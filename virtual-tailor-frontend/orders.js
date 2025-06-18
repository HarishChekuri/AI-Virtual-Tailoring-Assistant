const email = localStorage.getItem("userEmail");
const orderList = document.getElementById("orderList");

async function fetchOrders() {
  try {
    const res = await fetch(`http://localhost:5000/api/orders/${email}`);
    const data = await res.json();

    if (!res.ok || !data.length) {
      orderList.innerHTML = "<p>No orders found.</p>";
      return;
    }

    orderList.innerHTML = "";

    data.forEach(order => {
      const div = document.createElement("div");
      div.className = "order";

      div.innerHTML = `
        <p><strong>Type:</strong> ${order.type}</p>
        <p><strong>Fabric:</strong> ${order.fabric}</p>
        <p><strong>Color:</strong> ${order.color}</p>
        <p><strong>Design:</strong> ${order.design}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
      `;

      orderList.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading orders:", err);
    orderList.innerHTML = "<p style='color:red;'>Failed to load orders.</p>";
  }
}

fetchOrders();

// Zoom-out effect on back
document.getElementById("backBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = "home.html";
  }, 400);
});
