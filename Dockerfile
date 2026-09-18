# Etapa 1: compilar el panel. Etapa 2: servirlo con nginx. La URL de la API se escribe al
# arrancar el contenedor (config.json desde API_URL): la misma imagen sirve para cualquier entorno.
FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh
COPY --from=build /app/dist/sisventas-app/browser /usr/share/nginx/html
ENV API_URL=http://localhost:8080/api/v1
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/config.json > /dev/null || exit 1
