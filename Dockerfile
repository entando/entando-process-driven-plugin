FROM openjdk:8-jdk-alpine
MAINTAINER Filipe Leandro <f.leandro@entando.com>

COPY target/generated-artifact.jar app.jar
CMD ["java", "-jar", "app.jar"]
