const leaderboardData = [
    { rank: 1, name: "Gibbons Dorm", score: 1500 },
    { rank: 2, name: "Lyle-Maupin Dorm", score: 1000 },
    { rank: 3, name: "McCormick Dorm", score: 500 },
    // ... other entries ...
];

// Function to populate the leaderboard table
function populateLeaderboardTable(data) {
    const table = document.querySelector(".leaderboard .leaderboard-table");
    // Assuming the table is empty, add the header row first
    let headerHtml = '<tr class="header-row"><th>Rank</th><th>Name</th><th>Score</th></tr>';
    table.innerHTML = headerHtml; // Set the headers

    // Populate the data rows
    data.forEach(entry => {
        let rowHtml = `<tr>
                         <td>${entry.rank}</td>
                         <td>${entry.name}</td>
                         <td>${entry.score}</td>
                       </tr>`;
        table.innerHTML += rowHtml; // Append the rows
    });
}

document.addEventListener('DOMContentLoaded', () => {
    populateLeaderboardTable(leaderboardData);
});