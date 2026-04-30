# ─── Stage 1: Build Frontend ───────────────────────────────────────────────────
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=""
RUN npm run build


# ─── Stage 2: Final Unified Image ──────────────────────────────────────────────
FROM python:3.11-slim
WORKDIR /app

# Install Node.js (for Next.js) and Supervisor (to run dual processes)
RUN apt-get update && apt-get install -y curl supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Setup Backend
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Setup Frontend
WORKDIR /app/frontend
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static ./.next/static

# Setup Supervisor
WORKDIR /app
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Clean up local environment leftovers (if accidentally copied)
RUN rm -rf /app/backend/.env /app/frontend/.env.local /app/backend/myvote.db

# Cloud Run expects traffic on this port
EXPOSE 8080

# Run supervisor to start both Backend and Frontend
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
