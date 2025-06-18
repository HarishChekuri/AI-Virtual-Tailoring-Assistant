const email = localStorage.getItem("userEmail");
const output = document.getElementById("output");

async function fetchStyleTips() {
  const styleType = document.getElementById("styleType").value;

  if (!email) {
    output.innerHTML = "❌ No user email found.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/measurements/${email}`);
    const data = await res.json();

    if (!res.ok || !data.length) {
      output.innerHTML = "❌ No measurements found.";
      return;
    }

    const latest = [...data].reverse().find(m => m.type === "shirt" || m.type === "pant");
    if (!latest) {
      output.innerHTML = "❌ No shirt or pant measurements found.";
      return;
    }

    const type = latest.type;
    const score = latest.fitScore || 0;

    let tips = [];

    if (type === "shirt") {
      if (styleType === "casual") {
        tips = score >= 85 ? [
          "✔ Slim-fit polos or Henley shirts",
          "✔ Lightweight cotton fabrics",
          "✔ Roll up sleeves for a relaxed look"
        ] : score >= 60 ? [
          "✔ Regular-fit cotton shirts",
          "✔ Go for breathable materials",
          "✔ Half sleeves or loose checks look cool"
        ] : [
          "✔ Loose-fit or oversized shirts",
          "✔ Layer with t-shirts or hoodies",
          "✔ Avoid tight collars or cuffs"
        ];
      }

      if (styleType === "office") {
        tips = score >= 85 ? [
          "✔ Slim-fit formal shirts",
          "✔ Light solid colors or subtle patterns",
          "✔ Tuck-in with fitted trousers"
        ] : score >= 60 ? [
          "✔ Regular-fit button-down shirts",
          "✔ Go with stretch fabrics",
          "✔ Avoid tight chest and shoulder fits"
        ] : [
          "✔ Relaxed-fit formal shirts",
          "✔ Choose comfort over structure",
          "✔ Avoid stiff collars"
        ];
      }

      if (styleType === "party") {
        tips = score >= 85 ? [
          "✔ Shiny satin or printed slim shirts",
          "✔ Tuck-in with dark jeans or trousers",
          "✔ Add blazer for glam"
        ] : score >= 60 ? [
          "✔ Casual dress shirts with patterns",
          "✔ Roll sleeves, open collar look",
          "✔ Go for stylish checks"
        ] : [
          "✔ Loose silk shirts or oversized prints",
          "✔ Pair with jeans/joggers",
          "✔ Add accessories like chain/hat"
        ];
      }
    }

    if (type === "pant") {
      if (styleType === "casual") {
        tips = score >= 85 ? [
          "✔ Slim-fit chinos or joggers",
          "✔ Ankle length for a modern look",
          "✔ Pair with t-shirts or polos"
        ] : score >= 60 ? [
          "✔ Regular-fit jeans or cargos",
          "✔ Use belts for balance",
          "✔ Avoid skinny cuts"
        ] : [
          "✔ Loose-fit joggers or cargo pants",
          "✔ Drawstring waists for comfort",
          "✔ Avoid tight thighs/seat"
        ];
      }

      if (styleType === "office") {
        tips = score >= 85 ? [
          "✔ Tailored trousers or formal slim pants",
          "✔ Keep pleats minimal",
          "✔ Match with formal shirt or blazer"
        ] : score >= 60 ? [
          "✔ Comfort-fit trousers",
          "✔ Avoid heavy fabrics",
          "✔ Use stretch waistband"
        ] : [
          "✔ Relaxed formal pants",
          "✔ Use suspenders instead of tight belts",
          "✔ Pair with long shirt untucked"
        ];
      }

      if (styleType === "party") {
        tips = score >= 85 ? [
          "✔ Slim jeans with rips or shine",
          "✔ Fitted cargos with zips",
          "✔ Go for black or bold colors"
        ] : score >= 60 ? [
          "✔ Casual chinos or party joggers",
          "✔ Use belt accessories",
          "✔ Avoid wide flare pants"
        ] : [
          "✔ Loose-fit trousers with pattern",
          "✔ Pair with funky sneakers",
          "✔ Embrace retro baggy style"
        ];
      }
    }
    // 💾 Save this style to MongoDB
await fetch("http://localhost:5000/api/save-style", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email,
    type,
    fitScore: score,
    styleCategory: styleType,
    tips
  })
});


    output.innerHTML = `
      <p><strong>👕 Type:</strong> ${type.toUpperCase()}</p>
      <p><strong>🎯 Fit Score:</strong> ${score}%</p>
      <p><strong>💡 Style Tips (${styleType.toUpperCase()}):</strong></p>
      <ul style="text-align: left; margin-top: 10px;">
        ${tips.map(t => `<li>${t}</li>`).join("")}
      </ul>
    `;

  } catch (err) {
    console.error(err);
    output.innerHTML = "⚠️ Error loading style tips.";
  }
}

fetchStyleTips();
// Add zoom-out animation on "Back to Home"
document.getElementById("backBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");
  setTimeout(() => {
    window.location.href = "home.html";
  }, 400);
});
