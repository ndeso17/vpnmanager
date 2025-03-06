let currentPagePayments = 1;
const itemsPerPagePayments = 5;
let payments = [];
let filteredPayments = [];

function renderTablePayments(data = filteredPayments) {
  const paymentsTable = document.getElementById("paymentsTable");
  const paymentsPagination = document.getElementById("paymentsPagination");

  if (!paymentsTable || !paymentsPagination) {
    console.error("Table or pagination not found in DOM");
    return;
  }

  const totalPagesPayments = Math.ceil(data.length / itemsPerPagePayments);
  const startIdxPayments = (currentPagePayments - 1) * itemsPerPagePayments;
  const endIdxPayments = Math.min(
    startIdxPayments + itemsPerPagePayments,
    data.length
  );
  const paginatedDataPayments = data.slice(startIdxPayments, endIdxPayments);

  paymentsTable.innerHTML =
    paginatedDataPayments.length > 0
      ? paginatedDataPayments
          .map(
            (payment, index) => `<tr>
              <td class="p-2 border-t">${startIdxPayments + index + 1}</td>
              <td class="p-2 border-t">${payment.username}</td>
              <td class="p-2 border-t">${payment.idTelegram}</td>
              <td class="p-2 border-t">${payment.kodePembayaran}</td>
              <td class="p-2 border-t">
                <img src="/img/payments/${
                  payment.buktiPembayaran
                }" alt="Bukti Pembayaran" class="max-w-[100px] h-auto cursor-pointer bukti-img" data-url="/img/payments/${
              payment.buktiPembayaran
            }" onerror="this.src='/img/404.svg'; this.classList.add('error');">
              </td>
              <td class="p-2 border-t">${payment.statusPembayaran}</td>
              <td class="p-2 border-t">${payment.tanggalRegister || "N/A"}</td>
              <td class="p-2 border-t">${
                payment.tanggalPembayaran || "N/A"
              }</td>
              <td class="p-2 border-t">
                <button class="text-green-500 hover:underline acc-btn" 
                        data-username="${payment.username}" 
                        data-id-telegram="${payment.idTelegram}" 
                        ${
                          payment.statusPembayaran === "accepted"
                            ? "disabled"
                            : ""
                        }>Accept</button>
                <button class="text-red-500 hover:underline ml-2 dcl-btn" 
                        data-username="${payment.username}" 
                        data-id-telegram="${payment.idTelegram}" 
                        ${
                          payment.statusPembayaran === "accepted"
                            ? "disabled"
                            : ""
                        }>Decline</button>
              </td>
            </tr>`
          )
          .join("")
      : '<tr><td colspan="9" class="p-2 text-center">No payments available</td></tr>';

  paymentsPagination.innerHTML = "";

  const prevButtonPayments = document.createElement("button");
  prevButtonPayments.textContent = "Prev";
  prevButtonPayments.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPagePayments === 1
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  prevButtonPayments.disabled = currentPagePayments === 1;
  prevButtonPayments.onclick = () => {
    if (currentPagePayments > 1) {
      currentPagePayments--;
      renderTablePayments();
    }
  };
  paymentsPagination.appendChild(prevButtonPayments);

  for (let i = 1; i <= totalPagesPayments; i++) {
    const pageButtonPayments = document.createElement("button");
    pageButtonPayments.textContent = i;
    pageButtonPayments.className = `px-3 py-1 bg-gray-200 rounded ${
      currentPagePayments === i ? "bg-blue-500 text-white" : "hover:bg-gray-300"
    }`;
    pageButtonPayments.onclick = () => {
      currentPagePayments = i;
      renderTablePayments();
    };
    paymentsPagination.appendChild(pageButtonPayments);
  }

  const nextButtonPayments = document.createElement("button");
  nextButtonPayments.textContent = "Next";
  nextButtonPayments.className = `px-3 py-1 bg-gray-200 rounded ${
    currentPagePayments === totalPagesPayments
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-gray-300"
  }`;
  nextButtonPayments.disabled = currentPagePayments === totalPagesPayments;
  nextButtonPayments.onclick = () => {
    if (currentPagePayments < totalPagesPayments) {
      currentPagePayments++;
      renderTablePayments();
    }
  };
  paymentsPagination.appendChild(nextButtonPayments);

  addButtonEventListeners();
}

