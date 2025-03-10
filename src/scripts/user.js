document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('authToken')

    console.log(token)

    const UserData = async() => {
        if(token) {
            try {
                const response = await fetch('http://localhost:5001/api/users/getusers', {
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

                console.log(data);

                console.log(data.User.username)

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