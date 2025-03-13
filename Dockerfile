FROM nginx:1-alpine
COPY ["_site", "/usr/share/nginx/html"]
