let currentPageIptables = 1;
const itemsPerPageIptables = 10;
let iptables = [];
let filteredIptables = [];

function renderTableIptables(data = filteredIptables) {
  const iptablesTable = document.getElementById("iptablesTable");
  const iptablesPagination = document.getElementById("iptablesPagination");

  if (!iptablesTable || !iptablesPagination) {
    return;
  }

  const totalPagesIptables = Math.ceil(data.length / itemsPerPageIptables);
  const startIdxIptables = (currentPageIptables - 1) * itemsPerPageIptables;
  const endIdxIptables = Math.min(
    startIdxIptables + itemsPerPageIptables,
    data.length
  );
  const paginatedDataIptables = data.slice(startIdxIptables, endIdxIptables);

  iptablesTable.innerHTML =
    paginatedDataIptables.length > 0
      ? paginatedDataIptables
          .map(
            (rules) => `<tr>
              <td class="p-2 border-t">${rules.raw || "N/A"}</td>
            </tr>`
          )
          .join("")
      : '<tr><td class="p-2 text-center">No iptables available</td></tr>';

  iptablesPagination.innerHTML = "";

  const prevButtonIptables = document.createElement("button");
  prevButtonIptables.textContent = "Previous";
  prevButtonIptables.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPageIptables === 1
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  prevButtonIptables.disabled = currentPageIptables === 1;
  prevButtonIptables.onclick = () => {
    if (currentPageIptables > 1) {
      currentPageIptables--;
      renderTableIptables();
    }
  };
  iptablesPagination.appendChild(prevButtonIptables);

  for (let i = 1; i <= totalPagesIptables; i++) {
    const pageButtonIptables = document.createElement("button");
    pageButtonIptables.textContent = i;
    pageButtonIptables.className = `px-3 py-1 rounded ${
      currentPageIptables === i
        ? "bg-blue-500 text-white"
        : "bg-gray-200 hover:bg-gray-300"
    }`;
    pageButtonIptables.onclick = () => {
      currentPageIptables = i;
      renderTableIptables();
    };
    iptablesPagination.appendChild(pageButtonIptables);
  }

  const nextButtonIptables = document.createElement("button");
  nextButtonIptables.textContent = "Next";
  nextButtonIptables.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPageIptables === totalPagesIptables
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  nextButtonIptables.disabled = currentPageIptables === totalPagesIptables;
  nextButtonIptables.onclick = () => {
    if (currentPageIptables < totalPagesIptables) {
      currentPageIptables++;
      renderTableIptables();
    }
  };
  iptablesPagination.appendChild(nextButtonIptables);
}

function filterIptables(searchTerm) {
  currentPageIptables = 1;
  if (!searchTerm) {
    filteredIptables = [...iptables];
  } else {
    filteredIptables = iptables.filter((rules) =>
      (rules.raw || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  renderTableIptables();
}

function alertSuccessIptables() {
  Swal.fire({
    icon: "success",
    title: "Data Iptables Refreshed!",
    text: "Iptables data has been updated successfully",
    timer: 1500,
    showConfirmButton: false,
  });
}

function alertErrorIptables() {
  Swal.fire({
    icon: "error",
    title: "Refresh Data Iptables Problem",
    text: "Failed to fetch iptables data. Please try again.",
  });
}

function alerLoadIptables() {
  Swal.fire({
    title: "Refreshing...",
    text: "Fetching iptables data",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

async function fetchIptables() {
  alerLoadIptables();
  try {
    const responseIptables = await axios({
      method: "PUT",
      url: "/api/empu/iptables",
      headers: { "content-type": "application/json" },
      withCredentials: true,
    });

    iptables = Array.isArray(responseIptables.data)
      ? responseIptables.data
      : responseIptables.data.rule || [];
    filteredIptables = [...iptables];

    if (iptables.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Refresh Failed",
        text: "No iptables data returned from API",
      });
    }
    renderTableIptables();
    Swal.close(); // Tutup loading setelah sukses
    return true;
  } catch (error) {
    Swal.close(); // Tutup loading jika gagal
    alertErrorIptables();
    iptables = [];
    filteredIptables = [];
    renderTableIptables();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInputIptables = document.getElementById("searchInputIptables");
  const refreshButtonIptables = document.getElementById(
    "refreshButtonIptables"
  );

  if (searchInputIptables) {
    searchInputIptables.addEventListener("input", (e) => {
      filterIptables(e.target.value);
    });
  }

  if (refreshButtonIptables) {
    refreshButtonIptables.addEventListener("click", async () => {
      const getIptables = await fetchIptables();
      if (getIptables) {
        alertSuccessIptables();
      }
    });
  }

  fetchIptables();
});
