# Stage 1: Зависимости
FROM node:22-alpine AS deps
WORKDIR /app

# В монорепозитории нам нужны конфиги из корня + конфиг сервера
COPY package.json package-lock.json ./
COPY src/server/package.json ./src/server/

# Устанавливаем ТОЛЬКО продакшн зависимости всего воркспейса (Убрали скрипты потмоу тчо ломалось изза хаски)
RUN npm ci --workspace=src/server --omit=dev --ignore-scripts


# Stage 2: Финальный образ
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Копируем только то, что нужно для работы
COPY --from=deps /app/node_modules ./node_modules
COPY src/server ./src/server
COPY package.json ./

# Переходим в папку сервера для запуска
WORKDIR /app/src/server

EXPOSE 3000
CMD ["node", "server.js"]
