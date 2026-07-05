// ============================================================
// delivery_tracking.js — Curonex Delivery Tracking
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    /* ===========================
       USER DETAILS
    ============================ */

    const username = sessionStorage.getItem("curonex_username");

    if (username) {

        document.querySelector(".user-name").textContent = username;

    }

    /* ===========================
       ORDER DETAILS
    ============================ */

    const medicines =
        JSON.parse(sessionStorage.getItem("selectedMedicines")) || [];

    const medicineCount =
        document.getElementById("medicineCount");

    if (medicineCount) {

        medicineCount.textContent =
            `${medicines.length} Medicines`;

    }

    /* ===========================
       ORDER NUMBER
    ============================ */

    let orderNumber =
        sessionStorage.getItem("orderNumber");

    if (!orderNumber) {

        orderNumber =
            "MC" +
            Math.floor(100000 + Math.random() * 900000);

        sessionStorage.setItem(
            "orderNumber",
            orderNumber
        );

    }

    const orderNumberElement =
        document.getElementById("orderNumber");

    if (orderNumberElement) {

        orderNumberElement.textContent =
            "Order #" + orderNumber;

    }

    /* ===========================
       PHARMACY
    ============================ */

    const pharmacy =
        sessionStorage.getItem("selectedPharmacy");

    if (pharmacy) {

        document.getElementById(
            "selectedPharmacy"
        ).textContent = pharmacy;

    }

    /* ===========================
       PAYMENT
    ============================ */

    const payment =
        sessionStorage.getItem("paymentMethod");

    if (payment) {

        document.getElementById(
            "paymentMethod"
        ).textContent = payment;

    }

    /* ===========================
       TOTAL
    ============================ */

    const total =
        sessionStorage.getItem("totalAmount");

    if (total) {

        document.getElementById(
            "totalAmount"
        ).textContent = total;

    }

    sessionStorage.setItem(
        "orderStatus",
        "Placed"
    );

    /* ===========================
       PROFILE
    ============================ */

    const profileBtn =
        document.getElementById("myProfileBtn");

    if (profileBtn) {

        profileBtn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                goToProfile();

            }
        );

    }

    /* ===========================
       LOGOUT
    ============================ */

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                if (
                    confirm(
                        "Are you sure you want to logout?"
                    )
                ) {

                    logoutUser();

                }

            }
        );

    }

    /* ===========================
       TOAST
    ============================ */

    function showToast(message, type = "info") {

        const colors = {

            success: {

                bg: "#E8F5E9",
                text: "#2E7D32",
                border: "#2E7D32"

            },

            error: {

                bg: "#FFEBEE",
                text: "#D32F2F",
                border: "#D32F2F"

            },

            info: {

                bg: "#E3F2FD",
                text: "#1976D2",
                border: "#1976D2"

            }

        };

        const c = colors[type];

        const toast =
            document.createElement("div");

        toast.textContent = message;

        Object.assign(toast.style, {

            position: "fixed",
            bottom: "28px",
            left: "50%",
            transform:
                "translateX(-50%)",

            background: c.bg,

            color: c.text,

            border:
                `1.5px solid ${c.border}`,

            padding: "12px 22px",

            borderRadius: "14px",

            zIndex: "9999"

        });

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.remove();

        }, 2500);

    }
        /* ---------------------------------------------------------
       1. LIVE ETA COUNTDOWN
    --------------------------------------------------------- */

    const etaPill = document.querySelector(".eta-pill");

    let minutesLeft = parseInt(
        etaPill.textContent.match(/\d+/)?.[0] || "22",
        10
    );

    const countdownInterval = setInterval(() => {

        minutesLeft--;

        if (minutesLeft <= 0) {

            etaPill.textContent = "Arriving now";

            clearInterval(countdownInterval);

            triggerOutForDelivery();

        }
        else {

            etaPill.textContent =
                `Arriving in ${minutesLeft} mins`;

        }

    }, 60000);



    /* ---------------------------------------------------------
       2. TRACKER
    --------------------------------------------------------- */

    const trackSteps =
        document.querySelectorAll(".track-step");

    const trackLines =
        document.querySelectorAll(".track-line");

    function activateStep(index){

        const step = trackSteps[index];

        const icon =
            step.querySelector(".track-icon");

        icon.classList.remove("inactive");

        icon.classList.add("active");

        const timeEl =
            step.querySelector(".track-time");

        const now = new Date();

        timeEl.textContent =
            now.toLocaleTimeString([],
            {
                hour:"2-digit",
                minute:"2-digit"
            });

        if(trackLines[index]){

            trackLines[index]
                .classList.remove("empty");

            trackLines[index]
                .classList.add("filled");

        }

    }

    function triggerOutForDelivery(){

        activateStep(1);

        showToast(
            "Your order is now out for delivery!",
            "info"
        );

    }

    function triggerDelivered(){

        activateStep(2);

        showToast(
            "Order Delivered Successfully!",
            "success"
        );

        document.querySelector(".eta-bar")
            .style.background="#E8F5E9";

        etaPill.textContent="Delivered";

    }



    document.querySelector(".tracker")
    ?.addEventListener("click",()=>{

        const activeCount =
            document.querySelectorAll(
                ".track-icon.active"
            ).length;

        if(activeCount===1){

            triggerOutForDelivery();

        }

        else if(activeCount===2){

            triggerDelivered();

        }

    });



    /* ---------------------------------------------------------
       DELIVERY PARTNER CALL
    --------------------------------------------------------- */

    const partnerPhone =
        document.querySelector(".partner-phone");

    if(partnerPhone){

        partnerPhone.style.cursor="pointer";

        partnerPhone.addEventListener("click",()=>{

            const phoneText =
                partnerPhone.textContent
                .trim()
                .replace(/\s+/g,"");

            window.location.href=
                `tel:${phoneText}`;

        });

    }



    /* ---------------------------------------------------------
       LEFT SIDEBAR
    --------------------------------------------------------- */

    const navRoutes={

        "Appointment Scheduling":
        "../../Appointment/Appointment_Search_Page_Radha/appointment_search.html",

        "Pharmacy":
        "../../Pharmacy/Pharmacy_Home_Kaushik1/pharmacy_home.html",

        "Medical Camp":
        "../../Camp/camp_booking-AJAY SHARMA S/camp-booking.html"

    };



    document
    .querySelectorAll(".sidebar-left .nav-item")
    .forEach(item=>{

        item.addEventListener("click",()=>{

            const label=
                item.querySelector("span")
                .textContent
                .trim();

            if(navRoutes[label]){

                window.location.href=
                navRoutes[label];

            }

        });

    });



    /* ---------------------------------------------------------
       RIGHT SIDEBAR
    --------------------------------------------------------- */

    const sideRoutes={

        "Order History":
        "../History of Pharmacy order_Gowri Manogari/order.html",

        "Report an Issue":
        "#"

    };



    document
    .querySelectorAll(".sidebar-right .side-card")
    .forEach(card=>{

        card.addEventListener("click",()=>{

            const title=
                card.querySelector(".side-card-title")
                .textContent
                .trim();

            if(sideRoutes[title]){

                window.location.href=
                sideRoutes[title];

            }

        });

    });

});