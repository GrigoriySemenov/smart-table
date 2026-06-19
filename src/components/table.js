import {cloneTemplate} from '../lib/utils.js';

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before = [], after = []} = settings;
    const root = cloneTemplate(tableTemplate);

    [...before].reverse().forEach((subName) => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    after.forEach((subName) => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    root.container.addEventListener('input', (event) => {
        if (event.target.matches('input[type="text"]')) {
            onAction(event.target);
        }
    });

    root.container.addEventListener('change', (event) => {
        if (!event.target.matches('input[type="text"]')) {
            onAction(event.target);
        }
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction());
    });

    root.container.addEventListener('submit', (event) => {
        event.preventDefault();
        onAction(event.submitter);
    });

    const render = (data) => {
        const nextRows = data.map((item) => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach((key) => {
                const element = row.elements[key];

                if (element) {
                    element.textContent = item[key];
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}
