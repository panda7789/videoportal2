FROM node:lts-alpine as build
WORKDIR /app

COPY ./package.json .
COPY ./tsconfig.json .
COPY ./patches ./patches

RUN npm install -g pnpm
RUN pnpm install

COPY . /app
RUN pnpm run buildIgnoreErrors
RUN npx import-meta-env -x .env.production -p dist/index.html

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80