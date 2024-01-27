d3.csv('https://raw.githubusercontent.com/KhanradCoder/hoya-hacks/main/firstyearhousing_monthy.csv').then(function(data) {
  const last_month = 'Dec 2023';
  var totalScores = {};
  var electricScores = {};
  var hotWaterScores = {};
  var waterScores = {}; 
  data.forEach(element => {
    var houseData = data.filter(function(item) { return item.House === element.House});
    var electricity = parseFloat(houseData[0][last_month].replace(/,/g, ''));
    var hotWater = parseFloat(houseData[1][last_month].replace(/,/g, ''));
    var water = parseFloat(houseData[2][last_month].replace(/,/g, ''));

    var z_params = ['Mean', 'Standard Deviation']
    var z_electric = z_params.map(function(param) { return parseFloat(houseData[0][param].replace(/,/g, '')); });
    var z_hotWater = z_params.map(function(param) { return parseFloat(houseData[1][param].replace(/,/g, '')); });
    var z_water = z_params.map(function(param) { return parseFloat(houseData[2][param].replace(/,/g, '')); });
    console.log(z_electric, z_hotWater, z_water);
    var score_electric = ((electricity - z_electric[0]) / z_electric[1]) + 4;
    var score_hotWater = ((hotWater - z_hotWater[0]) / z_hotWater[1]) + 4;
    var score_water = ((water - z_water[0]) / z_water[1]) + 4;

    var total = score_electric + score_hotWater + score_water;
    
    totalScores[element.House] = total;
    electricScores[element.House] = score_electric;
    hotWaterScores[element.House] = score_hotWater;
    waterScores[element.House] = score_water;
  });
  var minTotalScore = Object.entries(totalScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)[0];
  var minElectricScore = Object.entries(electricScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)[0];
  var minHotWaterScore = Object.entries(hotWaterScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)[0];
  var minWaterScore = Object.entries(waterScores).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)[0];

  console.log('Best Total Score:', minTotalScore);
  console.log('Best Electric Score:', minElectricScore);
  console.log('Best Hot Water Score:', minHotWaterScore);
  console.log('Best Water Score:', minWaterScore);
});