document.addEventListener("DOMContentLoaded", () => {

    let recentbookings = new DataTable("#mytable", {
        paging: true,   
        searching: true, 
        ordering: true,   
        info: true,
        destroy: true,
        data: [],
        columns: [
            { title: "Booking_ID", data: "bookslot_id" },
            { title: "Name", data: "name" },
            { title: "Email", data: "email" },
            { title: "Date", data: "date" },
            { title: "Time", data: "time" },
            { title: "Service", data: "service" },
            { title: "Status", data: "status", className: "status-column" },
            { title: "Actions", data: "actions", orderable: false }
        ],
        columnDefs: [
            {
                targets: 6, // Status column index
                render: function (data, type, row) {
                    let statusClass = "";
                    if (data === "Pending") {
                        statusClass = "pending";
                    } else if (data === "Completed") {
                        statusClass = "completed";
                    } else if (data === "Cancelled") {
                        statusClass = "cancelled";
                    }
                    return `<span class="status ${statusClass}">${data}</span>`;
                }
            }
        ]
    });

    let allbookings = new DataTable("#alldata", {
        paging: true,   
        searching: true, 
        ordering: true,   
        info: true,
        destroy: true,
        data: [],
        columns: [
            { title: "Booking_ID", data: "bookslot_id" },
            { title: "Name", data: "name" },
            { title: "Email", data: "email" },
            { title: "Date", data: "date" },
            { title: "Time", data: "time" },
            { title: "Service", data: "service" },
            { title: "Status", data: "status", className: "status-column" },
            { title: "Actions", data: "actions", orderable: false }
        ],
        columnDefs: [
            {
                targets: 6,
                render: function (data, type, row) {
                    let statusClass = "";
                    if (data === "Pending") {
                        statusClass = "pending";
                    } else if (data === "Completed") {
                        statusClass = "completed";
                    } else if (data === "Cancelled") {
                        statusClass = "cancelled";
                    }
                    return `<span class="status ${statusClass}">${data}</span>`;
                }
            }
        ]
    });

    const token = localStorage.getItem('authToken');
    console.log(token)

    if (!token) {
        alert("Unauthorized! Please log in.");
        window.location.href = "../index.html"; 
        return;
    }

    const GarageData = async () => {
    
        try {
            const response = await fetch('https://autocare-backend-production.up.railway.app/api/garageown/garagedata', {
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

            const garage = data.Garage; 

            document.getElementById('garage-title').innerHTML = garage.garage_name;
            document.getElementById('garage-title').innerHTML = garage.garage_name;
            document.getElementById('garage-name').innerHTML = garage.garage_name;
            document.getElementById('garage-image').src = `http://localhost:5001${garage.garage_image}`
            document.getElementById('garage-address').innerHTML = garage.garage_location;
            document.getElementById('garage-contact').innerHTML = '📞 '+garage.garage_contact;
            document.getElementById('garage-owner').innerHTML = garage.garage_name;
            document.getElementById('garage-email').innerHTML = garage.garage_email;


            document.getElementById("edit-garage-name").value = garage.garage_name;
            document.getElementById('profile-image').src = `http://localhost:5001${garage.garage_image}`
            document.getElementById("edit-garage-image").src = `http://localhost:5001${garage.garage_image}`
            document.getElementById("edit-garage-location").value = garage.garage_location;
            document.getElementById("edit-garage-contact").value = garage.garage_contact;
            document.getElementById("edit-garage-email").value = garage.garage_email;

        } catch (err) {
            console.log("Error: ", err);
        }
    };
    GarageData();


    const updateGarageData = async () => {
        const formData = new FormData();
        formData.set("name", document.getElementById("edit-garage-name").value);
        formData.set("location", document.getElementById("edit-garage-location").value);
        formData.set("contact", document.getElementById("edit-garage-contact").value);
        formData.set("email", document.getElementById("edit-garage-email").value);

        const imageFile = document.getElementById("edit-garage-image").files[0];
        if (imageFile) {
            formData.set("garage_image", imageFile);
        }

        try {
            const response = await fetch("https://autocare-backend-production.up.railway.app/api/garages/updategarage", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                },
                body: formData,
            });

            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log("Garage updated successfully:", data);
                alert("Garage information updated successfully!");
            } else {
                console.error("Server returned non-JSON response");
                alert("Unexpected response from server.");
            }
        } catch (error) {
            console.error("Failed to update garage:", error);
            alert("Failed to update garage information.");
        }
    };

    document.getElementById("submitInfo").addEventListener("click", updateGarageData);

   const getBookslotData = async () => {
        try {
            const response = await fetch('https://autocare-backend-production.up.railway.app/api/bookslot/getbookslot', {
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

            const bookings = data.bookings || [];
            bookings.sort((a, b) => a.queue_position - b.queue_position);
            console.log("All Bookings:", bookings);

            const today = new Date();
            const todayDate = today.toISOString().split('T')[0];

            console.log("Today's Local Date:", todayDate);

            const todaysBookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.date);
                const localBookingDate = bookingDate.toLocaleDateString('en-CA'); 
                
                console.log(`Checking Booking Date: ${localBookingDate} with Today: ${todayDate}`);
                return localBookingDate === todayDate;
            });

            console.log("Filtered Today's Bookings:", todaysBookings);

            const formatBookingData = (bookingList) => {
                return bookingList.map(booking => ({
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
            };

            const formattedTodayBookings = formatBookingData(todaysBookings);
            const formattedAllBookings = formatBookingData(bookings);

            console.log("Formatted Today's Bookings:", formattedTodayBookings);
            console.log("Formatted All Bookings:", formattedAllBookings);

            recentbookings.clear().rows.add(formattedTodayBookings).draw();
            allbookings.clear().rows.add(formattedAllBookings).draw();

            document.getElementById("totalBookings").textContent = bookings.length;
            document.getElementById("pendingServices").textContent = bookings.filter(b => b.status === "Pending").length;
            document.getElementById("completedServices").textContent = bookings.filter(b => b.status === "Completed").length;

        } catch (err) {
            console.error("Something went wrong:", err);
        }
    };
    getBookslotData();


    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem("authToken");
        window.location.href = "../index.html";
        alert("Logged out successfully");
    });

    document.querySelector("#mytable tbody").addEventListener("click", async function (event) {
        if (event.target.classList.contains("complete-btn")) {
            let row = event.target.closest("tr");
            let bookingId = event.target.getAttribute("data-id");
            

            let userEmail = row.querySelector("td:nth-child(3)").textContent.trim(); 
            let serviceDetails = row.querySelector("td:nth-child(6)").textContent.trim();
            
            await updateStatus(bookingId, "Completed", userEmail, serviceDetails);
        } else if (event.target.classList.contains("cancel-btn")) {
            let bookingId = event.target.getAttribute("data-id");
            await updateStatus(bookingId, "Cancelled");
        }
    });

    document.querySelector("#alldata tbody").addEventListener("click", async function (event) {
        if (event.target.classList.contains("complete-btn")) {
            let row = event.target.closest("tr");
            let bookingId = event.target.getAttribute("data-id");
            

            let userEmail = row.querySelector("td:nth-child(3)").textContent.trim(); 
            let serviceDetails = row.querySelector("td:nth-child(6)").textContent.trim();
            
            await updateStatus(bookingId, "Completed", userEmail, serviceDetails);
        } else if (event.target.classList.contains("cancel-btn")) {
            let bookingId = event.target.getAttribute("data-id");
            await updateStatus(bookingId, "Cancelled");
        }
    });

    const updateStatus = async (bookslot_id, status, userEmail = "", serviceDetails = "") => {
        try {
            const response = await fetch("https://autocare-backend-production.up.railway.app/api/bookslot/updatestatus", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookslot_id, status }),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert("Booking status updated!");

                if (status === "Completed" && userEmail && serviceDetails) {
                    sendEmail(userEmail, serviceDetails);
                }
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    const sendEmail = async (userEmail, serviceDetails) => {
        try {
            const response = await fetch("https://autocare-backend-production.up.railway.app/api/send/sendemail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, serviceDetails })
            });

            const result = await response.json();
            if (result.success) {
                alert(`Email sent to ${userEmail}!`);
            } else {
                alert("Failed to send email.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };
});