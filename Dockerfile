FROM node:16 AS base

WORKDIR /app
COPY package*.json ./

RUN npm install
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

FROM base AS dev
COPY nest-cli.json \
  tsconfig.* \
  ./
COPY ./src/ ./src/

RUN npm run build

FROM node:16

COPY --from=base /app/package.json ./
COPY --from=dev /app/dist/ ./dist/
COPY --from=base /app/node_modules/ ./node_modules/

EXPOSE 8000
CMD ["node", "dist/main.js"]