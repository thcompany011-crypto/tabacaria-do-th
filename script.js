const PHONE = "5562994385558";

const products = [
  {
    id: 1,
    name: "IGNITE V300",
    price: 150,
    cat: "ignite",
    meta: "Destaque",
    image: "assets/products/ignite-v300.webp",
    flavors: ["MORANGO KIWI 🍓🥝", "MENTHOL 🍃"]
  },
  {
    id: 2,
    name: "ELFBAR BC 25K",
    price: 130,
    cat: "elfbar",
    meta: "Destaque",
    image: "assets/products/elfbar-bc-25k.webp",
    flavors: ["MENTA GELADA 🍃"]
  },
  {
    id: 3,
    name: "DINNER LUMA 20K",
    price: 130,
    cat: "outros",
    meta: "Disponível",
    image: "assets/products/dinner-luma-20k.webp",
    flavors: ["MENTA GELADA 🍃", "MENTHOL 🍃"]
  },
  {
    id: 4,
    name: "REFIL LIFE 10K",
    price: 110,
    cat: "refil",
    meta: "Refil",
    image: "assets/products/refil-life-10k.webp",
    flavors: ["ÁGUA DE COCO 🥥🧊", "BLUE RAZZ 💙", "DRAGON BLUE RAZZ 💙"]
  },
  {
    id: 5,
    name: "IGNITE SLIM 8K PUFF",
    price: 110,
    cat: "ignite",
    meta: "Destaque",
    image: "assets/products/ignite-slim-8k.webp",
    flavors: ["MENTHOL 🍃"]
  },
  {
    id: 6,
    name: "IGNITE V400 ICE SLIM",
    price: 160,
    cat: "ignite",
    meta: "Destaque",
    image: "assets/products/ignite-v400-ice-slim.webp",
    flavors: ["MENTHOL 🍃", "MENTA ICE 🍃🧊"]
  },
  {
    id: 7,
    name: "IGNITE V500",
    price: 150,
    cat: "ignite",
    meta: "Destaque",
    image: "assets/products/ignite-v500.webp",
    flavors: ["MENTHOL 🍃🧊", "UVA ICE 🍇🧊"]
  },
  {
    id: 8,
    name: "IGNITE KIT P100",
    price: 140,
    cat: "kit",
    meta: "Kit",
    image: "assets/products/ignite-kit-p100.webp",
    flavors: ["MENTA GELADA 🍃🧊", "UVA GELADA 🍇🧊"]
  },
  {
    id: 9,
    name: "REFIL P100",
    price: 110,
    cat: "refil",
    meta: "Refil",
    image: "assets/products/refil-p100.webp",
    flavors: ["MAÇÃ VERDE ICE 🍏🧊", "MELANCIA ICE 🍉🧊", "MORANGO E KIWI 🍓🥝"]
  },
  {
    id: 10,
    name: "IGNITE V155 SLIM",
    price: 120,
    cat: "ignite",
    meta: "Destaque",
    image: "assets/products/ignite-v155-slim.webp",
    flavors: ["MORANGO ICE 🍓🧊", "TROPICAL AÇAÍ"]
  },
  {
    id: 11,
    name: "BLACK SHEEP DUAL 40K",
    price: 150,
    cat: "outros",
    meta: "Disponível",
    image: "assets/products/black-sheep-dual-40k.webp",
    flavors: ["AÇAÍ E MORANGO 🍓", "AÇAÍ E UVA 🍇"]
  },
  {
    id: 12,
    name: "REFIL LIFE ECO3",
    price: 120,
    cat: "refil",
    meta: "Refil",
    image: "assets/products/refil-life-eco3.webp",
    flavors: ["MARACUJÁ ICE 🧊", "MELANCIA E LIMÃO 🍉", "UVA VERDE 🍇"]
  },
  {
    id: 13,
    name: "KIT LIFE ECO3",
    price: 160,
    cat: "kit",
    meta: "Kit",
    image: "assets/products/kit-life-eco3.webp",
    flavors: ["CHICLETE DE MENTA 🍃🍬"]
  },
  {
    id: 14,
    name: "COIL/RESISTÊNCIA 3ML",
    price: null,
    cat: "acessorios",
    meta: "Acessório",
    image: null,
    flavors: []
  },
  {
    id: 15,
    name: "NIC SALT 45mg",
    price: null,
    cat: "acessorios",
    meta: "Consultar",
    image: null,
    flavors: []
  }
];

