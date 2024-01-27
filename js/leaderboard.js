d3.csv('https://raw.githubusercontent.com/KhanradCoder/hoya-hacks/main/firstyearhousing_monthy.csv').then(function(data) {
  const columnNames = data.columns
  const months = columnNames.slice(2, columnNames.length - 2);
  var totalScores = {};
  var electricScores = {};
  var chilledWaterScores = {}; 
  var hotWaterScores = {};
  var lastMonth = months[months.length - 1];
  console.log(lastMonth);
  data.forEach(element => {
    var houseData = data.filter(function(item) { return item.House === element.House});

    var electricity = houseData.find(function(d) { return d.Type === 'Electricity'; });
    var lastElectricity = electricity && electricity[lastMonth] ? parseFloat(electricity[lastMonth].replace(/,/g, '')) : 0;

    var chilledWater = houseData.find(function(d) { return d.Type === 'Chilled Water'; });
    var lastChilledWater = chilledWater && chilledWater[lastMonth] ? parseFloat(chilledWater[lastMonth].replace(/,/g, '')) : 0;

    var mthw = houseData.find(function(d) { return d.Type === 'MTHW'; });
    var lastMTHW = mthw && mthw[lastMonth] ? parseFloat(mthw[lastMonth].replace(/,/g, '')) : 0;

    var steam = houseData.find(function(d) { return d.Type === 'Steam'; });
    lastSteam = steam && steam[lastMonth] ? parseFloat(steam[lastMonth].replace(/,/g, '')) : 0;

    //Combination of steam and mthw
    var hotWater = {};
    var totalHotWater = 0;
    var hotWaterValues = [];
    months.forEach(function(month) {
      var mthwValue = mthw && mthw[month] ? parseFloat(mthw[month].replace(/,/g, '')) : 0;
      var steamValue = steam && steam[month] ? parseFloat(steam[month].replace(/,/g, '')) : 0;
      hotWater[month] = mthwValue + steamValue;
      totalHotWater += hotWater[month];
      hotWaterValues.push(hotWater[month]);
    });
    var lastHotWater = lastMTHW + lastSteam;

    var electricMean = parseFloat(electricity['Mean'].replace(/,/g, ''));
    var electricStd = parseFloat(electricity['Standard Deviation'].replace(/,/g, ''));
    var chilledWaterMean = chilledWater && chilledWater['Mean'] ? parseFloat(chilledWater['Mean'].replace(/,/g, '')) : 0;
    var chilledWaterStd = chilledWater && chilledWater['Standard Deviation'] ? parseFloat(chilledWater['Standard Deviation'].replace(/,/g, '')) : 0;
    var hotWaterMean = totalHotWater / months.length;
    // Calculate hotWater variance
    var hotWaterVariance = hotWaterValues.reduce(function(sum, value) {
      return sum + Math.pow(value - hotWaterMean, 2);
    }, 0) / hotWaterValues.length;
    // Calculate hotWater standard deviation
    var hotWaterStd = Math.sqrt(hotWaterVariance);

    electricScores[element.House] = (lastElectricity - electricMean) / electricStd;
    chilledWaterScores[element.House] = (lastChilledWater - chilledWaterMean) / chilledWaterStd;
    if (isNaN(chilledWaterScores[element.House])) {
      chilledWaterScores[element.House] = 0;
    }
    hotWaterScores[element.House] =  (lastHotWater - hotWaterMean) / hotWaterStd;
    totalScores[element.House] = electricScores[element.House] + chilledWaterScores[element.House] + hotWaterScores[element.House];
  });

  var minTotalScore = Object.entries(totalScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr, [null, Infinity]);
  var minElectricScore = Object.entries(electricScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr, [null, Infinity]);
  var minChilledWaterScore = Object.entries(chilledWaterScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr, [null, Infinity]);
  var minHotWaterScore = Object.entries(hotWaterScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr, [null, Infinity]);

//   console.log(totalScores);
//   console.log('Best Total Score:', minTotalScore[0], minTotalScore[1]);
//   console.log('Best Electric Score:', minElectricScore[0], minElectricScore[1]);
//   console.log('Best Chilled Water Score:', minChilledWaterScore[0], minChilledWaterScore[1]);
//   console.log('Best Hot Water Score:', minHotWaterScore[0], minHotWaterScore[1]);
});

// const leaderboardData = [
//     { rank: 1, name: "Gibbons Dorm", score: 1500 },
//     { rank: 2, name: "Lyle-Maupin Dorm", score: 1000 },
//     { rank: 3, name: "McCormick Dorm", score: 500 },
//     // ... other entries ...
// ];

// // Function to populate the leaderboard table
// function populateLeaderboardTable(data) {
//     const table = document.querySelector(".leaderboard .leaderboard-table");
//     // Assuming the table is empty, add the header row first
//     let headerHtml = '<tr class="header-row"><th>Rank</th><th>Name</th><th>Score</th></tr>';
//     table.innerHTML = headerHtml; // Set the headers

//     // Populate the data rows
//     data.forEach(entry => {
//         let rowHtml = `<tr>
//                          <td>${entry.rank}</td>
//                          <td>${entry.name}</td>
//                          <td>${entry.score}</td>
//                        </tr>`;
//         table.innerHTML += rowHtml; // Append the rows
//     });
// }

// document.addEventListener('DOMContentLoaded', () => {
//     populateLeaderboardTable(leaderboardData);
// });