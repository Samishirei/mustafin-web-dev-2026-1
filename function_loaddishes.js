
// ФАЙЛ function_loaddishes.js
// ПРОВЕРКА НАЛИЧИЯ БЛЮД НА СЕРВЕРЕ

async function loadDishes() {
  const apiURL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status}`);
    }

    const dishes = await response.json();
    console.log(`Сервер доступен. Получено ${dishes.length} блюд.`);

    const dishNames = dishes.map(d => d.name);
    console.log('Доступные на сервере блюда:', dishNames);

    // Инициализация интерфейса после загрузки
    initializeFilters();
    initializeAddButtons(dishes);

  } catch (error) {
    console.warn('Не удалось связаться с сервером блюд:', error);

    // Если сервер не доступен, используем локальные блюда (HTML)
    initializeFilters();
    initializeAddButtons();
  }
}

// ИНИЦИАЛИЗАЦИЯ ФИЛЬТРОВ
function initializeFilters() {
  // Фильтры для блюд
  const filterBtns = document.querySelectorAll(".filter-btn");
  const itemsGrid = document.querySelector("#food-items .items-grid");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const items = itemsGrid.querySelectorAll(".item");

      items.forEach(item => {
        if (filter === "all" || item.dataset.type === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Фильтры для напитков
  const drinkFilterBtns = document.querySelectorAll(".drink-filter-btn");
  const drinksGrid = document.querySelector("#drinks-items .items-grid");

  drinkFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      drinkFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      const items = drinksGrid.querySelectorAll(".item");

      items.forEach(item => {
        if (filter === "all" || item.dataset.type === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// ИНИЦИАЛИЗАЦИЯ КНОПОК "ДОБАВИТЬ В КОРЗИНУ"
function initializeAddButtons(serverDishes = null) {
  const addButtons = document.querySelectorAll(".add-btn");

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const itemCard = btn.closest(".item");
      const id = itemCard.dataset.id;
      const name = itemCard.dataset.name;
      const price = parseInt(itemCard.dataset.price);
      const img = itemCard.querySelector("img").src;

      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      cartItems.push({ id, name, price, img });
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      alert(`${name} добавлено в корзину!`);
    });
  });
}

// АВТОМАТИЧЕСКИЙ ЗАПУСК
document.addEventListener("DOMContentLoaded", loadDishes);
