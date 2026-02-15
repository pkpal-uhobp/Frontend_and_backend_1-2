const container = document.getElementById('products-container');

fetch('/products')
    .then(res => res.json())
    .then(products => {
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <img class="product-card__image" src="${product.image}" alt="${product.name}">
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__price">${product.price} ₽</p>
                    <a href="#" class="product-card__btn">Купить</a>
                </div>
            `;

            container.appendChild(card);
        });
    });
