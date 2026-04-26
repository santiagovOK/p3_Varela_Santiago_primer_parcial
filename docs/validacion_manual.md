# Validacion manual

Esta guia cubre que probar y como probarlo para validar consignas y rubrica.

Referencia:
- docs/consignas_primer-parcial.md

## 1. Preparacion

1. Abrir terminal en la carpeta del proyecto ``.
2. Instalar las dependencias con `pnpm install`
3. Ejecutar:

```bash
cd path/to/parcial
pnpm install
pnpm dev
```

3. Abrir la URL local que informa Vite (ejemplo: http://localhost:5175/).
4. Abrir DevTools en el navegador.

## 2. Validación de Funcionalidades

### HU-P1-01: Buscar productos en el catálogo
1. Navegar a la página principal del catálogo (`/src/pages/store/home/home.html` o index).
2. Localizar el campo de búsqueda.
3. Ingresar un texto que coincida con el nombre de un producto existente (ej. "Hamburguesa").
   - **Resultado esperado**: El catálogo se actualiza mostrando únicamente los productos que coinciden total o parcialmente con la búsqueda.
4. Ingresar un texto que no coincida con ningún producto (ej. "XYZ123").
   - **Resultado esperado**: Se muestra un mensaje visual indicando que no hay coincidencias.
5. Borrar el texto del campo de búsqueda.
   - **Resultado esperado**: El catálogo vuelve a mostrar todos los productos.

### HU-P1-02: Filtrar productos por categoría
1. En la página principal del catálogo, ubicar el menú de categorías o filtros.
2. Hacer clic en una categoría específica (ej. "Pizzas").
   - **Resultado esperado**: El catálogo se actualiza para mostrar solo los productos de esa categoría.
3. Hacer clic en la opción para ver todos los productos (ej. "Todos" o deseleccionar la categoría).
   - **Resultado esperado**: El catálogo vuelve a mostrar la lista completa de productos.

### HU-P1-03: Agregar productos al carrito
1. En el catálogo de productos, hacer clic en el botón "Agregar al carrito" de un producto.
   - **Resultado esperado**: Se muestra un indicador visual de éxito (ej. alerta, toast o contador actualizado).
2. Ir a la pestaña "Application" > "Local Storage" en las DevTools del navegador.
   - **Resultado esperado**: Existe una clave de carrito que contiene el producto agregado guardado en formato JSON.
3. Hacer clic nuevamente en "Agregar al carrito" para el mismo producto.
   - **Resultado esperado**: En el Local Storage, el producto no se duplica; en su lugar, la cantidad del ítem existente se incrementa en 1.

### HU-P1-04: Visualizar el carrito
1. Limpiar el Local Storage y navegar a la página del carrito (`/src/pages/store/cart/cart.html`).
   - **Resultado esperado**: Se muestra un mensaje indicando que el carrito está vacío.
2. Volver al catálogo, agregar algunos productos diferentes y regresar a la página del carrito.
   - **Resultado esperado**: Se muestra una lista de los productos agregados.
3. Verificar la información de cada ítem en la lista.
   - **Resultado esperado**: Cada ítem muestra correctamente su **nombre**, **precio** y la **cantidad** agregada.

### HU-P1-05: Calcular el total del carrito
1. En la página del carrito con productos cargados, observar el importe total mostrado.
   - **Resultado esperado**: El total corresponde exactamente a la suma de los subtotales de cada ítem (precio unitario × cantidad).
2. Volver al catálogo, agregar más unidades de un producto y regresar al carrito.
   - **Resultado esperado**: El importe total se actualiza correctamente reflejando las nuevas cantidades en el Local Storage.

## 3. Validación de Requisitos Técnicos

1. **Configuración de Vite**:
   - Revisar el archivo `vite.config.ts`.
   - **Resultado esperado**: Las páginas HTML adicionales (ej. catálogo y carrito) están registradas en `build.rollupOptions.input`.
   - Ejecutar `pnpm build` en la terminal.
   - **Resultado esperado**: El build finaliza sin errores y los archivos generados se encuentran en el directorio `dist/`.

2. **Estructura del Proyecto**:
   - Navegar por el árbol de archivos.
   - **Resultado esperado**: Las páginas están en `src/pages/store/...`, los tipos en `src/types/` y los datos en `src/data/`, respetando la organización.

3. **Restricciones Tecnológicas**:
   - Inspeccionar el código fuente.
   - **Resultado esperado**: El desarrollo utiliza exclusivamente HTML, CSS, JavaScript y TypeScript. No se están utilizando frameworks (como React, Angular, Vue, etc.).

