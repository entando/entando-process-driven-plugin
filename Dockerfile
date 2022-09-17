FROM openjdk:11
MAINTAINER Filipe Leandro <f.leandro@entando.com>

COPY target/generated-artifact.jar app.jar
CMD ["java", "-jar", "app.jar"]
