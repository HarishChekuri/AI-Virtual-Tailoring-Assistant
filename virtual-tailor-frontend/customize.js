async function saveCustomization() {
  const email = localStorage.getItem("userEmail");

  const body = {
    email,
    type: document.getElementById("type").value,
    fabric: document.getElementById("fabric").value,
    color: document.getElementById("color").value,
    design: document.getElementById("design").value,
  };

  const res = await fetch("http://localhost:5000/api/save-customization", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  const msg = document.getElementById("msg");

  msg.innerText = res.ok ? "✅ Customization saved!" : "❌ " + data.message;
  msg.style.color = res.ok ? "lightgreen" : "red";
}

// Back to home animation
document.getElementById("backBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = "home.html";
  }, 400);
});
