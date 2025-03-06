let currentPageClients = 1;
const itemsPerPageClients = 5;
let clients = [];
let filteredClients = [];

function renderTableClients(data = filteredClients) {
  const clientsTable = document.getElementById("clientsTable");
  const clientsPagination = document.getElementById("clientsPagination");

  if (!clientsTable || !clientsPagination) {
    console.error("Table or pagination not found in DOM");
    return;
  }

  const totalPagesClients = Math.ceil(data.length / itemsPerPageClients);
  const startIdxClients = (currentPageClients - 1) * itemsPerPageClients;
  const endIdxClients = Math.min(
    startIdxClients + itemsPerPageClients,
    data.length
  );
  const paginatedDataClients = data.slice(startIdxClients, endIdxClients);

  clientsTable.innerHTML =
    paginatedDataClients.length > 0
      ? paginatedDataClients
          .map(
            (client, index) => `<tr>
              <td class="p-2 border-t">${startIdxClients + index + 1}</td>
              <td class="p-2 border-t">${client.email}</td>
              <td class="p-2 border-t">${client.idTelegram}</td>
              <td class="p-2 border-t">
                <button class="text-green-500 hover:underline view-btn" 
                        data-email="${client.email}" 
                        data-id-telegram="${client.idTelegram}">View</button>
                <button class="text-red-500 hover:underline ml-2 delete-btn" 
                        data-email="${client.email}" 
                        data-id-telegram="${client.idTelegram}">Delete</button>
              </td>
            </tr>`
          )
          .join("")
      : '<tr><td colspan="4" class="p-2 text-center">No clients available</td></tr>';

  clientsPagination.innerHTML = "";

  const prevButtonClients = document.createElement("button");
  prevButtonClients.textContent = "Prev";
  prevButtonClients.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPageClients === 1
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  prevButtonClients.disabled = currentPageClients === 1;
  prevButtonClients.onclick = () => {
    if (currentPageClients > 1) {
      currentPageClients--;
      renderTableClients();
    }
  };
  clientsPagination.appendChild(prevButtonClients);

  for (let i = 1; i <= totalPagesClients; i++) {
    const pageButtonClients = document.createElement("button");
    pageButtonClients.textContent = i;
    pageButtonClients.className = `px-3 py-1 bg-gray-200 rounded ${
      currentPageClients === i ? "bg-blue-500 text-white" : "hover:bg-gray-300"
    }`;
    pageButtonClients.onclick = () => {
      currentPageClients = i;
      renderTableClients();
    };
    clientsPagination.appendChild(pageButtonClients);
  }

  const nextButtonClients = document.createElement("button");
  nextButtonClients.textContent = "Next";
  nextButtonClients.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPageClients === totalPagesClients
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  nextButtonClients.disabled = currentPageClients === totalPagesClients;
  nextButtonClients.onclick = () => {
    if (currentPageClients < totalPagesClients) {
      currentPageClients++;
      renderTableClients();
    }
  };
  clientsPagination.appendChild(nextButtonClients);

  addButtonEventListeners();
}

function filterClients(searchTerm) {
  currentPageClients = 1;
  if (!searchTerm) {
    filteredClients = [...clients];
  } else {
    filteredClients = clients.filter(
      (client) =>
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.idTelegram
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) // Ubah ke string untuk idTelegram
    );
  }
  renderTableClients();
}

function alertLoadClients(message) {
  const defaultMessage = "Fetching clients data";
  Swal.fire({
    title: "Refreshing...",
    text: message || defaultMessage,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

function alertSuccessClients() {
  Swal.fire({
    icon: "success",
    title: "Data Refreshed",
    text: "Clients data has been updated successfully",
    timer: 1500,
    showConfirmButton: false,
  });
}

function alertErrorClients(message) {
  const defaultMessage = "Problem fetching clients data. Please try again.";
  Swal.fire({
    icon: "error",
    title: "Refresh Problem",
    text: message || defaultMessage,
    showConfirmButton: true,
  });
}

async function fetchClients(alert = true) {
  try {
    if (alert) alertLoadClients();
    const responseClients = await axios({
      method: "PUT",
      url: "/api/empu/clients",
      headers: { "content-type": "application/json" },
      withCredentials: true,
    });

    const datas = responseClients.data;

    clients = Array.isArray(datas) ? datas : datas.clients || [];
    filteredClients = [...clients];
    if (clients.length === 0) {
      console.warn("No clients returned from API");
      alertErrorClients();
    } else if (responseClients.status !== 200) {
      alertErrorClients(
        "Terjadi masalah saat mengambil data. Silahkan refresh halaman atau login ulang."
      );
    }
    renderTableClients();
    if (alert) alertSuccessClients();
    return true;
  } catch (error) {
    console.error("Error fetching clients:", error);
    alertErrorClients();
    clients = [];
    filteredClients = [];
    renderTableClients();
  }
}

function addButtonEventListeners() {
  // Event listener untuk tombol View
  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const idTelegram = e.target.getAttribute("data-id-telegram");
      // Navigasi ke halaman baru berdasarkan idTelegram
      window.location.href = `/siempu/listLayanan/${idTelegram}`;
    });
  });

  // Event listener untuk tombol Delete
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const email = e.target.getAttribute("data-email");
      const idTelegram = e.target.getAttribute("data-id-telegram");
      console.log("Delete clicked - Email:", email, "ID Telegram:", idTelegram);

      Swal.fire({
        title: "Are you sure?",
        text: `Delete client with Email: ${email} and ID Telegram: ${idTelegram}?`,
        icon: "warning",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Delete Only",
        denyButtonText: "Delete & Block",
        cancelButtonText: "Cancel",
        buttonsStyling: true,
      }).then((result) => {
        if (result.isConfirmed) {
          deleteClient(email, idTelegram, false); // Hanya hapus client
        } else if (result.isDenied) {
          deleteClient(email, idTelegram, true); // Hapus dan blokir client
        }
      });
    });
  });
}

async function deleteClient(email, idTelegram, block = false) {
  try {
    console.log(
      "Delete clicked - Email:",
      email,
      "ID Telegram:",
      idTelegram,
      "Block:",
      block
    );
    const message = block
      ? "Client has been deleted and blocked."
      : "Client has been deleted.";
    Swal.fire("Deleted!", message, "success");
    fetchClients(true); // Refresh tabel setelah hapus
  } catch (error) {
    console.error("Error deleting client:", error);
    Swal.fire("Error", "Failed to delete client.", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInputClient = document.getElementById("searchInputClient");
  const refreshButtonClient = document.getElementById("refreshButtonClient");

  if (searchInputClient) {
    searchInputClient.addEventListener("input", (e) => {
      filterClients(e.target.value);
    });
  } else {
    console.error("Search input not found in DOM");
  }

  if (refreshButtonClient) {
    refreshButtonClient.addEventListener("click", async () => {
      alertLoadClients();
      const getClients = await fetchClients(false);
      if (getClients) {
        alertSuccessClients();
      }
    });
  } else {
    console.error("Refresh button not found in DOM");
  }

  fetchClients(true); // Memuat data awal dan menambahkan event listener
});
