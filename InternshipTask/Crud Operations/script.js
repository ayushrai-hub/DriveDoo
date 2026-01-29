// Inventory Management System - JavaScript Logic

class InventoryManager {
    constructor() {
        this.products = this.loadProducts();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Clear all data button
        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });
    }

    handleFormSubmit() {
        const formData = this.getFormData();
        
        // Validation
        if (!this.validateForm(formData)) {
            this.showMessage('Please fill in all required fields with valid values.', 'error');
            return;
        }

        if (this.currentEditId) {
            this.updateProduct(formData);
        } else {
            this.addProduct(formData);
        }

        this.resetForm();
        this.render();
    }

    getFormData() {
        return {
            id: this.currentEditId || Date.now().toString(),
            productCode: document.getElementById('productCode').value.trim(),
            productName: document.getElementById('productName').value.trim(),
            qty: parseInt(document.getElementById('qty').value),
            price: parseFloat(document.getElementById('price').value)
        };
    }

    validateForm(data) {
        if (!data.productCode || !data.productName) {
            return false;
        }
        
        if (data.qty < 0 || data.price < 0) {
            return false;
        }

        // Check for duplicate product code (except when editing same product)
        const existingProduct = this.products.find(p => 
            p.productCode === data.productCode && p.id !== data.id
        );
        
        if (existingProduct) {
            this.showMessage('Product code already exists!', 'error');
            return false;
        }

        return true;
    }

    addProduct(data) {
        this.products.push(data);
        this.saveProducts();
        this.showMessage('Product added successfully!', 'success');
    }

    updateProduct(data) {
        const index = this.products.findIndex(p => p.id === data.id);
        if (index !== -1) {
            this.products[index] = data;
            this.saveProducts();
            this.currentEditId = null;
            this.showMessage('Product updated successfully!', 'success');
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
            this.render();
            this.showMessage('Product deleted successfully!', 'success');
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            document.getElementById('productCode').value = product.productCode;
            document.getElementById('productName').value = product.productName;
            document.getElementById('qty').value = product.qty;
            document.getElementById('price').value = product.price;
            
            this.currentEditId = product.id;
            this.showMessage('Editing product. Click Add Product to save changes.', 'success');
        }
    }

    resetForm() {
        document.getElementById('productForm').reset();
        this.currentEditId = null;
    }

    render() {
        this.renderProducts();
        this.updateSummary();
    }

    renderProducts() {
        const tbody = document.getElementById('productList');
        tbody.innerHTML = '';

        if (this.products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                        No products found. Add your first product above!
                    </td>
                </tr>
            `;
            return;
        }

        this.products.forEach(product => {
            const totalValue = (product.qty * product.price).toFixed(2);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.productCode}</td>
                <td>${product.productName}</td>
                <td>${product.qty}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${totalValue}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="inventory.editProduct('${product.id}')">
                            Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="inventory.deleteProduct('${product.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    handleSearch(query) {
        const filteredProducts = this.products.filter(product => 
            product.productCode.toLowerCase().includes(query.toLowerCase()) ||
            product.productName.toLowerCase().includes(query.toLowerCase())
        );

        this.renderSearchResults(filteredProducts);
    }

    renderSearchResults(products) {
        const tbody = document.getElementById('productList');
        tbody.innerHTML = '';

        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #6c757d;">
                        No products found matching your search.
                    </td>
                </tr>
            `;
            return;
        }

        products.forEach(product => {
            const totalValue = (product.qty * product.price).toFixed(2);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.productCode}</td>
                <td>${product.productName}</td>
                <td>${product.qty}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${totalValue}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="inventory.editProduct('${product.id}')">
                            Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="inventory.deleteProduct('${product.id}')">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    updateSummary() {
        const totalProducts = this.products.length;
        const totalValue = this.products.reduce((sum, product) => {
            return sum + (product.qty * product.price);
        }, 0);

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete all products? This action cannot be undone.')) {
            this.products = [];
            this.saveProducts();
            this.render();
            this.showMessage('All data cleared successfully!', 'success');
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.products, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory_data.json';
        link.click();
        
        URL.revokeObjectURL(url);
        this.showMessage('Data exported successfully!', 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);

        // Auto-remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    saveProducts() {
        localStorage.setItem('inventory_products', JSON.stringify(this.products));
    }

    loadProducts() {
        const saved = localStorage.getItem('inventory_products');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inventory = new InventoryManager();
});