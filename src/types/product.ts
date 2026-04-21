/* `product.ts` define qué campos existen y de qué tipo son para que luego puedan ser usados en otras partes del proyecto, principalmente con data.ts. En este caso, se define la interfaz `Product` que describe la estructura de un objeto producto, con campos como `id`, `nombre`, `precio`, `descripcion`, `stock`, `imagen`, `disponible` y `categorias`. Esta interfaz se puede importar y garantiza que los objetos producto tengan la estructura correcta. */

/* elegí usar `interface` y no `type` por consistencia con el resto del proyecto, ya que en otros archivos como `IUser.ts` que ya estaban creados en el repositorio base, también se utiliza `interface`. */

// Importamos la interfaz ICategory para usarla en la definición de Product, ya que un producto puede pertenecer a varias categorías.

import type { ICategory } from "./categoria";

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string; // URL o ruta de la imagen
  disponible: boolean;
  categorias: ICategory[]; // Un producto puede pertenecer a varias categorías
  eliminado: boolean;
  createdAt: string; // ISO date string
}