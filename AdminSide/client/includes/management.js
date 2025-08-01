async function fetchUsersAndDisplay() {
    try {
        const response = await fetch('https://fishinmap-1h6i.onrender.com/api/users');
        const users = await response.json();

        console.log("🔍 users from server:", users);

        if (!Array.isArray(users)) {
            throw new Error("Server response is not a user array");
        }

        const tbody = document.querySelector("#user-table tbody");
        tbody.innerHTML = "";

        users
        console.log("📦 Users received:", users);

        users.forEach(user => {
            const tr = document.createElement("tr");

            const fullName = `${user.firstName} ${user.lastName}`;
            const email = user.email;
            const id = user._id.slice(-12);
            const subsDate = new Date(user.createdAt).toLocaleDateString('en-GB');
            const verified = user.role === "Expert" ? "Yes" : "No";

            tr.innerHTML = `
                    <td>${fullName}</td>
                    <td>${email}</td>
                    <td>${id}</td>
                    <td>${subsDate}</td>
                    <td>${verified}</td>
                `;

            tr.addEventListener("click", () => {
                window.location.href = `userDetails.html?userId=${user._id}`;
            });

            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("❌ Failed to load users", err);
    }
}

document.addEventListener("DOMContentLoaded", fetchUsersAndDisplay);
