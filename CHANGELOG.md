# Registro de cambios

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [1.0.0] - 2026-09-18

Primera versión publicada: el panel completo contra `sisventas-api` 0.0.1.

### Añadido (sistema completo)
- Listados paginados, ordenados, buscados y filtrados **en el servidor** (`serverList`): ya no
  existe el techo de 100 registros. Rangos de fechas en ventas, compras, inventario y auditoría.
- **Cobro** en la caja: método de pago, descuento, cliente, efectivo recibido con importes rápidos y
  cambio; vista previa del impuesto con la tasa de la API. Una línea rechazada por stock (621) se
  marca en el pedido en vez de perderse.
- Detalle de venta con desglose (subtotal, descuento, impuesto, total, recibido, cambio),
  **devoluciones parciales** línea a línea, corrección de fecha, factura A4 y **tirilla de 80 mm**
  enviada a imprimir. Corrección de fecha también en compras.
- Pantallas nuevas: **Inventario** (libro global), **Reportes** (totales, ticket promedio, margen
  estimado, gráfica diaria en SVG, por vendedor, productos más vendidos), **Cierre de caja** por día
  y vendedor, **Auditoría** (ADMIN) y **Sin permiso**.
- Usuarios: alta por administrador con rol, edición de nombre/apellido/foto, reinicio de contraseña.
  Perfil: edición propia y cierre de sesión en todos los dispositivos. Imagen de producto (URL).
- Sesión: refresco del usuario y la configuración al entrar, aviso cinco minutos antes de caducar y
  salida al caducar, 401/403 explicados una sola vez, recarga al volver a la pestaña.
- Diálogo de confirmación modal con promesa (sustituye al toast con acción), guard contra doble
  envío en todos los formularios, títulos de página por ruta, manifest PWA.
- `config.json` en tiempo de ejecución para la URL de la API, Dockerfile (nginx + SPA fallback),
  `docker-compose.yml`, publicación en GHCR desde CI.
- Tests unitarios con vitest (consulta, formato, errores de API, JWT, tabla, listas en servidor,
  carrito y cobro) y `pnpm test` + `pnpm audit` en CI.

### Seguridad
- Content-Security-Policy en nginx (`script-src 'self'`, sin scripts inline, `connect-src` acotado)
  como barrera contra XSS; el tradeoff del token en `localStorage` queda explicado en el README.

### Cambiado
- Inicio consume `GET /reports/summary` en vez de sumar listas en el cliente.
- La moneda con la que se pinta el dinero viene de `GET /settings`.
