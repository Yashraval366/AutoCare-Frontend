const registerUser = async () => {
    const form = document.getElementById("register-form");
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    document.getElementById("loading").style.display = "flex";

    try {
        const response = await fetch("http://localhost:5001/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        });

        const data = await response.json();

        if (response.ok) {
            setTimeout(() => {
                document.getElementById("loading").style.display = "none";
                document.getElementById("popup").style.display = "flex";
            }, 3000);
        
            window.addEventListener("click", (event) => {
                if (event.target === document.querySelector('body')) {
                    document.getElementById("popup").style.display = "none";
                }
            });    
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Network Error! Please try again.");
    }
    finally {
        document.getElementById("loading").style.display = "none"; // Ensures loading always disappears
    } 
};

document.getElementById("register-form").addEventListener("submit", (event) => {
    event.preventDefault(); 
    registerUser();
});