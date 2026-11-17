(function () {
    "use strict";
 
    const ORDERS_KEY = "bags_style_orders";
    const CUSTOMER_KEY = "bags_style_customer";
    const SHIPPING_FEE = 0; // Phí vận chuyển ($). Đổi số này nếu muốn tính phí.
    const MAX_QTY = 99;
 
    /* ---------- CẤU HÌNH GỬI EMAIL (EmailJS) ----------
       1. Đăng ký miễn phí tại https://www.emailjs.com
       2. Tạo Email Service -> lấy Service ID
       3. Tạo Email Template -> lấy Template ID
       4. Account -> lấy Public Key
       5. Dán 3 giá trị vào bên dưới.
       Template cần các biến: {{to_email}}, {{to_name}}, {{order_id}},
       {{order_date}}, {{order_items}}, {{subtotal}}, {{shipping}},
       {{order_total}}, {{phone}}, {{address}}, {{payment_method}}, {{note}}
       Ô "To email" của template để là {{to_email}}.
    ---------------------------------------------------- */
    const EMAIL_CONFIG = {
        serviceId: "YOUR_SERVICE_ID",
        templateId: "YOUR_TEMPLATE_ID",
        publicKey: "YOUR_PUBLIC_KEY"
    };
 
    const PAYMENT_NAMES = {
        cod: "Thanh toán khi nhận hàng (COD)",
        bank: "Chuyển khoản ngân hàng"
    };
 
    /* ---------- Hàm tiện ích ---------- */
    function $(id) {
        return document.getElementById(id);
    }
 
    function read(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value === null || value === undefined ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }
 
    function write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
 
    function esc(text) {
        return String(text === null || text === undefined ? "" : text)
            .replace(/[&<>"']/g, function (c) {
                return {
                    "&": "&amp;", "<": "&lt;", ">": "&gt;",
                    '"': "&quot;", "'": "&#39;"
                }[c];
            });
    }
 
    function money(value) {
        return (Number(value) || 0).toLocaleString("vi-VN") + " $";
    }
 
    function dateText(iso) {
        return new Date(iso).toLocaleString("vi-VN");
    }
 
    function toast(message) {
        let box = $("toast");
 
        if (!box) {
            box = document.createElement("div");
            box.id = "toast";
            box.className = "toast";
            document.body.appendChild(box);
        }
 
        box.textContent = message;
        box.classList.add("show");
 
        clearTimeout(toast.timer);
        toast.timer = setTimeout(function () {
            box.classList.remove("show");
        }, 2000);
    }
 
    /* ---------- Giỏ hàng ---------- */
    function getCart() {
        return read(CART_KEY, []).map(function (item) {
            return {
                id: item.id,
                name: item.name,
                price: Number(item.price) || 0,
                img: item.img,
                quantity: Math.min(MAX_QTY,
                    Math.max(1, Math.floor(Number(item.quantity) || 1)))
            };
        });
    }
 
    function saveCart(cart) {
        write(CART_KEY, cart);
        updateBadge();
    }
 
    // Đồng bộ giỏ hàng với danh sách sản phẩm hiện tại
    // (giá/tên mới nhất, bỏ sản phẩm đã bị xóa khỏi cửa hàng)
    function syncCart() {
        const products = getProducts();
 
        const cart = getCart()
            .filter(function (item) {
                return products.some(function (p) {
                    return Number(p.id) === Number(item.id);
                });
            })
            .map(function (item) {
                const p = products.find(function (x) {
                    return Number(x.id) === Number(item.id);
                });
 
                return {
                    id: item.id,
                    name: p.name,
                    price: Number(p.price) || 0,
                    img: p.img,
                    quantity: item.quantity
                };
            });
 
        saveCart(cart);
        return cart;
    }
 
    function calcTotals(cart) {
        const subtotal = cart.reduce(function (sum, item) {
            return sum + item.price * item.quantity;
        }, 0);
 
        const shipping = cart.length ? SHIPPING_FEE : 0;
 
        return { subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
    }
 
    function updateBadge() {
        const count = getCart().reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);
 
        document.querySelectorAll("[data-cart-count]").forEach(function (el) {
            el.textContent = count;
            el.style.display = count > 0 ? "inline-block" : "none";
        });
    }
 
    /* ---------- Thanh điều hướng chung ---------- */
    function injectNav() {
        const header = document.querySelector(".main-header");
 
        if (!header || header.querySelector("[data-shop-nav]")) {
            return;
        }
 
        let nav = header.querySelector("nav");
 
        if (!nav) {
            nav = document.createElement("nav");
            const adminLink = header.querySelector(".admin-link");
 
            if (adminLink) {
                header.insertBefore(nav, adminLink);
            } else {
                header.appendChild(nav);
            }
        }
 
        nav.setAttribute("data-shop-nav", "1");
        nav.classList.add("shop-nav");
 
        if (!nav.querySelector('a[href="sanpham.html"]')) {
            nav.insertAdjacentHTML("beforeend",
                '<a href="sanpham.html">Cửa hàng</a>');
        }
 
        nav.insertAdjacentHTML("beforeend",
            '<a href="cart.html">Giỏ hàng <span class="cart-badge" ' +
            'data-cart-count>0</span></a>' +
            '<a href="customer.html">Khách hàng</a>');
    }
 
    /* ---------- Nút trên trang cửa hàng / chi tiết ---------- */
    function initProductButtons() {
        // Thông báo khi bấm THÊM GIỎ (project.js đã xử lý thêm vào giỏ)
        document.addEventListener("click", function (event) {
            if (event.target.closest(".btn-cart")) {
                updateBadge();
                toast("Đã thêm sản phẩm vào giỏ hàng");
            }
        });
 
        // Trang chi tiết: thêm nút THÊM VÀO GIỎ + xử lý MUA NGAY
        const buyButton = document.querySelector(".detail-page-buy");
 
        if (!buyButton) {
            return;
        }
 
        const id = new URLSearchParams(window.location.search).get("id");
 
        const cartButton = document.createElement("button");
        cartButton.type = "button";
        cartButton.className = "detail-page-cart";
        cartButton.textContent = "THÊM VÀO GIỎ HÀNG";
        buyButton.parentNode.insertBefore(cartButton, buyButton);
 
        cartButton.addEventListener("click", function () {
            addToCart(id);
            updateBadge();
            toast("Đã thêm sản phẩm vào giỏ hàng");
        });
 
        buyButton.addEventListener("click", function () {
            addToCart(id);
            window.location.href = "checkout.html";
        });
    }
 
    /* ---------- Trang giỏ hàng (cart.html) ---------- */
    function renderCart() {
        const root = $("cart-root");
 
        if (!root) {
            return;
        }
 
        const cart = syncCart();
 
        if (cart.length === 0) {
            root.innerHTML =
                '<div class="empty-box">' +
                '<h2>Giỏ hàng của bạn đang trống</h2>' +
                '<p>Hãy chọn những chiếc túi bạn yêu thích nhé!</p>' +
                '<a href="sanpham.html" class="nut-chinh btn-link">' +
                'TIẾP TỤC MUA SẮM</a></div>';
            return;
        }
 
        const totals = calcTotals(cart);
 
        const rows = cart.map(function (item) {
            return '<div class="cart-item" data-id="' + esc(item.id) + '">' +
                '<img src="' + esc(item.img) + '" alt="' + esc(item.name) + '">' +
                '<div class="cart-item-info">' +
                '<p class="cart-item-name">' + esc(item.name) + '</p>' +
                '<p class="cart-item-price">' + money(item.price) + '</p>' +
                '</div>' +
                '<div class="qty-control">' +
                '<button type="button" data-action="dec" aria-label="Giảm">−</button>' +
                '<input type="number" min="1" max="' + MAX_QTY + '" value="' +
                item.quantity + '" data-action="qty" aria-label="Số lượng">' +
                '<button type="button" data-action="inc" aria-label="Tăng">+</button>' +
                '</div>' +
                '<p class="cart-item-total">' + money(item.price * item.quantity) + '</p>' +
                '<button type="button" class="btn-remove" data-action="remove">Xóa</button>' +
                '</div>';
        }).join("");
 
        root.innerHTML =
            '<div class="cart-layout">' +
            '<div class="cart-items">' + rows +
            '<button type="button" class="btn-clear" data-action="clear">' +
            'Xóa toàn bộ giỏ hàng</button></div>' +
            '<aside class="cart-summary">' +
            '<h2>Tóm tắt đơn hàng</h2>' +
            '<div class="sum-row"><span>Tạm tính</span><b>' +
            money(totals.subtotal) + '</b></div>' +
            '<div class="sum-row"><span>Phí vận chuyển</span><b>' +
            (totals.shipping ? money(totals.shipping) : "Miễn phí") + '</b></div>' +
            '<div class="sum-row sum-total"><span>Tổng thanh toán</span><b>' +
            money(totals.total) + '</b></div>' +
            '<a href="checkout.html" class="nut-chinh btn-link">ĐẶT HÀNG</a>' +
            '<a href="sanpham.html" class="link-back">← Tiếp tục mua sắm</a>' +
            '</aside></div>';
    }
 
    function setQuantity(id, quantity) {
        const cart = getCart();
        const item = cart.find(function (x) {
            return String(x.id) === String(id);
        });
 
        if (!item) {
            return;
        }
 
        item.quantity = Math.min(MAX_QTY, Math.max(1, Math.floor(quantity) || 1));
        saveCart(cart);
        renderCart();
    }
 
    function initCartPage() {
        const root = $("cart-root");
 
        if (!root) {
            return;
        }
 
        renderCart();
 
        root.addEventListener("click", function (event) {
            const button = event.target.closest("[data-action]");
 
            if (!button) {
                return;
            }
 
            const action = button.dataset.action;
 
            if (action === "clear") {
                if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
                    saveCart([]);
                    renderCart();
                }
                return;
            }
 
            const row = button.closest(".cart-item");
 
            if (!row) {
                return;
            }
 
            const id = row.dataset.id;
            const item = getCart().find(function (x) {
                return String(x.id) === String(id);
            });
 
            if (!item) {
                return;
            }
 
            if (action === "inc") {
                setQuantity(id, item.quantity + 1);
            } else if (action === "dec") {
                if (item.quantity > 1) {
                    setQuantity(id, item.quantity - 1);
                }
            } else if (action === "remove") {
                if (confirm("Xóa \"" + item.name + "\" khỏi giỏ hàng?")) {
                    saveCart(getCart().filter(function (x) {
                        return String(x.id) !== String(id);
                    }));
                    renderCart();
                }
            }
        });
 
        root.addEventListener("change", function (event) {
            if (event.target.dataset.action === "qty") {
                const row = event.target.closest(".cart-item");
                setQuantity(row.dataset.id, Number(event.target.value));
            }
        });
    }
 
    /* ---------- Thông tin khách hàng ---------- */
    function getCustomer() {
        return read(CUSTOMER_KEY, null);
    }
 
    function validateCustomer(c) {
        if (!c.name || c.name.length < 2) {
            return "Vui lòng nhập họ tên.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) {
            return "Email không hợp lệ.";
        }
        if (!/^(0|\+84)\d{9,10}$/.test(c.phone.replace(/[\s.-]/g, ""))) {
            return "Số điện thoại không hợp lệ (ví dụ: 0901234567).";
        }
        if (!c.address || c.address.length < 8) {
            return "Vui lòng nhập địa chỉ giao hàng đầy đủ.";
        }
        return "";
    }
 
    /* ---------- Đơn hàng ---------- */
    function getOrders() {
        return read(ORDERS_KEY, []);
    }
 
    function saveOrders(orders) {
        write(ORDERS_KEY, orders);
    }
 
    function orderItemsText(order) {
        return order.items.map(function (item, i) {
            return (i + 1) + ". " + item.name + " x " + item.quantity +
                " = " + money(item.price * item.quantity);
        }).join("\n");
    }
 
    function orderToText(order) {
        return "Xin chào " + order.customer.name + ",\n\n" +
            "Cảm ơn bạn đã đặt hàng tại BAGS STYLE 2026.\n\n" +
            "Mã đơn hàng: " + order.id + "\n" +
            "Ngày đặt: " + dateText(order.createdAt) + "\n\n" +
            "SẢN PHẨM:\n" + orderItemsText(order) + "\n\n" +
            "Tạm tính: " + money(order.subtotal) + "\n" +
            "Phí vận chuyển: " + (order.shipping ? money(order.shipping) : "Miễn phí") + "\n" +
            "TỔNG THANH TOÁN: " + money(order.total) + "\n\n" +
            "Thanh toán: " + PAYMENT_NAMES[order.payment] + "\n" +
            "Người nhận: " + order.customer.name + " - " + order.customer.phone + "\n" +
            "Địa chỉ: " + order.customer.address + "\n" +
            (order.note ? "Ghi chú: " + order.note + "\n" : "") +
            "\nBAGS STYLE 2026 xin chân thành cảm ơn!";
    }
 
    function emailReady() {
        return ![EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId,
            EMAIL_CONFIG.publicKey].some(function (v) {
            return !v || v.indexOf("YOUR_") === 0;
        });
    }
 
    // Trả về: "sent" | "failed" | "not_configured"
    async function sendOrderEmail(order) {
        if (!emailReady()) {
            return "not_configured";
        }
 
        try {
            const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    service_id: EMAIL_CONFIG.serviceId,
                    template_id: EMAIL_CONFIG.templateId,
                    user_id: EMAIL_CONFIG.publicKey,
                    template_params: {
                        to_email: order.customer.email,
                        to_name: order.customer.name,
                        order_id: order.id,
                        order_date: dateText(order.createdAt),
                        order_items: orderItemsText(order),
                        subtotal: money(order.subtotal),
                        shipping: order.shipping ? money(order.shipping) : "Miễn phí",
                        order_total: money(order.total),
                        phone: order.customer.phone,
                        address: order.customer.address,
                        payment_method: PAYMENT_NAMES[order.payment],
                        note: order.note || "Không có"
                    }
                })
            });
 
            return response.ok ? "sent" : "failed";
        } catch (error) {
            return "failed";
        }
    }
 
    function updateOrder(order) {
        const orders = getOrders().map(function (o) {
            return o.id === order.id ? order : o;
        });
        saveOrders(orders);
    }
 
    function makeOrderId() {
        const d = new Date();
        const pad = function (n) { return String(n).padStart(2, "0"); };
 
        return "DH" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
            "-" + Math.floor(1000 + Math.random() * 9000);
    }
 
    /* ---------- Trang thanh toán (checkout.html) ---------- */
    function initCheckoutPage() {
        const form = $("checkout-form");
 
        if (!form) {
            return;
        }
 
        const cart = syncCart();
        const wrapper = $("checkout-wrapper");
 
        if (cart.length === 0) {
            wrapper.innerHTML =
                '<div class="empty-box"><h2>Giỏ hàng trống</h2>' +
                '<p>Bạn cần thêm sản phẩm trước khi đặt hàng.</p>' +
                '<a href="sanpham.html" class="nut-chinh btn-link">' +
                'ĐI ĐẾN CỬA HÀNG</a></div>';
            return;
        }
 
        // Điền sẵn thông tin khách hàng đã lưu
        const saved = getCustomer();
 
        if (saved) {
            $("c-name").value = saved.name || "";
            $("c-email").value = saved.email || "";
            $("c-phone").value = saved.phone || "";
            $("c-address").value = saved.address || "";
        }
 
        // Tóm tắt đơn hàng
        const totals = calcTotals(cart);
 
        $("checkout-summary").innerHTML =
            '<h2>Đơn hàng của bạn</h2>' +
            cart.map(function (item) {
                return '<div class="mini-item">' +
                    '<img src="' + esc(item.img) + '" alt="">' +
                    '<div><p class="mini-name">' + esc(item.name) + '</p>' +
                    '<p class="mini-qty">SL: ' + item.quantity + ' × ' +
                    money(item.price) + '</p></div>' +
                    '<b>' + money(item.price * item.quantity) + '</b></div>';
            }).join("") +
            '<div class="sum-row"><span>Tạm tính</span><b>' +
            money(totals.subtotal) + '</b></div>' +
            '<div class="sum-row"><span>Phí vận chuyển</span><b>' +
            (totals.shipping ? money(totals.shipping) : "Miễn phí") + '</b></div>' +
            '<div class="sum-row sum-total"><span>Tổng thanh toán</span><b>' +
            money(totals.total) + '</b></div>' +
            '<a href="cart.html" class="link-back">← Quay lại giỏ hàng</a>';
 
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
 
            const customer = {
                name: $("c-name").value.trim(),
                email: $("c-email").value.trim(),
                phone: $("c-phone").value.trim(),
                address: $("c-address").value.trim()
            };
 
            const error = validateCustomer(customer);
 
            if (error) {
                alert(error);
                return;
            }
 
            const currentCart = syncCart();
 
            if (currentCart.length === 0) {
                alert("Giỏ hàng đã trống.");
                window.location.href = "cart.html";
                return;
            }
 
            const currentTotals = calcTotals(currentCart);
            const paymentInput = form.querySelector('input[name="payment"]:checked');
 
            const order = {
                id: makeOrderId(),
                createdAt: new Date().toISOString(),
                customer: customer,
                items: currentCart,
                subtotal: currentTotals.subtotal,
                shipping: currentTotals.shipping,
                total: currentTotals.total,
                payment: paymentInput ? paymentInput.value : "cod",
                note: $("c-note").value.trim(),
                status: "Chờ xử lý",
                emailStatus: "pending"
            };
 
            const submitButton = form.querySelector("button[type=submit]");
            submitButton.disabled = true;
            submitButton.textContent = "ĐANG XỬ LÝ...";
 
            if ($("c-save").checked) {
                write(CUSTOMER_KEY, customer);
            }
 
            order.emailStatus = await sendOrderEmail(order);
 
            const orders = getOrders();
            orders.unshift(order);
            saveOrders(orders);
            saveCart([]);
 
            window.location.href = "order-success.html?id=" +
                encodeURIComponent(order.id);
        });
    }
 
    /* ---------- Trang xác nhận đơn hàng (order-success.html) ---------- */
    function emailStatusHtml(order) {
        if (order.emailStatus === "sent") {
            return '<div class="notice ok">✔ Đã gửi thông tin đơn hàng đến email <b>' +
                esc(order.customer.email) + '</b>.</div>';
        }
 
        if (order.emailStatus === "failed") {
            return '<div class="notice error">Không gửi được email tự động. ' +
                '<button type="button" id="resend-email" class="link-button">' +
                'Thử gửi lại</button></div>';
        }
 
        // Chưa cấu hình EmailJS: không hiển thị thông báo
        return "";
    }
 
    function orderDetailHtml(order) {
        return '<div class="order-grid">' +
            '<div class="info-box"><h3>Thông tin khách hàng</h3>' +
            '<p><b>Họ tên:</b> ' + esc(order.customer.name) + '</p>' +
            '<p><b>Email:</b> ' + esc(order.customer.email) + '</p>' +
            '<p><b>Điện thoại:</b> ' + esc(order.customer.phone) + '</p>' +
            '<p><b>Địa chỉ:</b> ' + esc(order.customer.address) + '</p>' +
            (order.note ? '<p><b>Ghi chú:</b> ' + esc(order.note) + '</p>' : '') +
            '</div>' +
            '<div class="info-box"><h3>Thông tin đơn hàng</h3>' +
            '<p><b>Mã đơn:</b> ' + esc(order.id) + '</p>' +
            '<p><b>Ngày đặt:</b> ' + dateText(order.createdAt) + '</p>' +
            '<p><b>Thanh toán:</b> ' + esc(PAYMENT_NAMES[order.payment] || order.payment) + '</p>' +
            '<p><b>Trạng thái:</b> <span class="status status-' +
            (order.status === "Đã hủy" ? "cancel" : "wait") + '">' +
            esc(order.status) + '</span></p></div></div>' +
            '<table class="order-table"><thead><tr><th>Sản phẩm</th>' +
            '<th>Đơn giá</th><th>SL</th><th>Thành tiền</th></tr></thead><tbody>' +
            order.items.map(function (item) {
                return '<tr><td data-label="Sản phẩm"><div class="order-product">' +
                    '<img src="' + esc(item.img) + '" alt=""><span>' +
                    esc(item.name) + '</span></div></td>' +
                    '<td data-label="Đơn giá">' + money(item.price) + '</td>' +
                    '<td data-label="SL">' + item.quantity + '</td>' +
                    '<td data-label="Thành tiền">' + money(item.price * item.quantity) + '</td></tr>';
            }).join("") + '</tbody></table>' +
            '<div class="order-totals">' +
            '<div class="sum-row"><span>Tạm tính</span><b>' + money(order.subtotal) + '</b></div>' +
            '<div class="sum-row"><span>Phí vận chuyển</span><b>' +
            (order.shipping ? money(order.shipping) : "Miễn phí") + '</b></div>' +
            '<div class="sum-row sum-total"><span>Tổng thanh toán</span><b>' +
            money(order.total) + '</b></div></div>';
    }
 
    function initSuccessPage() {
        const root = $("success-root");
 
        if (!root) {
            return;
        }
 
        const id = new URLSearchParams(window.location.search).get("id");
        const order = getOrders().find(function (o) {
            return o.id === id;
        });
 
        if (!order) {
            root.innerHTML =
                '<div class="empty-box"><h2>Không tìm thấy đơn hàng</h2>' +
                '<a href="sanpham.html" class="nut-chinh btn-link">VỀ CỬA HÀNG</a></div>';
            return;
        }
 
        function draw() {
            root.innerHTML =
                '<div class="success-head"><div class="tick">✔</div>' +
                '<h2>Đặt hàng thành công!</h2>' +
                '<p>Cảm ơn <b>' + esc(order.customer.name) +
                '</b>, đơn hàng của bạn đã được ghi nhận.</p></div>' +
                emailStatusHtml(order) +
                orderDetailHtml(order) +
                '<div class="action-row">' +
                '<a href="sanpham.html" class="nut-chinh btn-link">TIẾP TỤC MUA SẮM</a>' +
                '<a href="customer.html" class="btn-outline">XEM ĐƠN HÀNG CỦA TÔI</a></div>';
 
            const resend = $("resend-email");
 
            if (resend) {
                resend.addEventListener("click", async function () {
                    resend.disabled = true;
                    resend.textContent = "đang gửi...";
                    order.emailStatus = await sendOrderEmail(order);
                    updateOrder(order);
                    draw();
                });
            }
        }
 
        draw();
    }
 
    /* ---------- Trang khách hàng (customer.html) ---------- */
    function renderOrderHistory() {
        const box = $("order-history");
 
        if (!box) {
            return;
        }
 
        const orders = getOrders();
 
        if (orders.length === 0) {
            box.innerHTML = '<p class="muted">Bạn chưa có đơn hàng nào.</p>';
            return;
        }
 
        box.innerHTML = orders.map(function (order) {
            const cancelled = order.status === "Đã hủy";
 
            return '<div class="history-item" data-id="' + esc(order.id) + '">' +
                '<div><p class="history-id">' + esc(order.id) + '</p>' +
                '<p class="muted">' + dateText(order.createdAt) + ' · ' +
                order.items.length + ' sản phẩm</p></div>' +
                '<div class="history-right"><b>' + money(order.total) + '</b>' +
                '<span class="status status-' + (cancelled ? "cancel" : "wait") + '">' +
                esc(order.status) + '</span></div>' +
                '<div class="history-actions">' +
                '<a href="order-success.html?id=' + encodeURIComponent(order.id) +
                '" class="btn-small">Xem</a>' +
                (cancelled ? '' :
                    '<button type="button" class="btn-small btn-danger" ' +
                    'data-action="cancel">Hủy đơn</button>') +
                '</div></div>';
        }).join("");
    }
 
    function initCustomerPage() {
        const form = $("customer-form");
 
        if (!form) {
            return;
        }
 
        const saved = getCustomer();
 
        if (saved) {
            $("c-name").value = saved.name || "";
            $("c-email").value = saved.email || "";
            $("c-phone").value = saved.phone || "";
            $("c-address").value = saved.address || "";
        }
 
        form.addEventListener("submit", function (event) {
            event.preventDefault();
 
            const customer = {
                name: $("c-name").value.trim(),
                email: $("c-email").value.trim(),
                phone: $("c-phone").value.trim(),
                address: $("c-address").value.trim()
            };
 
            const error = validateCustomer(customer);
 
            if (error) {
                alert(error);
                return;
            }
 
            write(CUSTOMER_KEY, customer);
            toast("Đã lưu thông tin khách hàng");
        });
 
        $("delete-customer").addEventListener("click", function () {
            if (confirm("Xóa thông tin khách hàng đã lưu trên thiết bị này?")) {
                localStorage.removeItem(CUSTOMER_KEY);
                form.reset();
                toast("Đã xóa thông tin khách hàng");
            }
        });
 
        renderOrderHistory();
 
        $("order-history").addEventListener("click", function (event) {
            const button = event.target.closest('[data-action="cancel"]');
 
            if (!button) {
                return;
            }
 
            const id = button.closest(".history-item").dataset.id;
 
            if (!confirm("Bạn có chắc muốn hủy đơn hàng " + id + "?")) {
                return;
            }
 
            const orders = getOrders();
            const order = orders.find(function (o) {
                return o.id === id;
            });
 
            if (order) {
                order.status = "Đã hủy";
                saveOrders(orders);
                renderOrderHistory();
                toast("Đã hủy đơn hàng");
            }
        });
    }
 
    /* ---------- Khởi chạy ---------- */
    injectNav();
    updateBadge();
    initProductButtons();
    initCartPage();
    initCheckoutPage();
    initSuccessPage();
    initCustomerPage();
})();
