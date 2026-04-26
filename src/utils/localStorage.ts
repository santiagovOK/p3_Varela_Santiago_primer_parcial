import type { IUser } from "../types/IUser";

export const saveUser = (user: IUser) => {
  const parseUser = JSON.stringify(user);
  localStorage.setItem("userData", parseUser);
};
export const getUSer = () => {
  return localStorage.getItem("userData");
};
export const removeUser = () => {
  localStorage.removeItem("userData");
};

// ---------------------

// Función para guardar el carrito en localStorage (helpers) - Agregado para el parcial y así no tener que colocar todo en cart.ts, aunque podría ir ahí también perfectamente.
// NO DEPENDE NI SE RELACIONA CON EL USUARIO (userData)

// Usando Record<string, number> para definir un tipo de objeto que representa el carrito. Record es una utilidad de TypeScript que permite definir un tipo de objeto con claves de un tipo específico. Creo que es útil comenzar a usarla para familiarizarme con esta clase de herramientas.

export type CartMap = Record<string, number>; // clave: productId, valor: cantidad (de los productos) , para usar en el carrito y también para el storage del carrito

// Creación de una constante para la clave de localStorage, para evitar errores de tipeo y facilitar cambios futuros, siguiendo la buena práctica de centralizar estos valores para mejor mantenibilidad.
const CART_STORAGE_KEY = "store_cart_items";

export const getCart = (): CartMap => {
  // Obtener el carrito almacenado en localStorage

  const rawCart = localStorage.getItem(CART_STORAGE_KEY);

  // Si no hay datos en localStorage, devolver un objeto vacío
  if (!rawCart) return {};

  try {
    // Parsear el JSON almacenado en localStorage, utilizando un tipo desconocido para validar su estructura antes de convertirlo a CartMap.
    const parsed = JSON.parse(rawCart) as unknown;

    // Validar que el dato parseado sea un objeto válido y no un array, ya que se un objeto con claves de producto y cantidades.
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

        // Procesar las entradas del objeto para asegurar datos válidos
    const safeEntries = Object.entries(parsed as Record<string, unknown>)

      // Filtrar solo las entradas con valores numéricos válidos (mayores a 0)
      .filter(([_, value]) => typeof value === "number" && Number.isFinite(value) && value > 0)

      // Convertir los valores a enteros (eliminar decimales)
      .map(([key, value]) => [key, Math.floor(value as number)]);

    
      // Convertir las entradas procesadas de nuevo a un objeto
    return Object.fromEntries(safeEntries);
  } catch {
    // Si ocurre algún error durante el parseo o procesamiento, devolver un objeto vacío
    return {};
  }
};

// Función para guardar el carrito en localStorage, recibe un objeto con la estructura CartMap, lo convierte a JSON y lo almacena bajo la clave definida en CART_STORAGE_KEY.
export const saveCart = (items: CartMap): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

// Función para limpiar el carrito, elimina la entrada del carrito en localStorage utilizando la clave definida en CART_STORAGE_KEY.
export const clearCart = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};