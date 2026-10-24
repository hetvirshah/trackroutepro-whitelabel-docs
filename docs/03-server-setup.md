# 3. Server Setup

Commands assume Ubuntu with a sudo user. Adjust versions to what your package sources provide.

## 3.1 Base packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx ufw git curl
```

## 3.2 Java (for Traccar)

```bash
sudo apt install -y default-jre-headless
java -version
```

## 3.3 PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql
```

```sql
CREATE USER traccar WITH PASSWORD '<DB_PASSWORD>';
CREATE DATABASE traccar OWNER traccar;
```

Keep PostgreSQL listening on localhost only (the default).

## 3.4 Node.js and PM2

Install Node.js (v24.x was used in development) using your preferred method (NodeSource or nvm), then:

```bash
sudo npm install -g pm2
pm2 startup        # run the command it prints
```

## 3.5 MongoDB (Docker)

```bash
sudo apt install -y docker.io docker-compose
```

Create `mongodb-docker/docker-compose.yml` inside your backend project folder:

```yaml
services:
  mongo:
    image: mongo:<VERSION>
    restart: always
    ports:
      - "127.0.0.1:27017:27017"   # localhost only
    environment:
      MONGO_INITDB_ROOT_USERNAME: <MONGO_USER>
      MONGO_INITDB_ROOT_PASSWORD: <MONGO_PASSWORD>
    volumes:
      - ./data:/data/db
```

```bash
cd mongodb-docker
sudo docker-compose up -d
sudo docker ps
```

> Check the MongoDB edition and licence you deploy (see [Licences](13-licences.md)).

## 3.6 Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80,443/tcp
sudo ufw allow 5000:6000/tcp
sudo ufw enable
```

Do **not** open 5432, 27017, 3100 or 8083 to the internet.

## 3.7 DNS and SSL

1. Point `api.<YOUR_DOMAIN>` and `track.<YOUR_DOMAIN>` (A records) to the server IP.
2. Create Nginx site configs in `/etc/nginx/sites-available/` and symlink to `sites-enabled/`.

Backend (port 3100):

```nginx
server {
    server_name api.<YOUR_DOMAIN>;
    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;      # WebSocket support
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Traccar (port 8083): same pattern with `server_name track.<YOUR_DOMAIN>;` and `proxy_pass http://127.0.0.1:8083;`. Traccar also uses WebSockets, so keep the Upgrade headers.

3. Issue certificates:

```bash
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.<YOUR_DOMAIN> -d track.<YOUR_DOMAIN>
sudo certbot renew --dry-run
```
