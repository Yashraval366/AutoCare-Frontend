document.addEventListener("DOMContentLoaded", function () {
    const loading = document.getElementById("loading");
    const popup = document.getElementById("popup");

    if (loading) loading.style.display = "none";
    if (popup) popup.style.display = "none";

    const form = document.getElementById("register-form");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            registerUser();
        });
    }

    if (popup) {
        popup.addEventListener("click", (event) => {
            if (event.target === popup) {
                closePopup();
            }
        });
    }
});

const registerUser = async () => {
    const form = document.getElementById("register-form");
    if (!form) {
        alert("Form not found!");
        return;
    }

    const formData = new FormData(form);

    formData.set("role", document.getElementById('role').value);
    formData.set("username", document.getElementById('username').value);
    formData.set("email", document.getElementById('email').value);
    formData.set("password", document.getElementById('password').value);
    formData.set("phone", document.getElementById('phone').value);
    formData.set("gender", document.getElementById('gender').value);
    formData.set("city", document.getElementById('city').value);

    if(document.getElementById('role').value === "garageowner") {
        formData.set("garage_name", document.getElementById('garage_name').value);
        formData.set("garage_location", document.getElementById('garage_location').value);
        formData.set("garage_contact", document.getElementById('garage_contact').value);
        formData.set("garage_email", document.getElementById('garage_email').value);

        const garageImage = document.getElementById('garage_image').files[0];
        if (garageImage) {
            formData.set("garage_image", garageImage);
        }
    }

    console.log("Submitting FormData:", Object.fromEntries(formData.entries()));


    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "flex";

    try {
        const response = await fetch("https://autocare-backend.onrender.com//api/users/register", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        setTimeout(() => {
            if (loading) loading.style.display = "none";

            setTimeout(() => {
                if (response.ok) {
                    const popup = document.getElementById("popup");
                    if (popup) popup.style.display = "flex";
                    form.reset();
                } else {
                    alert("Error: " + (data.message || "Something went wrong"));
                }
            }, 1000);
        }, 3000);
    } catch (error) {
        if (loading) loading.style.display = "none";
        alert("Network Error! Please try again.");
    }
};

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "none";
}
