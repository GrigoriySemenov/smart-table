export function initSearching(searchField) {
    return (query, state) => {
        const searchValue = state[searchField]?.trim();

        return searchValue
            ? {...query, search: searchValue}
            : query;
    };
}
