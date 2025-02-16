document.addEventListener("DOMContentLoaded", () => {
    const signInBtn = document.getElementById("open-signin");
    const signInPlaceholder = document.getElementById("signin-placeholder");
    const bookbtns = document.querySelectorAll(".book-btn"); 
    const bookslotPlaceholder = document.getElementById("bookslot-placeholder");


    signInBtn.addEventListener("click", () => {
        fetch("../src/pages/signIn.html")
            .then(response => response.text())
            .then(html => {
                signInPlaceholder.innerHTML = html;

                const signInContainer = document.getElementById("signin-container");
                const closeSignIn = document.getElementById("close-signin");

                signInContainer.classList.remove("fade-out")
                signInContainer.classList.add("fade-in")
                signInContainer.style.display = "flex"; 

                closeSignIn.addEventListener("click", () => {
                    signInContainer.classList.remove("fade-in")
                    signInContainer.classList.add("fade-out")
                    setTimeout(() => {
                        signInContainer.style.display = "none";
                    },500)
                   
                });

                window.addEventListener("click", (event) => {
                    if (event.target === signInContainer) {
                        signInContainer.classList.remove("fade-in")
                        signInContainer.classList.add("fade-out")
                        setTimeout(() => {
                            signInContainer.style.display = "none";
                        },500)
                    }
                });
            })
            .catch(error => console.error("Error loading sign-in form:", error));
    });


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
