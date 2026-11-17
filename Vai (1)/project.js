const STORAGE_KEY = "bags_style_products";
const CART_KEY = "bags_style_cart";

// Danh sách 10 sản phẩm mẫu
const initialProducts = [
  {
    id: 1,
    name: "Cem Handbag",
    price: 8000000,
    img: "https://product.hstatic.net/200000259629/product/4_cafbcb9929bc47eabf213e7f02142608.png",
    badge: "badge-new",
    description:
      "Túi xách Cem có thiết kế thanh lịch và hiện đại, phù hợp để sử dụng hằng ngày hoặc trong những dịp đặc biệt.",
  },
  {
    id: 2,
    name: "LACAMIE Handbag",
    price: 7900000,
    img: "https://sakurafashion.vn/upload/a/8709-thieu-hoa-7541.webp",
    badge: "badge-new",
    description:
      "Túi xách LACAMIE mang phong cách tinh tế, phù hợp khi đi làm, đi mua sắm hoặc tham gia các hoạt động thường ngày.",
  },
  {
    id: 3,
    name: "PUCINI Handbag",
    price: 9999000,
    img: "https://pucini.vn/wp-content/uploads/2025/12/62-600x900.png",
    badge: "badge-sale",
    description:
      "Túi xách PUCINI có kiểu dáng thời trang, giúp tạo điểm nhấn cho trang phục và phong cách cá nhân.",
  },
  {
    id: 4,
    name: "LATA Handbag",
    price: 8600000,
    img: "https://thieuhoa.com.vn/imagecache/thumbnail-category/wp-content/uploads/2026/01/tui-xach-nu-da-cao-cap-phoi-canvas-dang-kelly-tx5a0810-la-camie-2.webp",
    badge: "badge-new",
    description:
      "Túi xách LATA có kiểu dáng cổ điển, dễ kết hợp với trang phục đi làm, đi chơi và những dịp trang trọng.",
  },
  {
    id: 5,
    name: "GUCCI Handbag",
    price: 20000000,
    img: "https://cdn.hstatic.net/products/1000284478/b4de_cen94_1_235b2f7747dc426fa9a864d3846a6328.jpg",
    badge: "badge-sale",
    description:
      "Túi xách GUCCI mang phong cách sang trọng, phù hợp với những ai yêu thích vẻ ngoài nổi bật và tinh tế.",
  },
  {
    id: 6,
    name: "HAPAS Handbag",
    price: 2500000,
    img: "https://product.hstatic.net/200000978078/product/_mg_9330_ba40276180da44998bf163e75906cd04_master.jpg",
    badge: "badge-sale",
    description:
      "Túi xách HAPAS có thiết kế trẻ trung và tiện dụng, phù hợp với các hoạt động hằng ngày.",
  },
  {
    id: 7,
    name: "LESAC Handbag",
    price: 6800000,
    img: "https://pos.nvncdn.com/b22375-44395/ps/Airy-Bag-Den-2.jpg?v=1779857754",
    badge: "badge-sale",
    description:
      "Túi xách LESAC có phong cách hiện đại, tạo điểm nhấn đơn giản nhưng thời trang cho trang phục.",
  },
  {
    id: 8,
    name: "JUNO Handbag",
    price: 50000000,
    img: "https://img.onelife.vn/3kHxXlLOGMIenuaEhoKcCy_hzicRk80FLD-X2UjAzLs/rs:fit:1350:1695:1/aHR0cHM6Ly9zdGF0aWMuanVuby52bi9jbXNpbWFnZS9wdWJsaWMvbmF1X3R4dDMzNV80XzIwMjYwOTE1MTE1ODUwLmpwZWc.webp",
    badge: "badge-new",
    description:
      "Túi xách JUNO có thiết kế nổi bật, phù hợp để kết hợp cùng nhiều phong cách thời trang khác nhau.",
  },
  {
    id: 9,
    name: "TEMPUS Handbag",
    price: 10000000,
    img: "https://www.vascara.com/uploads/cms_productmedia/2026/September/30/tui-deo-vai-phoi-layered-belts-tot-0256-mau-den-0-768559-1790756807.jpg",
    badge: "badge-sale",
    description:
      "Túi xách TEMPUS mang phong cách hiện đại, dễ phối hợp với nhiều loại trang phục.",
  },
  {
    id: 10,
    name: "ZUCIANI Handbag",
    price: 8000000,
    img: "https://shopdonghai.com/cdn/shop/files/tui-xach-zuciani-JYS2-nau-1.jpg?crop=center&height=1663&v=1790758915&width=1280",
    badge: "badge-new",
    description:
      "Túi xách ZUCIANI có kiểu dáng thanh lịch, phù hợp để sử dụng trong nhiều hoạt động thường ngày.",
  },
];
// ---------- Danh mục ----------
const MENU_KEY = "bags_style_active_menu";
const CATEGORIES = ["nu", "nam", "thethao", "treem"];

