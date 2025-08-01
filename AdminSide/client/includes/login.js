document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.elements.login.value.trim();
        const password = form.password.value;

        try {
            const res = await fetch("https://fishinmap-n1oc.onrender.com/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errData = await res.json();
                alert(`❌ ${errData.message || 'Login failed'}`);
                return;
            }

            const data = await res.json();
            alert(`✅ Welcome, ${data.user.name}`);
            window.location.href = "./mainMenu.html";
        } catch (err) {
            console.error("❌ Error during login", err);
            alert("Login failed. Try again later.");
        }
    });
});
