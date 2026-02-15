const container = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('edit-modal');
const closeModal = document.querySelector('.close');

let allProducts = [];

function loadProducts() {
    fetch('/products')
        .then(res => res.json())
        .then(products => {
            allProducts = products;
            displayProducts(products);
        })
        .catch(err => console.error('Ошибка загрузки:', err));
}

function displayProducts(products) {
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">Товары не найдены</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;

        card.innerHTML = `
            <div class="product-card__content">
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__description">${product.description}</p>
                <p class="product-card__price">${product.price} ₽</p>
                <div class="product-card__actions">
                    <button class="btn-edit" onclick="editProduct(${product.id})">Редактировать</button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">Удалить</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

document.getElementById('add-btn').addEventListener('click', () => {
    const name = document.getElementById('add-name').value.trim();
    const description = document.getElementById('add-description').value.trim();
    const price = parseFloat(document.getElementById('add-price').value);

    if (!name || !description || !price || price <= 0) {
        alert('Пожалуйста, заполните все поля корректно');
        return;
    }

    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, price })
    })
        .then(res => res.json())
        .then(newProduct => {
            document.getElementById('add-name').value = '';
            document.getElementById('add-description').value = '';
            document.getElementById('add-price').value = '';
            loadProducts();
            alert('Товар успешно добавлен!');
        })
        .catch(err => {
            console.error('Ошибка:', err);
            alert('Ошибка при добавлении товара');
        });
});

function editProduct(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-price').value = product.price;

    modal.style.display = 'block';
}

document.getElementById('save-edit-btn').addEventListener('click', () => {
    const id = parseInt(document.getElementById('edit-id').value);
    const name = document.getElementById('edit-name').value.trim();
    const description = document.getElementById('edit-description').value.trim();
    const price = parseFloat(document.getElementById('edit-price').value);

    if (!name || !description || !price || price <= 0) {
        alert('Пожалуйста, заполните все поля корректно');
        return;
    }

    fetch(`/products/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, price })
    })
        .then(res => res.json())
        .then(updatedProduct => {
            modal.style.display = 'none';
            loadProducts();
            alert('Товар успешно обновлен!');
        })
        .catch(err => {
            console.error('Ошибка:', err);
            alert('Ошибка при обновлении товара');
        });
});

function deleteProduct(id) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }

    fetch(`/products/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            loadProducts();
            alert('Товар успешно удален!');
        })
        .catch(err => {
            console.error('Ошибка:', err);
            alert('Ошибка при удалении товара');
        });
}


searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );

    displayProducts(filtered);
});


closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

loadProducts();