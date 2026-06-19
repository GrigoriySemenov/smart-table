import {getPages} from '../lib/utils.js';

const paginationActionNames = ['first', 'prev', 'next', 'last', 'page'];

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    let pageCount = 1;

    pages.firstElementChild.remove();

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action && action.name === 'first') {
            page = 1;
        }

        if (action && action.name === 'prev') {
            page = Math.max(1, page - 1);
        }

        if (action && action.name === 'next') {
            page = Math.min(pageCount, page + 1);
        }

        if (action && action.name === 'last') {
            page = pageCount;
        }

        if (action && !paginationActionNames.includes(action.name)) {
            page = 1;
        }

        page = Math.max(1, Math.min(pageCount, page));

        return {...query, limit, page};
    };

    const updatePagination = (total, {page, limit}) => {
        pageCount = Math.max(1, Math.ceil(total / limit));
        const currentPage = Math.max(1, Math.min(pageCount, page));
        const visiblePages = getPages(currentPage, pageCount, 5);

        pages.replaceChildren(...visiblePages.map((pageNumber) => {
            const element = pageTemplate.cloneNode(true);

            return createPage(element, pageNumber, pageNumber === currentPage);
        }));

        fromRow.textContent = total === 0 ? 0 : (currentPage - 1) * limit + 1;
        toRow.textContent = Math.min(currentPage * limit, total);
        totalRows.textContent = total;
    };

    return {applyPagination, updatePagination};
};