function getActiveCategory() {
  let value = "nu";
  try {
    value = localStorage.getItem(MENU_KEY) || "nu";
  } catch (error) {}
  return CATEGORIES.includes(value) ? value : "nu";
}

// 10 sản phẩm cũ đều thuộc mục Nữ
initialProducts.forEach(function (p) {
  p.category = "nu";
});

// Sản phẩm mới cho Nam / Thể Thao / Trẻ Em (id 11 -> 22)
// Hãy thay link img bằng ảnh thật của bạn.
const newProducts = [
  // ----- NAM -----
  {
    id: 11,
    category: "nam",
    name: "Briefcase Nam",
    price: 6500000,
    img: "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    badge: "badge-new",
    description:
      "Cặp công sở nam thiết kế tối giản, ngăn đựng laptop riêng, phù hợp đi làm và đi họp.",
  },
  {
    id: 12,
    category: "nam",
    name: "Balo Laptop Nam",
    price: 3200000,
    img: "https://placehold.co/600x800/e8e8e8/333?text=Balo+Laptop+Nam",
    badge: "badge-sale",
    description:
      "Balo nam nhiều ngăn, chống thấm nước, vừa laptop 15 inch, tiện cho đi làm và đi học.",
  },
  {
    id: 13,
    category: "nam",
    name: "Túi Đeo Chéo Nam",
    price: 2800000,
    img: "https://placehold.co/600x800/e8e8e8/333?text=Tui+Deo+Cheo+Nam",
    badge: "badge-new",
    description:
      "Túi đeo chéo nam nhỏ gọn, phong cách hiện đại, đựng vừa điện thoại, ví và đồ cá nhân.",
  },
  {
    id: 14,
    category: "nam",
    name: "Ví Cầm Tay Nam",
    price: 1800000,
    img: "https://placehold.co/600x800/e8e8e8/333?text=Vi+Cam+Tay+Nam",
    badge: "none",
    description:
      "Ví cầm tay nam chất liệu da, thiết kế gọn gàng, nhiều ngăn đựng thẻ và tiền mặt.",
  },

  // ----- THỂ THAO -----
  {
    id: 15,
    category: "thethao",
    name: "Túi Trống Gym",
    price: 2200000,
    img: "https://placehold.co/600x800/dfe9f3/333?text=Tui+Trong+Gym",
    badge: "badge-sale",
    description:
      "Túi trống tập gym dung tích lớn, có ngăn đựng giày riêng, chất liệu bền và nhẹ.",
  },
  {
    id: 16,
    category: "thethao",
    name: "Balo Chạy Bộ",
    price: 1900000,
    img: "https://placehold.co/600x800/dfe9f3/333?text=Balo+Chay+Bo",
    badge: "badge-new",
    description:
      "Balo chạy bộ siêu nhẹ, thoáng khí, có túi đựng nước và dây đeo êm vai.",
  },
  {
    id: 17,
    category: "thethao",
    name: "Túi Đeo Hông",
    price: 950000,
    img: "https://placehold.co/600x800/dfe9f3/333?text=Tui+Deo+Hong",
    badge: "none",
    description:
      "Túi đeo hông thể thao nhỏ gọn, tiện mang điện thoại và chìa khóa khi chạy bộ, đạp xe.",
  },
  {
    id: 18,
    category: "thethao",
    name: "Túi Đựng Giày Thể Thao",
    price: 650000,
    img: "https://placehold.co/600x800/dfe9f3/333?text=Tui+Dung+Giay",
    badge: "badge-sale",
    description:
      "Túi đựng giày thông thoáng, chống mùi, dễ vệ sinh, phù hợp mang đi tập luyện.",
  },

  // ----- TRẺ EM -----
  {
    id: 19,
    category: "treem",
    name: "Balo Khủng Long Bé Trai",
    price: 1200000,
    img: "https://placehold.co/600x800/fde8ef/333?text=Balo+Khung+Long",
    badge: "badge-new",
    description:
      "Balo hình khủng long đáng yêu cho bé, nhẹ, dây đeo êm vai, an toàn cho trẻ em.",
  },
  {
    id: 20,
    category: "treem",
    name: "Balo Mẫu Giáo Công Chúa",
    price: 1150000,
    img: "https://placehold.co/600x800/fde8ef/333?text=Balo+Mau+Giao",
    badge: "badge-new",
    description:
      "Balo mẫu giáo màu sắc tươi sáng, kích thước nhỏ gọn vừa vặn với bé 3–6 tuổi.",
  },
  {
    id: 21,
    category: "treem",
    name: "Túi Đeo Chéo Mini Cho Bé",
    price: 750000,
    img: "https://placehold.co/600x800/fde8ef/333?text=Tui+Cheo+Mini",
    badge: "badge-sale",
    description:
      "Túi đeo chéo mini xinh xắn cho bé đựng đồ chơi nhỏ, khăn giấy và đồ dùng cá nhân.",
  },
  {
    id: 22,
    category: "treem",
    name: "Cặp Học Sinh Chống Gù",
    price: 1600000,
    img: "https://placehold.co/600x800/fde8ef/333?text=Cap+Hoc+Sinh",
    badge: "none",
    description:
      "Cặp học sinh thiết kế chống gù lưng, nhiều ngăn đựng sách vở, chất liệu chống thấm.",
  },
];

