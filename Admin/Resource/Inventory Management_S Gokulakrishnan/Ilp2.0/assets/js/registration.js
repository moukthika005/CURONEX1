(() => {
    const STORAGE_KEY = 'curonexResources';

    const form = document.getElementById('resourceForm');
    if (!form) {
        return;
    }

    const fieldIds = [
        'resourceName',
        'category',
        'quantity',
        'unit',
        'hospital',
        'supplier',
        'batchNumber',
        'resourceType',
        'manufactureDate',
        'expiryDate',
        'description'
    ];

    const fields = Object.fromEntries(
        fieldIds.map((id) => [id, document.getElementById(id)])
    );

    const errorMessages = Object.fromEntries(
        fieldIds.map((id) => [id, document.getElementById(`${id}Error`)]).filter((entry) => entry[1])
    );

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
            // Local storage is not always available when the site is opened as a file.
        }
    }

    function setError(fieldId, message) {
        const errorElement = errorMessages[fieldId];
        if (!errorElement) {
            return;
        }

        errorElement.textContent = message || '';
    }

    function clearErrors() {
        Object.keys(errorMessages).forEach((fieldId) => setError(fieldId, ''));
    }

    function valueOf(fieldId) {
        const field = fields[fieldId];
        return field ? field.value.trim() : '';
    }

    function computeStatus(quantity) {
        if (quantity <= 0) {
            return 'Out of Stock';
        }

        if (quantity < 20) {
            return 'Low Stock';
        }

        return 'Available';
    }

    function isValidText(value, pattern) {
        return pattern.test(value.trim());
    }

    function isValidDate(value) {
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
    }

    function validateForm() {
        const errors = {};
        const resourceNameValue = valueOf('resourceName');
        const categoryValue = valueOf('category');
        const quantityValueRaw = valueOf('quantity');
        const quantityValue = Number(quantityValueRaw);
        const unitValue = valueOf('unit');
        const hospitalValue = valueOf('hospital');
        const supplierValue = valueOf('supplier');
        const batchNumberValue = valueOf('batchNumber');
        const resourceTypeValue = valueOf('resourceType');
        const manufactureDateValue = valueOf('manufactureDate');
        const expiryDateValue = valueOf('expiryDate');

        if (!resourceNameValue) {
            errors.resourceName = 'Resource name is required.';
        } else if (resourceNameValue.length < 3 || resourceNameValue.length > 80 || !isValidText(resourceNameValue, /^[A-Za-z0-9][A-Za-z0-9\s\-()\/.,]+$/)) {
            errors.resourceName = 'Enter a valid resource name.';
        }

        if (!categoryValue) {
            errors.category = 'Category is required.';
        }

        if (!quantityValueRaw) {
            errors.quantity = 'Quantity is required.';
        } else if (!Number.isInteger(quantityValue) || quantityValue <= 0 || quantityValue > 100000) {
            errors.quantity = 'Enter a whole number greater than zero.';
        }

        if (!unitValue) {
            errors.unit = 'Unit is required.';
        } else if (unitValue.length > 24 || !isValidText(unitValue, /^[A-Za-z\s]+$/)) {
            errors.unit = 'Enter a valid unit.';
        }

        if (!hospitalValue) {
            errors.hospital = 'Hospital / Camp is required.';
        } else if (hospitalValue.length < 3 || hospitalValue.length > 100 || !isValidText(hospitalValue, /^[A-Za-z0-9][A-Za-z0-9\s\-()\/.,]+$/)) {
            errors.hospital = 'Enter a valid hospital or camp name.';
        }

        if (!supplierValue) {
            errors.supplier = 'Supplier is required.';
        } else if (supplierValue.length < 2 || supplierValue.length > 100 || !isValidText(supplierValue, /^[A-Za-z][A-Za-z\s&.,\-()]+$/)) {
            errors.supplier = 'Enter a valid supplier name.';
        }

        if (!batchNumberValue) {
            errors.batchNumber = 'Batch number is required.';
        } else if (batchNumberValue.length < 3 || batchNumberValue.length > 30 || !isValidText(batchNumberValue, /^[A-Za-z0-9][A-Za-z0-9\-\/]+$/)) {
            errors.batchNumber = 'Enter a valid batch number.';
        }

        if (!resourceTypeValue) {
            errors.resourceType = 'Resource type is required.';
        }

        if (!manufactureDateValue) {
            errors.manufactureDate = 'Manufacture date is required.';
        } else if (!isValidDate(manufactureDateValue)) {
            errors.manufactureDate = 'Enter a valid manufacture date.';
        }

        if (!expiryDateValue) {
            errors.expiryDate = 'Expiry date is required.';
        } else if (!isValidDate(expiryDateValue)) {
            errors.expiryDate = 'Enter a valid expiry date.';
        }

        if (manufactureDateValue && expiryDateValue && expiryDateValue <= manufactureDateValue) {
            errors.expiryDate = 'Expiry date must be after the manufacture date.';
        }

        const descriptionValue = valueOf('description');
        if (descriptionValue.length > 500) {
            errors.description = 'Description must be 500 characters or fewer.';
        }

        return errors;
    }

    form.addEventListener('reset', () => {
        clearErrors();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors();

        const errors = validateForm();
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
            errorKeys.forEach((fieldId) => setError(fieldId, errors[fieldId]));
            return;
        }

        const quantityValue = Number(valueOf('quantity'));
        const resourceRecord = {
            id: `resource-${Date.now()}`,
            resourceName: valueOf('resourceName'),
            category: valueOf('category'),
            quantity: quantityValue,
            unit: valueOf('unit'),
            hospital: valueOf('hospital'),
            supplier: valueOf('supplier'),
            batchNumber: valueOf('batchNumber'),
            resourceType: valueOf('resourceType'),
            manufactureDate: valueOf('manufactureDate'),
            expiryDate: valueOf('expiryDate'),
            description: valueOf('description'),
            status: computeStatus(quantityValue),
            createdAt: new Date().toISOString()
        };

        const storedResources = safeReadList(STORAGE_KEY);
        storedResources.unshift(resourceRecord);
        safeWriteList(STORAGE_KEY, storedResources);

        form.reset();
        window.alert('Resource registered successfully.');
        window.dispatchEvent(new Event('curonex-resources-updated'));
    });
})();
