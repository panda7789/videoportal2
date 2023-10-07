FROM node:lts-alpine3.14 as build
WORKDIR /app

COPY ./package.json .
COPY ./tsconfig.json .
COPY . /app

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run buildIgnoreErrors

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80