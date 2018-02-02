# Can only be run at a winery checkout - not a git worktree or plain copy of winery

FROM maven:3-jdk-8 as builder

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get update -qq && apt-get install -qqy \
        nodejs \
        unzip \
        git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && echo '{ "allow_root": true }' > /root/.bowerrc

WORKDIR /tmp/winery
COPY . /tmp/winery
RUN mvn package -DskipTests
RUN unzip /tmp/winery/org.eclipse.winery.repository.rest/target/winery.war -d /opt/winery \
    && sed -i "sXbpmn4toscamodelerBaseURI=.*Xbpmn4toscamodelerBaseURI=/winery-workflowmodelerX" /opt/winery/WEB-INF/classes/winery.properties \
    && sed -i "sX#repositoryPath=.*XrepositoryPath=/var/opentosca/repositoryX" /opt/winery/WEB-INF/classes/winery.properties

# integrate the topology modeler from the "topologymodeler" branch
RUN git checkout origin/topologymodeler
RUN mvn package -pl org.eclipse.winery.topologymodeler.ui -am -DskipTests

FROM tomcat:8.5-jre8
LABEL maintainer "Johannes Wettinger <jowettinger@gmail.com>, Oliver Kopp <kopp.dev@gmail.com>, Michael Wurster <miwurster@gmail.com>"

RUN rm /dev/random && ln -s /dev/urandom /dev/random \
    && rm -rf ${CATALINA_HOME}/webapps/* \
    && sed -ie "s/securerandom.source=file:\/dev\/random/securerandom.source=file:\/dev\/.\/urandom/g" /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/java.security

# ensure that /var/opentosca/repository exists to enable external directory binding
RUN mkdir -p /var/opentosca/repository

COPY --from=builder /opt/winery ${CATALINA_HOME}/webapps/winery
COPY --from=builder /tmp/winery/org.eclipse.winery.repository.ui/target/winery-ui.war ${CATALINA_HOME}/webapps/ROOT.war
COPY --from=builder /tmp/winery/org.eclipse.winery.topologymodeler/target/winery-topologymodeler.war ${CATALINA_HOME}/webapps
COPY --from=builder /tmp/winery/org.eclipse.winery.workflowmodeler/target/winery-workflowmodeler.war ${CATALINA_HOME}/webapps

EXPOSE 8080