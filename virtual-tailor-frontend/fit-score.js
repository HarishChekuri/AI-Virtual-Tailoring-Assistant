const email = localStorage.getItem("userEmail");
const resultDiv = document.getElementById("result");

// Shirt & Pant Size Charts
const shirtChart = {
  S: { chest: 38, shoulder: 16.5, sleeveLength: 23, length: 27 },
  M: { chest: 40, shoulder: 17.5, sleeveLength: 24, length: 28 },
  L: { chest: 42, shoulder: 18.5, sleeveLength: 25, length: 29 },
  XL: { chest: 44, shoulder: 19.5, sleeveLength: 26, length: 30 }
};
const pantChart = {
  S: { waist: 30, hips: 36, length: 38 },
  M: { waist: 32, hips: 38, length: 39 },
  L: { waist: 34, hips: 40, length: 40 },
  XL: { waist: 36, hips: 42, length: 41 }
};

// Styled alert box
function showCustomAlert(message, type = "success") {
  const alertBox = document.createElement("div");
  alertBox.className = `custom-alert ${type}`;
  alertBox.innerText = message;
  resultDiv.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

async function calculateFit() {
  resultDiv.innerHTML = ""; // Clear previous results

  if (!email) {
    showCustomAlert("❌ User email not found in localStorage.", "error");
    return;
  }

  try {
    const encodedEmail = encodeURIComponent(email);
    const res = await fetch(`http://localhost:5000/api/measurements/${encodedEmail}`);
    const data = await res.json();

    if (!res.ok || !data.length) {
      showCustomAlert("❌ No measurements found.", "error");
      return;
    }

    const fitType = document.getElementById("fitType").value;
    const latest = [...data].reverse().find(item => item.type === fitType);
    if (!latest) {
      showCustomAlert(`❌ No ${fitType} measurements found.`, "error");
      return;
    }

    const chart = fitType === "pant" ? pantChart : shirtChart;
    let bestSize = "";
    let bestScore = 0;

    for (let size in chart) {
      const ref = chart[size];
      let total = 0, matched = 0;

      for (let key in ref) {
        const userVal = parseFloat(latest[key] || 0);
        const refVal = ref[key];
        if (!userVal || !refVal) continue;

        const diff = Math.abs(userVal - refVal);
        const tolerance = refVal * 0.05;
        if (diff <= tolerance) matched++;
        total++;
      }

      const score = Math.round((matched / total) * 100);
      if (score > bestScore) {
        bestScore = score;
        bestSize = size;
      }
    }

    let color = "red";
    if (bestScore >= 80) color = "green";
    else if (bestScore >= 60) color = "orange";

    let suggestion = "";
    if (bestScore >= 85) {
      suggestion = "✅ Perfect fit! Go with slim or regular styles.";
    } else if (bestScore >= 60) {
      suggestion = "⚠️ Decent fit. Choose stretchable or comfort-fit styles.";
    } else {
      suggestion = "❌ Poor fit. Go for custom tailoring or relaxed fits.";
    }

    resultDiv.innerHTML += `
      <div style="color: ${color}; font-size: 24px; font-weight: bold;">
        ✅ ${fitType.toUpperCase()} Fit Score: ${bestScore}%
      </div>
      <div style="font-size: 18px;">
        📏 Best Match: Size <strong>${bestSize}</strong>
      </div>
      <div style="margin-top: 10px; font-style: italic;">
        🧠 <strong>Style Tip:</strong> ${suggestion}
      </div>
    `;

    document.getElementById("saveBtn").style.display = "inline-block";
    window.latestFit = { email, type: fitType, fitScore: bestScore };

    await fetch("http://localhost:5000/api/save-fit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: fitType, fitScore: bestScore })
    });

  } catch (err) {
    console.error("Error:", err);
    showCustomAlert("⚠️ Error fetching data.", "error");
  }
}

async function saveToCloset() {
  const { email, type, fitScore } = window.latestFit;

  try {
    const res = await fetch("http://localhost:5000/api/save-outfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type, fitScore })
    });

    if (res.ok) {
      showCustomAlert("✅ Outfit saved to closet!", "success");
    } else {
      showCustomAlert("❌ Failed to save outfit.", "error");
    }
  } catch (err) {
    console.error(err);
    showCustomAlert("⚠️ Error saving outfit.", "error");
  }
}

// Zoom-out animation before navigating
function animateExit(event) {
  event.preventDefault();
  document.body.classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = event.target.href;
  }, 300);
}
