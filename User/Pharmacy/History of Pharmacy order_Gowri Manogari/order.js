document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    /* Logged-in username */

    const username =
        sessionStorage.getItem("curonex_username");

    if (username) {

        document.querySelector(".user-name").textContent =
            username;

    }

    /* Profile */

    document
        .getElementById("profileMenu")
        .addEventListener("click", () => {

            const option =
                prompt(
                    "Type:\n1 - Profile\n2 - Logout"
                );

            if (option === "1") {

                goToProfile();

            }

            else if (option === "2") {

                if (confirm("Logout?")) {

                    logoutUser();

                }

            }

        });

    /* Latest order */

    const medicines =
        JSON.parse(
            sessionStorage.getItem("selectedMedicines")
        ) || [];

    if (medicines.length > 0) {

        const firstCard =
            document.querySelector(".card");

        const patient =
            firstCard.querySelectorAll(".details p");

        patient[0].innerHTML =
            "<strong>Patient Name :</strong> " +
            username;

        patient[1].innerHTML =
            "<strong>Order Date :</strong> " +
            new Date().toLocaleDateString();

        const list =
            firstCard.querySelector(".medicine ul");

        list.innerHTML = "";

        medicines.forEach(medicine => {

            const li =
                document.createElement("li");

            li.textContent =
                medicine.name +
                " x " +
                medicine.quantity;

            list.appendChild(li);

        });

    }

});