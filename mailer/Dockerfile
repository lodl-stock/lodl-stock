FROM node:16.14.2

RUN chown -R node:node /root/.npm
RUN su node

RUN npm install -g nodemon

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY mailer/package.json ./
COPY mailer/package-lock.json ./

# Copy global prisma schema into project
COPY db/schema.prisma ./prisma/schema.prisma

RUN npm i --silent

COPY mailer/prisma ./prisma
RUN npx prisma generate

COPY . .
