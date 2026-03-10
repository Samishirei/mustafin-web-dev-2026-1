let orders = JSON.parse(localStorage.getItem('orders')) || [];

// сортируем по дате (новые сначала)
orders.sort((a,b) => new Date(b.date) - new Date(a.date));

const ordersTableBody = document.querySelector("#ordersTable tbody");

function renderOrders() {
  if (!ordersTableBody) return;
  
  if (orders.length === 0) {
    ordersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">No orders found</td></tr>';
    return;
  }
  
  ordersTableBody.innerHTML = "";
  orders.forEach((order, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${order.date || 'N/A'}</td>
      <td>${Array.isArray(order.items) ? order.items.join(', ') : order.items || 'N/A'}</td>
      <td>${order.total || 0}</td>
      <td>${order.delivery_time || "As soon as possible (7:00-23:00)"}</td>
      <td>
        <i class="bi bi-eye" onclick="viewOrder(${index})" title="Details"></i>
        <i class="bi bi-pencil" onclick="editOrder(${index})" title="Edit"></i>
        <i class="bi bi-trash" onclick="deleteOrder(${index})" title="Delete"></i>
      </td>
    `;
    ordersTableBody.appendChild(tr);
  });
}

function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function viewOrder(index) {
  const order = orders[index];
  const detailsDiv = document.getElementById("orderDetails");
  detailsDiv.innerHTML = `
    <p><strong>Full name:</strong> ${order.full_name || 'N/A'}</p>
    <p><strong>Email:</strong> ${order.email || 'N/A'}</p>
    <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
    <p><strong>Delivery address:</strong> ${order.delivery_address || 'N/A'}</p>
    <p><strong>Delivery type:</strong> ${order.delivery_type || 'N/A'}</p>
    <p><strong>Delivery time:</strong> ${order.delivery_time || "As soon as possible"}</p>
    <p><strong>Comment:</strong> ${order.comment || '-'}</p>
    <p><strong>Order items:</strong> ${Array.isArray(order.items) ? order.items.join(', ') : order.items || 'N/A'}</p>
    <p><strong>Total:</strong> ${order.total || 0} ₽</p>
  `;
  openModal("viewModal");
}

let editIndex = null;
function editOrder(index) {
  editIndex = index;
  const order = orders[index];
  
  document.getElementById("edit_full_name").value = order.full_name || '';
  document.getElementById("edit_email").value = order.email || '';
  document.getElementById("edit_phone").value = order.phone || '';
  document.getElementById("edit_delivery_address").value = order.delivery_address || '';
  document.getElementById("edit_delivery_type").value = order.delivery_type || '';
  document.getElementById("edit_delivery_time").value = order.delivery_time || '';
  document.getElementById("edit_comment").value = order.comment || '';
  
  openModal("editModal");
}

document.getElementById("editForm").onsubmit = function(e) {
  e.preventDefault();
  
  orders[editIndex] = {
    ...orders[editIndex],
    full_name: document.getElementById("edit_full_name").value,
    email: document.getElementById("edit_email").value,
    phone: document.getElementById("edit_phone").value,
    delivery_address: document.getElementById("edit_delivery_address").value,
    delivery_type: document.getElementById("edit_delivery_type").value,
    delivery_time: document.getElementById("edit_delivery_time").value,
    comment: document.getElementById("edit_comment").value
  };
  
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  closeModal("editModal");
  alert("Order updated successfully");
}

let deleteIndex = null;
function deleteOrder(index) {
  deleteIndex = index;
  openModal("deleteModal");
}

document.getElementById("confirmDelete").onclick = function() {
  orders.splice(deleteIndex, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  closeModal("deleteModal");
  alert("Order deleted successfully");
}

// инициализация
document.addEventListener('DOMContentLoaded', renderOrders);