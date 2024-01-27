const leaderboardData = [
    { name: "Lile-Maupin", score: 500 },
    { name: "Watson-Webb", score: 400 },
    { name: "Bond", score: 300 },
    { name: "etc etc", score: 200 }
]

function populateHTMLLeaderboard(data) {
    const leaderboard = document.getElementById("leaderboard-list");
    leaderboard.innerHTML = ""; // clear existing list items

    data.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.classList.add("leaderboard-list-entry");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = entry.name;
        nameSpan.classList.add("name");

        const scoreSpan = document.createElement("span");
        scoreSpan.textContent = entry.score;
        scoreSpan.classList.add("score"); // Optional: for styling

        listItem.appendChild(nameSpan);
        listItem.appendChild(scoreSpan);

        leaderboard.appendChild(listItem);
    })
}

populateHTMLLeaderboard(leaderboardData);