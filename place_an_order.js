// Берем состав заказа из localStorage, созданный на create_lunch.html
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const orderFlexbox = document.getElementById("order-flexbox");
const checkoutList = document.getElementById("checkout-list");
const totalPriceSpan = document.getElementById("total-price");

function renderCart() {
  orderFlexbox.innerHTML = "";
  checkoutList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    // Flexbox карточки
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p class="price">${item.price} ₽</p>
      <button onclick="removeItem(${index})">Удалить</button>
    `;
    orderFlexbox.appendChild(div);

    // Список
    const li = document.createElement("li");
    li.innerHTML = `${item.name} <span>${item.price} ₽</span>`;
    checkoutList.appendChild(li);

    total += item.price;
  });

  totalPriceSpan.textContent = total;
}

function removeItem(index) {
  cartItems.splice(index, 1);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  renderCart();
}

// Время доставки
const timeLabel = document.getElementById("time-label");
const deliveryTimeInput = document.getElementById("delivery-time");

document.querySelectorAll('input[name="delivery_time"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "specified" && radio.checked) {
      timeLabel.classList.remove("hidden");
      deliveryTimeInput.classList.remove("hidden");
    } else if (radio.value === "asap" && radio.checked) {
      timeLabel.classList.add("hidden");
      deliveryTimeInput.classList.add("hidden");
    }
  });
});

// Отправка заказа
document.getElementById("submit-btn").addEventListener("click", () => {
  if (cartItems.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  const fio = document.getElementById("fio").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const comment = document.getElementById("order-comments").value.trim();
  const deliveryType = document.querySelector('input[name="delivery_time"]:checked').value;
  const deliveryTime = deliveryType === "specified" ? deliveryTimeInput.value : "";

  if (!fio || !email || !phone || !address) {
    alert("Пожалуйста, заполните все обязательные поля!");
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const order = {
    full_name: fio,
    email,
    phone,
    delivery_address: address,
    delivery_type: deliveryType === "asap" ? "Как можно скорее (с 7:00 до 23:00)" : "По времени",
    delivery_time: deliveryTime,
    comment,
    items: cartItems.map(item => item.name),
    total,
    date: new Date().toLocaleString()
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // После отправки оставляем cartItems пустым только если хотите очистить корзину
  cartItems = [];
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  renderCart();
  showSuccessPopup();
});

// Сброс формы
document.getElementById("reset-btn").addEventListener("click", () => {
  cartItems = [];
  localStorage.removeItem("cartItems");
  renderCart();
  document.getElementById("fio").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("address").value = "";
  document.getElementById("order-comments").value = "";
  deliveryTimeInput.value = "";
});

// Попап успешного заказа
const successPopup = document.getElementById("success-popup");
const okBtn = document.getElementById("ok-btn");

function showSuccessPopup() {
  successPopup.classList.remove("hidden");
}

okBtn.addEventListener("click", () => {
  successPopup.classList.add("hidden");
});

renderCart();
