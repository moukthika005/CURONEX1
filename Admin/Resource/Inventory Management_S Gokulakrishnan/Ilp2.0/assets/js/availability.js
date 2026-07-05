(() => {
    const STORAGE_KEY = 'curonexResources';

    const tableBody = document.getElementById('resourceTableBody');
    const topSearchInput = document.getElementById('availabilitySearch');
    const searchInput = document.getElementById('searchResource');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalResourcesCount');
    const availableCount = document.getElementById('availableResourcesCount');
    const lowStockCount = document.getElementById('lowStockCount');
    const outOfStockCount = document.getElementById('outOfStockCount');

    if (!tableBody) {
        return;
    }

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

    function normalizeStatus(resource) {
        if (resource.status) {
            return resource.status;
        }

        const quantityValue = Number(resource.quantity);
        if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
            return 'Out of Stock';
        }

        if (quantityValue < 20) {
            return 'Low Stock';
        }

        return 'Available';
    }

    function getResources() {
        const storedResources = safeReadList(STORAGE_KEY);
        return storedResources.map((resource) => ({
            ...resource,
            status: normalizeStatus(resource)
        }));
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function statusClass(status) {
        if (status === 'Low Stock') {
            return 'low';
        }

        if (status === 'Out of Stock') {
            return 'out';
        }

        return 'available';
    }

    function renderSummary(resources) {
        const summary = resources.reduce((counts, resource) => {
            const status = normalizeStatus(resource);
            counts.total += 1;

            if (status === 'Available') {
                counts.available += 1;
            } else if (status === 'Low Stock') {
                counts.low += 1;
            } else {
                counts.out += 1;
            }

            return counts;
        }, {
            total: 0,
            available: 0,
            low: 0,
            out: 0
        });

        if (totalCount) {
            totalCount.textContent = String(summary.total);
        }

        if (availableCount) {
            availableCount.textContent = String(summary.available);
        }

        if (lowStockCount) {
            lowStockCount.textContent = String(summary.low);
        }

        if (outOfStockCount) {
            outOfStockCount.textContent = String(summary.out);
        }
    }

    function renderTable(resources) {
        const searchValue = [searchInput, topSearchInput]
            .map((input) => input ? input.value.trim().toLowerCase() : '')
            .find((value) => value.length > 0) || '';
        const categoryValue = categoryFilter ? categoryFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';

        const filteredResources = resources.filter((resource) => {
            const resourceStatus = normalizeStatus(resource);
            const matchesSearch = !searchValue || [resource.resourceName, resource.hospital, resource.batchNumber, resource.supplier]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(searchValue));
            const matchesCategory = !categoryValue || resource.category === categoryValue;
            const matchesStatus = !statusValue || resourceStatus === statusValue;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        tableBody.innerHTML = filteredResources.map((resource) => {
            const resourceStatus = normalizeStatus(resource);
            const expiryLabel = resource.expiryDate
                ? new Date(resource.expiryDate + 'T00:00:00').toLocaleDateString()
                : '-';

            return `
                <tr data-resource-id="${escapeHtml(resource.id || resource.resourceName)}">
                    <td>${escapeHtml(resource.resourceName || '-')}</td>
                    <td>${escapeHtml(resource.category || '-')}</td>
                    <td>${escapeHtml(resource.quantity ?? '-')} ${escapeHtml(resource.unit || '')}</td>
                    <td>${escapeHtml(resource.hospital || '-')}</td>
                    <td>${escapeHtml(expiryLabel)}</td>
                    <td><span class="status ${statusClass(resourceStatus)}">${escapeHtml(resourceStatus)}</span></td>
                    <td class="action-cell">
                        <button type="button" class="delete-btn" data-delete-resource="${escapeHtml(resource.id || resource.resourceName)}">
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (emptyState) {
            emptyState.style.display = filteredResources.length === 0 ? 'block' : 'none';
        }
    }

    function refreshView() {
        const resources = getResources();
        renderSummary(resources);
        renderTable(resources);
    }

    function deleteResource(resourceId) {
        const storedResources = safeReadList(STORAGE_KEY);
        const updatedResources = storedResources.filter((resource) => (resource.id || resource.resourceName) !== resourceId);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResources));
        window.dispatchEvent(new Event('curonex-resources-updated'));
    }

    [searchInput, categoryFilter, statusFilter].forEach((element) => {
        if (!element) {
            return;
        }

        element.addEventListener('input', refreshView);
        element.addEventListener('change', refreshView);
    });

    if (topSearchInput) {
        topSearchInput.addEventListener('input', () => {
            if (searchInput) {
                searchInput.value = topSearchInput.value;
            }

            refreshView();
        });
    }

    if (searchInput && topSearchInput) {
        searchInput.addEventListener('input', () => {
            topSearchInput.value = searchInput.value;
        });
    }

    window.addEventListener('curonex-resources-updated', refreshView);
    tableBody.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('[data-delete-resource]');
        if (!deleteButton) {
            return;
        }

        const resourceId = deleteButton.dataset.deleteResource;
        if (!resourceId) {
            return;
        }

        deleteResource(resourceId);
    });
    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            refreshView();
        }
    });

    refreshView();
})();
