document.addEventListener("DOMContentLoaded",()=>{
    const signInBtn = document.getElementById("open-signin")
    const signInPlaceholder = document.getElementById("signin-placeholder");

    signInBtn.addEventListener("click", ()=>{
        fetch("../src/pages/signIn.html")
        .then(response => response.text())
        .then(html => {
            signInPlaceholder.innerHTML = html

            const signInContainer = document.getElementById("signin-container")
            const closeSignIn = document.getElementById("close-signin")

            signInBtn.addEventListener("click", function () {
                signInContainer.style.display = "flex";
            })

             closeSignIn.addEventListener("click", function () {
                signInContainer.style.display = "none";
            });

            window.addEventListener("click", function (event) {
                if (event.target === signInContainer) {
                    signInContainer.style.display = "none";
                }
            });

        })
        .catch(error => console.error("Error loading sign-in form:", error));
    })
})