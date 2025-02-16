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
})