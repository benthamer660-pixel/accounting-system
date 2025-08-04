# نظام المحاسبة - Dockerfile
# Accounting System - Docker Configuration

# استخدام Node.js 18 Alpine كصورة أساسية
FROM node:18-alpine AS base

# تثبيت التبعيات المطلوبة
RUN apk add --no-cache libc6-compat
WORKDIR /app

# نسخ ملفات package
COPY package*.json ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

# مرحلة تثبيت التبعيات
FROM base AS deps
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# مرحلة البناء
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تعطيل التحليلات أثناء البناء
ENV NEXT_TELEMETRY_DISABLED 1

# بناء التطبيق
RUN npm run build

# مرحلة الإنتاج
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# إنشاء مستخدم غير جذر
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات المطلوبة
COPY --from=builder /app/public ./public

# نسخ ملفات البناء
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# تشغيل التطبيق
CMD ["node", "server.js"]
