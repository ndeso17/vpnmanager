let currentPagePort = 1;
const itemsPerPagePort = 10;
let ports = [];
let filteredPort = [];

function renderTablePort(data = filteredPort) {
  const portsTable = document.getElementById("portsTable");
  const portsPagination = document.getElementById("portsPagination");

  if (!portsTable || !portsPagination) {
    console.error("Table port or pagination container not found in DOM");
    return;
  }

  const totalPagesPorts = Math.ceil(data.length / itemsPerPagePort);
  const startIdxPort = (currentPagePort - 1) * itemsPerPagePort;
  const endIdxPort = Math.min(startIdxPort + itemsPerPagePort, data.length);
  const paginatedDataPort = data.slice(startIdxPort, endIdxPort);

  portsTable.innerHTML =
    paginatedDataPort.length > 0
      ? paginatedDataPort
          .map(
            (port) => `<tr>
              <td class="p-2 border-t">${port.localAddress || "N/A"}</td>
              <td class="p-2 border-t">${port.port || "N/A"}</td>
              <td class="p-2 border-t">${port.protocol || "N/A"}</td>
              <td class="p-2 border-t">${port.status || "N/A"}</td>
              <td class="p-2 border-t">${port.pid || "N/A"}</td>
              <td class="p-2 border-t">${port.process || "N/A"}</td>
            </tr>`
          )
          .join("")
      : '<tr><td colspan="6" class="p-2 text-center">No ports available</td></tr>'; // Perbaiki colspan jadi 6

  portsPagination.innerHTML = "";

  const prevButtonPort = document.createElement("button");
  prevButtonPort.textContent = "Previous";
  prevButtonPort.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPagePort === 1
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  prevButtonPort.disabled = currentPagePort === 1;
  prevButtonPort.onclick = () => {
    if (currentPagePort > 1) {
      currentPagePort--;
      renderTablePort();
    }
  };
  portsPagination.appendChild(prevButtonPort);

  for (let i = 1; i <= totalPagesPorts; i++) {
    const pageButtonPort = document.createElement("button");
    pageButtonPort.textContent = i;
    pageButtonPort.className = `px-3 py-1 rounded ${
      currentPagePort === i
        ? "bg-blue-500 text-white"
        : "bg-gray-200 hover:bg-gray-300"
    }`;
    pageButtonPort.onclick = () => {
      currentPagePort = i; // Perbaiki bug: gunakan nomor halaman yang diklik
      renderTablePort();
    };
    portsPagination.appendChild(pageButtonPort);
  }

  const nextButtonPort = document.createElement("button");
  nextButtonPort.textContent = "Next";
  nextButtonPort.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPagePort === totalPagesPorts
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  nextButtonPort.disabled = currentPagePort === totalPagesPorts;
  nextButtonPort.onclick = () => {
    if (currentPagePort < totalPagesPorts) {
      currentPagePort++;
      renderTablePort();
    }
  };
  portsPagination.appendChild(nextButtonPort);
}

function filterPort(searchTerm) {
  currentPagePort = 1;
  if (!searchTerm) {
    filteredPort = [...ports];
  } else {
    filteredPort = ports.filter((port) => {
      // Pastikan properti ada dan ubah ke string untuk pencarian
      const localAddress = (port.localAddress || "").toLowerCase();
      const process = (port.process || "").toLowerCase();
      const portNum = (port.port || "").toString().toLowerCase(); // port bisa angka
      const term = searchTerm.toLowerCase();

      // Cek apakah searchTerm ada di localAddress, process, atau port
      return (
        localAddress.includes(term) ||
        process.includes(term) ||
        portNum.includes(term)
      );
    });
  }
  renderTablePort();
}

function alertLoadPort() {
  Swal.fire({
    title: "Refreshing...",
    text: "Fetching port data",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

function alertSuccessPort() {
  Swal.fire({
    icon: "success",
    title: "Data Refreshed",
    text: "Port data has been updated successfully",
    timer: 1500,
    showConfirmButton: false,
  });
}

function alertErrorPort() {
  Swal.fire({
    icon: "error",
    title: "Refresh Problem",
    text: "Problem fetching port data. Please try again.",
  });
}

async function fetchPort() {
  try {
    const responsePort = await axios({
      method: "PUT",
      url: "/api/empu/ports",
      headers: { "content-type": "application/json" },
      withCredentials: true,
    });
    ports = Array.isArray(responsePort.data)
      ? responsePort.data
      : responsePort.data.port || [];
    filteredPort = [...ports];
    if (ports.length === 0) {
      console.warn("No ports returned from API");
      alertErrorPort();
    }
    renderTablePort();
    return true;
  } catch (error) {
    console.error("Error getting port: ", error);
    alertErrorPort();
    ports = [];
    filteredPort = [];
    renderTablePort(); // Panggil fungsi dengan tanda kurung
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInputPort = document.getElementById("searchInputPort");
  const refreshButtonPort = document.getElementById("refreshButtonPort");

  if (searchInputPort) {
    searchInputPort.addEventListener("input", (e) => {
      filterPort(e.target.value);
    });
  } else {
    console.error("Search input not found in DOM");
  }

  if (refreshButtonPort) {
    refreshButtonPort.addEventListener("click", async () => {
      alertLoadPort();
      const getPort = await fetchPort();
      if (getPort) {
        alertSuccessPort();
      }
    });
  } else {
    console.error("Refresh button not found in DOM");
  }

  fetchPort();
});
