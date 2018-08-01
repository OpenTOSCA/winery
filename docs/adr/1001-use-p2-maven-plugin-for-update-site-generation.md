# Use p2-maven-plugin for Eclipse update-site generation 

## Context and Problem Statement

Winery build artifacts should be available for Eclipse OSGi projects, which require an update-site to consume dependencies.
Auto-generation of Eclipse update-site during usual continuous integration builds.

## Considered Options

* Use Maven plugin `org.reficio:p2-maven-plugin`

## Decision Outcome

Chosen option: "Use Maven plugin `org.reficio:p2-maven-plugin`", because it is the only option which is suitable.

Positive Consequences:
* By using the `pages` provider in TravisCI, we can publish the update-site to GitHub.
* For each branch, we generate an update-site and publish it to `OpenTOSCA/winery-update-site/<branch>` (see `.travis.yml`).
* Default gh-page of repository `OpenTOSCA/winery-update-site` is set to `ustutt`.

Negative consequences:
* Additional effort required to maintain dependencies that should go into the update-site.
  See `pom.xml` in root directory (`<id>org.eclipse.winery:org.eclipse.winery.model.tosca.yaml:2.0.0-SNAPSHOT</id>`).
