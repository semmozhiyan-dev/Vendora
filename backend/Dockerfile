FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi && \
    npm cache clean --force

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

USER node

CMD ["npm", "start"]
