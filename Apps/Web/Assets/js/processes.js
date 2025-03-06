let currentPage = 1;
const itemsPerPage = 10;
let processes = [];
let filteredProcesses = [];

function renderTable(data = filteredProcesses) {
  const tbody = document.getElementById("processesTable");
  const paginationDiv = document.getElementById("processesPagination");

  if (!tbody || !paginationDiv) {
    console.error("Table or pagination container not found in DOM");
    return;
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, data.length);
  const paginatedData = data.slice(startIdx, endIdx);

  tbody.innerHTML =
    paginatedData.length > 0
      ? paginatedData
          .map(
            (proc) => `
            <tr>
              <td class="p-2 border-t">${proc.name || "N/A"}</td>
              <td class="p-2 border-t">${proc.pid || "N/A"}</td>
              <td class="p-2 border-t">${proc.status || "N/A"}</td>
              <td class="p-2 border-t">${proc.user || "N/A"}</td>
              <td class="p-2 border-t">${proc.path || "N/A"}</td>
            </tr>
          `
          )
          .join("")
      : '<tr><td colspan="5" class="p-2 text-center">No matching processes found</td></tr>';

  paginationDiv.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
  }`;
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };
  paginationDiv.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = `px-3 py-1 rounded ${
      currentPage === i
        ? "bg-blue-500 text-white"
        : "bg-gray-200 hover:bg-gray-300"
    }`;
    pageButton.onclick = () => {
      currentPage = i;
      renderTable();
    };
    paginationDiv.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPage === totalPages
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };
  paginationDiv.appendChild(nextButton);
}

function filterProcesses(searchTerm) {
  currentPage = 1;
  if (!searchTerm) {
    filteredProcesses = [...processes];
  } else {
    filteredProcesses = processes.filter((proc) =>
      proc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  renderTable();
}

async function fetchProcesses() {
  // Tampilkan SweetAlert loading
  Swal.fire({
    title: "Refreshing...",
    text: "Fetching process data",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await axios({
      method: "PUT",
      url: "/api/empu/processes",
      headers: { "content-type": "application/json" },
      withCredentials: true,
    });

    processes = Array.isArray(response.data)
      ? response.data
      : response.data.processes || [];

    filteredProcesses = [...processes];
    if (processes.length === 0) {
      console.warn("No processes returned from API");
    }

    // Tutup loading dan tampilkan sukses
    Swal.fire({
      icon: "success",
      title: "Data Refreshed",
      text: "Process data has been updated successfully",
      timer: 1500,
      showConfirmButton: false,
    });

    renderTable();
  } catch (error) {
    console.error("Error fetching processes:", error);

    // Tutup loading dan tampilkan error
    Swal.fire({
      icon: "error",
      title: "Refresh Failed",
      text: "Failed to fetch process data. Please try again.",
    });

    processes = [];
    filteredProcesses = [];
    renderTable();
  }
}

// Event listener untuk DOM
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const refreshButton = document.getElementById("refreshButton");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      filterProcesses(e.target.value);
    });
  } else {
    console.error("Search input not found in DOM");
  }

  if (refreshButton) {
    refreshButton.addEventListener("click", () => {
      fetchProcesses();
    });
  } else {
    console.error("Refresh button not found in DOM");
  }

  // Jalankan pertama kali
  fetchProcesses();
});