let cart = {};
try {
  const storedCart = JSON.parse(localStorage.getItem("thCart") || "{}");
  if (storedCart && typeof storedCart === "object" && !Array.isArray(storedCart)) {
    cart = Object.fromEntries(
      Object.entries(storedCart)
        .filter(([id, quantity]) => products.some((product) => product.id === Number(id)) && Number.isInteger(quantity) && quantity > 0)
        .map(([id, quantity]) => [id, Math.min(quantity, 99)])
    );
  }
} catch (e) {
  cart = {};
}
let activeFilter = "all";

const $ = (selector) => document.querySelector(selector);

const money = (value) =>
  value == null
    ? "Consultar"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(value);

function saveCart() {
  cart = Object.fromEntries(
    Object.entries(cart)
      .filter(([id, quantity]) => products.some((product) => product.id === Number(id)) && Number.isInteger(quantity) && quantity > 0)
      .map(([id, quantity]) => [id, Math.min(quantity, 99)])
  );

  try {
    localStorage.setItem("thCart", JSON.stringify(cart));
  } catch (e) {}

  renderCart();
  updateCount();
}

function updateCount() {
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  $("#cartCount").textContent = count;
}

function searchableText(product) {
  return [
    product.name,
    product.meta,
    ...(product.flavors || [])
  ]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filteredProducts() {
  const query = $("#searchInput").value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let list = products.filter((product) => {
    const categoryMatch =
      activeFilter === "all" || product.cat === activeFilter;
    const searchMatch =
      !query || searchableText(product).includes(query);

    return categoryMatch && searchMatch;
  });

  const sort = $("#sortSelect").value;

  if (sort === "low") {
    list.sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
  }

  if (sort === "high") {
    list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  }

  if (sort === "az") {
    list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  return list;
}

function productImage(product) {
  if (product.image) {
    return `<img
      src="${product.image}"
      alt="${product.name}"
      loading="lazy"
      decoding="async"
      onerror="this.style.display='none';this.nextElementSibling.hidden=false"
    >
    <div class="product-placeholder" hidden>TH</div>`;
  }

  return '<div class="product-placeholder">TH</div>';
}

function renderProducts() {
  const list = filteredProducts();
  const grid = $("#productGrid");

  $("#resultInfo").textContent =
    list.length +
    " produto" +
    (list.length === 1 ? "" : "s") +
    " encontrado" +
    (list.length === 1 ? "" : "s");

  if (!list.length) {
    grid.innerHTML =
      '<div class="empty-cart" style="grid-column:1/-1">Nenhum produto encontrado.</div>';
    return;
  }

  grid.innerHTML = list
    .map((product) => {
      const flavors = product.flavors?.length
        ? product.flavors.join(" • ")
        : "Consulte disponibilidade";

      return `<article class="product-card">
        <div class="product-visual">
          ${productImage(product)}
        </div>
        <div class="product-body">
          <div class="product-name">${product.name}</div>
          <div class="product-meta">${flavors}</div>
          <div class="product-price ${product.price == null ? "consult" : ""}">
            ${money(product.price)}
          </div>
          <button class="product-add" data-id="${product.id}">
            ${product.price == null ? "Consultar no WhatsApp" : "Adicionar ao carrinho"}
          </button>
        </div>
      </article>`;
    })
    .join("");

  grid.querySelectorAll(".product-add").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find(
        (item) => item.id === Number(button.dataset.id)
      );

      if (!product) return;

      if (product.price == null) {
        openProductWhatsApp(product);
        return;
      }

      cart[product.id] = Math.min((cart[product.id] || 0) + 1, 99);
      saveCart();
    });
  });
}

