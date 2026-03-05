# Deployment Guide - Booking Lapangan Futsal

**Author:** Muhammad Rizal Nurfirdaus  
**Last Updated:** March 5, 2026

---

## Production Deployment Options

### Option 1: VPS Deployment (Recommended)

**Requirements:**
- Ubuntu 22.04+ / Debian 11+
- Min 2GB RAM
- Node.js 18+ or Bun runtime
- PostgreSQL 14+
- Nginx (reverse proxy)
- SSL Certificate (Let's Encrypt)

#### 1.1 Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### 1.2 Database Setup

```bash
# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE db_booking_lapangan;
CREATE USER booking_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE db_booking_lapangan TO booking_user;
\q
```

#### 1.3 Deploy Backend

```bash
# Clone repository
cd /var/www
git clone https://github.com/MuhammadRizalNurfirdaus/booking_lapangan.git
cd booking_lapangan/backend

# Install dependencies
bun install

# Setup environment
cp .env.example .env
nano .env
```

**.env (Production):**
```env
DATABASE_URL=postgres://booking_user:your_secure_password@localhost:5432/db_booking_lapangan?sslmode=prefer
JWT_SECRET=your_very_secure_random_string_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
FRONTEND_URL=https://yourdomain.com
PORT=3000
```

```bash
# Run migrations
bun run migrate

# Seed initial data
bun run seed

# Create systemd service
sudo nano /etc/systemd/system/booking-backend.service
```

**/etc/systemd/system/booking-backend.service:**
```ini
[Unit]
Description=Booking Lapangan Backend
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/booking_lapangan/backend
ExecStart=/home/YOUR_USER/.bun/bin/bun run src/index.ts
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable booking-backend
sudo systemctl start booking-backend
sudo systemctl status booking-backend
```

#### 1.4 Deploy Frontend

```bash
cd /var/www/booking_lapangan/frontend

# Build for production
bun install
bun run build

# Files will be in dist/ folder
```

#### 1.5 Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/booking-lapangan
```

**/etc/nginx/sites-available/booking-lapangan:**
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads {
        alias /var/www/booking_lapangan/backend/src/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/booking_lapangan/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy uploads to backend
    location /uploads {
        proxy_pass http://localhost:3000;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/booking-lapangan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 1.6 SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal (certbot sets this up automatically)
sudo certbot renew --dry-run
```

#### 1.7 Firewall Setup

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

### Option 2: Docker Deployment

#### 2.1 Create Dockerfiles

**backend/Dockerfile:**
```dockerfile
FROM oven/bun:1.3-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
```

**frontend/Dockerfile:**
```dockerfile
FROM oven/bun:1.3-alpine AS build

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads {
        proxy_pass http://backend:3000;
    }
}
```

#### 2.2 Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: db_booking_lapangan
      POSTGRES_USER: booking_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - booking-network
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgres://booking_user:${DB_PASSWORD}@db:5432/db_booking_lapangan
      JWT_SECRET: ${JWT_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      GOOGLE_REDIRECT_URI: ${GOOGLE_REDIRECT_URI}
      FRONTEND_URL: ${FRONTEND_URL}
      PORT: 3000
    volumes:
      - ./backend/src/uploads:/app/src/uploads
    depends_on:
      - db
    networks:
      - booking-network
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - booking-network
    restart: unless-stopped

networks:
  booking-network:
    driver: bridge

volumes:
  postgres_data:
```

**.env for Docker:**
```env
DB_PASSWORD=your_secure_db_password
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
FRONTEND_URL=https://yourdomain.com
```

**Deploy with Docker:**
```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec backend bun run migrate

# Seed data
docker-compose exec backend bun run seed

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 3: Cloud Platform Deployment

#### 3.1 Vercel (Frontend Only)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-backend.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### 3.2 Railway (Full Stack)

1. Create account at https://railway.app
2. New Project → Deploy from GitHub
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy backend and frontend separately

#### 3.3 Render (Full Stack)

1. Create account at https://render.com
2. New Web Service → Connect GitHub repo
3. Backend:
   - Build: `cd backend && bun install`
   - Start: `bun run src/index.ts`
4. Frontend:
   - Build: `cd frontend && bun run build`
   - Publish: `frontend/dist`
5. Add PostgreSQL database

---

## Environment Variables Checklist

### Backend (.env)
- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `JWT_SECRET` - Random secure string (min 32 chars)
- [x] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [x] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [x] `GOOGLE_REDIRECT_URI` - `https://yourdomain.com/api/auth/google/callback`
- [x] `FRONTEND_URL` - `https://yourdomain.com`
- [x] `PORT` - Default: 3000

### Frontend (vite.config.ts)
Update proxy target to production backend URL in production build.

---

## Post-Deployment Checklist

- [ ] Database migrated and seeded
- [ ] Admin account created (admin123@gmail.com)
- [ ] Environment variables set correctly
- [ ] HTTPS/SSL enabled
- [ ] Google OAuth configured with production URLs
- [ ] File upload directories writable
- [ ] Nginx/reverse proxy configured
- [ ] Firewall rules applied
- [ ] Backup strategy in place
- [ ] Monitoring/logging setup
- [ ] Domain DNS configured
- [ ] Test all features in production

---

## Backup & Restore

### Database Backup

```bash
# Backup
pg_dump -U booking_user db_booking_lapangan > backup_$(date +%Y%m%d).sql

# Restore
psql -U booking_user db_booking_lapangan < backup_20260305.sql
```

### File Uploads Backup

```bash
# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/src/uploads/

# Restore
tar -xzf uploads_backup_20260305.tar.gz -C backend/src/
```

---

## Monitoring

### PM2 (Alternative to systemd)

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start bun --name booking-backend -- run src/index.ts

# Save process list
pm2 save

# Auto-start on boot
pm2 startup
```

### Logs

```bash
# Backend logs (systemd)
sudo journalctl -u booking-backend -f

# Backend logs (PM2)
pm2 logs booking-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Scaling Considerations

### Database
- Enable connection pooling
- Add read replicas for high traffic
- Regular VACUUM and ANALYZE

### Backend
- Deploy multiple instances behind load balancer
- Use Redis for session storage
- Implement rate limiting

### Frontend
- Use CDN for static assets
- Enable Brotli/Gzip compression
- Implement service worker for offline support

---

## Security Best Practices

1. **HTTPS Only** - Redirect HTTP to HTTPS
2. **Environment Variables** - Never commit .env files
3. **CORS** - Restrict to production domain only
4. **Rate Limiting** - Implement API rate limits
5. **SQL Injection** - Use parameterized queries (already implemented)
6. **XSS Protection** - Sanitize user input
7. **CSRF Protection** - Use SameSite cookies
8. **File Upload** - Validate file types and sizes
9. **Password Policy** - Enforce strong passwords
10. **Regular Updates** - Keep dependencies up to date

---

**Need help?** Contact: Muhammad Rizal Nurfirdaus
