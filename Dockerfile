# Base image
FROM node:14

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

# Launch command
CMD ["npm run dev"]
