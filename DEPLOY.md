# Guía de Despliegue - CloudPanel (Node.js)

Esta guía detalla cómo desplegar la aplicación Astro SSR en un entorno CloudPanel.

## 1. Configuración del Sitio en CloudPanel

1.  **Crear Sitio**: Selecciona **Create Node.js Site**.
2.  **Dominio**: `altosdesoberanacalafate.com.ar`
3.  **Versión Node**: Node.js 20 LTS (o superior).
4.  **App Port**: Dejar por defecto (ej. 3000) o asignar uno libre. CloudPanel gestionará el Reverse Proxy.

## 2. Variables de Entorno

En el panel del sitio, ve a la pestaña **Settings** o **Environment** y añade las siguientes variables. Son CRÍTICAS para el funcionamiento del CMS y Email.

```env
# Producción
HOST=0.0.0.0
PORT=3000
NODE_ENV=production

# Email (Gmail o SMTP Webmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-app # Generar contraseña de aplicación si usas Gmail
SMTP_TO=altosdesoberanahosteria@gmail.com

# GitHub OAuth (Para Decap CMS)
# Obtener en GitHub -> Settings -> Developer Settings -> OAuth Apps
OAUTH_CLIENT_ID=__TU_CLIENT_ID__
OAUTH_CLIENT_SECRET=__TU_CLIENT_SECRET__
```

### Configuración GitHub OAuth App
- **Homepage URL**: `https://altosdesoberanacalafate.com.ar`
- **Authorization callback URL**: `https://altosdesoberanacalafate.com.ar/api/callback`

## 3. Script de Despliegue (Deploy Script)

Si configuras el despliegue automático desde CloudPanel (pestaña **VCS**):

**Repository URL**: `git@github.com:mjaubet/altosdesoberanahosteria.git`
**Branch**: `main`

**Deploy Script**:
Copia y pega esto en la caja de "Deploy Script":

```bash
# Instalar dependencias
npm ci

# Construir la aplicación
npm run build

# Detener/Reiniciar proceso (Si usas PM2 o solo Restart)
# En CloudPanel, usualmente basta con 'npm run build' y luego CloudPanel reinicia el proceso Node si está configurado.
# Si necesitas reinicio manual:
# pm2 reload all || pm2 start dist/server/entry.mjs --name "hosteria"
```

## 4. Run Command (Comando de Inicio)

En la configuración de la aplicación (Settings):

- **Script**: `npm start` (Asegúrate de que en package.json start sea `node ./dist/server/entry.mjs`)
- O comando directo: `node ./dist/server/entry.mjs`

> **Nota:** Astro con adaptador Node construye por defecto en `dist/`. Verifica si configuraste `outDir` diferente.

## 5. GitHub Actions (Opcional)

Si prefieres usar GitHub Actions para desplegar (en lugar del VCS de CloudPanel), crea `.github/workflows/deploy.yml` que use SSH para entrar al servidor, hacer `git pull`, `npm install`, `npm run build` y reiniciar el servicio.

---

### Verificación

1.  Entra a `https://altosdesoberanacalafate.com.ar/admin`
2.  Logueate con GitHub.
3.  Edita un texto y guarda. Deberías ver el commit en el repo en segundos.
