(() => {
    const resourceStorageKey = 'curonexResources';
    const transferStorageKey = 'curonexTransfers';
    const resourceGrid = document.querySelector('.resource-grid');
    const lowStockTableBody = document.querySelector('.bottom-grid .resource-table tbody');
    const searchInput = document.getElementById('dashboardSearch');

    function safeReadList(key) {
        try {
            const rawValue = window.localStorage.getItem(key);
            if (!rawValue) {
                return [];
            }

            const parsedValue = JSON.parse(rawValue);
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch {
            return [];
        }
    }

    function normalizeResources(resources) {
        return resources.map((resource) => {
            const quantityValue = Number(resource.quantity);
            let status = resource.status;

            if (!status) {
                if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
                    status = 'Out of Stock';
                } else if (quantityValue < 20) {
                    status = 'Low Stock';
                } else {
                    status = 'Available';
                }
            }

            return {
                ...resource,
                status
            };
        });
    }

    function getDashboardResources() {
        const storedResources = safeReadList(resourceStorageKey);
        return normalizeResources(storedResources);
    }

    function getTransfers() {
        const storedTransfers = safeReadList(transferStorageKey);
        return storedTransfers.map((transfer) => ({
            ...transfer,
            status: transfer.movementStatus || transfer.status || 'Pending'
        }));
    }

    function setStatCardValue(index, value) {
        const statCards = document.querySelectorAll('.stats-grid .stat-card');
        const statCard = statCards[index];
        if (!statCard) {
            return;
        }

        const statValue = statCard.querySelector('h3');
        if (statValue) {
            statValue.textContent = String(value);
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function renderResourceGrid(resources) {
        if (!resourceGrid) {
            return;
        }

        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filteredResources = resources.filter((resource) => {
            if (!searchValue) {
                return true;
            }

            return [resource.resourceName, resource.category, resource.hospital, resource.batchNumber, resource.supplier]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(searchValue));
        });

        const recentResources = [...filteredResources]
            .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0))
            .slice(0, 3);

        if (recentResources.length === 0) {
            resourceGrid.innerHTML = `
                <div class="resource-card" style="grid-column:1/-1; text-align:center;">
                    <div class="resource-icon equipment">
                        <i class="fa-solid fa-box-open"></i>
                    </div>
                    <div class="resource-content">
                        <h3>No resources registered yet</h3>
                        <span class="resource-type">Register a resource to begin tracking</span>
                    </div>
                </div>
            `;
            return;
        }

        resourceGrid.innerHTML = recentResources.map((resource) => {
            const statusClass = resource.status === 'Available' ? 'available' : resource.status === 'Low Stock' ? 'warning' : 'danger';
            const resourceIconClass = resource.category === 'Medicine' ? 'medicine' : resource.category === 'Equipment' ? 'equipment' : 'gloves';

            return `
                <div class="resource-card">
                    <div class="resource-icon ${resourceIconClass}">
                        <i class="fa-solid ${resourceIconClass === 'medicine' ? 'fa-capsules' : resourceIconClass === 'equipment' ? 'fa-kit-medical' : 'fa-hand'}"></i>
                    </div>
                    <div class="resource-content">
                        <h3>${escapeHtml(resource.resourceName || '-')}</h3>
                        <span class="resource-type">${escapeHtml(resource.category || '-')}</span>
                        <div class="resource-info">
                            <span><i class="fa-solid fa-box"></i> Qty : ${escapeHtml(resource.quantity ?? '-')}</span>
                            <span class="status ${resource.status === 'Available' ? 'available' : resource.status === 'Low Stock' ? 'warning' : 'danger'}">${escapeHtml(resource.status || '-')}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderLowStockTable(resources) {
        if (!lowStockTableBody) {
            return;
        }

        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const lowStockResources = resources.filter((resource) => {
            const matchesSearch = !searchValue || [resource.resourceName, resource.category, resource.hospital, resource.batchNumber, resource.supplier]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(searchValue));

            return matchesSearch && resource.status !== 'Available';
        });
        if (lowStockResources.length === 0) {
            lowStockTableBody.innerHTML = `
                <tr>
                    <td colspan="4">No low stock resources.</td>
                </tr>
            `;
            return;
        }

        lowStockTableBody.innerHTML = lowStockResources.map((resource) => `
            <tr>
                <td>${escapeHtml(resource.resourceName || '-')}</td>
                <td>${escapeHtml(resource.category || '-')}</td>
                <td>${escapeHtml(resource.quantity ?? '-')}</td>
                <td>
                    <span class="status ${resource.status === 'Low Stock' ? 'warning' : 'danger'}">
                        ${escapeHtml(resource.status || '-')}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    function refreshDashboard() {
        const resources = getDashboardResources();
        const transfers = getTransfers();

        const availableResources = resources.filter((resource) => resource.status === 'Available').length;
        const lowStockResources = resources.filter((resource) => resource.status === 'Low Stock').length;
        const pendingTransfers = transfers.filter((transfer) => transfer.status === 'Pending').length;

        setStatCardValue(0, resources.length);
        setStatCardValue(1, availableResources);
        setStatCardValue(2, lowStockResources);
        setStatCardValue(3, pendingTransfers);

        renderResourceGrid(resources);
        renderLowStockTable(resources);
    }

    refreshDashboard();

    if (searchInput) {
        searchInput.addEventListener('input', refreshDashboard);
    }

    window.addEventListener('curonex-resources-updated', refreshDashboard);
    window.addEventListener('curonex-transfers-updated', refreshDashboard);
    window.addEventListener('storage', (event) => {
        if (event.key === resourceStorageKey || event.key === transferStorageKey) {
            refreshDashboard();
        }
    });
})();
