FROM node:latest AS build

WORKDIR /api
COPY . /api/
RUN npm install
RUN npm run lint
RUN npm run build

FROM node:latest
WORKDIR /api
COPY --from=build /api/ ./

ENTRYPOINT [ "npm", "start" ]
EXPOSE 3000