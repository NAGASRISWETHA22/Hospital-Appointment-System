# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /hospital
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
WORKDIR /hospital

COPY --from=build /hospital/target/*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]