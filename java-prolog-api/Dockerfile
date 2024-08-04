# Dockerfile para la aplicación Java
FROM openjdk:17-jdk-alpine

# Instalar Maven
RUN apk update && apk add maven

WORKDIR /app

# Copiar el archivo pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el código fuente
COPY src /app/src

# Construir el proyecto
RUN mvn package

# Exponer el puerto en el que la aplicación estará escuchando
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-jar", "target/java-prolog-api-1.0-SNAPSHOT.jar"]
