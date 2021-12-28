FROM node:12 as build

WORKDIR /tmp/node

COPY package.json ./

RUN npm install

COPY public/ ./public
COPY src/ ./src

ARG REACT_APP_GA
ARG REACT_APP_URL
ARG REACT_APP_WS

ENV GENERATE_SOURCEMAP=false
ENV SKIP_PREFLIGHT_CHECK=true
RUN npm run build

FROM nginx

COPY --from=build /tmp/node/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf



