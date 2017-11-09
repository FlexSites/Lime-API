FROM node:latest
WORKDIR /code

# Install app dependencies
COPY package.json .
COPY .npmrc .
RUN npm install --production
RUN rm .npmrc
# Bundle app source
COPY . .
CMD ["npm", "start"]
