# 🚀 Guía de Despliegue - Hostería Altos de Soberana

## 📋 Requisitos Previos

- Acceso SSH a tu VPS
- Node.js 18+ instalado en el VPS
- PM2 instalado globalmente en el VPS
- Nginx configurado como reverse proxy
- Dominio apuntando al VPS

---

## 🔧 PASO 1: Configurar GitHub Secrets

Ve a tu repositorio en GitHub: `https://github.com/mjaubet/altosdesoberanahosteria`

1. Click en **Settings** → **Secrets and variables** → **Actions**
2. Click en **New repository secret**
3. Agrega estos 3 secrets:

### Secret 1: VPS_HOST
- **Name**: `VPS_HOST`
- **Value**: La IP o dominio de tu VPS (ej: `123.45.67.89` o `altosdesoberanacalafate.com.ar`)

### Secret 2: VPS_USER
- **Name**: `VPS_USER`
- **Value**: Tu usuario SSH (normalmente `root` o `ubuntu`)

### Secret 3: VPS_SSH_KEY
- **Name**: `VPS_SSH_KEY`
- **Value**: Tu clave privada SSH completa

**Para obtener tu clave SSH privada:**
```bash
cat ~/.ssh/id_rsa
```
Copia TODO el contenido (desde `-----BEGIN` hasta `-----END`)

---

## 🖥️ PASO 2: Preparar el VPS

Conéctate a tu VPS por SSH:
```bash
ssh tu_usuario@tu_vps_ip
```

### 2.1 Instalar Node.js (si no está instalado)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2.2 Instalar PM2 globalmente
```bash
sudo npm install -g pm2
```

### 2.3 Crear directorio del proyecto
```bash
sudo mkdir -p /var/www/altosdesoberanacalafate.com.ar
sudo chown -R $USER:$USER /var/www/altosdesoberanacalafate.com.ar
cd /var/www/altosdesoberanacalafate.com.ar
```

### 2.4 Clonar el repositorio
```bash
git clone https://github.com/mjaubet/altosdesoberanahosteria.git .
```

### 2.5 Crear archivo .env en el servidor
```bash
nano .env
```

Pega este contenido (ajusta si es necesario):
```bash
# SMTP (Correo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=starttls
SMTP_USER=mjaubet@gmail.com
SMTP_PASS=luwz lukc wela qhmi
SMTP_FROM_EMAIL=mjaubet@gmail.com
SMTP_FROM_NAME=Hostería Altos de Soberana

# GitHub OAuth (CMS)
OAUTH_CLIENT_ID=tu_client_id_de_github
OAUTH_CLIENT_SECRET=tu_client_secret_de_github
```

Guarda con `Ctrl+O`, `Enter`, `Ctrl+X`

### 2.6 Instalar dependencias y hacer build
```bash
npm install
npm run build
```

### 2.7 Iniciar con PM2
```bash
pm2 start npm --name "altosdesoberana" -- start
pm2 save
pm2 startup
```

---

## 🌐 PASO 3: Configurar Nginx

### 3.1 Crear configuración de Nginx
```bash
sudo nano /etc/nginx/sites-available/altosdesoberanacalafate.com.ar
```

Pega esta configuración:
```nginx
server {
    listen 80;
    server_name altosdesoberanacalafate.com.ar www.altosdesoberanacalafate.com.ar;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3.2 Activar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/altosdesoberanacalafate.com.ar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3.3 Instalar SSL con Certbot (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d altosdesoberanacalafate.com.ar -d www.altosdesoberanacalafate.com.ar
```

---

## 🔄 PASO 4: Configurar GitHub OAuth para el CMS

1. Ve a: https://github.com/settings/developers
2. Click en **New OAuth App**
3. Completa:
   - **Application name**: `Hostería CMS`
   - **Homepage URL**: `https://altosdesoberanacalafate.com.ar`
   - **Authorization callback URL**: `https://altosdesoberanacalafate.com.ar/api/callback`
4. Click en **Register application**
5. Copia el **Client ID** y genera un **Client Secret**
6. Actualiza el `.env` en el servidor con estos valores

---

## ✅ PASO 5: Primer Deploy Manual

Desde tu Mac, commitea y pushea:

```bash
cd /Applications/MAMP/htdocs/altosdesoberanahosteria
git add .
git commit -m "Initial production setup"
git push origin main
```

**¡El deploy automático se ejecutará!** 🎉

Revisa el progreso en: `https://github.com/mjaubet/altosdesoberanahosteria/actions`

---

## 📝 Comandos Útiles en el VPS

### Ver logs de la aplicación
```bash
pm2 logs altosdesoberana
```

### Reiniciar la aplicación
```bash
pm2 restart altosdesoberana
```

### Ver estado
```bash
pm2 status
```

### Deploy manual (si falla el automático)
```bash
cd /var/www/altosdesoberanacalafate.com.ar
git pull origin main
npm install
npm run build
pm2 restart altosdesoberana
```

---

## 🎯 Resumen del Flujo

1. **Desarrollas en local** (Mac)
2. **Commiteas a GitHub**: `git push origin main`
3. **GitHub Actions se activa automáticamente**
4. **Se conecta a tu VPS por SSH**
5. **Hace pull, build y restart**
6. **¡Sitio actualizado!** ✨

---

## 🆘 Troubleshooting

### El deploy falla en GitHub Actions
- Verifica que los Secrets estén bien configurados
- Revisa los logs en la pestaña "Actions" de GitHub

### La app no arranca en el VPS
```bash
pm2 logs altosdesoberana --lines 50
```

### Nginx muestra error
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

¿Necesitas ayuda? Revisa los logs y avísame! 🚀
