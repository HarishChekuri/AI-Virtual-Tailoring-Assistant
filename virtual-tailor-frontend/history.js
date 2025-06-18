const userEmail = localStorage.getItem("userEmail");
const historyList = document.getElementById("historyList");

async function fetchMeasurements() {
  try {
    const res = await fetch(`http://localhost:5000/api/measurements/${encodeURIComponent(userEmail)}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Fetch failed");

    if (data.length === 0) {
      historyList.innerHTML = "<p>No measurements found.</p>";
      return;
    }

    data.forEach((entry) => {
      if (!entry || !entry.type || !entry.date) {
        console.warn("Skipped invalid entry:", entry);
        return;
      }

      // Create a container div for this entry
      const div = document.createElement("div");
      div.className = "entry";

      // Format date and type
      const date = new Date(entry.date).toLocaleString();
      const type = (entry.type || "unknown").toUpperCase();

      // Build the HTML content of this measurement
      div.innerHTML = `
        <h3>${type} — ${date}</h3>
        ${Object.entries(entry)
          .filter(([key, value]) =>
            !["_id", "type", "date", "name", "fitScore", "__v"].includes(key) && value
          )
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join("")}
      `;


      // Add this entry to the history list
      historyList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    historyList.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

fetchMeasurements();

function goHome(event) {
  event.preventDefault(); // prevent instant jump

  const container = document.querySelector(".container");
  container.classList.remove("zoom-in");
  container.classList.add("zoom-out");

  setTimeout(() => {
    window.location.href = "home.html";
  }, 400); // delay must match the animation duration
}

