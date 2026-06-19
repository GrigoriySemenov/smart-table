import './fonts/ys-display/fonts.css';
import './style.css';

import {initData} from './data.js';
import {processFormData} from './lib/utils.js';
import {initTable} from './components/table.js';
import {initPagination} from './components/pagination.js';
import {initSorting} from './components/sorting.js';
import {initFiltering} from './components/filtering.js';
import {initSearching} from './components/searching.js';

const api = initData();
let renderRequestId = 0;

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = Number.parseInt(state.rowsPerPage, 10) || 10;
    const page = Number.parseInt(state.page ?? 1, 10) || 1;

    return {
        ...state,
        rowsPerPage,
        page
    };
}

async function render(action) {
    const requestId = ++renderRequestId;
    const state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const {total, items} = await api.getRecords(query);

    if (requestId !== renderRequestId) {
        return;
    }

    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applySearching = initSearching('search');

const {updateIndexes, applyFiltering} = initFiltering(sampleTable.filter.elements);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const {applyPagination, updatePagination} = initPagination(
    sampleTable.pagination.elements,
    (element, page, isCurrent) => {
        const input = element.querySelector('input');
        const label = element.querySelector('span');

        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;

        return element;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(() => render());
