document.addEventListener('DOMContentLoaded', () => {
    const cartItems = window.cartStorage.load();

    if (cartItems.length === 0) {
        document.getElementById('wd-pivot-container').style.display = 'none';
        document.getElementById('no-data-message').style.display = 'block';
        return;
    }

    const reportData = cartItems.map(item => ({
        "Назва": item.name,
        "Тип": item.name.includes("Імпреза") || item.name.includes("Гавайська") || item.name.includes("BBQ") || item.name.includes("Баварська") || item.name.includes("Карбонара") || item.name.includes("Міксовий поло") || item.name.includes("Мексиканська") ? "М'ясна" : (item.name.includes("Маргарита") ? "Вегатаріанська" : "З морепродуктами"),
        "Розмір": item.size === 'S' ? 'Мала' : 'Велика',
        "Ціна за одиницю": item.price,
        "Кількість": item.quantity,
        "Загальна вартість": item.price * item.quantity,
        "Діаметр, см": item.diameter,
        "Вага, г": item.weight
    }));

    const pivot = new WebDataRocks({
        container: "#wd-pivot-container",
        toolbar: true, // Показувати панель інструментів
        width: "100%",
        height: 600,
        report: {
            dataSource: {
                data: reportData
            },
            slice: {
                rows: [
                    { "uniqueName": "Тип" },
                    { "uniqueName": "Назва" },
                    { "uniqueName": "Розмір" }
                ],
                columns: [],
                measures: [
                    {
                        "uniqueName": "Кількість",
                        "aggregation": "sum",
                        "caption": "Всього штук"
                    },
                    {
                        "uniqueName": "Загальна вартість",
                        "aggregation": "sum",
                        "caption": "Всього, грн"
                    }
                ]
            },
            options: {
                grid: {
                    title: "Аналіз замовлення",
                    showTotals: "on",
                    showGrandTotals: "on"
                }
            },
            localization: {
                "grid": {
                    "blankMember": "Порожньо",
                    "grandTotal": "Загальний підсумок",
                    "total": "Всього"
                },
                "toolbar": {
                    "fields": "Поля",
                    "filters": "Фільтри",
                    "format": "Формат",
                    "options": "Опції",
                    "grid": "Таблиця",
                    "charts": "Графіки",
                    "export": "Експорт",
                    "connect": "Підключити",
                    "open": "Відкрити",
                    "save": "Зберегти"
                }
            }
        }
    });
});