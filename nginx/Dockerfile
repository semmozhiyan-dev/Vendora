FROM vendora-frontend:latest as frontend_assets

FROM nginx:1.27-alpine

# Copy built frontend assets from frontend image
COPY --from=frontend_assets /usr/share/nginx/html /usr/share/nginx/html

# NOTE: nginx.conf is expected to be mounted at runtime from a secure host path
# Do NOT COPY production nginx.conf into the image to avoid baking secrets.

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
