function showForm(formName) {
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById(formName).style.display = "block";
    document.getElementById("message").textContent = "";
}

function showFormFromLink() {
    if (window.location.hash === "#register") {
        showForm("register");
    } else {
        showForm("login");
    }
}

showFormFromLink();
window.addEventListener("hashchange", showFormFromLink);

function saveCustomerProfile(name, email) {
    const saved = JSON.parse(localStorage.getItem("bags_style_customer") || "null");
    const customer = {
        name: name,
        email: email,
        phone: saved && saved.email === email ? saved.phone || "" : "",
        address: saved && saved.email === email ? saved.address || "" : "",
    };
    localStorage.setItem("bags_style_customer", JSON.stringify(customer));
}

function register() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let pass = document.getElementById("regPass").value;

    if (name === "" || email === "" || pass === "") {
        document.getElementById("message").textContent =
            "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("message").textContent =
            "Email không hợp lệ!";
        return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pass", pass);
    saveCustomerProfile(name, email);
    alert("Đăng ký thành công!");
    document.getElementById("loginName").value = name;
    document.getElementById("loginPass").value = "";
    showForm("login");
}

function login() {
    let name = document.getElementById("loginName").value.trim();
    let pass = document.getElementById("loginPass").value;
    let savedName = localStorage.getItem("name");
    let savedPass = localStorage.getItem("pass");

    if (name === "" || pass === "") {
        document.getElementById("message").textContent =
            "Vui lòng nhập đầy đủ thông tin!";
        return;
    }
    if (name === savedName && pass === savedPass) {
        saveCustomerProfile(savedName, localStorage.getItem("email") || "");
        alert("Đăng nhập thành công!");
        window.location.href = "customer.html";
    } else {
        document.getElementById("message").textContent =
            "Tên người dùng hoặc mật khẩu không chính xác!";
    }
}