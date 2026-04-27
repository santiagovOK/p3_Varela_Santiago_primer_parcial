
# Programacion III (2026) - Primer parcial - 

✨ Estudiante

- Nombre: Varela, Santiago Octavio
- Comisión: M25 C3-13
- Email institucional: santiago.varela@tupad.utn.edu.ar

# Links de relevancia para la evaluación

**Link al repositorio en Github: https://github.com/santiagovOK/p3_Varela_Santiago_primer_parcial**

**- Video explicativo: https://youtu.be/XsA_l7GETsY**
**- Video explicativo (link B):https://drive.google.com/file/d/1tLh6fcIgUK24Sm0hlEJID5eusZOVyP60/view?usp=sharing**

**- Presentación utilizada en el video:https://whimsical.com/santiagovarela/p3-primer-parcial-X24Fejunufkt4kNEjD7kYZ**

---

Repositorio Base para este trabajo: https://github.com/chiro45/proteger_rutas 

Ya trabajé con el repositorio anterior como base para el primer trabajo práctico sobre TypeScript, por lo cuál en realidad partí desde lo realizado allí. Ese trabajo está en mi [repositorio de la asignatura](https://github.com/santiagovOK/UTN-TUPaD-P3/tree/main/unidad4_auth_rutas_ts)

## Instalación de dependencias

Requisitos previos:

- Node.js (versión 18 o superior recomendada).
- pnpm instalado globalmente.

Pasos:

1. Ubicarse en la carpeta del proyecto.
2. Instalar dependencias:

```bash
pnpm install
```

3. Levantar el entorno de desarrollo:

```bash
pnpm dev
```

## Objetivo General

El objetivo de esta evaluación es consolidar los conocimientos adquiridos en las primeras unidades del cursado (HTML, CSS, JavaScript y TypeScript), mediante la evolución del proyecto Food Store hacia una aplicación frontend más dinámica e interactiva.

### Resumen de funcionalidades implementadas:

- **Maquetación y Estilos**: Diseño y maquetación de las vistas del catálogo (`/store/home`) y el carrito (`/store/cart`), integrando los componentes estructurales con CSS para lograr una interfaz de usuario prolija y funcional.
- **Carrito básico con persistencia**: permite agregar productos desde el catálogo, visualizar la información en una vista dedicada y calcular el total de la compra. Los datos se mantienen persistentes usando localStorage.
- **Búsqueda y filtrado de productos**: funcionalidad dinámica de interacción sobre el catálogo para buscar artículos por su nombre o filtrar los resultados según su categoría. 

## Validaciones Manuales

Pueden ver el paso a paso de las validaciones manuales que seguí para el cumplimiento de las consignas y los criterios evaluativos en [docs/validacion_manual.md](docs/validacion_manual.md).

Además, se comprobó que el proyecto compila correctamente para producción, incluyendo las nuevas rutas requeridas (`home` y `cart`). Para probar el build, ejecutar:

```bash
pnpm build
```

Esto generará de manera exitosa el directorio `dist/` con las páginas registradas en `vite.config.ts` y todos los recursos optimizados.

## Uso de console.log para debugging

Durante el desarrollo se utilizaron `console.log` para seguir el flujo de las funcionalidades del parcial (búsqueda de productos, filtros por categoría, y gestión del carrito en `localStorage`), así como los flujos previos de registro, login, guard de rutas y logout. Se utilizaron prefijos por contexto (ej. `[store]`, `[cart]`, `[auth]`) para facilitar la lectura en consola.

Estos logs se usaron solo como soporte de depuración y desarrollo, asegurando que el estado del catálogo y el contenido del carrito funcionen correctamente en todo momento, evitando además exponer datos sensibles.

## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](LICENCE.TXT).