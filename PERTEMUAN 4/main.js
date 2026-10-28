const projects = [
    {
        id: 1,
        title: "Sistem Informasi Apotek",
        category: "Web App",
        budget: 3000000,
        completed: true,
    },
    {
        id: 2,
        title: "Aplikasi Manajemen Stok Obat",
        category: "Desktop App",
        budget: 5000000,
        completed: true,
    },
    {
        id: 3,
        title: "Aplikasi Konsultasi Kesehatan",
        category: "Web App",
        budget: 1550000,
        completed: false,
    },
    {
        id: 4,
        title: "Aplikasi Pengingat Minum Obat",
        category: "Mobile App",
        budget: 6000000,
        completed: false,
    }
];

let selectedCategory = "Semua";
let searchKeyword = "";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
};

const escapeHTML = (text) => {
  return String(text).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};

const updateStats = () => {
  const totalProjects = projects.length;

  const totalBudget = projects.reduce(
    (total, project) => total + project.budget,
    0,
  );

  const completedCount = projects.filter((project) => project.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;

  document.getElementById("stat-total-budget").textContent =
    formatRupiah(totalBudget);

  document.getElementById("stat-completed-projects").textContent =
    completedCount;
};

const getFilteredProjects = () => {
  return projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "Semua" || project.category === selectedCategory;

    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    return matchesCategory && matchesSearch;
  });
};

const renderProjects = () => {
  const container = document.getElementById("project-list");
  const filteredProjects = getFilteredProjects();

  if (filteredProjects.length === 0) {
    container.innerHTML = `
      <p class="empty-message">
        Tidak ada proyek yang sesuai dengan pencarian atau kategori.
      </p>
    `;
    return;
  }

  container.innerHTML = filteredProjects
    .map((project) => {
      const badgeClass = project.completed ? "badge-success" : "badge-pending";

      const statusText = project.completed ? "Selesai" : "Dalam Pengerjaan";

      const buttonStatusText = project.completed
        ? "Batalkan Selesai"
        : "Tandai Selesai";

      return `
        <div class="project-card">
          <div class="project-info">
            <span class="project-category">
              ${escapeHTML(project.category)}
            </span>

            <h4>${escapeHTML(project.title)}</h4>

            <p class="project-budget">
              ${formatRupiah(project.budget)}
            </p>

            <span class="badge ${badgeClass}">
              ${statusText}
            </span>
          </div>

          <div class="project-actions">
            <button
              type="button"
              class="btn-action btn-status"
              data-action="toggle"
              data-id="${project.id}"
            >
              ${buttonStatusText}
            </button>

            <button
              type="button"
              class="btn-action btn-delete"
              data-action="delete"
              data-id="${project.id}"
            >
              Hapus
            </button>
          </div>
        </div>
      `;
    })
    .join("");
};

const refreshDashboard = () => {
  renderProjects();
  updateStats();
};

document.addEventListener("DOMContentLoaded", () => {
  const projectForm = document.getElementById("project-form");
  const titleInput = document.getElementById("project-title");
  const categoryInput = document.getElementById("project-category");
  const budgetInput = document.getElementById("project-budget");
  const completedInput = document.getElementById("project-completed");
  const searchInput = document.getElementById("search-input");
  const filterButtons = document.querySelectorAll(".btn-filter");
  const projectList = document.getElementById("project-list");

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const budget = Number(budgetInput.value);
    const completed = completedInput.checked;

    if (!title) {
      alert("Judul proyek wajib diisi.");
      titleInput.focus();
      return;
    }

    if (!category) {
      alert("Silakan pilih kategori proyek.");
      categoryInput.focus();
      return;
    }

    if (
      budgetInput.value.trim() === "" ||
      !Number.isFinite(budget) ||
      budget <= 0 ||
      !Number.isInteger(budget)
    ) {
      alert("Anggaran harus berupa bilangan bulat lebih dari 0.");
      budgetInput.focus();
      return;
    }

    const newId =
      projects.length > 0
        ? Math.max(...projects.map((project) => project.id)) + 1
        : 1;

    const newProject = {
      id: newId,
      title: title,
      category: category,
      budget: budget,
      completed: completed,
    };

    projects.push(newProject);

    selectedCategory = "Semua";
    searchKeyword = "";
    searchInput.value = "";

    filterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.category === "Semua");
    });

    projectForm.reset();
    refreshDashboard();

    alert("Proyek berhasil ditambahkan!");
  });

  searchInput.addEventListener("input", () => {
    searchKeyword = searchInput.value.trim();
    renderProjects();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      renderProjects();
    });
  });

  projectList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const projectId = Number(button.dataset.id);
    const action = button.dataset.action;

    const project = projects.find((item) => item.id === projectId);

    if (!project) return;

    if (action === "toggle") {
      project.completed = !project.completed;
      refreshDashboard();
    }

    if (action === "delete") {
      const confirmed = confirm(
        `Apakah Anda yakin ingin menghapus proyek "${project.title}"?`,
      );

      if (!confirmed) return;

      const projectIndex = projects.findIndex((item) => item.id === projectId);

      if (projectIndex !== -1) {
        projects.splice(projectIndex, 1);
        refreshDashboard();
      }
    }
  });

  refreshDashboard();
});