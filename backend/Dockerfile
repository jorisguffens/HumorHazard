FROM gradle:jdk17 AS build

WORKDIR /tmp/app

COPY src ./src
COPY build.gradle ./
COPY settings.gradle ./

RUN gradle shadowJar --no-daemon


FROM azul/zulu-openjdk-alpine:17

WORKDIR /opt/app
COPY --from=build /tmp/app/build/libs/ ./
ENTRYPOINT java -jar HumorHazardServer.jar
