async function uploadImage() {
  const realHeight = document.getElementById("realHeight").value;
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];
  const resultDiv = document.getElementById("result");

  if (!realHeight || !file) {
    resultDiv.innerHTML = '<p class="error">❌ Please provide both height and image.</p>';
    return;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("real_height", realHeight);

  try {
    const aiRes = await fetch("http://localhost:8000/api/image-measurement", {
      method: "POST",
      body: formData
    });

    const data = await aiRes.json();

    if (!aiRes.ok) {
      resultDiv.innerHTML = `<p class="error">❌ ${data.error}</p>`;
      return;
    }

    resultDiv.innerHTML = `
      <div class="success">✅ Measurements Detected:</div>
      <p>Chest: ${data.chest_cm} cm (${data.chest_in} in)</p>
      <p>Waist: ${data.waist_cm} cm (${data.waist_in} in)</p>
      <p>Height: ${data.height_cm} cm (${data.height_in} in)</p>
      <p><em>Saving to your account...</em></p>
    `;

    const userEmail = localStorage.getItem("userEmail") || "guest@email.com";
    const saveRes = await fetch("http://localhost:5000/api/save-ai-measurement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        type: "ai",
        chest: data.chest_cm,
        waist: data.waist_cm,
        height: data.height_cm,
        date: new Date()
      })
    });

    const saveData = await saveRes.json();
    if (saveRes.ok) {
      resultDiv.innerHTML += `<p class="success">✅ Saved successfully!</p>`;
    } else {
      resultDiv.innerHTML += `<p class="error">❌ Save failed: ${saveData.message}</p>`;
    }

  } catch (err) {
    resultDiv.innerHTML = `<p class="error">❌ Error: ${err.message}</p>`;
  }
}

document.querySelector(".back-link a").addEventListener("click", (e) => {
  e.preventDefault();
  const container = document.querySelector(".container");
  container.classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = "home.html";
  }, 500);
});
