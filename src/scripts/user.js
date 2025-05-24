document.addEventListener("DOMContentLoaded", () => {

    console.log("user code executed")
    const token = localStorage.getItem('authToken')

    const UserData = async() => {
        if(token) {
            try {
                const response = await fetch('https://autocare-backend.onrender.com//api/users/getuser', {
                    method: "GET",
                    headers : {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json" 
                    }
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();

                document.getElementById('user-name').innerHTML = data.User.username
            }
            catch(err) {
                console.log("Error: ",err)
            }
        }
    }
    UserData();

    document.getElementById('logout').addEventListener('click', ()=>{
        localStorage.removeItem("authToken");
        window.location.href = "#";
        alert("Logged out successfully") 
    })
})