function filterPayments(searchTerm) {
  currentPagePayments = 1;
  if (!searchTerm) {
    filteredPayments = [...payments];
  } else {
    filteredPayments = payments.filter((payment) =>
      [
        payment.username,
        payment.idTelegram.toString(),
        payment.kodePembayaran,
      ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  renderTablePayments();
}

function alertLoadPayments(time) {
  Swal.fire({
    title: "Refreshing...",
    text: "Fetching payments data",
    timer: time || 10000,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

function alertSuccessPayments() {
  Swal.fire({
    icon: "success",
    title: "Data Refreshed",
    text: "Payments data has been updated successfully",
    timer: 1500,
    showConfirmButton: false,
  });
}

function alertErrorPayments() {
  Swal.fire({
    icon: "error",
    title: "Refresh Problem",
    text: "Problem fetching payments data. Please try again.",
  });
}

async function fetchPayments(alert = true) {
  try {
    if (alert) alertLoadPayments();
    const responsePayments = await axios({
      method: "PUT", // Pastikan ini sesuai dengan API Anda, sebaiknya GET untuk fetch
      url: "/api/empu/payments",
      headers: { "content-type": "application/json" },
      withCredentials: true,
    });
    console.log("Data Payments:", responsePayments.data);
    payments = Array.isArray(responsePayments.data)
      ? responsePayments.data
      : [];
    filteredPayments = [...payments];
    if (payments.length === 0) {
      console.warn("No payments returned from API");
      alertErrorPayments();
    }
    renderTablePayments();
    if (alert) alertSuccessPayments();
    return true;
  } catch (error) {
    console.error("Error fetching payments:", error);
    alertErrorPayments();
    payments = [];
    filteredPayments = [];
    renderTablePayments();
  }
}

function addButtonEventListeners() {
  // Event listener untuk tombol Accept
  document.querySelectorAll(".acc-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const username = e.target.getAttribute("data-username");
      const idTelegram = e.target.getAttribute("data-id-telegram");
      Swal.fire({
        title: "Accept Payment",
        text: `Accept payment for Username: ${username} (ID Telegram: ${idTelegram})?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, accept",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updatePaymentStatus(username, idTelegram, "accepted");
        }
      });
    });
  });

  // Event listener untuk tombol Decline
  document.querySelectorAll(".dcl-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const username = e.target.getAttribute("data-username");
      const idTelegram = e.target.getAttribute("data-id-telegram");
      Swal.fire({
        title: "Decline Payment",
        text: `Decline payment for Username: ${username} (ID Telegram: ${idTelegram})?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, decline",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updatePaymentStatus(username, idTelegram, "declined");
        }
      });
    });
  });

  // Event listener untuk klik gambar bukti pembayaran
  document.querySelectorAll(".bukti-img").forEach((img) => {
    img.addEventListener("click", () => {
      const url = img.getAttribute("data-url");
      const isError = img.classList.contains("error");

      if (isError) {
        Swal.fire({
          title: "Bukti Pembayaran Not Found",
          text: "Gambar bukti pembayaran tidak dapat ditemukan.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Bukti Pembayaran",
          html: `
            <div class="zoom-container">
              <div class="zoom-controls mb-2">
                <span class="zoom-in cursor-pointer text-blue-500 hover:text-blue-700 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="7" x2="11" y2="15"></line>
                    <line x1="7" y1="11" x2="15" y2="11"></line>
                  </svg>
                </span>
                <span class="zoom-out cursor-pointer text-blue-500 hover:text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="7" y1="11" x2="15" y2="11"></line>
                  </svg>
                </span>
              </div>
              <img src="${url}" alt="Bukti Pembayaran" class="zoom-img max-w-full h-auto" style="transform: scale(1); transition: transform 0.2s ease;">
            </div>
          `,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Tutup",
          cancelButtonText: "Unduh",
          customClass: {
            popup: "swal-wide",
            confirmButton: "bg-green-500 text-white",
            cancelButton: "bg-blue-500 text-white",
          },
          didOpen: () => {
            const zoomImg = document.querySelector(".zoom-img");
            const zoomInBtn = document.querySelector(".zoom-in");
            const zoomOutBtn = document.querySelector(".zoom-out");
            let scale = 1;

            // Fungsi zoom
            const zoomIn = () => {
              scale = Math.min(scale + 0.1, 3); // Batas maksimum zoom
              zoomImg.style.transform = `scale(${scale})`;
            };

            const zoomOut = () => {
              scale = Math.max(scale - 0.1, 0.5); // Batas minimum zoom
              zoomImg.style.transform = `scale(${scale})`;
            };

            zoomInBtn.addEventListener("click", zoomIn);
            zoomOutBtn.addEventListener("click", zoomOut);

            // Hapus event listener saat popup ditutup
            Swal.getPopup().addEventListener("mouseleave", () => {
              zoomInBtn.removeEventListener("click", zoomIn);
              zoomOutBtn.removeEventListener("click", zoomOut);
            });
          },
          willClose: () => {
            // Fungsi saat popup ditutup
            console.log("Popup ditutup");
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            // Jika tombol "Unduh" ditekan
            window.open(url, "_blank");
          }
        });
      }
    });
  });
}

async function updatePaymentStatus(username, idTelegram, status) {
  try {
    await axios({
      method: "PUT",
      url: "/api/empu/payments/update",
      headers: { "content-type": "application/json" },
      data: { username, idTelegram, status },
      withCredentials: true,
    });
    Swal.fire("Success!", `Payment has been ${status}.`, "success");
    fetchPayments(true); // Refresh tabel setelah update
  } catch (error) {
    console.error(`Error ${status} payment:`, error);
    Swal.fire("Error", `Failed to ${status} payment.`, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInputPayment = document.getElementById("searchInputPayment");
  const refreshButtonPayment = document.getElementById("refreshButtonPayment");

  if (searchInputPayment) {
    searchInputPayment.addEventListener("input", (e) => {
      filterPayments(e.target.value);
    });
  } else {
    console.error("Search input not found in DOM");
  }

  if (refreshButtonPayment) {
    refreshButtonPayment.addEventListener("click", () => fetchPayments(true));
  } else {
    console.error("Refresh button not found in DOM");
  }

  fetchPayments(true); // Memuat data awal
});
