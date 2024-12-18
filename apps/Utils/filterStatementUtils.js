/**
 * Prepare SQL filter statements based on provided inputs.
 * 
 * @param {number} minPrice - Minimum price filter.
 * @param {number} maxPrice - Maximum price filter.
 * @param {string} sort - Sort order (column, direction), e.g. "id,ASC". If not provided will be RANDOM() by default.
 * @param {string} manufacturer - Manufacturer filter.
 * @param {string} search - Search keyword.
 * @param {string} products_category - Category of products, e.g. "mobilephones". If not provided, all products are considered.
 * @returns {Object} Object containing SQL filter statements.
 * @returns {string} priceFilter - SQL statement for price filter. Blank if no price filter is applied.
 * @returns {string} manufacturerFilter - SQL statement for manufacturer filter. Blank if no manufacturer filter is applied.
 * @returns {string} searchFilter - SQL statement for search filter. Blank if no search filter is applied.
 * @returns {string} sortFilter - SQL statement for sort filter. RANDOM() if no sort order were provided
 * @returns {string} productsCategoryFilter - SQL statement for product category filter. Blank if no product category filter is applied.
 * @example
 * const {priceFilter, manufacturerFilter, searchFilter, sortFilter, productsCategoryFilter} = prepareFilterStatements(100, 500, "price,ASC", "Samsung", "Galaxy", "mobilephones");
 */
function prepareFilterStatements(minPrice, maxPrice, sort, manufacturer, search, products_category) {
    let productsCategoryFilter = "";
    if(products_category != null)
        productsCategoryFilter = `AND category_id = (SELECT id from categories where category_name = '${products_category}')`;

    // initialize filters
    let manufacturerFilter = manufacturer === "All" ? "" : `AND manufacturer_name IN (${manufacturer.split(",").map(g => `'${g}'`).join(", ")})`;
    let searchFilter = search ? `AND name ILIKE '%${search}%'` : "";
    let priceFilter = ""; 

    if (minPrice !== null && maxPrice !== null) {
        priceFilter = `AND price BETWEEN ${minPrice} AND ${maxPrice}`;
    } else if (minPrice !== null) {
        priceFilter = `AND price >= ${minPrice}`;
    } else if (maxPrice !== null) {
        priceFilter = `AND price <= ${maxPrice}`;
    }

    let sortFilter = "";
    const [sortColumn, sortDir] = sort.split(",");
    if(sortColumn != null && sortDir != null) {
        sortFilter = `ORDER BY ${sortColumn} ${sortDir}`;
    } else {
        sortFilter = "ORDER BY RANDOM()";
    }
    
    return {priceFilter, manufacturerFilter, searchFilter, sortFilter, productsCategoryFilter};
}

module.exports = {
    prepareFilterStatements,
};