initialProducts.push(...newProducts);

// Chuyển giá sản phẩm thành số
function convertPrice(price) {
  if (price === null || price === undefined || String(price).trim() === "") {
    return NaN;
  }

  const numericPrice = Number(String(price).replace(/[^\d]/g, ""));
  return Number.isFinite(numericPrice) ? numericPrice : NaN;
}

// Lưu sản phẩm vào Local Storage
function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Lấy danh sách sản phẩm

function getProducts() {
  let products = [];

  try {
    products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    products = [];
  }

  return products.map(function (product) {
    const initialProduct = initialProducts.find(function (item) {
      return Number(item.id) === Number(product.id);
    });

    let price = convertPrice(product.price);

    if (!Number.isFinite(price) && initialProduct) {
      price = initialProduct.price;
    }

    return {
      ...product,
      price: price,
      category:
        product.category || (initialProduct ? initialProduct.category : "nu"),

      // Lấy mô tả theo ID sản phẩm
      description:
        product.description && product.description.trim() !== ""
          ? product.description
          : initialProduct
            ? initialProduct.description
            : "Chưa có mô tả sản phẩm.",
    };
  });
}

// Khởi tạo sản phẩm mẫu

const SEED_VERSION_KEY = "bags_style_seed_version";
const SEED_VERSION = "2";

function initializeProducts() {
  if (localStorage.getItem(STORAGE_KEY) === null) {
    saveProducts(initialProducts);
  } else {
    const products = getProducts();

    if (localStorage.getItem(SEED_VERSION_KEY) !== SEED_VERSION) {
      newProducts.forEach(function (np) {
        const exists = products.some(function (p) {
          return Number(p.id) === Number(np.id);
        });
        if (!exists) {
          products.push(np);
        }
      });
    }

    saveProducts(products);
  }

  localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
}

// Định dạng giá tiền
function formatPrice(price) {
  const numericPrice = convertPrice(price);

  if (!Number.isFinite(numericPrice)) {
    return "Chưa có giá";
  }

  return numericPrice.toLocaleString("vi-VN") + " $";
}

