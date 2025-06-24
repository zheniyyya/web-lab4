
window.cartStorage = {
    STORAGE_KEY: 'pizzaCart',


    save(cartItems) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Помилка збереження кошика в Local Storage:", error);
        }
    },



    load() {
        try {
            const savedCart = localStorage.getItem(this.STORAGE_KEY);

            if (savedCart) {
                return JSON.parse(savedCart);
            }
        } catch (error) {
            console.error("Помилка завантаження кошика з Local Storage:", error);
            return [];
        }

        return [];
    }
};