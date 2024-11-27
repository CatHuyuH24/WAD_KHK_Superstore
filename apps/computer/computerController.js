const computerService = require("./computerService");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const {calculateDiscountedPrice} = require("../Utils/calculateDiscountedPrice");
const { query } = require("express");

async function renderCompterCategoryPage(req, res) {
  try {
    

    const sortBy = req.query.sortBy || "";
    const search = req.query.search || "";
    const minPrice = req.query.min ? parseInt(req.query.min) : null; // Chuyển min thành số
    const maxPrice = req.query.max ? parseInt(req.query.max) : null;
    const currentCategory = req.params.category; // Lấy category từ URL (vd: /mobilephone)
    // Lấy giá trị selectedBrands từ query (có thể là một chuỗi hoặc mảng)
    let selectedBrands = req.query.brands;

    // Kiểm tra và xử lý nếu selectedBrands không phải là mảng
    if (selectedBrands && !Array.isArray(selectedBrands)) {
      selectedBrands = [selectedBrands]; // Nếu là chuỗi, chuyển thành mảng
    } else if (!selectedBrands) {
      selectedBrands = []; // Nếu không có giá trị, khởi tạo mảng rỗng
    }
    let categories;

    categories = [
      { id: "cat-1", name: "Apple", count: 15 },
      { id: "cat-2", name: "Dell", count: 0 },
      { id: "cat-3", name: "Asus", count: 0 },
      { id: "cat-4", name: "Acer", count: 0 },
    ];

    const products = await computerService.getAllComputers(
      sortBy,
      minPrice,
      maxPrice,
      selectedBrands,
      search
    );
    products.forEach((product) => {
      product.price = calculateDiscountedPrice(product.price, product.discount);
    });

    brands = products.map((product) => product.brand);

    res.render("category", {
      title: "Computer Category - Superstore - GA05",
      products: products,
      category: "computers",
      sortBy,
      search,
      min: minPrice || "",
      max: maxPrice || "",
      categories,
      currentCategory,
      selectedBrands,
      brands,
    });
  } catch (error) {
    console.error("Error rendering computer category page:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

async function renderComputerDetailPage(req, res) {
  try {
    const computerID = req.params.id;
    const queryResult = await computerService.getComputerByID(computerID);

    const relatedComputers = await computerService.getRelatedComputers(computerID, 5);
    relatedComputers.forEach((product) => {
      product.price = calculateDiscountedPrice(product.price, product.discount);
    });

    res.render("product", { product: queryResult.rows[0], relatedProducts: relatedComputers, category: "computers",title: queryResult.rows[0].name, });
  } catch (error) {
    console.error("Error rendering computer detail page:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

module.exports = {
  renderCompterCategoryPage,
  renderComputerDetailPage,
};
