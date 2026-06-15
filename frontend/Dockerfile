FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN NODE_OPTIONS="--max-old-space-size=512" npm ci
COPY . .
RUN npm run build && rm -rf node_modules src *.config.* *.json

FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
