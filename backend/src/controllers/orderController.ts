import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

// Пример: товары из базы данных для валидирования
const products = [
    { id: '662e97d0c2fed29cab5bf3db', price: 2000 },
    { id: '662e97dec2fed29cab5bf3dd', price: 2500 },
    // Добавьте больше товаров, если нужно
];

// Функция для проверки наличия товара и его цена
const validateItems = (items) => {
    let total = 0;
    for (const itemId of items) {
        const product = products.find(p => p.id === itemId);
        if (!product || product.price === null) {
            return { isValid: false, total };
        }
        total += product.price;
    }
    return { isValid: true, total };
};

// Контроллер для создания заказа
export const createOrder = (req, res) => {
    const { payment, email, phone, address, total, items } = req.body;

    // Валидация данных
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Items should be a non-empty array." });
    }

    const { isValid, total: calculatedTotal } = validateItems(items);
    if (!isValid) {
        return res.status(400).json({ message: "One or more items are invalid or not sellable." });
    }

    if (calculatedTotal !== total) {
        return res.status(400).json({ message: "Total does not match the sum of items." });
    }

    const validPayments = ['card', 'online'];
    if (!validPayments.includes(payment)) {
        return res.status(400).json({ message: "Payment method is invalid." });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }

    if (!phone || !address) {
        return res.status(400).json({ message: "Phone and address are required." });
    }

    // Генерация ID заказа
    const orderId = faker.datatype.uuid();

    // Успешный ответ
    return res.status(201).json({
        id: orderId,
        total: calculatedTotal
    });
};