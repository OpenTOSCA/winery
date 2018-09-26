# Publish Maven artifacts to GitHub

## Context and Problem Statement

Winery build artifacts should be available for consumptions in other Maven-based Java projects.

## Decision Drivers

* Eclipse projects can release artifacts on Maven Central only their Jenkins environment.
* The Jenkins build of Winery does not work at the moment.

## Considered Options

* Publish artifacts to GitHub
* Set up Eclipse Jenkins build for Winery

## Decision Outcome

Chosen option: "Publish artifacts to GitHub", because it's the LPIN solution.
During `mvn deploy` all artifacts are copied to a local repository (`target/mvn-repo`).
This repository is published after the build process, i.e., by TravisCI `deploy` stage.

Positive Consequences:
* By using the `pages` provider in TravisCI, we can publish the Maven repository to GitHub.
* For each branch, we publish a repository to `OpenTOSCA/mvn-repo/<branch>` (see `.travis.yml`).
* Default gh-page of repository `OpenTOSCA/mvn-repo` is set to `ustutt`.

Negative consequences:
* None

## Links 

* See also [ADR-1001](1001-use-p2-maven-plugin-for-update-site-generation.md)
