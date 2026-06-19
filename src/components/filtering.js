export function initFiltering(elements) {
    const updateIndexes = (nextElements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = nextElements[elementName];

            if (!select) {
                return;
            }

            const emptyOption = select.querySelector('option[value=""]')?.cloneNode(true);
            const options = Object.values(indexes[elementName]).map((name) => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;

                return option;
            });

            select.replaceChildren(...[emptyOption, ...options].filter(Boolean));
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.parentElement.querySelector('input, select');

            if (input) {
                input.value = '';
            }

            if (field) {
                state[field] = '';
            }
        }

        const filter = {};

        Object.values(elements).forEach((element) => {
            if (['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
                filter[`filter[${element.name}]`] = element.value;
            }
        });

        return Object.keys(filter).length
            ? {...query, ...filter}
            : query;
    };

    return {updateIndexes, applyFiltering};
}
