FROM node:22
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
EXPOSE 8000
CMD [ "node", "index.js" ]




