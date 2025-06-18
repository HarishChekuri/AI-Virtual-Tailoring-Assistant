const userName = localStorage.getItem("userName") || "Guest";
document.getElementById("welcomeMessage").innerText = `Welcome, ${userName}!`;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".container").classList.add("zoom-in");
});

// New goTo() with zoom-out animation before redirect
function goTo(page) {
  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = page;
  }, 600); // match animation duration
}

function logout() {
  localStorage.removeItem("userName");

  const popup = document.createElement("div");
  popup.className = "custom-alert";
  popup.innerHTML = `<p>👋 Logged out successfully!</p>`;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("fade-out");
    setTimeout(() => {
      popup.remove();
      goTo("login.html");
    }, 400);
  }, 1500);
}

