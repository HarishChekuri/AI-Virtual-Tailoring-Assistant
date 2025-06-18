document.getElementById("getStartedBtn").addEventListener("click", function () {
  const screen = document.getElementById("introScreen");
  screen.classList.add("exit");

  // Delay to allow animation to play before redirect
  setTimeout(() => {
    window.location.href = "login.html";
  }, 600); // Match transition duration in CSS
});
