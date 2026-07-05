/* ===========================
   CURONEX COMMON UTILITIES
=========================== */

const ROUTES = {

    HOME:
    "../../User/Homepage_Gowri M/homepage.html",

    LOGIN:
    "../Login_Kaushik/login.html",

    REGISTER:
    "../Register_Kaushik/register.html",

    PROFILE:
    "../../User/Profile Management/profile.html",

    APPOINTMENT_SEARCH:
    "../../User/Appointment/Appointment_Search_Page_Radha/appointment_search.html"

};

// Session Keys
const SESSION_KEYS = {
    LOGGED_IN: "curonex_logged_in",
    USERNAME: "curonex_username",
    ROLE: "curonex_role"
};

// Login
function loginUser(username, role = "user") {
    sessionStorage.setItem(SESSION_KEYS.LOGGED_IN, "true");
    sessionStorage.setItem(SESSION_KEYS.USERNAME, username);
    sessionStorage.setItem(SESSION_KEYS.ROLE, role);
}

// Logout
function logoutUser() {
    sessionStorage.clear();
    window.location.href = "User\Homepage_ Gowri Manogari\homepage.html";
}

// Check Login
function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEYS.LOGGED_IN) === "true";
}

// Protect Pages
function requireLogin() {
    if (!isLoggedIn()) {
        alert("Please login first.");
        window.location.href = "User\Homepage_ Gowri Manogari\homepage.html";
    }
}

// Go to Profile
function goToProfile() {
    window.location.href =
        "User\Profile Management_Gowri Manogari\profile.html";
}

// Email Validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone Validation
function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

// Toast Placeholder
function showCommonToast(message) {
    alert(message);
}