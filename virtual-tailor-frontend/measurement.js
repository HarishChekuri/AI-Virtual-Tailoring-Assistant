const userName = localStorage.getItem("userName") || "Unknown";

function animateForm(form) {
  form.classList.add("zoom-out");
  setTimeout(() => form.classList.remove("zoom-out"), 500);
}

// Shirt Form Submit
document.getElementById("shirtForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  animateForm(form);

  const body = {
    name: userName,
    type: "shirt",
    length: form.length.value,
    shoulder: form.shoulder.value,
    sleeveLength: form.sleeveLength.value,
    chest: form.chest.value,
    stomach: form.stomach.value,
    hips: form.hips.value,
    neck: form.neck.value,
    date: new Date()
  };

  const res = await fetch("http://localhost:5000/api/manual-measurement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  // alert(data.message || (res.ok ? "Shirt measurement saved successfully!" : "Failed to save."));
  showCustomAlert("✅ Shirt measurement saved!");

});

// Pant Form Submit
document.getElementById("pantForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  animateForm(form);

  const body = {
    name: userName,
    type: "pant",
    length: form.length.value,
    waist: form.waist.value,
    hips: form.hips.value,
    bottom: form.bottom.value,
    seatRound: form.seatRound.value,
    date: new Date()
  };

  const res = await fetch("http://localhost:5000/api/manual-measurement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  // alert(data.message || (res.ok ? "Pant measurement saved successfully!" : "Failed to save."));
  showCustomAlert("✅ Pant measurement saved!");

});

function showCustomAlert(message) {
  const alertBox = document.getElementById("customAlert");
  alertBox.innerText = message;
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000); // show for 3 seconds
}
