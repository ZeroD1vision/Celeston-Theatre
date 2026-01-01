# ========== STAGE 1: Install dependencies ==========
# Используем Node.js 22 (LTS на 2026 год)
FROM node:22-alpine AS deps
WORKDIR /app

# Копируем только файлы зависимостей для кэширования
COPY package.json package-lock.json ./
COPY src/client/package.json ./src/client/

# Устанавливаем зависимости с использованием кэша монтирования
RUN --mount=type=cache,target=/root/.npm \
    npm ci --workspace=src/client --include=dev --ignore-scripts

# ========== STAGE 2: Build ==========
FROM node:22-alpine AS builder
WORKDIR /app

# Копируем установленные модули и весь исходный код
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Собираем фронтенд
WORKDIR /app/src/client
RUN npm run build

# ========== STAGE 3: Production (Internal Nginx) ==========
FROM nginx:stable-alpine AS production

# Настройка безопасности: создаем пользователя
RUN addgroup -g 1001 -S nginxuser && \
    adduser -S nginxuser -u 1001

# 1. Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# 2. Копируем ВНУТРЕННИЙ конфиг клиента (тот, что с try_files)
COPY src/client/nginx.conf /etc/nginx/conf.d/default.conf

# 3. Копируем билд
COPY --from=builder /app/src/client/build /usr/share/nginx/html

# Настраиваем права доступа
RUN chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginxuser:nginxuser /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

USER nginxuser

# Проверка работоспособности (внутренняя)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
