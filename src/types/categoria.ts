/* `categoria.ts` define qué campos existen y de qué tipo son para que luego puedan ser usados en otras partes del proyecto, principalmente con data.ts. En este caso, se define la interfaz `ICategoria` que describe la estructura de un objeto categoría, con campos como `id`, `nombre`, `descripcion`, `eliminado` y `createdAt`. Esta interfaz se puede importar y garantiza que los objetos categoría tengan la estructura correcta. */

/* elegí usar `interface` y no `type` por consistencia con el resto del proyecto, ya que en otros archivos como `IUser.ts` que ya estaban creados en el repositorio base, también se utiliza `interface`. */

export interface ICategory {
  id: number;
  nombre: string;
  descripcion: string;
  eliminado: boolean;
  createdAt: string; // ISO date string
}