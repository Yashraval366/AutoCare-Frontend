document.addEventListener("DOMContentLoaded", () => {

    let allbookings = new DataTable("#alldata", {
        paging: true,   
        searching: true, 
        ordering: true,   
        info: true,
        destroy: true,
        data: [],
        columns: [
            { title: "Booking_ID", data: "bookslot_id" },
            { title: "Garage ID", data: "garage_id" },
            { title: "Garage Name", data: "garage_name" },
            { title: "Date", data: "date" },
            { title: "Time", data: "time" },
            { title: "Service", data: "service" },
            { title: "Status", data: "status", className: "status-column" },
        ],
        
    });

    const token = localStorage.getItem('authToken');
    console.log(token)

    if (!token) {
        alert("Unauthorized! Please log in.");
        window.location.href = "../index.html"; 
        return;
    }

    const UserData = async () => {
    
        try {
            const response = await fetch('https://autocare-backend.onrender.com//api/users/getuser', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch garage data");
            }

            const data = await response.json();

            const user = data.User; 

            console.log(user)

            document.getElementById('user-id').innerHTML = "user_id: " + user.id;
            document.getElementById('user-title').innerHTML = "Welcome " + user.username;
            document.getElementById('user-name').innerHTML = user.username;
            document.getElementById('user-name1').innerHTML = user.username;
            document.getElementById('user-contact').innerHTML = '📞 '+user.phone;
            document.getElementById('user-email').innerHTML = user.email;
            document.getElementById('user-city').innerHTML = user.city;


            document.getElementById("edit-user-name").value = user.username;
            document.getElementById("edit-user-city").value = user.city;
            document.getElementById("edit-user-contact").value = user.phone;
            document.getElementById("edit-user-email").value = user.email;

        } catch (err) {
            console.log("Error: ", err);
        }
    };
    UserData();


    const updateUserData = async () => {
        const userData = {
            name: document.getElementById("edit-user-name").value,
            city: document.getElementById("edit-user-city").value,
            phone: document.getElementById("edit-user-contact").value,
            email: document.getElementById("edit-user-email").value,
        };

        try {
            const response = await fetch("https://autocare-backend.onrender.com//api/users/updateuser", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log("User updated successfully:", data);
                alert("User information updated successfully!");
            } else {
                console.error("Server returned non-JSON response");
                alert("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Failed to update user info:", error);
            alert("Failed to update user information.");
        }
    };

    document.getElementById("submitInfo").addEventListener("click", updateUserData);

   const getBookslothistory = async () => {
        try {
            const response = await fetch('https://autocare-backend.onrender.com//api/users/history', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response:", data);
            const historydata = Array.isArray(data.PrevData) 
                                ? data.PrevData 
                                : data.PrevData ? [data.PrevData] : [];

            console.log(historydata)

             const formattedData = historydata.map(booking => ({
                ...booking,
                date: new Date(booking.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
                status: `<span class="status status-${booking.status.toLowerCase()}">${booking.status}</span>`,
                actions: `
                    <div class="action-buttons">
                        <button class="complete-btn" data-id="${booking.bookslot_id}">Complete</button>
                        <button class="cancel-btn" data-id="${booking.bookslot_id}">Cancel</button>
                    </div>
                `,
            }));

            allbookings.clear();
            allbookings.rows.add(formattedData);
            allbookings.draw();


        } catch (err) {
            console.error("Something went wrong:", err);
        }
    };
    getBookslothistory();


    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem("authToken");
        window.location.href = "../index.html";
        alert("Logged out successfully");
    });

});
