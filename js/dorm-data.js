d3.csv('https://raw.githubusercontent.com/KhanradCoder/hoya-hacks/main/firstyearhousing_monthy.csv').then(function(data) {
  //Get Scores for Specific House
  var houseNames = Array.from(new Set(data.map(function(d) { return d.House; })));

  var selectElement = document.getElementById('house-select');

  // Populate the select element with house names
  var optionElement = document.createElement('option');
  optionElement.value = "Select a House";
  optionElement.text = "Select a House";
  selectElement.appendChild(optionElement);
  houseNames.forEach(function(houseName) {
    var optionElement = document.createElement('option');
    optionElement.value = houseName;
    optionElement.text = houseName;
    selectElement.appendChild(optionElement);
  });
  var house_name = 'Page';
  var myChart;
  // Add event listener to update house_name when a new option is selected
  selectElement.addEventListener('change', function() {
    if (myChart){
      myChart.destroy();
    }
    house_name = this.value;
    var houseData = data.filter(function(d) { return d.House === house_name; });
    const columnNames = data.columns
    const months = columnNames.slice(columnNames.length - 14, columnNames.length - 2);
    var electricity = houseData.find(function(d) { return d.Type === 'Electricity'; });
    electricity = months.map(function(month) { 
      return electricity && electricity[month] ? parseFloat(electricity[month].replace(/,/g, '')) : 0; 
    });

    var chilledWater = houseData.find(function(d) { return d.Type === 'Chilled Water'; });
    chilledWater = months.map(function(month) { 
      return chilledWater && chilledWater[month] ? parseFloat(chilledWater[month].replace(/,/g, '')) : 0; 
    });

    var mthw = houseData.find(function(d) { return d.Type === 'MTHW'; });
    mthw = months.map(function(month) { 
      return mthw && mthw[month] ? parseFloat(mthw[month].replace(/,/g, '')) : 0; 
    });

    var steam = houseData.find(function(d) { return d.Type === 'Steam'; });
    steam = months.map(function(month) { 
      return steam && steam[month] ? parseFloat(steam[month].replace(/,/g, '')) : 0; 
    });

    //Combination of steam and mthw
    var heat = mthw.map(function(value, index) {
      return value + (steam[index] || 0);
    });

    var naturalGas = houseData.find(function(d) { return d.Type === 'Natural Gas'; });
    naturalGas = months.map(function(month) { 
      return naturalGas && naturalGas[month] ? parseFloat(naturalGas[month].replace(/,/g, '')) : 0; 
    });

    var score_electric = electricity.map(function(value) {return (0.000259*value)});
    var score_chilledWater = chilledWater.map(function(value) {return (0.017048*value)});
    var score_hotWater = heat.map(function(value) {return (0.059224*value)});
    var score_naturalGas = naturalGas.map(function(value) {return (0.053068*value)});
    //Chart
    var ctx = document.getElementById('chart').getContext('2d');
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Electricity',
          data: score_electric,
          backgroundColor: 'rgb(190, 156, 146, 0.2)',
          borderColor: 'rgb(190, 156, 146, 1)',
          borderWidth: 1
        },
        {
          label: 'Chilled Water',
          data: score_chilledWater,
          backgroundColor: 'rgb(146, 180, 190, 0.2)',
          borderColor: 'rgb(146, 180, 190, 1)',
          borderWidth: 1
        },
        {
          label: 'Hot Water',
          data: score_hotWater,
          backgroundColor: 'rgb(178, 146, 190, 0.2)',
          borderColor: 'rgb(178, 146, 190, 1)',
          borderWidth: 1
        },
        {
          label: 'Natural Gas',
          data: score_naturalGas,
          backgroundColor: 'rgb(146, 190, 156, 0.2)',
          borderColor: 'rgb(146, 190, 156, 1)',
          borderWidth: 1
        }  
        ]
      },
      options: {
        title: {
          display: true,
          text: house_name+' House Environmental Impact',
        },
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            ticks: {
              min: 0,
              suggestedMax: 18
            }
          }
        }
      }
    });

    //Get Rankings
    var totalScores = {};
    var electricScores = {};
    var chilledWaterScores = {}; 
    var hotWaterScores = {};
    var lastMonth = months[months.length - 1];
    data.forEach(element => {
      var houseData = data.filter(function(item) { return item.House === element.House});

      var electricity = houseData.find(function(d) { return d.Type === 'Electricity'; });
      electricity = electricity && electricity[lastMonth] ? parseFloat(electricity[lastMonth].replace(/,/g, '')) : 0;

      var chilledWater = houseData.find(function(d) { return d.Type === 'Chilled Water'; });
      chilledWater = chilledWater && chilledWater[lastMonth] ? parseFloat(chilledWater[lastMonth].replace(/,/g, '')) : 0;

      var mthw = houseData.find(function(d) { return d.Type === 'MTHW'; });
      mthw = mthw && mthw[lastMonth] ? parseFloat(mthw[lastMonth].replace(/,/g, '')) : 0;

      var steam = houseData.find(function(d) { return d.Type === 'Steam'; });
      steam = steam && steam[lastMonth] ? parseFloat(steam[lastMonth].replace(/,/g, '')) : 0;

      //Combination of steam and mthw
      var hotWater = mthw + steam;

      var total = electricity + chilledWater + hotWater;

      totalScores[element.House] = total;
      electricScores[element.House] = electricity;
      chilledWaterScores[element.House] = chilledWater;
      hotWaterScores[element.House] = hotWater;
    });
  });
});