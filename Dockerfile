# Establecer la imagen base
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos de la aplicación al contenedor
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar el código fuente de la aplicación al contenedor
COPY . .

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
