import { PRODUCTS } from "../../../data/data";
import { getCart, saveCart, type CartMap } from "../../../utils/localStorage" // Funciones para manejar el carrito en localStorage
import type { Product } from "../../../types/product";

// 1 - Referencias del DOM al inicio

// Referencias a elementos del DOM (mediante id) que se van a usar en la vista.
const productsList = document.getElementById("products-list") as HTMLUListElement | null;
const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
const searchFeedback = document.getElementById("search-feedback") as HTMLParagraphElement | null;
const categoryList = document.getElementById("category-list") as HTMLUListElement | null;
const cartCount = document.getElementById("cart-count") as HTMLSpanElement | null;

// Agrego un Guard clause (validación) por si falta algún nodo clave del HTML. Se detiene la ejecución y se lanza un error para evitar fallos silenciosos posteriores.
// Parecido a la idea de `main.ts` de validación de rutas, pero aplicado a la integridad del DOM específico de esta vista.
if (!productsList || !searchInput || !searchFeedback || !categoryList || !cartCount) {
  throw new Error("Faltan elementos del DOM en la vista store/home.");
}

// Dataset base para catálogo: excluye con `filter` productos marcados como eliminados.
let baseProducts: Product[] = PRODUCTS.filter((product) => !product.eliminado);

// 2 - Estado de pantalla simple ("single source of truth")

// En lugar de manejar variables sueltas, es posible concentral el estado de la vista en un objeto. Esto simplifica el refresco de UI y evita inconsistencias.
// A fines de este parcial, voy a dejarlo aquí para respetar la estructura de archivos, pero podría ir modularizado en la carpeta types/

type HomeViewState = {
  selectedCategory: string;
  searchTerm: string;
  filteredProducts: Product[];
};

// Estado inicial:
// - selectedCategory: "all" para mostrar catálogo completo
// - searchTerm: vacío al cargar la vista
// - filteredProducts: arranca con todos los productos base
const state: HomeViewState = {
  selectedCategory: "all",
  searchTerm: "",
  filteredProducts: [...baseProducts],
};

// Helper para volver al estado inicial de filtros. Se puede usar también si se agrega un botón de "limpiar filtros" en la UI.

const resetViewState = (): void => {
  state.selectedCategory = "all";
  state.searchTerm = "";
  state.filteredProducts = [...baseProducts];
};

// 3 - Lógica de filtrado puro (sin render)
// Normaliza texto para comparar sin importar mayúsculas/minúsculas y espacios.
const normalizeText = (value: string): string => {
  return value.trim().toLowerCase();
};

// Verifica si un producto coincide con la categoría seleccionada.
// Si selectedCategory es "all", no aplica filtro por categoría.
const matchesCategory = (product: Product, selectedCategory: string): boolean => {
  if (selectedCategory === "all") return true;

  return product.categorias.some((category) => {
    return normalizeText(category.nombre) === normalizeText(selectedCategory);
  });
};

// Verifica si el nombre del producto coincide parcial o totalmente con la búsqueda.
// Si searchTerm está vacío, no aplica filtro por texto.
const matchesSearch = (product: Product, searchTerm: string): boolean => {
  const normalizedSearch = normalizeText(searchTerm);
  if (!normalizedSearch) return true;

  return normalizeText(product.nombre).includes(normalizedSearch);
};

// Aplica ambos criterios de filtro sobre baseProducts y actualiza el estado.
// Esta función será llamada por los listeners de búsqueda y categorías.
const applyFilters = (): void => {
  state.filteredProducts = baseProducts.filter((product) => {
    const categoryOk = matchesCategory(product, state.selectedCategory);
    const searchOk = matchesSearch(product, state.searchTerm);

    return categoryOk && searchOk;
  });
};

// 4 - Render de catálogo + feedback de resultados

// Formatea números a moneda ARS para mostrar precios consistentes en UI.
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

const syncCartCountFromStorage = (): void => {
  const cart = getCart();
  cartCount.textContent = String(getTotalUnits(cart));
};

