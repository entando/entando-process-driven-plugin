FROM openjdk:8-jdk-alpine

COPY target/generated-artifact.jar app.jar
CMD ["java", "-jar", "app.jar", "-Dspring.profiles.active=dev"]