// Hiển thị danh sách sản phẩm
function renderProducts() {
  const productsList = document.getElementById("products-list");

  if (!productsList) {
    return;
  }

  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("filter-select");
  const resultCount = document.getElementById("result-count");

  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filter = filterSelect ? filterSelect.value : "all";

  let products = getProducts();

  // Tìm kiếm theo tên sản phẩm
  products = products.filter(function (product) {
    return String(product.name).toLowerCase().includes(keyword);
  });
  // Lọc theo danh mục đang chọn trên menu
  const activeCategory = getActiveCategory();
  products = products.filter(function (product) {
    return product.category === activeCategory;
  });
  // Lọc sản phẩm theo nhãn
  if (filter === "none") {
    products = products.filter(function (product) {
      return !product.badge || product.badge === "none";
    });
  } else if (filter !== "all") {
    products = products.filter(function (product) {
      return product.badge === filter;
    });
  }

  productsList.innerHTML = "";

  if (resultCount) {
    resultCount.textContent = "Tìm thấy " + products.length + " sản phẩm";
  }

  if (products.length === 0) {
    productsList.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
    return;
  }

  products.forEach(function (product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Hiển thị nhãn sản phẩm
    if (product.badge && product.badge !== "none") {
      const badge = document.createElement("b");
      badge.className = product.badge;
      badge.textContent = product.badge === "badge-new" ? "MỚI" : "SALE";
      card.appendChild(badge);
    }

    // Hình ảnh sản phẩm
    const img = document.createElement("img");
    img.src = product.img;
    img.alt = product.name;
    img.loading = "lazy";
    card.appendChild(img);

    // Tên sản phẩm
    const name = document.createElement("p");
    name.className = "product-name";
    name.textContent = product.name;
    card.appendChild(name);

    // Giá sản phẩm
    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);
    card.appendChild(price);

    // Hai nút chức năng
    const actions = document.createElement("div");
    actions.className = "product-actions";

    // Nút MUA NGAY
    const buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.className = "btn-buy";
    buyButton.textContent = "MUA NGAY";

    // MUA NGAY: thêm vào giỏ rồi chuyển đến trang giỏ hàng
    buyButton.addEventListener("click", function () {
      addToCart(product.id);
      window.location.href = "cart.html";
    });

    // Nút THÊM GIỎ
    const cartButton = document.createElement("button");
    cartButton.type = "button";
    cartButton.className = "btn-cart";
    cartButton.textContent = "THÊM GIỎ";

    cartButton.addEventListener("click", function () {
      addToCart(product.id);
    });

    actions.appendChild(buyButton);
    actions.appendChild(cartButton);
    card.appendChild(actions);

    // Nút XEM CHI TIẾT
    const detailButton = document.createElement("button");
    detailButton.type = "button";
    detailButton.className = "btn-details";
    detailButton.textContent = "XEM CHI TIẾT";

    detailButton.addEventListener("click", function () {
      window.location.href = "chitiet.html?id=" + product.id;
    });

    card.appendChild(detailButton);

    productsList.appendChild(card);
  });
}

// Thêm sản phẩm vào giỏ hàng
// Không hiển thị thông báo
function addToCart(id) {
  const product = getProducts().find(function (item) {
    return Number(item.id) === Number(id);
  });

  if (!product) {
    return;
  }

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    cart = [];
  }

  const existingProduct = cart.find(function (item) {
    return Number(item.id) === Number(id);
  });

  if (existingProduct) {
    existingProduct.quantity = Number(existingProduct.quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Thêm sản phẩm mới
const addForm = document.getElementById("add-form");

if (addForm) {
  addForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const products = getProducts();

    const newProduct = {
      id: Date.now(),
      name: document.getElementById("product-name").value.trim(),
      price: convertPrice(document.getElementById("product-price").value),
      img: document.getElementById("product-img").value.trim(),
      description: document.getElementById("product-description").value.trim(),
      badge: document.getElementById("product-badge").value,
      category: document.getElementById("product-category").value,
    };

    if (
      !newProduct.name ||
      !Number.isFinite(newProduct.price) ||
      !newProduct.img ||
      !newProduct.description
    ) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin sản phẩm.");
      return;
    }

    products.push(newProduct);
    saveProducts(products);
    localStorage.setItem(MENU_KEY, newProduct.category);
    alert("Thêm sản phẩm thành công!");
    window.location.href = "sanpham.html";
  });
}

// Tải danh sách sản phẩm vào trang sửa
function loadEditProducts() {
  const selector = document.getElementById("edit-selector");

  if (!selector) {
    return;
  }

  selector.innerHTML = "";

  getProducts().forEach(function (product) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    selector.appendChild(option);
  });

  fillEditForm();
}

// Hiển thị thông tin sản phẩm cần sửa
function fillEditForm() {
  const selector = document.getElementById("edit-selector");

  if (!selector || !selector.value) {
    return;
  }

  const product = getProducts().find(function (item) {
    return String(item.id) === selector.value;
  });

  if (!product) {
    return;
  }

  document.getElementById("edit-name").value = product.name;
  document.getElementById("edit-price").value = product.price;
  document.getElementById("edit-img").value = product.img;
  document.getElementById("edit-description").value = product.description || "";
  document.getElementById("edit-badge").value = product.badge || "none";
  document.getElementById("edit-category").value = product.category || "nu";
}

const editSelector = document.getElementById("edit-selector");

if (editSelector) {
  loadEditProducts();
  editSelector.addEventListener("change", fillEditForm);
}

