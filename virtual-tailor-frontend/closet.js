const email = localStorage.getItem("userEmail");
const closetList = document.getElementById("closetList");

// 👇 Custom alert message function
function showAlert(message, type = "success") {
  const alertBox = document.createElement("div");
  alertBox.className = `alert ${type}`;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

// Fetch and display outfits
async function fetchCloset() {
  try {
    const encodedEmail = encodeURIComponent(email);
    const res = await fetch(`http://localhost:5000/api/closet/${encodedEmail}`);
    const data = await res.json();

    if (!res.ok || data.length === 0) {
      closetList.innerHTML = "<p>No outfits saved yet.</p>";
      return;
    }

    closetList.innerHTML = "";
    data.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "outfit-card";

      const date = new Date(entry.date).toLocaleString();
      const scoreColor = entry.fitScore >= 80 ? "limegreen" : entry.fitScore >= 60 ? "orange" : "red";
      const imgSrc = entry.type === "pant" ? "pant.png" : "blue shirt.png";

      div.innerHTML = `
        <h3>${entry.type.toUpperCase()}</h3>
        <img src="${imgSrc}" />
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Fit Score:</strong> <span style="color:${scoreColor}; font-weight:bold;">${entry.fitScore}%</span></p>
        <button onclick="deleteOutfit('${entry._id}')">🗑 Delete</button>
      `;

      closetList.appendChild(div);
    });
  } catch (err) {
    closetList.innerHTML = `<p style="color:red;">Error loading outfits.</p>`;
  }
}

// Delete outfit with styled alert
async function deleteOutfit(id) {
  if (!confirm("Are you sure you want to delete this outfit?")) return;

  const res = await fetch(`http://localhost:5000/api/closet/${email}/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    showAlert("✅ Deleted successfully!", "success");
    fetchCloset();
  } else {
    showAlert("❌ Failed to delete!", "error");
  }
}

// Back button animation
document.getElementById("backBtn").addEventListener("click", () => {
  document.querySelector(".container").classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = "home.html";
  }, 400);
});

fetchCloset();
