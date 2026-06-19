const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    const checkResponse = (response) => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json();
    };

    const mapRecords = (records) => records.map((record) => ({
        id: record.receipt_id,
        date: record.date,
        seller: sellers[record.seller_id],
        customer: customers[record.customer_id],
        total: record.total_amount
    }));

    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(checkResponse),
                fetch(`${BASE_URL}/customers`).then(checkResponse)
            ]);
        }

        return {sellers, customers};
    };

    const getRecords = async (query = {}, isUpdated = false) => {
        const queryString = new URLSearchParams(query).toString();

        if (lastQuery === queryString && lastResult && !isUpdated) {
            return lastResult;
        }

        const recordsUrl = queryString
            ? `${BASE_URL}/records?${queryString}`
            : `${BASE_URL}/records`;
        const records = await fetch(recordsUrl).then(checkResponse);

        lastQuery = queryString;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {getIndexes, getRecords};
}