// Lưu thông tin sau khi sửa
const editForm = document.getElementById("edit-form");

if (editForm) {
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = Number(document.getElementById("edit-selector").value);
    const products = getProducts();

    const index = products.findIndex(function (item) {
      return Number(item.id) === id;
    });

    if (index === -1) {
      alert("Không tìm thấy sản phẩm cần sửa.");
      return;
    }

    const newName = document.getElementById("edit-name").value.trim();
    const newPrice = convertPrice(document.getElementById("edit-price").value);
    const newImage = document.getElementById("edit-img").value.trim();
    const newDescription = document
      .getElementById("edit-description")
      .value.trim();

    if (
      !newName ||
      !Number.isFinite(newPrice) ||
      !newImage ||
      !newDescription
    ) {
      alert("Vui lòng nhập đầy đủ và chính xác thông tin sản phẩm.");
      return;
    }

    products[index].name = newName;
    products[index].price = newPrice;
    products[index].img = newImage;
    products[index].description = newDescription;
    products[index].badge = document.getElementById("edit-badge").value;
    products[index].category = document.getElementById("edit-category").value;

    saveProducts(products);

    localStorage.setItem(MENU_KEY, products[index].category);
    alert("Cập nhật sản phẩm thành công!");
    window.location.href = "sanpham.html";
  });
}

// Tải danh sách sản phẩm vào trang xóa
function loadDeleteProducts() {
  const selector = document.getElementById("delete-selector");

  if (!selector) {
    return;
  }

  selector.innerHTML = "";

  getProducts().forEach(function (product) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    selector.appendChild(option);
  });
}

const deleteSelector = document.getElementById("delete-selector");

if (deleteSelector) {
  loadDeleteProducts();
}

// Xóa sản phẩm
const deleteForm = document.getElementById("delete-form");

if (deleteForm) {
  deleteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = Number(document.getElementById("delete-selector").value);
    const products = getProducts();

    const product = products.find(function (item) {
      return Number(item.id) === id;
    });

    if (!product) {
      alert("Không tìm thấy sản phẩm cần xóa.");
      return;
    }

    const confirmed = confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm " + product.name + " không?",
    );

    if (!confirmed) {
      return;
    }

    const updatedProducts = products.filter(function (item) {
      return Number(item.id) !== id;
    });

    saveProducts(updatedProducts);

    alert("Xóa sản phẩm thành công!");
    window.location.href = "sanpham.html";
  });
}

// Tìm kiếm sản phẩm
const searchInput = document.getElementById("search-input");

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}

// Lọc sản phẩm
const filterSelect = document.getElementById("filter-select");

if (filterSelect) {
  filterSelect.addEventListener("change", renderProducts);
}

// Hiển thị trang chi tiết sản phẩm
function renderProductDetail() {
  const detailContainer = document.getElementById("product-detail");

  if (!detailContainer) {
    return;
  }

  // Lấy ID sản phẩm từ đường dẫn
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // Tìm sản phẩm theo ID
  const product = getProducts().find(function (item) {
    return String(item.id) === String(id);
  });

  if (!product) {
    detailContainer.innerHTML = "<h2>Không tìm thấy sản phẩm!</h2>";
    return;
  }

  // Hiển thị thông tin sản phẩm
  detailContainer.innerHTML = `
        <div class="detail-page-image">
            <img src="${product.img}" alt="${product.name}">
        </div>

        <div class="detail-page-info">
            <h1>${product.name}</h1>

            <p class="detail-page-price">
                ${formatPrice(product.price)}
            </p>

            <p class="detail-page-badge">
                ${
                  product.badge === "badge-new"
                    ? "SẢN PHẨM MỚI"
                    : product.badge === "badge-sale"
                      ? "SẢN PHẨM GIẢM GIÁ"
                      : "SẢN PHẨM"
                }
            </p>

            <div class="detail-page-description">
                <h3>Mô tả sản phẩm</h3>
                <p></p>
            </div>

            <button type="button" class="detail-page-buy">
                MUA NGAY
            </button>

            <a href="sanpham.html" class="detail-page-back">
                Quay lại cửa hàng
            </a>
        </div>
    `;

  // Hiển thị mô tả sản phẩm
  const descriptionElement = detailContainer.querySelector(
    ".detail-page-description p",
  );

  descriptionElement.textContent = product.description;
  // Nút MUA NGAY chưa gắn chức năng mua hàng.
}

// Khởi chạy chương trình
initializeProducts();
renderProducts();
renderProductDetail();