function openProductWhatsApp(product) {
  const message =
    `Olá! Gostaria de consultar o valor e a disponibilidade de: ${product.name}.`;

  window.open(
    `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener"
  );
}

function renderCart() {
  const box = $("#cartItems");
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);

  if (!ids.length) {
    box.innerHTML =
      '<div class="empty-cart">Seu carrinho está vazio.<br>Adicione produtos para montar seu pedido.</div>';
    $("#cartTotal").textContent = money(0);
    return;
  }

  let total = 0;

  box.innerHTML = ids
    .map((id) => {
      const product = products.find((item) => item.id === Number(id));
      const quantity = cart[id];

      if (!product || product.price == null) return "";

      total += product.price * quantity;

      return `<div class="cart-item">
        <div>
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">
            ${money(product.price)} × ${quantity}
          </div>
        </div>
        <div class="qty">
          <button data-minus="${product.id}" aria-label="Diminuir">−</button>
          <b>${quantity}</b>
          <button data-plus="${product.id}" aria-label="Aumentar">+</button>
        </div>
      </div>`;
    })
    .join("");

  $("#cartTotal").textContent = money(total);

  box.querySelectorAll("[data-minus]").forEach((button) => {
    button.onclick = () =>
      changeQty(Number(button.dataset.minus), -1);
  });

  box.querySelectorAll("[data-plus]").forEach((button) => {
    button.onclick = () =>
      changeQty(Number(button.dataset.plus), 1);
  });
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  saveCart();
}

function openCart() {
  const panel = $("#cartPanel");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  const panel = $("#cartPanel");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function sendOrder() {
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);

  if (!ids.length) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  let total = 0;

  const lines = ids
    .map((id) => {
      const product = products.find(
        (item) => item.id === Number(id)
      );

      if (!product || product.price == null) return "";

      const quantity = cart[id];
      total += product.price * quantity;

      return `• ${product.name} — ${quantity}x — ${money(
        product.price * quantity
      )}`;
    })
    .filter(Boolean);

  const message =
    `Olá! Quero falar sobre um pedido na Tabacaria do TH.\n\n${lines.join(
      "\n"
    )}\n\nTotal informado no catálogo: ${money(
      total
    )}\n\nTenho 18 anos ou mais.`;

  window.open(
    `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener"
  );
}

$("#searchInput").addEventListener("input", renderProducts);
$("#sortSelect").addEventListener("change", renderProducts);

document.querySelectorAll(".category").forEach((button) => {
  button.onclick = () => {
    document
      .querySelectorAll(".category")
      .forEach((item) => item.classList.remove("active"));

    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProducts();
  };
});

$("#openCart").onclick = openCart;
$("#closeCart").onclick = closeCart;
$("#closeCartButton").onclick = closeCart;
$("#whatsappOrder").onclick = sendOrder;

$("#clearCart").onclick = () => {
  cart = {};
  saveCart();
};

$("#ageYes").onclick = () => {
  try {
    localStorage.setItem("thAge", "yes");
  } catch (e) {}
  $("#ageGate").classList.add("hidden");
};

$("#ageNo").onclick = () => {
  window.location.href = "https://www.google.com/";
};

try {
  if (localStorage.getItem("thAge") === "yes") {
    $("#ageGate").classList.add("hidden");
  }
} catch (e) {}

const ageGate = $("#ageGate");
const ageYes = $("#ageYes");
const ageNo = $("#ageNo");

function closeAgeGate() {
  try {
    localStorage.setItem("thAge", "yes");
  } catch (e) {}
  ageGate.classList.add("hidden");
  document.body.style.overflow = "";
}

ageYes.addEventListener("click", closeAgeGate);

ageNo.addEventListener("click", () => {
  window.location.replace("https://www.google.com/");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !ageGate.classList.contains("hidden")) {
    ageNo.click();
    return;
  }

  if (event.key === "Escape" && $("#cartPanel").classList.contains("open")) {
    closeCart();
  }
});

const originalOpenCart = openCart;
openCart = function () {
  originalOpenCart();
  const closeButton = $("#closeCartButton");
  if (closeButton) closeButton.focus();
};

if (!ageGate.classList.contains("hidden")) {
  document.body.style.overflow = "hidden";
  ageYes.focus();
}

renderProducts();
renderCart();
updateCount();
