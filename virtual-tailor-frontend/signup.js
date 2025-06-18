document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const email = form.email.value;
  const password = form.password.value;

  // ✅ Add zoom-in animation to form container
  const container = document.querySelector(".form-container");
  container.classList.add("zoom-in");

  const res = await fetch("http://localhost:5000/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  setTimeout(() => {
    container.classList.remove("zoom-in");

    if (res.ok) {
      showAlert("✅ Signup successful! Please login.");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    } else {
      showAlert("❌ " + (data.message || "Signup failed."));
    }
  }, 400);
});

// ✅ Custom toast-style alert box
function showAlert(message) {
  const alert = document.createElement("div");
  alert.className = "custom-alert";
  alert.innerText = message;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}
