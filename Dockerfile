# ============================================================
# MAUDY IT Solution — Dockerfile
# Base: nginx:alpine (sangat ringan ~25MB)
# ============================================================

FROM nginx:alpine

# Label metadata
LABEL maintainer="MAUDY IT Solution <info@maudyitsolution.com>"
LABEL description="MAUDY IT Solution Website — Static Site with Nginx"
LABEL version="1.0.0"

# Hapus default nginx config dan files
RUN rm -rf /usr/share/nginx/html/*

# Copy semua file website ke nginx html directory
COPY . /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Hapus file yang tidak perlu di container
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/docker-compose.yml \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/.gitignore \
          /usr/share/nginx/html/README.md \
          /usr/share/nginx/html/implementation_plan.md

# Port expose
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

# Jalankan nginx di foreground
CMD ["nginx", "-g", "daemon off;"]
