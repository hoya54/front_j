FROM node:14.15.4 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/build /app
COPY nginx.conf /etc/nginx/nginx.conf

# 3000포트 오픈하고 nginx 실행
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
