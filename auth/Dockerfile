FROM node:16.14.2

RUN su node

RUN npm install -g nodemon

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY auth/package.json ./
COPY auth/package-lock.json ./
RUN npm i
COPY auth .

# Copy global prisma schema into project
COPY db/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate

RUN su
RUN chown -R node:node "/root/.npm"
