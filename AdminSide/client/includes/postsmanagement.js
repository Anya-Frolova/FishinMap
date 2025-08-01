document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".cards-container");
    const emptyMsg = document.getElementById("empty-message");

    try {
        const res = await fetch("http://localhost:3000/api/posts/pending");
        const posts = await res.json();

        if (!posts.length) {
            emptyMsg.style.display = "block";
            return;
        }

        emptyMsg.style.display = "none";

        posts.forEach(post => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
    <h3>${post.user?.firstName || "Unknown User"}</h3>
    <img src="${post.photoSrc || 'images/emptyprofile.png'}" alt="post image">
        <p><strong>Fish:</strong> ${post.fishType}, ${post.fishWeight}kg, ${post.fishLength}cm</p>
        <p><strong>Location:</strong> ${post.location}</p>
        <div class="actions">
            <button class="approve">✔</button>
            <button class="decline">🗑</button>
        </div>
        `;

            card.querySelector(".approve").addEventListener("click", async () => {
                const res = await fetch(`http://localhost:3000/api/posts/${post._id}/approve`, {
                    method: "PATCH"
                });
                if (res.ok) {
                    alert("✅ Post approved");
                    card.remove();
                } else {
                    alert("❌ Approval failed");
                }
            });

            card.querySelector(".decline").addEventListener("click", async () => {
                const res = await fetch(`http://localhost:3000/api/posts/${post._id}/decline`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    alert("🗑️ Post declined");
                    card.remove();
                } else {
                    alert("❌ Decline failed");
                }
            });

            container.appendChild(card);
        });
    } catch (err) {
        console.error("Error loading posts:", err);
    }
});

