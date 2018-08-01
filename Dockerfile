FROM maven:3-jdk-8 as builder

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && apt-get update -qq && apt-get install -qqy \
        unzip \
        git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && echo '{ "allow_root": true }' > /root/.bowerrc

COPY . /tmp/winery
WORKDIR /tmp/winery
RUN mvn package -DskipTests
RUN unzip /tmp/winery/org.eclipse.winery.repository.rest/target/winery.war -d /opt/winery \
    && sed -i "sXbpmn4toscamodelerBaseURI=.*Xbpmn4toscamodelerBaseURI=/winery-workflowmodelerX" /opt/winery/WEB-INF/classes/winery.properties \
    && sed -i "sX#repositoryPath=.*XrepositoryPath=/var/opentosca/repositoryX" /opt/winery/WEB-INF/classes/winery.properties


FROM tomcat:8.5.31
LABEL maintainer "Oliver Kopp <kopp.dev@gmail.com>, Michael Wurster <miwurster@gmail.com>"

ENV WINERY_REPOSITORY_URL=
ENV WINERY_HEAP_MAX=2048m

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash \
    && apt-get update -qq && apt-get install -qqy \
        git \
        git-lfs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf ${CATALINA_HOME}/webapps/* \
    && sed -ie "s/securerandom.source=file:\/dev\/random/securerandom.source=file:\/dev\/.\/urandom/g" /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/java.security \
    && mkdir -p /var/opentosca/repository \
    && cd /var/opentosca/repository \
    && git init \
    && git config core.fscache true \
    && git lfs install

COPY --from=builder /opt/winery ${CATALINA_HOME}/webapps/winery
COPY --from=builder /tmp/winery/org.eclipse.winery.repository.ui/target/winery-ui.war ${CATALINA_HOME}/webapps/ROOT.war
COPY --from=builder /tmp/winery/org.eclipse.winery.topologymodeler/target/winery-topologymodeler.war ${CATALINA_HOME}/webapps
COPY --from=builder /tmp/winery/org.eclipse.winery.topologymodeler.ui/target/topologymodeler-ui.war ${CATALINA_HOME}/webapps/winery-topologymodeler-ui.war
COPY --from=builder /tmp/winery/org.eclipse.winery.workflowmodeler/target/winery-workflowmodeler.war ${CATALINA_HOME}/webapps

EXPOSE 8080

CMD if [ ! "x${WINERY_REPOSITORY_URL}" = "x" ]; then rm -rf /var/opentosca/repository && git clone ${WINERY_REPOSITORY_URL} /var/opentosca/repository; fi \
    && echo "CATALINA_OPTS=-Djava.security.egd=file:/dev/./urandom -Xms512m -Xmx${WINERY_HEAP_MAX} -XX:MaxPermSize=256m" > ${CATALINA_HOME}/bin/setenv.sh \
    && chmod a+x ${CATALINA_HOME}/bin/setenv.sh \
    && ${CATALINA_HOME}/bin/catalina.sh run
