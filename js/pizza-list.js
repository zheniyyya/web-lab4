
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

        const smallSize = pizza.sizes.find(s => s.size === 'S') || pizza.sizes[0];
        const largeSize = pizza.sizes.find(s => s.size === 'L') || pizza.sizes[1];

        return `
            <div class="pizza-item" data-id="${pizza.id}">
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
                        <button data-size="S">Купити</button>
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
                        <button data-size="L">Купити</button>
                    </div>
                </div>
            </div>
        `;
    }


    function renderPizzas(pizzasToRender) {
        if (pizzasAmountSpan) {
            pizzasAmountSpan.textContent = pizzasToRender.length;
        }

        if (pizzaContainer) {
            pizzaContainer.innerHTML = '';
            if (pizzasToRender.length === 0) {
                pizzaContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #555;">За вашим фільтром піц не знайдено.</p>';
            } else {
                pizzasToRender.forEach(pizza => {
                    const pizzaCardHTML = createPizzaCardHTML(pizza);
                    pizzaContainer.insertAdjacentHTML('beforeend', pizzaCardHTML);
                });
            }
        }
    }


    async function loadPizzas() {
        try {
            const response = await fetch('pizzas.json');
            if (!response.ok) {
                throw new Error(`HTTP помилка! Статус: ${response.status}`);
            }
            const allPizzas = await response.json();

            renderPizzas(allPizzas);


            //передаємо дані піц кошику і фільтру
            if (window.pizzaCart) {
                window.pizzaCart.init(allPizzas);
            }

            if (window.pizzaFilters) {
                window.pizzaFilters.init(allPizzas, renderPizzas);
            }

        } catch (error) {
            console.error("Не вдалося завантажити піци:", error);
            if(pizzaContainer) {
                pizzaContainer.innerHTML = '<p style="color: red; text-align: center;">Помилка завантаження меню. Спробуйте оновити сторінку.</p>';
            }
        }
    }

    // Обробник кліків на кнопки "Купити"
    if (pizzaContainer) {
        pizzaContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.dataset.size) {
                const pizzaItem = e.target.closest('.pizza-item');
                const pizzaId = parseInt(pizzaItem.dataset.id);
                const size = e.target.dataset.size;

                if (window.pizzaCart) {
                    window.pizzaCart.add(pizzaId, size);
                }
            }
        });
    }

    loadPizzas();
});