const addProductToCartStorage = (productId: string): void => {

const cart = getCart();
  cart[productId] = (cart[productId] ?? 0) + 1;
  saveCart(cart);
  cartCount.textContent = String(getTotalUnits(cart));
};

// Crea el HTML de una tarjeta de producto usando la estructura BEM de home.html.
// El botón "Agregar" queda preparado con data-product-id para conectarlo después al carrito.
const createProductCardTemplate = (product: Product): string => {
  const firstCategoryName = product.categorias[0]?.nombre ?? "Sin categoria";

  return [
    '<li class="store-home__product-item">',
    '  <article class="product-card product-card--col">',
    '    <figure class="product-card__media">',
    `      <img class="product-card__image" src="/images/${product.imagen}" alt="${product.nombre}" />`,
    "    </figure>",
    '    <div class="product-card__body product-card__body--col">',
    `      <p class="product-card__category">${firstCategoryName}</p>`,
    `      <h3 class="product-card__title">${product.nombre}</h3>`,
    `      <p class="product-card__description">${product.descripcion}</p>`,
    "    </div>",
    '    <footer class="product-card__footer product-card__footer--row">',
    `      <p class="product-card__price">${formatPrice(product.precio)}</p>`,
    `      <button class="product-card__add-btn" type="button" data-product-id="${product.id}">Agregar</button>`,
    "    </footer>",
    "  </article>",
    "</li>",
  ].join("");
};

// Renderiza el listado completo en el UL principal.
// Primero limpia contenido existente para evitar duplicados con la tarjeta estática del HTML.
const renderProducts = (): void => {
  productsList.innerHTML = "";

  const cardsMarkup = state.filteredProducts.map((product) => {
    return createProductCardTemplate(product);
  });

  productsList.innerHTML = cardsMarkup.join("");
};

// Actualiza el mensaje de estado debajo del buscador.
// Muestra contexto de búsqueda/filtro y cantidad de resultados.
const updateSearchFeedback = (): void => {
  const total = baseProducts.length;
  const filtered = state.filteredProducts.length;
  const hasSearch = normalizeText(state.searchTerm).length > 0;
  const hasCategoryFilter = state.selectedCategory !== "all";

  if (filtered === 0) {
    searchFeedback.textContent = "No se encontraron productos para el criterio actual.";
    return;
  }

  if (!hasSearch && !hasCategoryFilter) {
    searchFeedback.textContent = `Mostrando todos los productos (${total})`;
    return;
  }

  if (hasSearch && hasCategoryFilter) {
    searchFeedback.textContent =
      `Busqueda: "${state.searchTerm}" | Categoria: ${state.selectedCategory} | ${filtered} resultado(s)`;
    return;
  }

  if (hasSearch) {
    searchFeedback.textContent = `Busqueda: "${state.searchTerm}" | ${filtered} resultado(s)`;
    return;
  }

  searchFeedback.textContent = `Categoria: ${state.selectedCategory} | ${filtered} resultado(s)`;
};

// Función orquestadora de la vista:
// 1) recalcula filtros
// 2) renderiza productos
// 3) actualiza feedback visual

const refreshView = (): void => {
  applyFilters();
  renderProducts();
  updateSearchFeedback();
};

// 5 - Event Listeners para interacción con la vista

// Event listener para búsqueda
searchInput.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  state.searchTerm = target.value;
  refreshView();
});

// Event listener para categorías
categoryList.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("store-home__category-btn")) {
    const category = target.getAttribute("data-category") || "all";
    state.selectedCategory = category;

    // Actualiza la clase activa en los botones de categorías
    const buttons = categoryList.querySelectorAll(".store-home__category-btn");
    buttons.forEach((button) => {
      button.classList.toggle("store-home__category-btn--active", button === target);
    });

    refreshView();
  }
});



// Event listener para agregar productos al carrito
productsList.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest(".product-card__add-btn") as HTMLButtonElement | null;

  if (!button) return;

  const productId = button.getAttribute("data-product-id");
  if (!productId) return;

  addProductToCartStorage(productId);
});

// 6 - Inicialización de la vista

// Inicializa la vista al cargar la página
refreshView();
syncCartCountFromStorage();