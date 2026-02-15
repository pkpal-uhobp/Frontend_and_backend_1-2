const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let products = [
    {
        id: 1,
        name: "Смарт-часы",
        description: "Современные смарт-часы с AMOLED дисплеем, GPS и пульсометром",
        price: 7990
    },
    {
        id: 2,
        name: "Наушники",
        description: "Беспроводные наушники с активным шумоподавлением",
        price: 5990
    },
    {
        id: 3,
        name: "Фитнес-браслет",
        description: "Водонепроницаемый фитнес-трекер с мониторингом сна",
        price: 3490
    }
];


app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, description, price } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({
            message: 'Название и стоимость обязательны'
        });
    }

    const newProduct = {
        id: Date.now(),
        name,
        description: description || '',
        price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    const { name, description, price } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const exists = products.some(p => p.id == req.params.id);

    if (!exists) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    products = products.filter(p => p.id != req.params.id);

    res.json({ message: 'Товар удалён' });
});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});