// Seleção de elementos DOM
const menu = document.getElementById("menu");
const cartModal = document.querySelector("#cart-modal");
const cartBtn = document.querySelector("#cart-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const dateSpanItem = document.querySelector("#date-span");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const inputAddress = document.querySelector("#address");
const addressWarning = document.querySelector("#address-warning");

// Estado do carrinho de compras
let cart = [];

// Inicialização dos Event Listeners
initializeEventListeners();

// Função para inicializar os Event Listeners
function initializeEventListeners() {
  cartBtn.addEventListener("click", openCartModal);
  cartModal.addEventListener("click", handleCloseModalClick);
  menu.addEventListener("click", handleAddToCartClick);
  cartItemsContainer.addEventListener("click", handleRemoveItemClick);
  inputAddress.addEventListener("input", validateAddressInput);
  checkoutBtn.addEventListener("click", handleCheckout);
}

// Abre o modal do carrinho
function openCartModal() {
  updateCartModal();
  cartModal.style.display = "flex";
}

// Fecha o modal do carrinho
function handleCloseModalClick(event) {
  if (event.target === cartModal || event.target === closeModalBtn) {
    cartModal.style.display = "none";
  }
}

// Adiciona item ao carrinho ao clicar no botão correspondente
function handleAddToCartClick(event) {
  const addToCartButton = event.target.closest(".add-to-cart-btn");

  if (addToCartButton) {
    const name = addToCartButton.getAttribute("data-name");
    const price = parseFloat(addToCartButton.dataset.price);
    addToCart(name, price);
  }
}

// Remove item do carrinho ao clicar no botão correspondente
function handleRemoveItemClick(event) {
  if (event.target.classList.contains("remove-item-cart-btn")) {
    const itemName = event.target.dataset.name;
    removeItemFromCart(itemName);
  }
}

// Adiciona um item ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const newItem = { name, price, quantity: 1 };
    showToast(`${name} adicionado ao carrinho`, "linear-gradient(to right, #22e675, #22e55e)");
    cart.push(newItem);
  }
  updateCartModal();
}

// Remove um item do carrinho
function removeItemFromCart(name) {
  const itemIndex = cart.findIndex((item) => item.name === name);

  if (itemIndex !== -1) {
    const product = cart[itemIndex];

    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    updateCartModal();
  }
}

// Atualiza o conteúdo do modal do carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(createCartItemElement(item));
  });

  cartTotal.textContent = formatCurrency(total);
  cartCount.textContent = cart.length;
}

// Cria o elemento HTML para um item do carrinho
function createCartItemElement(item) {
  const cartItemElement = document.createElement("div");
  cartItemElement.classList.add("flex", "flex-col", "justify-between", "mb-4");

  cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="w-40 text-clip font-medium">${item.name}</p>
        <p>Qtd: <span class="font-semibold">${item.quantity}</span></p>
        <p class="font-medium">R$${item.price.toFixed(2)}</p>
      </div>
      <button 
        class="py-1 px-3 bg-black text-white rounded-md remove-item-cart-btn"
        data-name="${item.name}">
        Remover
      </button>
    </div>
  `;
  return cartItemElement;
}

// Formata valores monetários
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Valida o campo de endereço durante o input
function validateAddressInput(event) {
  const inputValue = event.target.value;

  if (inputValue.length > 1) {
    inputAddress.classList.remove("border-red-500");
    addressWarning.classList.add("hidden");
  }
}

// Processa o checkout do carrinho
function handleCheckout() {
  if (cart.length === 0) {
    showToast("Ops! O Carrinho está vázio!", "linear-gradient(to right, #ef4444, #ef4149)");
    return;
  }

  if (inputAddress.value === "") {
    addressWarning.classList.remove("hidden");
    inputAddress.classList.add("border-red-500");
    return;
  }

  sendOrderToWhatsapp();
  // Limpa o carrinho
  // cart = [];
}

// Mostra um toast com a mensagem fornecida
function showToast(message, background) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: { background },
  }).showToast();
}

// Envia o pedido para o WhatsApp
function sendOrderToWhatsapp() {
  const cartItems = cart.map((item) => {
    return ` ${item.name}, Quantidade: (${item.quantity}), Preço: R$${item.price.toFixed(2)} |\n`;
  }).join("-");

  const message = encodeURIComponent(cartItems);
  const phone = "+5581998451051";

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${inputAddress.value}`, "_blank");
}

// Verifica se o restaurante está aberto
function checkRestaurantIsOpen() {
  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 18 && currentHour <= 23;

  if (isOpen) {
    dateSpanItem.classList.remove("bg-red-500");
    dateSpanItem.classList.add("bg-green-600");
  }
}
