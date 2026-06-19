export function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);
    const clone = template.content.firstElementChild.cloneNode(true);
    const elements = Array.from(clone.querySelectorAll('[data-name]')).reduce((result, element) => {
        result[element.dataset.name] = element;

        return result;
    }, {});

    return {
        container: clone,
        elements
    };
}

export function processFormData(formData) {
    return Array.from(formData.entries()).reduce((result, [key, value]) => {
        result[key] = value;

        return result;
    }, {});
}

export function getPages(currentPage, maxPage, limit) {
    const lastPage = Math.max(1, maxPage);
    const visibleLimit = Math.min(lastPage, limit);
    const normalizedPage = Math.max(1, Math.min(lastPage, currentPage));
    let start = Math.max(1, normalizedPage - Math.floor(visibleLimit / 2));
    let end = start + visibleLimit - 1;

    if (end > lastPage) {
        end = lastPage;
        start = Math.max(1, end - visibleLimit + 1);
    }

    const pages = [];

    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }

    return pages;
}
