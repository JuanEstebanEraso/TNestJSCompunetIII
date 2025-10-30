# Módulo de Seed

Este módulo permite poblar la base de datos con datos de prueba para desarrollo.

## Estructura

```
src/seed/
├── data/
│   └── seed-data.ts       # Datos de prueba
├── seed.controller.ts      # Endpoints para ejecutar seeds
├── seed.module.ts         # Módulo de NestJS
└── seed.service.ts        # Lógica de seeding
```

## Uso

### Ejecutar el seed

Para poblar la base de datos con datos de prueba, ejecuta:

```bash
curl -X POST http://localhost:3000/seed
```

o desde tu cliente HTTP preferido (Postman, Insomnia, etc.).

### Limpiar datos

Para eliminar todos los datos de prueba:

```bash
curl -X POST http://localhost:3000/seed/clear
```

## Datos incluidos

- **Usuarios**: admin y 3 usuarios de prueba (password: `password123`)
- **Eventos**: 6 eventos deportivos con diferentes opciones
- **Apuestas**: 8 apuestas de ejemplo con diferentes estados

## Credenciales de prueba

| Usuario | Contraseña | Rol | Balance |
|---------|------------|-----|---------|
| admin | password123 | admin | $50,000 |
| usuario1 | password123 | user | $15,000 |
| usuario2 | password123 | user | $8,000 |
| usuario3 | password123 | user | $12,000 |

## Notas

- El seed verifica si los datos ya existen antes de crearlos
- Todos los usuarios comparten la misma contraseña: `password123`
- Las contraseñas están hasheadas usando bcrypt
- Los eventos incluyen diferentes estados (OPEN y CLOSED)
- Las apuestas incluyen diferentes estados (PENDING, WON, LOST)

