document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("https://fishinmap-opo1.onrender.com/api/users/summary");
        const { fishermanCount, expertCount } = await res.json();

        const totalUsers = fishermanCount + expertCount;

        document.getElementById("user-count").textContent = totalUsers;

        new Chart(document.getElementById("userTypeChart"), {
            type: 'doughnut',
            data: {
                labels: ['Regular', 'Experts'],
                datasets: [{
                    data: [fishermanCount, expertCount],
                    backgroundColor: ['#e74c3c', '#f39c12'],
                }]
            },
            options: {
                cutout: '70%',
                plugins: {
                    legend: { display: false }
                }
            }
        });

    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
});
