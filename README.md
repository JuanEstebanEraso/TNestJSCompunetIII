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

Inicia PostgreSQL usando Docker Compose:

```bash
docker-compose up -d
```

## Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

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
