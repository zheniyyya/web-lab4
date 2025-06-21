document.addEventListener('DOMContentLoaded', () => {

    const pizzaContainer = document.getElementById('pizza-list-container');
    const pizzasAmountSpan = document.getElementById('pizzas-amount');

    function createPizzaCardHTML(pizza) {
        let badgeHTML = '';
        if (pizza.isNew) {
            badgeHTML = '<div class="new">Нова</div>';
        } else if (pizza.isPopular) {
            badgeHTML = '<div class="popular">Популярна</div>';
        }

        const smallSize = pizza.sizes[0];
        const largeSize = pizza.sizes[1];

        return `
            <div class="pizza-item">
                ${badgeHTML}
                <img src="${pizza.image}" alt="Піца ${pizza.name}">
                
                <span class="name">${pizza.name}</span>
                <span class="pizza-type">${pizza.type}</span>
                <p class="ingredients">${pizza.ingredients}</p>
                
                <div class="size-info">
                    <!-- Маленький розмір -->
                    <div class="size-s">
                        <div class="size-details">
                            <span class="size">${smallSize.diameter}</span>
                            <span class="weight">${smallSize.weight}</span>
                        </div>
                        <div class="price">
                            <span class="price-value">${smallSize.price}</span>
                            <span class="currency">грн.</span>
                        </div>
                        <button>Купити</button>
                    </div>

                    <!-- Великий розмір -->
                    <div class="size-l">
                        <div class="size-details">
                            <span class="size">${largeSize.diameter}</span>
                            <span class="weight">${largeSize.weight}</span>
                        </div>
                        <div class="price">
                            <span class="price-value">${largeSize.price}</span>
                            <span class="currency">грн.</span>
                        </div>
                        <button>Купити</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Функція завантаження та відображення піц
    async function loadAndRenderPizzas() {
        try {
            const response = await fetch('pizzas.json');
            if (!response.ok) {
                throw new Error(`HTTP помилка! Статус: ${response.status}`);
            }
            const pizzas = await response.json();

            if (pizzasAmountSpan) {
                pizzasAmountSpan.textContent = pizzas.length;
            }

            if (pizzaContainer) {
                pizzaContainer.innerHTML = '';

                pizzas.forEach(pizza => {
                    const pizzaCardHTML = createPizzaCardHTML(pizza);
                    pizzaContainer.insertAdjacentHTML('beforeend', pizzaCardHTML);
                });
            }
        } catch (error) {
            console.error("Не вдалося завантажити піци:", error);
            if(pizzaContainer) {
                pizzaContainer.innerHTML = '<p style="color: red; text-align: center;">Помилка завантаження меню. Спробуйте оновити сторінку.</p>';
            }
        }
    }

    loadAndRenderPizzas();
});