# Sports Bet System

Sistema de apuestas deportivas con autenticación JWT y autorización basada en roles.


## Integrantes 
- Juan Esteban Eraso
- Carlos Sanchez
- Alejandro Mejia
- Nicolas Cardona

## Instalación

```bash
npm install
```

## Configuración

Copia el archivo `.env.example` a `.env` y configura las variables de entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de base de datos:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=sports_bet_db
JWT_SECRET=tu_secret_key_super_segura
```

## Base de Datos

### Opción 1: PostgreSQL Local (con Docker)

Inicia PostgreSQL usando Docker Compose:

```bash
docker-compose up -d
```

### Opción 2: PostgreSQL en Render

Si usas una base de datos en Render, configura las variables de entorno en `.env`:

```env
DB_HOST=dpg-xxxxx.render.com
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_database
```

**Nota:** La base de datos de Render requiere SSL (ya está configurado en el código).

## Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Datos de Prueba (Seed)

El proyecto incluye un sistema de seed para poblar la base de datos con datos de prueba.

### Ejecutar el Seed

```bash
npm run seed
```

### Limpiar Datos

```bash
npm run seed:clear
```

**Nota:** El servidor debe estar corriendo antes de ejecutar los scripts de seed.

### Datos Incluidos

- **Usuarios:** admin, usuario1, usuario2, usuario3 (contraseña: `password123`)
- **Eventos:** 6 eventos deportivos con opciones
- **Apuestas:** 8 apuestas de ejemplo

## Autenticación y Autorización

### Roles Disponibles

1. **user** - Usuario regular
2. **admin** - Administrador

### Endpoints de Autenticación

#### Registrarse
```bash
POST /auth/register
{
  "username": "usuario1",
  "password": "password123",
  "role": "user"  // opcional
}
```

#### Iniciar Sesión
```bash
POST /auth/login
{
  "username": "usuario1",
  "password": "password123"
}
```

Respuesta:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "username": "usuario1",
    "role": "user",
    "balance": 10000
  }
}
```

#### Ver Perfil
```bash
GET /auth/profile
Authorization: Bearer {token}
```

### Uso de Tokens

Los tokens deben enviarse en el header:

```
Authorization: Bearer {tu_token}
```

## API Endpoints

### Usuarios

- `POST /users` - Crear usuario
- `GET /users` - Listar todos (admin)
- `GET /users/:id` - Ver perfil (autenticado)
- `GET /users/:id/balance` - Ver balance (autenticado)
- `PATCH /users/:id` - Actualizar (autenticado)
- `DELETE /users/:id` - Eliminar (admin)

### Eventos

- `POST /events` - Crear evento (admin)
- `GET /events` - Listar todos (autenticado)
- `GET /events/open` - Ver eventos abiertos (público)
- `GET /events/:id` - Ver detalles (público)
- `PATCH /events/:id` - Actualizar (admin)
- `POST /events/:id/close` - Cerrar evento (admin)
- `DELETE /events/:id` - Eliminar (admin)

### Apuestas

- `POST /bets` - Crear apuesta (autenticado)
- `GET /bets` - Listar todas (admin)
- `GET /bets/:id` - Ver apuesta (autenticado)
- `GET /bets/user/:userId` - Apuestas del usuario (autenticado)
- `GET /bets/user/:userId/stats` - Estadísticas (autenticado)
- `GET /bets/event/:eventId` - Apuestas de evento (autenticado)
- `POST /bets/event/:eventId/process` - Procesar apuestas (admin)
- `DELETE /bets/:id` - Eliminar apuesta (autenticado)

## Características

### ✅ Autenticación (5%)
- Sistema JWT (JSON Web Tokens)
- Login y registro de usuarios
- Tokens con expiración de 24 horas
- Validación de contraseñas encriptadas

### ✅ Autorización (5%)
- Dos roles: `user` y `admin`
- Guards de autenticación (`JwtAuthGuard`)
- Guards de autorización basados en roles (`RolesGuard`)
- Decorador `@Roles()` para restringir acceso
- Permisos diferenciados por rol

## Notas

- Las contraseñas se encriptan con bcrypt
- Los tokens expiran después de 24 horas
- El rol por defecto es 'user'
- Usa variables de entorno para configuración sensible
