document.addEventListener('DOMContentLoaded', () => {
    const orderList = document.querySelector('.order-list');
    const cartTitleCount = document.querySelector('.cart-title span span');
    const cartTotalSum = document.querySelector('.buy-section .sum');

    function createCartItemHTML(item) {
        const itemTotalPrice = item.price * item.quantity;
        return `
            <div class="ordered-item" data-id="${item.id}" data-size="${item.size}">
                <div class="details">
                    <span class="pizza-name">${item.name} (${item.size === 'S' ? 'Мала' : 'Велика'})</span>
                    <div class="order-info">
                        <div class="size">${item.diameter}</div>
                        <div class="weight">${item.weight}</div>
                    </div>
                    <div class="control-panel">
                        <span class="price">${itemTotalPrice} грн</span>
                        <div class="amount-control">
                            <button class="minus ${item.quantity === 1 ? 'disabled' : ''}">-</button>
                            <span>${item.quantity}</span>
                            <button class="plus">+</button>
                            <button class="delete">×</button>
                        </div>
                    </div>
                </div>
                <div class="order-picture">
                    <img src="${item.image}" alt="${item.name}">
                </div>
            </div>
        `;
    }

    // function to paint from a massive `items`
    function renderAllCartItems() {
        orderList.innerHTML = '';

        if (window.pizzaCart.items.length > 0) {
            window.pizzaCart.items.forEach(item => {
                const itemHTML = createCartItemHTML(item);
                orderList.insertAdjacentHTML('beforeend', itemHTML);
            });
        }
    }


    function updateTotals() {
        let totalSum = 0;
        let totalCount = 0;

        window.pizzaCart.items.forEach(item => {
            totalSum += item.price * item.quantity;
            totalCount += item.quantity;
        });

        cartTitleCount.textContent = totalCount;
        cartTotalSum.textContent = `${totalSum} грн`;
        //значок к-сті
        cartTitleCount.style.display = totalCount > 0 ? 'grid' : 'none';

        if (totalCount === 0) {
            orderList.innerHTML = `<p style="text-align:center; padding: 20px; color: #a0a0a0;">Кошик порожній</p>`;
        }
    }

    //main object to control the cart
    window.pizzaCart = {
        items: [],
        allPizzas: [],

        init(pizzas) {
            this.allPizzas = pizzas;

            this.items = window.cartStorage.load();

            renderAllCartItems();
            updateTotals();
        },

        add(pizzaId, size) {
            const existingItem = this.items.find(item => item.id === pizzaId && item.size === size);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                const pizzaData = this.allPizzas.find(p => p.id === pizzaId);
                if (!pizzaData) return;
                const sizeData = pizzaData.sizes.find(s => s.size === size);

                const newItem = {
                    id: pizzaData.id, name: pizzaData.name, image: pizzaData.image,
                    size: sizeData.size, diameter: sizeData.diameter, weight: sizeData.weight,
                    price: sizeData.price, quantity: 1
                };
                this.items.push(newItem);
            }

            renderAllCartItems();
            updateTotals();
            window.cartStorage.save(this.items);
        },

        //+/-/delete
        update(pizzaId, size, action) {
            const itemIndex = this.items.findIndex(item => item.id === pizzaId && item.size === size);
            if (itemIndex === -1) return;

            const item = this.items[itemIndex];

            if (action === 'plus') {
                item.quantity++;
            } else if (action === 'minus') {
                if (item.quantity > 1) {
                    item.quantity--;
                }
            } else if (action === 'delete') {
                this.items.splice(itemIndex, 1);
            }

            renderAllCartItems();
            updateTotals();
            window.cartStorage.save(this.items);
        },

        clear() {
            this.items = [];
            updateTotals();
            window.cartStorage.save(this.items);
        }
    };

    if (orderList) {
        orderList.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button || button.classList.contains('disabled')) return;

            const orderedItem = e.target.closest('.ordered-item');
            if (!orderedItem) return;

            const pizzaId = parseInt(orderedItem.dataset.id);
            const size = orderedItem.dataset.size;

            if (button.classList.contains('plus')) window.pizzaCart.update(pizzaId, size, 'plus');
            else if (button.classList.contains('minus')) window.pizzaCart.update(pizzaId, size, 'minus');
            else if (button.classList.contains('delete')) window.pizzaCart.update(pizzaId, size, 'delete');
        });
    }

    const clearOrderBtn = document.querySelector('.clear-order');
    if (clearOrderBtn) {
        clearOrderBtn.addEventListener('click', () => window.pizzaCart.clear());
    }
});