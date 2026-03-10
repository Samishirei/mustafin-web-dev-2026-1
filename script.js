const SUBMIT_URL = "";

    const COMBOS = {
      1: {
        name: "Combo 1: Adventurer's Breakfast",
        items: [
          { id: "drink2", name: "Potion of Healing", price: 12, img: "img/Potion_of_Healing.png" },
          { id: "food6", name: "Golden Apple", price: 32, img: "img/Golden_Apple.png" }
        ],
        total: 44
      },
      2: {
        name: "Combo 2: Miner's Lunch",
        items: [
          { id: "food8", name: "Baked Potato", price: 5, img: "img/potato.png" },
          { id: "food1", name: "Cooked Porkchop", price: 8, img: "img/porkchop.png" },
          { id: "drink1", name: "Honey Bottle", price: 5, img: "img/honey.png" }
        ],
        total: 18
      },
      3: {
        name: "Combo 3: Enchanter's Dinner",
        items: [
          { id: "food7", name: "Enchanted Golden Apple", price: 64, img: "img/Enchanted_Golden_Apple.png" },
          { id: "food2", name: "Suspicious Stew", price: 12, img: "img/stew.png" }
        ],
        total: 76
      }
    };

// ВНУТРЕННЕЕ СОСТОЯНИЕ ЗАКАЗА
let order = {}; // ключ = itemId, value = { id, name, price, qty }

// УТИЛИТЫ
const byId = id => document.getElementById(id);
function formatPrice(n){ return Number(n).toFixed(0); }

// ФУНКЦИИ РАБОТЫ С ЗАКАЗОМ

// Добавление/увеличение позиции
function addToOrder(item){
  if(!item || !item.id) return;
  if(order[item.id]){
    order[item.id].qty += 1;
  } else {
    order[item.id] = { ...item, qty: 1 };
  }

  saveOrder();
  renderOrder();
}

// Уменьшение количества
function decreaseQty(itemId){
  if(!order[itemId]) return;
  order[itemId].qty -= 1;
  if(order[itemId].qty <= 0) delete order[itemId];

  saveOrder();
  renderOrder();
}

// Увеличение количества
function increaseQty(itemId){
  if(!order[itemId]) return;
  order[itemId].qty += 1;

  saveOrder();
  renderOrder();
}

// Сброс заказа
function resetAll(){
  order = {};
  saveOrder();
  renderOrder();

  ['comments','name','email','phone','address','time-input'].forEach(id=>{
    const el = byId(id);
    if(!el) return;
    if(el.type === 'checkbox' || el.type === 'radio') el.checked = false;
    else el.value = '';
  });
  byId('subscribe').checked = false;
  document.querySelectorAll('input[name="delivery_time"]').forEach(r=>{
    if(r.value === 'asap') r.checked = true;
  });
  toggleTimeInput();
  showMessage('', false);
}

// Сохранение заказа в localStorage
function saveOrder(){
  localStorage.setItem('order', JSON.stringify(Object.values(order)));
}

// Загрузка заказа из localStorage
function loadOrder(){
  const saved = JSON.parse(localStorage.getItem('order')) || [];
  order = {};
  saved.forEach(it => order[it.id] = it);
}

// Рендер списка заказа
function renderOrder(){
  const list = byId('order-list');
  const totalEl = byId('order-total');
  list.innerHTML = '';
  let total = 0;

  for(const id in order){
    const it = order[id];

    const li = document.createElement('li');

    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('div');
    name.textContent = it.name;
    const price = document.createElement('div');
    price.textContent = `${formatPrice(it.price * it.qty)} ₽`;
    meta.appendChild(name);

    const qty = document.createElement('div');
    qty.className = 'qty-control';
    const dec = document.createElement('button');
    dec.textContent = '−';
    dec.title = 'Уменьшить';
    dec.addEventListener('click', ()=> decreaseQty(id));
    const qtyVal = document.createElement('span');
    qtyVal.textContent = it.qty;
    const inc = document.createElement('button');
    inc.textContent = '+';
    inc.title = 'Увеличить';
    inc.addEventListener('click', ()=> increaseQty(id));
    const remove = document.createElement('button');
    remove.textContent = '×';
    remove.title = 'Удалить';
    remove.addEventListener('click', ()=> {
      delete order[id];
      saveOrder();
      renderOrder();
    });

    qty.appendChild(dec);
    qty.appendChild(qtyVal);
    qty.appendChild(inc);
    qty.appendChild(remove);

    li.appendChild(meta);
    li.appendChild(qty);
    li.appendChild(price);
    list.appendChild(li);

    total += it.price * it.qty;
  }

  totalEl.textContent = formatPrice(total);
}

// ФИЛЬТРЫ
function initFilters(){
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('#food-items .item').forEach(it=>{
        const type = it.dataset.type;
        it.style.display = (filter === 'all' || filter === type) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('.drink-filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.drink-filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('#drinks-items .item').forEach(it=>{
        const type = it.dataset.type;
        it.style.display = (filter === 'all' || filter === type) ? '' : 'none';
      });
    });
  });
}

