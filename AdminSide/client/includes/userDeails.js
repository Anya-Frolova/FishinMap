document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    if (!userId) {
        console.error("No userId in URL");
        return;
    }


    fetch(`http://localhost:3000/api/users/${userId}`)
        .then(response => {
            if (!response.ok) throw new Error("User not found");
            return response.json();
        })
        .then(user => {
            document.getElementById("user-name").textContent = `${user.firstName} ${user.lastName}`;
            document.getElementById("user-email").textContent = user.email;
            document.getElementById("user-id").textContent = user._id.slice(-12);
            document.getElementById("user-subs-date").textContent = new Date(user.createdAt).toLocaleDateString('en-GB');
            document.getElementById("user-ver").textContent = user.role === "Expert" ? "Yes" : "No";
        })
        .catch(err => {
            console.error("❌ Failed to fetch user", err);
        });

    const approveBtn = document.querySelector(".approve");
    approveBtn.addEventListener("click", async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userId}/approve`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("Failed to approve user");

            const data = await res.json();
            alert(`✅ User approved!`);
            document.getElementById("user-ver").textContent = "Yes";

        } catch (err) {
            console.error("❌ Approval failed:", err);
            alert("Failed to approve user");
        }
    });

    const declineBtn = document.querySelector(".decline");

    declineBtn.addEventListener("click", async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/users/${userId}/decline`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Failed to decline user");

            alert("🗑️ User declined");
            window.location.href = "Management.html";
        } catch (err) {
            console.error("❌ Decline failed:", err);
            alert("Failed to decline user");
        }
    });

});
