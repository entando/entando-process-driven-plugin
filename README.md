# Entando - Process Driven Apps Plugin

Jenkins:
[![Build Status](https://jenkins.entandocloud.com/buildStatus/icon?job=de-entando-process-driven-plugin-master)](https://jenkins.entandocloud.com/job/de-entando-process-driven-plugin-master/)
[![Coverage Status](https://coveralls.io/repos/github/entando/entando-process-driven-plugin/badge.svg?branch=master)](https://coveralls.io/github/entando/entando-process-driven-plugin?branch=master)

Jenkins X:
[![Build Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fstatusbadge-jx.apps.serv.run%2Fentando%2Fentando-process-driven-plugin)](https://github.com/entando/devops-results/tree/logs/jenkins-x/logs/entando/entando-process-driven-plugin/master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=entando_entando-process-driven-plugin&metric=alert_status)](https://sonarcloud.io/dashboard?id=entando_entando-process-driven-plugin)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=entando_entando-process-driven-plugin&metric=coverage)](https://entando.github.io/devops-results/entando-process-driven-plugin/master/jacoco/index.html)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=entando_entando-process-driven-plugin&metric=vulnerabilities)](https://entando.github.io/devops-results/entando-process-driven-plugin/master/dependency-check-report.html)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=entando_entando-process-driven-plugin&metric=code_smells)](https://sonarcloud.io/dashboard?id=entando_entando-process-driven-plugin)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=entando_entando-process-driven-plugin&metric=security_rating)](https://sonarcloud.io/dashboard?id=entando_entando-process-driven-plugin)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=entando_entando-process-driven-plugin&metric=sqale_index)](https://sonarcloud.io/dashboard?id=entando_entando-process-driven-plugin)

# Introduction

For more information and documentation visit: http://docs.entando.com, or http://forum.entando.org. Or for the latest news or product information please visit the main website: https://www.entando.com.

Information below is for running locally or building from source. For usage information see the links above.


## Scope

The scope of this service is to provide a clean and simple API to allow Micro Frontend Widgets to integrate with BPM Providers:

## Environment Configuration

You'll need these environment variables set in order to run the project. Some variables are **required** and _MUST_ be set in order to run the server:

### Required Environment Variables:

> - `PORT`: TCP Port where the server will run. Default: `8081`
> - `KEYCLOAK_AUTH_URL`: The keycloak authentication URL. Default: `http://localhost:8081/auth`
> - `KEYCLOAK_REALM`: The keycloak realm. Default: `entando-development`
> - `KEYCLOAK_CLIENT_ID`: The keycloak resource/clientId. Default: `entando-pda`
> - `KEYCLOAK_CLIENT_SECRET`: The keycloak client secret.

### Optional Environment Variables:

> - `LOG_LEVEL`: Log level. Default: `INFO`

## Development

Entando PDA Plugin uses Entando `web-commons` and `keycloak-connector`.

In order to make it work on dev environment, you have to clone and install the dependencies
or just add to your IntelliJ workspace.

- Web Commons: https://github.com/entando/web-commons
- Keycloak Connector: https://github.com/entando/keycloak-commons

```
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## API Docs

Swagger Docs are available at http://localhost:8080/swagger-ui.html

## Docker Hub

Latest version deployed on Docker Hub:

- https://hub.docker.com/r/entando/entando-process-driven-plugin

##Sonar Cloud Report:

- https://sonarcloud.io/dashboard?id=entando_entando-process-driven-plugin
