# Contribuir

Este es un proyecto personal y no tiene colaboradores fijos, pero los issues y las
propuestas son bienvenidos.

## Antes de proponer un cambio

1. Lee el README: describe qué hace el panel, qué no hace a propósito y las convenciones de
   interfaz (cuatro estados por pantalla, listados en servidor, cobro en la caja).
2. El código va en inglés; la interfaz, los comentarios y la documentación interna, en español.
3. Cadena en un solo sentido: `pantalla → operación → (service | store) → HttpClient`. Una
   operación por archivo en `operations/`; las pantallas nunca llaman a la API ni muestran toasts
   por su cuenta.
4. Lista de dependencias cerrada: nada de librerías de UI, formularios, gráficas, iconos ni
   estado. Cada componente trae su CSS con las variables de `src/styles.css`, en los dos temas.
5. Toda pantalla nueva cubre cargando, error, vacío, sin resultados y con datos.

## Verificar

```bash
pnpm lint && pnpm test && pnpm build
docker build -t sisventas-app . && docker run --rm -p 4300:80 sisventas-app
```

Antes de una entrega, recorre las pantallas tocadas contra la API real (`../sisventas-api`).

## Commits

Mensajes en inglés, en imperativo, con el porqué en el cuerpo cuando no sea obvio.
