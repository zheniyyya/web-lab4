
document.addEventListener('DOMContentLoaded', () => {

    window.pizzaFilters = {

        allPizzas: [],
        renderFunction: null,


        init(pizzasData, renderCallback) {
            this.allPizzas = pizzasData;
            this.renderFunction = renderCallback;

            const filterContainer = document.querySelector('.pizza-filters .filters');
            if (filterContainer) {
                filterContainer.addEventListener('click', this.handleFilterClick.bind(this));
            }
        },


        handleFilterClick(event) {
            const target = event.target;

            if (target.tagName !== 'SPAN' || !target.dataset.filter) {
                return;
            }

            const filterType = target.dataset.filter;
            let filteredPizzas = [];

            switch (filterType) {
                case 'meat':
                    filteredPizzas = this.allPizzas.filter(p =>
                        p.type.includes("М'ясна") || p.type.includes("Гостра")
                    );
                    break;
                case 'pineapple':
                    filteredPizzas = this.allPizzas.filter(p =>
                        p.ingredients.toLowerCase().includes('ананас')
                    );
                    break;
                case 'mushrooms':
                    filteredPizzas = this.allPizzas.filter(p =>
                        p.ingredients.toLowerCase().includes('гриби')
                    );
                    break;
                case 'seafood':
                    filteredPizzas = this.allPizzas.filter(p =>
                        p.type.includes('морепродукт')
                    );
                    break;
                case 'vegan':
                    filteredPizzas = this.allPizzas.filter(p =>
                        p.type.includes('Вегетаріанська')
                    );
                    break;
                case 'all':
                default:
                    filteredPizzas = this.allPizzas;
                    break;
            }

            if (this.renderFunction) {
                this.renderFunction(filteredPizzas);
            }


            //підкреслюємо вибраний фільтир кольором це у pizza_list.css
            const filterContainer = document.querySelector('.pizza-filters .filters');
            const currentActive = filterContainer.querySelector('.chosen');
            if (currentActive) {
                currentActive.classList.remove('chosen');
            }
            target.classList.add('chosen');
        }
    };
});