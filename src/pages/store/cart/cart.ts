import { PRODUCTS } from "../../../data/data";
import type { Product } from "../../../types/product";

// 1.) Estado del carrito

// Al igual que en `home.ts`, definimos un tipo para el estado del carrito, que es un objeto donde la clave es el productId y el valor es la cantidad de ese producto en el carrito. No es totalmente necesario, pero ayuda a la claridad del código en próximas etapas del TPI.

type CartState = {
  items: { [key: string]: number }; // clave es productId, valor es cantidad
};

// Estado inicial del carrito, que arranca vacío.
const cartState: CartState = {
  items: {},
};

// Función para agregar productos al carrito
const addToCart = (productId: string): void => {
  if (cartState.items[productId]) {
    cartState.items[productId] += 1;
  } else {
    cartState.items[productId] = 1;
  }

  updateCartCount();
};

// Función para actualizar el contador del carrito
const updateCartCount = (): void => {
  const cartCount = document.getElementById("cart-count") as HTMLSpanElement | null;
  if (cartCount) {
    const totalItems = Object.values(cartState.items).reduce((sum, quantity) => sum + quantity, 0);
    cartCount.textContent = totalItems.toString();
  }
};

// Formatea números a moneda ARS para mostrar precios consistentes en UI, usando el objeto `Intl.NumberFormat`. 
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
};

// Event listener para agregar productos al carrito, que captura el evento personalizado "addToCart" disparado desde home.ts
// Cuando se hace click en el botón de agregar al carrito, este evento lleva el productId en su detalle, que es lo que necesitamos para actualizar el estado del carrito y el contador visual.
document.addEventListener("addToCart", (event) => {
  const customEvent = event as CustomEvent;
  const { productId } = customEvent.detail;
  addToCart(productId);
});

// Inicializar el contador del carrito al cargar la página
updateCartCount();