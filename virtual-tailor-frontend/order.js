const email = localStorage.getItem("userEmail");
const messageDiv = document.getElementById("message");

document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const fabric = document.getElementById("fabric").value;
  const color = document.getElementById("color").value;
  const design = document.getElementById("design").value;

  if (!email) {
    showMessage("❌ User not logged in.", "red");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type, fabric, color, design })
    });

    const data = await res.json();
    if (res.ok) {
      showMessage("✅ Order placed successfully!", "lightgreen");
    } else {
      showMessage(`❌ ${data.message}`, "red");
    }
  } catch (err) {
    console.error(err);
    showMessage("❌ Failed to place order.", "red");
  }
});

function showMessage(text, color) {
  messageDiv.innerText = text;
  messageDiv.style.color = color;
}

// Zoom-out effect for Back to Home
document.getElementById("backBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = "home.html";
  }, 400);
});
