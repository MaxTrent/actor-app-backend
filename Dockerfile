FROM node:18.18.2 as dev1

RUN apt-get update
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn* ./

# RUN  npm install -g typescript@5.2.2 
RUN yarn

COPY . .

RUN yarn build

# RUN npm run format && npm cache clean --force

ENV NODE_ENV=development
ENV PORT=80
ENV DB_CONNECTION_URL=
ENV JWT_ACCESS_TOKEN=
ENV SENDGRID_API_KEY=
ENV PINECONE_API_KEY=
ENV SENDER_EMAIL=
ENV OPENAI_API_KEY=

EXPOSE 80

CMD node /usr/src/app/dist