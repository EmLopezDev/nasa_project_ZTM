const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_NUMBER;
    const page = Math.abs(query.page) || DEFAULT_PAGE_LIMIT;
    const skip = page * limit - limit;
    return { limit, skip };
}

module.exports = { getPagination };
