document.addEventListener("DOMContentLoaded", function () {
  const vehicleForm = document.getElementById("vehicleForm");
  const entriesTableBody = document.getElementById("entriesTableBody");
  const clearEntriesBtn = document.getElementById("clearEntries");

  // Set current datetime as default for entry time
  document.getElementById("entryTime").value = new Date()
    .toISOString()
    .slice(0, 16);

  // Load existing entries
  loadEntries();

  // Handle form submission
  vehicleForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const entry = {
      id: Date.now(),
      vehicleNumber: document.getElementById("vehicleNumber").value,
      driverName: document.getElementById("driverName").value,
      vehicleType: document.getElementById("vehicleType").value,
      entryTime: document.getElementById("entryTime").value,
      mobileNumber: document.getElementById("mobileNumber").value,
      purpose: document.getElementById("purpose").value,
    };

    // Save entry
    saveEntry(entry);

    // Reset form
    vehicleForm.reset();

    // Set current datetime again
    document.getElementById("entryTime").value = new Date()
      .toISOString()
      .slice(0, 16);

    // Refresh table
    loadEntries();
  });

  // Handle clear all entries
  clearEntriesBtn.addEventListener("click", function () {
    if (confirm("সমস্ত এন্ট্রি মুছে ফেলতে চান?")) {
      localStorage.removeItem("vehicleEntries");
      loadEntries();
    }
  });

  function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem("vehicleEntries") || "[]");
    entries.unshift(entry); // Add new entry at the beginning
    localStorage.setItem("vehicleEntries", JSON.stringify(entries));
  }

  function loadEntries() {
    const entries = JSON.parse(localStorage.getItem("vehicleEntries") || "[]");
    entriesTableBody.innerHTML = "";

    entries.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${entry.vehicleNumber}</td>
                <td>${entry.driverName}</td>
                <td>${entry.vehicleType}</td>
                <td>${formatDateTime(entry.entryTime)}</td>
                <td>${entry.mobileNumber || "-"}</td>
                <td>${entry.purpose || "-"}</td>
                <td>
                    <button class="delete-btn" onclick="deleteEntry(${
                      entry.id
                    })">
                        <i class="fas fa-trash"></i> মুছুন
                    </button>
                </td>
            `;
      entriesTableBody.appendChild(row);
    });
  }

  // Add to global scope for onclick handler
  window.deleteEntry = function (id) {
    if (confirm("এই এন্ট্রি মুছে ফেলতে চান?")) {
      let entries = JSON.parse(localStorage.getItem("vehicleEntries") || "[]");
      entries = entries.filter((entry) => entry.id !== id);
      localStorage.setItem("vehicleEntries", JSON.stringify(entries));
      loadEntries();
    }
  };

  function formatDateTime(dateTimeStr) {
    const dt = new Date(dateTimeStr);
    return dt.toLocaleString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
});
