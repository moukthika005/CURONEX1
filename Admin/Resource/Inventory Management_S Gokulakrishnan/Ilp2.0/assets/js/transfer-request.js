(() => {
    const STORAGE_KEY = 'curonexTransfers';
    const RESOURCE_STORAGE_KEY = 'curonexResources';

    const tableBody = document.getElementById('transferTableBody');
    const totalCount = document.getElementById('totalTransferRequests');
    const pendingCount = document.getElementById('pendingTransfers');
    const inTransitCount = document.getElementById('inTransitTransfers');
    const deliveredCount = document.getElementById('deliveredTransfers');
    const emptyState = document.getElementById('transferEmptyState');
    const form = document.getElementById('transferForm');
    const resourceSelect = document.getElementById('transferResource');
    const quantityInput = document.getElementById('transferQuantity');
    const sourceInput = document.getElementById('transferSource');
    const destinationInput = document.getElementById('transferDestination');
    const prioritySelect = document.getElementById('transferPriority');
    const notesInput = document.getElementById('transferNotes');
    const searchInput = document.getElementById('transferSearch');
    const dateInput = document.getElementById('transferDate');

    const errorIds = ['transferResource', 'transferQuantity', 'transferSource', 'transferDestination', 'transferPriority'];
    const errorNodes = Object.fromEntries(
        errorIds.map((fieldId) => [fieldId, document.getElementById(`${fieldId}Error`)]).filter((entry) => entry[1])
    );

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
            // Ignore storage failures when the page is opened locally.
        }
    }

    function clearErrors() {
        Object.values(errorNodes).forEach((node) => {
            node.textContent = '';
        });
    }

    function setError(fieldId, message) {
        const node = errorNodes[fieldId];
        if (node) {
            node.textContent = message;
        }
    }

    function valueOf(element) {
        return element ? element.value.trim() : '';
    }

    function readResources() {
        const storedResources = safeReadList(RESOURCE_STORAGE_KEY);
        return storedResources;
    }

    function populateResourceSelect() {
        if (!resourceSelect) {
            return;
        }

        const resources = readResources();
        const resourceNames = [...new Set(resources.map((resource) => resource.resourceName).filter(Boolean))];

        if (resourceNames.length === 0) {
            resourceSelect.innerHTML = '<option value="">No resources available</option>';
            resourceSelect.disabled = true;
            return;
        }

        resourceSelect.disabled = false;
        resourceSelect.innerHTML = ['<option value="">Select Resource</option>']
            .concat(resourceNames.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`))
            .join('');
    }

    function resourceAvailability(resourceName) {
        const resources = readResources();
        const match = resources.find((resource) => resource.resourceName === resourceName);
        return match ? Number(match.quantity) || 0 : 0;
    }

    function normalizeQuantityInput(resourceName, requestedQuantity) {
        const availableQuantity = resourceAvailability(resourceName);
        if (availableQuantity > 0) {
            return Math.min(requestedQuantity, availableQuantity);
        }

        return requestedQuantity;
    }

    function getSelectedResource(resourceName) {
        const resources = readResources();
        return resources.find((resource) => resource.resourceName === resourceName);
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
        if (status === 'In Transit') {
            return 'transit';
        }

        if (status === 'Delivered') {
            return 'delivered';
        }

        if (status === 'Rejected') {
            return 'rejected';
        }

        return 'pending';
    }

    function getTransfers() {
        const storedTransfers = safeReadList(STORAGE_KEY);
        return storedTransfers.map((transfer, index) => ({
            id: transfer.id || `TR-${String(index + 1).padStart(4, '0')}`,
            resource: transfer.resource || '-',
            source: transfer.source || '-',
            destination: transfer.destination || '-',
            quantity: transfer.quantity || '-',
            priority: transfer.priority || '-',
            status: transfer.movementStatus || transfer.status || 'Pending',
            movementStatus: transfer.movementStatus || transfer.status || 'Pending',
            createdAt: transfer.createdAt || new Date().toISOString(),
            updatedAt: transfer.updatedAt || new Date().toISOString(),
            notes: transfer.notes || ''
        }));
    }

    function renderSummary(transfers) {
        const summary = transfers.reduce((counts, transfer) => {
            counts.total += 1;

            if (transfer.status === 'Pending') {
                counts.pending += 1;
            } else if (transfer.status === 'In Transit') {
                counts.inTransit += 1;
            } else if (transfer.status === 'Delivered') {
                counts.delivered += 1;
            }

            return counts;
        }, {
            total: 0,
            pending: 0,
            inTransit: 0,
            delivered: 0
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

        if (deliveredCount) {
            deliveredCount.textContent = String(summary.delivered);
        }
    }

    function getTransferDateValue(transfer) {
        return transfer.createdAt ? new Date(transfer.createdAt).toISOString().slice(0, 10) : '';
    }

    function renderTable(transfers) {
        const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const dateValue = dateInput ? dateInput.value : '';

        const filteredTransfers = transfers.filter((transfer) => {
            const matchesSearch = !searchValue || [transfer.id, transfer.resource, transfer.source, transfer.destination]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(searchValue));
            const matchesDate = !dateValue || getTransferDateValue(transfer) === dateValue;

            return matchesSearch && matchesDate;
        });

        tableBody.innerHTML = filteredTransfers.map((transfer) => `
            <tr data-transfer-id="${escapeHtml(transfer.id)}">
                <td>${escapeHtml(transfer.id)}</td>
                <td>${escapeHtml(transfer.resource)}</td>
                <td>${escapeHtml(transfer.source)}</td>
                <td>${escapeHtml(transfer.destination)}</td>
                <td>${escapeHtml(transfer.quantity)}</td>
                <td>${escapeHtml(transfer.priority)}</td>
                <td>${escapeHtml(getTransferDateValue(transfer) || '-')}</td>
                <td><span class="status ${statusClass(transfer.status)}">${escapeHtml(transfer.status)}</span></td>
            </tr>
        `).join('');

        if (emptyState) {
            emptyState.style.display = filteredTransfers.length === 0 ? 'block' : 'none';
        }
    }

    function validateForm() {
        clearErrors();

        const errors = {};

        if (!valueOf(resourceSelect)) {
            errors.transferResource = 'Select a resource.';
        }

        const requestedQuantity = Number(valueOf(quantityInput));
        if (!valueOf(quantityInput)) {
            errors.transferQuantity = 'Quantity is required.';
        } else if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
            errors.transferQuantity = 'Enter a valid quantity.';
        }

        if (!valueOf(sourceInput)) {
            errors.transferSource = 'Source is required.';
        }

        if (!valueOf(destinationInput)) {
            errors.transferDestination = 'Destination is required.';
        }

        if (!valueOf(prioritySelect)) {
            errors.transferPriority = 'Priority is required.';
        }

        const selectedResource = valueOf(resourceSelect);
        const availableQuantity = resourceAvailability(selectedResource);
        if (selectedResource && availableQuantity > 0 && Number.isFinite(requestedQuantity) && requestedQuantity > availableQuantity) {
            errors.transferQuantity = `Only ${availableQuantity} ${availableQuantity === 1 ? 'unit is' : 'units are'} available.`;
        }

        Object.entries(errors).forEach(([fieldId, message]) => setError(fieldId, message));
        return errors;
    }

    if (resourceSelect) {
        populateResourceSelect();
    }

    if (form) {
        form.addEventListener('reset', clearErrors);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const errors = validateForm();
            if (Object.keys(errors).length > 0) {
                return;
            }

            const resourceName = valueOf(resourceSelect);
            const requestedQuantity = Number(valueOf(quantityInput));
            const normalizedQuantity = normalizeQuantityInput(resourceName, requestedQuantity);
            const selectedResource = getSelectedResource(resourceName);
            const transferRecord = {
                id: `TR-${Date.now()}`,
                resource: resourceName,
                source: valueOf(sourceInput) || (selectedResource ? selectedResource.hospital : ''),
                destination: valueOf(destinationInput),
                quantity: normalizedQuantity,
                priority: valueOf(prioritySelect),
                status: 'Pending',
                movementStatus: 'Pending',
                notes: notesInput ? notesInput.value.trim() : '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const storedTransfers = safeReadList(STORAGE_KEY);
            storedTransfers.unshift(transferRecord);
            safeWriteList(STORAGE_KEY, storedTransfers);

            window.dispatchEvent(new Event('curonex-transfers-updated'));
            form.reset();
            populateResourceSelect();
            refreshView();
        });
    }

    function refreshView() {
        const transfers = getTransfers();
        renderSummary(transfers);
        renderTable(transfers);
    }

    function refreshResources() {
        populateResourceSelect();
        refreshView();
    }

    [searchInput, dateInput].forEach((element) => {
        if (!element) {
            return;
        }

        element.addEventListener('input', refreshView);
        element.addEventListener('change', refreshView);
    });

    refreshView();

    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            refreshView();
        }

        if (event.key === RESOURCE_STORAGE_KEY) {
            refreshResources();
        }
    });
    window.addEventListener('curonex-transfers-updated', refreshView);
    window.addEventListener('curonex-resources-updated', refreshResources);
})();
