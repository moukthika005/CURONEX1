(() => {
    const STORAGE_KEY = 'curonexTransfers';

    const tableBody = document.getElementById('trackingTableBody');
    const totalCount = document.getElementById('totalMovements');
    const pendingCount = document.getElementById('pendingMovements');
    const inTransitCount = document.getElementById('inTransitMovements');
    const completedCount = document.getElementById('completedMovements');
    const emptyState = document.getElementById('trackingEmptyState');
    const searchInput = document.getElementById('movementSearch');

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

    function safeWriteList(key, list) {
        try {
            window.localStorage.setItem(key, JSON.stringify(list));
        } catch {
            // Ignore local storage failures.
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

    function statusClass(status) {
        if (status === 'Delivered') {
            return 'delivered';
        }

        if (status === 'Cancelled') {
            return 'cancelled';
        }

        if (status === 'In Transit') {
            return 'transit';
        }

        return 'pending';
    }

    function getMovements() {
        const storedTransfers = safeReadList(STORAGE_KEY);
        return storedTransfers.map((transfer, index) => ({
            id: transfer.id || `MT-${String(index + 1).padStart(4, '0')}`,
            transferId: transfer.id,
            resource: transfer.resource || transfer.resourceName || '-',
            source: transfer.source || transfer.hospital || '-',
            destination: transfer.destination || transfer.target || '-',
            quantity: transfer.quantity || '-',
            status: transfer.movementStatus || transfer.status || 'Pending',
            updatedAt: transfer.updatedAt || new Date().toISOString()
        }));
    }

    function getSearchValue() {
        return searchInput ? searchInput.value.trim().toLowerCase() : '';
    }

    function renderSummary(movements) {
        const summary = movements.reduce((counts, movement) => {
            counts.total += 1;

            if (movement.status === 'Pending') {
                counts.pending += 1;
            } else if (movement.status === 'In Transit') {
                counts.inTransit += 1;
            } else if (movement.status === 'Delivered') {
                counts.completed += 1;
            }

            return counts;
        }, {
            total: 0,
            pending: 0,
            inTransit: 0,
            completed: 0
        });

        if (totalCount) {
            totalCount.textContent = String(summary.total);
        }

        if (pendingCount) {
            pendingCount.textContent = String(summary.pending);
        }

        if (inTransitCount) {
            inTransitCount.textContent = String(summary.inTransit);
        }

        if (completedCount) {
            completedCount.textContent = String(summary.completed);
        }
    }

    function renderTable(movements) {
        const searchValue = getSearchValue();

        const filteredMovements = movements.filter((movement) => {
            if (!searchValue) {
                return true;
            }

            const updatedAtText = new Date(movement.updatedAt).toLocaleString().toLowerCase();
            return [
                movement.id,
                movement.transferId,
                movement.resource,
                movement.source,
                movement.destination,
                movement.quantity,
                movement.status,
                updatedAtText
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(searchValue));
        });

        tableBody.innerHTML = filteredMovements.map((movement) => {
            const updatedAtLabel = new Date(movement.updatedAt).toLocaleString();

            return `
                <tr data-transfer-id="${escapeHtml(movement.transferId || movement.id)}">
                    <td>${escapeHtml(movement.id)}</td>
                    <td>${escapeHtml(movement.resource)}</td>
                    <td>${escapeHtml(movement.source)}</td>
                    <td>${escapeHtml(movement.destination)}</td>
                    <td>${escapeHtml(movement.quantity)}</td>
                    <td><span class="status ${statusClass(movement.status)}">${escapeHtml(movement.status)}</span></td>
                    <td>${escapeHtml(updatedAtLabel)}</td>
                </tr>
            `;
        }).join('');

        if (emptyState) {
            emptyState.style.display = filteredMovements.length === 0 ? 'block' : 'none';
        }
    }

    function persistUpdatedStatus(transferId, nextStatus) {
        const storedTransfers = safeReadList(STORAGE_KEY);
        const updatedTransfers = storedTransfers.map((transfer) => {
            if ((transfer.id || '') !== transferId && (transfer.transferId || '') !== transferId) {
                return transfer;
            }

            return {
                ...transfer,
                movementStatus: nextStatus,
                status: nextStatus,
                updatedAt: new Date().toISOString()
            };
        });

        safeWriteList(STORAGE_KEY, updatedTransfers);
    }

    tableBody.addEventListener('click', (event) => {
        const row = event.target.closest('tr[data-transfer-id]');
        if (!row) {
            return;
        }

        const transferId = row.dataset.transferId;
        const currentMovements = getMovements();
        const movement = currentMovements.find((item) => item.transferId === transferId || item.id === transferId);
        if (!movement) {
            return;
        }

        const nextStatus = movement.status === 'Pending'
            ? 'In Transit'
            : movement.status === 'In Transit'
                ? 'Delivered'
                : 'Pending';

        persistUpdatedStatus(transferId, nextStatus);

        const refreshedMovements = getMovements();
        renderSummary(refreshedMovements);
        renderTable(refreshedMovements);
    });

    const movements = getMovements();
    renderSummary(movements);
    renderTable(movements);

    if (searchInput) {
        const refreshSearch = () => renderTable(getMovements());

        searchInput.addEventListener('input', refreshSearch);
        searchInput.addEventListener('change', refreshSearch);
        searchInput.addEventListener('keyup', refreshSearch);
    }

    window.addEventListener('curonex-transfers-updated', () => {
        const refreshedMovements = getMovements();
        renderSummary(refreshedMovements);
        renderTable(refreshedMovements);
    });
})();
