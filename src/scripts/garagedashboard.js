document.addEventListener("DOMContentLoaded", () => {
    new DataTable("#mytable", {
        paging: true,     // Enable pagination
        searching: true,  // Enable search
        ordering: true,   // Enable sorting
        info: true,       // Show info (e.g., "Showing 1 to 10 of 50 entries")
    })
    new DataTable("#alldata", {
        paging: true,     // Enable pagination
        searching: true,  // Enable search
        ordering: true,   // Enable sorting
        info: true,       // Show info (e.g., "Showing 1 to 10 of 50 entries")
    })

    const token = localStorage.getItem('authToken')

    console.log(token)

    if (!token) {
        alert("Unauthorized! Please log in.");
        window.location.href = "../index.html"; 
        return;
    }

    const GarageData = async() => {
        try {
            const response = await fetch('http://localhost:5001/api/garageown/garagedata', {
                method: "GET",
                headers : {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json" 
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch garage data");
            }

            const data = await response.json();

            console.log(data);

            document.getElementById('garage-title').innerHTML = data.Garage.garage_name
        }
        catch(err) {
            console.log("Error: ",err)
        }
    }
    GarageData();

    document.getElementById('logout').addEventListener('click', ()=>{
        localStorage.removeItem("authToken");
        window.location.href = "../index.html";
        alert("Logged out successfully") 
    })
})