// КОМБО
function initComboClicks(){
  document.querySelectorAll('#combos .combo').forEach(el=>{
    el.addEventListener('click', ()=>{
      const id = el.dataset.comboId;
      if(!COMBOS[id]) return;
      COMBOS[id].items.forEach(it => addToOrder({ id: it.id, name: it.name, price: Number(it.price) }));
      el.classList.add('active-combo');
      setTimeout(()=> el.classList.remove('active-combo'), 300);
    });
    el.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
}


// КНОПКИ ДОБАВЛЕНИЯ
function initAddButtons(){
  document.querySelectorAll('.item .add-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const itemEl = e.target.closest('.item');
      const id = itemEl.dataset.id;
      const name = itemEl.dataset.name;
      const price = Number(itemEl.dataset.price);
      addToOrder({ id, name, price });
    });
  });
}

// ВАЛИДАЦИЯ И ОТПРАВКА
function validateForm(){
  const errors = [];
  if(Object.keys(order).length === 0) errors.push("There are no dishes in the order.");

  const name = byId('name').value.trim();
  const email = byId('email').value.trim();
  const phone = byId('phone').value.trim();
  const address = byId('address').value.trim();

  if(!name) errors.push("The 'Name' field is required.");
  if(!email) errors.push("The 'Email' field is required.");
  else if(!/^\S+@\S+\.\S+$/.test(email)) errors.push("Incorrect email format.");
  if(!phone) errors.push("The 'Phone number' field is required.");
  else if(!/^\+?\d{7,15}$/.test(phone)) errors.push("The phone number is in an incorrect format.");
  if(!address) errors.push("The 'Shipping address' field is required.");

  const deliveryMode = document.querySelector('input[name="delivery_time"]:checked').value;
  if(deliveryMode === 'specified'){
    const time = byId('time-input').value;
    if(!time) errors.push("Please indicate your desired delivery time.");
  }

  return errors;
}

function showMessage(text, isError=true){
  const box = byId('form-messages');
  if(!box) return;
  box.textContent = text;
  box.style.color = isError ? '#b00020' : 'green';
}

// ВРЕМЯ ДОСТАВКИ
function toggleTimeInput(){
  const specified = document.querySelector('input[name="delivery_time"][value="specified"]').checked;
  const timeInput = byId('time-input');
  const label = byId('time-input-label');
  if(specified){
    timeInput.classList.remove('hidden');
    label.classList.remove('hidden');
    timeInput.required = true;
  } else {
    timeInput.classList.add('hidden');
    label.classList.add('hidden');
    timeInput.required = false;
  }
}

function initDeliveryRadio(){
  document.querySelectorAll('input[name="delivery_time"]').forEach(r=>{
    r.addEventListener('change', toggleTimeInput);
  });
  toggleTimeInput();
}

// КНОПКИ СБРОСА
function initClearOrder(){
  byId('clear-order').addEventListener('click', ()=>{
    order = {};
    saveOrder();
    renderOrder();
  });
}

function initResetButton(){
  byId('reset-btn').addEventListener('click', ()=>{
    resetAll();
  });
}

// ОТПРАВКА ЗАКАЗА
async function submitOrder(){
  const errors = validateForm();
  if(errors.length){
    showMessage(errors.join("\n"), true);
    return;
  }

  const payload = {
    order: Object.values(order).map(i=>({ id:i.id, name:i.name, price:i.price, qty:i.qty })),
    total: Number(byId('order-total').textContent) || 0,
    comments: byId('comments').value.trim(),
    customer: {
      name: byId('name').value.trim(),
      email: byId('email').value.trim(),
      phone: byId('phone').value.trim(),
      address: byId('address').value.trim(),
      subscribe: byId('subscribe').checked,
      delivery_mode: document.querySelector('input[name="delivery_time"]:checked').value,
      delivery_time: byId('time-input').value || null
    },
    meta: { createdAt: new Date().toISOString(), city: "Москва" }
  };

  showMessage("The order has been sent...", false);

  if(!SUBMIT_URL){
    console.log("Order payload (SUBMIT_URL not set):", payload);
    showSuccessPopup();
    order = {};
    saveOrder();
    renderOrder();
    return;
  }

  try{
    const resp = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!resp.ok) throw new Error(`Server error: ${resp.status}`);
    showSuccessPopup();
    order = {};
    saveOrder();
    renderOrder();
  } catch (err){
    console.error(err);
    showMessage("Error sending order: " + err.message, true);
  }
}

// ПОПАП
function showSuccessPopup() {
  const popup = byId('success-popup');
  const okBtn = byId('popup-ok-btn');
  if (!popup || !okBtn) return;

  popup.classList.remove('hidden');

  okBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
  });
}

// ИНИЦИАЛИЗАЦИЯ
function init(){
  loadOrder();
  initComboClicks();
  initAddButtons();
  initFilters();
  initDeliveryRadio();
  initClearOrder();
  initResetButton();
  byId('submit-btn').addEventListener('click', submitOrder);
  renderOrder();
}

document.addEventListener('DOMContentLoaded', init);
