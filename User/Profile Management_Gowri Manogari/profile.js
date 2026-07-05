document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");

    const inputs = form.querySelectorAll("input, textarea");

    // Remove error while typing
    inputs.forEach(input => {

        input.addEventListener("input", function () {

            const error = this.nextElementSibling;

            this.classList.remove("error-border");

            error.innerHTML = "";

        });

    });

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        let valid = true;

        // Clear previous errors
        document.querySelectorAll(".error").forEach(error => {
            error.innerHTML = "";
        });

        inputs.forEach(input => {

            const value = input.value.trim();

            const error = input.nextElementSibling;

            input.classList.remove("error-border");

            // Empty Field Validation
            if (value === "") {

                error.innerHTML = "Please fill this field";

                input.classList.add("error-border");

                valid = false;

                return;

            }

            // Email Validation
            if (input.type === "email") {

                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailPattern.test(value)) {

                    error.innerHTML = "Enter a valid email";

                    input.classList.add("error-border");

                    valid = false;

                }

            }

            // Phone Number Validation
            if (input.previousElementSibling.innerText.includes("Phone")) {

                const phonePattern = /^[0-9]{10}$/;

                if (!phonePattern.test(value)) {

                    error.innerHTML = "Enter a valid 10-digit number";

                    input.classList.add("error-border");

                    valid = false;

                }

            }

        });

        if (valid) {

            alert("Profile Saved Successfully!");

            //form.reset();

        }

    });

});