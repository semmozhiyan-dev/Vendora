FROM node:20-slim AS builder

WORKDIR /app

ENV VITE_API_URL=/api/v1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && rm -rf node_modules src *.config.* *.json

FROM nginx:1.27-alpine

RUN rm -f /etc/nginx/conf.d/default.conf && \
    printf 'server {\n  listen 80 default_server;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n\n  gzip on;\n  gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;\n  gzip_min_length 1000;\n\n  # SPA routing\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n\n  # Cache immutable assets\n  location ~* /assets/(.*\\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot))$ {\n    expires 1y;\n    add_header Cache-Control "public, max-age=31536000, immutable";\n  }\n\n  # Disable caching for HTML\n  location ~* \\.html?$ {\n    expires -1;\n    add_header Cache-Control "no-cache, no-store, must-revalidate";\n  }\n}\n' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
