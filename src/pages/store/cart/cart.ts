import { PRODUCTS } from "../../../data/data";
import type { Product } from "../../../types/product";
import type { CartItem } from "../../../types/product";
import { getCart, saveCart, clearCart } from "../../../utils/localStorage"; // Importamos la función para guardar el carrito en localStorage (desde utils/localStorage.ts), que se va a usar para persistir el estado del carrito entre sesiones.


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
  items: getCart(), // Cargamos el carrito desde localStorage al iniciar la vista, para mantener persistencia entre sesiones.
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
// 4) Render principal

const getLineSubtotal = (precioUnitario: number, cantidad: number): number => {
  return precioUnitario * cantidad;
};

const updateTotals = (items: CartItem[]): void => {
  const total = items.reduce((acc, item) => {
    return acc + getLineSubtotal(item.precioUnitario, item.cantidad);
  }, 0);

  cartSubtotal.textContent = formatPrice(total);
  cartTotal.textContent = formatPrice(total);
};

const createCartItemTemplate = (item: CartItem): string => {
  const product = state.productsById.get(item.productId);
  const category = product?.categorias[0]?.nombre ?? "Sin categoria";
  const lineSubtotal = getLineSubtotal(item.precioUnitario, item.cantidad);

  return [
    '<li class="cart-items__item">',
    '  <article class="cart-product cart-product--row">',
    '    <div class="cart-product__main cart-product__main--row">',
    '      <figure class="cart-product__media">',
    `        <img class="cart-product__image" src="/images/${item.imagen}" alt="${item.nombre}" />`,
    "      </figure>",
    '      <div class="cart-product__info cart-product__info--col">',
    `        <h3 class="cart-product__name">${item.nombre}</h3>`,
    `        <p class="cart-product__category">${category}</p>`,
    `        <p class="cart-product__subtotal">Subtotal: ${formatPrice(lineSubtotal)}</p>`,
    "      </div>",
    "    </div>",
    '    <div class="cart-product__actions cart-product__actions--col">',
    '      <div class="cart-product__quantity cart-product__quantity--row" aria-label="Control de cantidad">',
    `        <button class="cart-product__quantity-btn" type="button" data-action="decrease" data-product-id="${item.productId}" aria-label="Restar unidad">-</button>`,
    `        <span class="cart-product__quantity-value" aria-live="polite">${item.cantidad}</span>`,
    `        <button class="cart-product__quantity-btn" type="button" data-action="increase" data-product-id="${item.productId}" aria-label="Sumar unidad">+</button>`,
    "      </div>",
    `      <button class="cart-product__remove-btn" type="button" data-action="remove" data-product-id="${item.productId}">Eliminar</button>`,
    "    </div>",
    "  </article>",
    "</li>",
  ].join("");
};

const renderCartItems = (items: CartItem[]): void => {
  cartItemsList.innerHTML = items.map(createCartItemTemplate).join("");
};

// 5) Estado vacío

const toggleEmptyState = (hasItems: boolean): void => {
  if (hasItems) {
    cartContent.hidden = false;
    cartEmpty.hidden = true;
    return;
  }

  cartContent.hidden = true;
  cartEmpty.hidden = false;
};

const renderCartView = (): void => {
  const renderableItems = toRenderableItems(state.items);
  const hasItems = renderableItems.length > 0;

  toggleEmptyState(hasItems);
  syncCartCount();

  if (!hasItems) {
    cartItemsList.innerHTML = "";
    cartSubtotal.textContent = formatPrice(0);
    cartTotal.textContent = formatPrice(0);
    return;
  }

  renderCartItems(renderableItems);
  updateTotals(renderableItems);
};

// 6) Interacciones

const increaseItemQuantity = (productId: string): void => {
  if (!state.items[productId]) {
    state.items[productId] = 1;
  } else {
    state.items[productId] += 1;
  }
};

const decreaseItemQuantity = (productId: string): void => {
  const current = state.items[productId];
  if (!current) return;

  if (current <= 1) {
    delete state.items[productId];
    return;
  }

  state.items[productId] = current - 1;
};

const removeItem = (productId: string): void => {
  delete state.items[productId];
};

cartItemsList.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const action = target.getAttribute("data-action");
  const productId = target.getAttribute("data-product-id");

  if (!action || !productId) return;

  if (action === "increase") {
    increaseItemQuantity(productId);
  }

  if (action === "decrease") {
    decreaseItemQuantity(productId);
  }

  if (action === "remove") {
    removeItem(productId);
  }

  persistCart();
  renderCartView();
});

clearCartBtn.addEventListener("click", () => {
  state.items = {};
  clearCart();
  renderCartView();
});
renderCartView(); // Renderizado del estado actual del carrito