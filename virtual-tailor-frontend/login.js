document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;

  const container = document.querySelector(".form-container");
  container.classList.add("zoom-in");

  const res = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  setTimeout(() => {
    container.classList.remove("zoom-in");

    if (res.ok) {
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);

      showAlert("✅ Login successful!");
      setTimeout(() => (window.location.href = "home.html"), 1500);
    } else {
      showAlert("❌ " + (data.message || "Login failed."));
    }
  }, 400);
});

function showAlert(message) {
  const alert = document.createElement("div");
  alert.className = "custom-alert";
  alert.innerText = message;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}
