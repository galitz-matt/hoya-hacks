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
                      <td>${Math.trunc(entry.score)}</td>
                    </tr>`;
      table.innerHTML += rowHtml; // Append the rows
  });
}
document.addEventListener('DOMContentLoaded', () => {
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

    electricScores[element.House] = ((lastElectricity - electricMean) / electricStd) + 4;
    chilledWaterScores[element.House] = ((lastChilledWater - chilledWaterMean) / chilledWaterStd) + 4;
    if (isNaN(chilledWaterScores[element.House])) {
      chilledWaterScores[element.House] = 0;
    }
    hotWaterScores[element.House] =  ((lastHotWater - hotWaterMean) / hotWaterStd) + 4;
    totalScores[element.House] = Math.log((0.7*electricScores[element.House] + 0.1*chilledWaterScores[element.House] + 0.2*hotWaterScores[element.House]))*1000;
  });

  var sortedTotalScores = Object.entries(totalScores).sort((a, b) => a[1] - b[1]);
  const leaderboardData = sortedTotalScores.map((entry, index) => {
    return { rank: index + 1, name: entry[0], score: entry[1] };
  });
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: leaderboardData.map(entry => entry.name),
      datasets: [{
        label: 'Score',
        data: leaderboardData.map(entry => entry.score),
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(27, 162, 162, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(27, 162, 162, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Add this line
        }
      }
    }
  });
  });
});