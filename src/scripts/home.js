document.addEventListener("DOMContentLoaded", () => {
    const signInBtn = document.getElementById("open-signin");
    const signInPlaceholder = document.getElementById("signin-placeholder");
    const profileDropdown = document.getElementById("profile-dropdown");
    const profileBtn = document.getElementById("profile-btn");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const bookbtns = document.querySelectorAll(".book-btn"); 
    const bookslotPlaceholder = document.getElementById("bookslot-placeholder");

    // Load the sign-in form
    signInBtn.addEventListener("click", loadSignInForm);

    function loadSignInForm() {
        fetch("../src/pages/signIn.html")
            .then(response => response.text())
            .then(html => {
                signInPlaceholder.innerHTML = html;
                const signInContainer = document.getElementById("signin-container");
                const closeSignIn = document.getElementById("close-signin");

                signInContainer.classList.remove("fade-out");
                signInContainer.classList.add("fade-in");
                signInContainer.style.display = "flex"; 

                loginHandler();

                closeSignIn.addEventListener("click", () => closeSignInForm(signInContainer));

                window.addEventListener("click", (event) => {
                    if (event.target === signInContainer) {
                        closeSignInForm(signInContainer);
                    }
                });
            })
            .catch(error => console.error("Error loading sign-in form:", error));
    }

    function closeSignInForm(container) {
        container.classList.remove("fade-in");
        container.classList.add("fade-out");
        setTimeout(() => {
            container.style.display = "none";
        }, 500);
    }

    function loginHandler() {
        document.getElementById("login-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            await loginUser();
        });
    }

    async function loginUser() {
        try {
            const form = document.getElementById('login-form');
            const formData = new FormData(form);
            const jsonData = Object.fromEntries(formData.entries());

            const response = await fetch("http://localhost:5001/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Login failed");

            alert("Login successfully");

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", jsonData.role); 

            console.log(data.token, jsonData.role)
            
            updateUI();
            form.reset();
            document.getElementById("signin-container").style.display = "none";
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        }
    }

    async function updateUI() {
        const signInBtn = document.getElementById("open-signin");
        const profileDropdown = document.getElementById("profile-dropdown");
        const token = localStorage.getItem("authToken");

        if (!token) {
            signInBtn.style.display = "block"; 
            profileDropdown.style.display = "none"; 
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/users/check-auth", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Invalid token");

            // If token is valid, show profile dropdown
            signInBtn.style.display = "none"; 
            profileDropdown.style.display = "inline-block";

            document.getElementById('logout').addEventListener("click", logoutUser)

        } catch (error) {
            console.warn("Invalid token, logging out");
            logoutUser();
        }
    }

    document.addEventListener("click", (event) => {
        const profileBtn = event.target.closest("#profile-btn");
        if (profileBtn) {
            document.getElementById("dropdownMenu").classList.toggle("active");
        }

        const dropdown = document.getElementById("dropdownMenu");
        if (dropdown && !dropdown.contains(event.target) && event.target.id !== "profile-btn") {
            dropdown.classList.remove("active");
        }
    });

    async function checkAuth() {
        const token = localStorage.getItem("authToken");

        if (!token) return logoutUser();

        try {
            const response = await fetch("http://localhost:5001/api/users/check-auth", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Session expired");
        } catch (error) {
            console.warn(error.message);
            logoutUser();
        }
    }

    function logoutUser() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        updateUI();
    }

    updateUI();

    // Check token validity every 5 minutes
    setInterval(checkAuth, 5 * 60 * 1000);


    bookbtns.forEach((bookbtn) => {
        bookbtn.addEventListener("click", () => {
            fetch("../src/pages/bookslot.html")
                .then(response => response.text())
                .then(html => {
                    bookslotPlaceholder.innerHTML = html; 

                    const bookslotContainer = document.getElementById("modal-container");
                    const closeBookslot = document.getElementById("close-bookslot");
           
                    bookslotContainer.classList.remove("fade-out")
                    bookslotContainer.classList.add("fade-in")
                    bookslotContainer.style.display = "flex";

                    closeBookslot.addEventListener("click", () => {
                        bookslotContainer.classList.remove("fade-in")
                        bookslotContainer.classList.add("fade-out")
                        setTimeout(() => {
                            bookslotContainer.style.display = "none";
                        },500)
                    });

                    window.addEventListener("click", (event) => {
                        if (event.target === bookslotContainer) {
                            bookslotContainer.classList.remove("fade-in")
                            bookslotContainer.classList.add("fade-out")
                            setTimeout(() => {
                                bookslotContainer.style.display = "none";
                            },500)
                        }
                    });

                    function showServiceOptions() {
                        const serviceDropdown = document.getElementById("services");
                        const serviceOptions = document.getElementById("service-options");

                        if (serviceDropdown.value !== "") {
                            serviceOptions.style.display = "block";
                        } else {
                            serviceOptions.style.display = "none";
                        }
                    }
                })
                .catch(error => console.error("Error loading book slot form:", error));
        });
    });
});
