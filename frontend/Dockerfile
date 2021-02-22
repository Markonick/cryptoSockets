
FROM node:15.9.0-alpine3.10 as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
RUN npm run build
CMD ["npm", "start"]
# production environment
# FROM nginx:1.19.0-alpine
# COPY --from=build /app/build /usr/share/nginx/html

# #from https://mherman.org/blog/dockerizing-a-react-app/
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]