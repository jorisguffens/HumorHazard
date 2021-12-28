FROM gradle:jdk17 AS build

WORKDIR /tmp/app

COPY src ./src
COPY build.gradle ./
COPY settings.gradle ./

RUN gradle shadowJar --no-daemon

FROM eclipse-temurin:17-alpine

WORKDIR /usr/src/app

COPY --from=build /tmp/app/build/libs/ ./

ENTRYPOINT ["/usr/bin/java", "-jar", "HumorHazardServer.jar"]
