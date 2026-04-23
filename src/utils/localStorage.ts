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

// Función para guardar el carrito en localStorage (helpers) - Agregado para el parcial y así no tener que colocar todo en cart.ts, aunque podría ir ahí también perfectamente.
// NO DEPENDE NI SE RELACIONA CON EL USUARIO (userData)

export type CartMap = Record<string, number>; // clave: productId, valor: cantidad , para usar en el carrito y también para el storage del carrito

// Creación de una constante para la clave de localStorage, para evitar errores de tipeo y facilitar cambios futuros, siguiendo la buena práctica de centralizar estos valores para mejor mantenibilidad.
const CART_STORAGE_KEY = "store_cart_items";

export const getCart = (): CartMap => {
  const rawCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!rawCart) return {};

  try {
    const parsed = JSON.parse(rawCart) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const safeEntries = Object.entries(parsed as Record<string, unknown>)
      .filter(([_, value]) => typeof value === "number" && Number.isFinite(value) && value > 0)
      .map(([key, value]) => [key, Math.floor(value as number)]);

    return Object.fromEntries(safeEntries);
  } catch {
    return {};
  }
};

export const saveCart = (items: CartMap): void => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};