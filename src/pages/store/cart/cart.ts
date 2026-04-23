import { PRODUCTS } from "../../../data/data";
import type { Product } from "../../../types/product";
import type { CartItem } from "../../../types/product";
import { saveCart } from "../../../utils/localStorage"; // Importamos la función para guardar el carrito en localStorage (desde utils/localStorage.ts), que se va a usar para persistir el estado del carrito entre sesiones.


// 1. Referencias a elementos del DOM (mediante id) que se van a usar en la vista.

const cartItemsList = document.getElementById("cart-items-list") as HTMLUListElement | null;
const cartSubtotal = document.getElementById("cart-subtotal") as HTMLSpanElement | null;
const cartTotal = document.getElementById("cart-total") as HTMLSpanElement | null;
const cartContent = document.getElementById("cart-content") as HTMLElement | null;
const cartEmpty = document.getElementById("cart-empty") as HTMLElement | null;
const cartCount = document.getElementById("cart-count") as HTMLSpanElement | null;
const clearCartBtn = document.getElementById("clear-cart-btn") as HTMLButtonElement | null;

// Guard clause para evitar errores silenciosos si cambia el HTML.
if (!cartItemsList || !cartSubtotal || !cartTotal || !cartContent || !cartEmpty || !cartCount || !clearCartBtn) {
throw new Error("Faltan elementos del DOM en la vista store/cart.");
}

// 2. Estado del carrito

// Al igual que en `home.ts`, definimos tipos para el estado del carrito, que es un objeto donde la clave es el productId y el valor es la cantidad de ese producto en el carrito. No es totalmente necesario, pero ayuda a la claridad del código en próximas etapas del TPI.

type CartMap = Record<string, number>; // clave: productId, valor: cantidad

type CartState = {
  items: CartMap;
  productsById: Map<number, Product>;
};

// Estado inicial del carrito, que arranca vacío.
const state: CartState = {
  items: {},
  productsById: new Map(PRODUCTS.map((product) => [product.id, product])),
};

// 3) Helpers

// Formatea números a moneda ARS para mostrar precios consistentes en UI, usando el objeto `Intl.NumberFormat`. 
const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
};

const getTotalUnits = (items: CartMap): number => {
  return Object.values(items).reduce((acc, qty) => acc + qty, 0);
};

const syncCartCount = (): void => {
  cartCount.textContent = String(getTotalUnits(state.items));
};

const persistCart = (): void => {
  saveCart(state.items);
  syncCartCount();
};

const toRenderableItems = (items: CartMap): CartItem[] => {
  return Object.entries(items)
    .map(([productId, cantidad]) => {
      const product = state.productsById.get(Number(productId));
      if (!product) return null;

      return {
        productId: product.id,
        nombre: product.nombre,
        precioUnitario: product.precio,
        cantidad,
        imagen: product.imagen,
      };
    })
    .filter((item): item is CartItem => item !== null);

};



// -- Función para agregar productos al carrito
const addToCart = (productId: string): void => {
  if (state.items[productId]) {
    state.items[productId] += 1;
  } else {
    state.items[productId] = 1;
  }

  updateCartCount();
};

// Función para actualizar el contador del carrito
const updateCartCount = (): void => {
  const cartCount = document.getElementById("cart-count") as HTMLSpanElement | null;
  if (cartCount) {
    const totalItems = Object.values(state.items).reduce((sum, quantity) => sum + quantity, 0);
    cartCount.textContent = totalItems.toString();
  }
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