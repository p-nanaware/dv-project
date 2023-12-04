d3.csv("data.csv").then(function(data) {

    var urlParams = new URLSearchParams(window.location.search);
    var param1Value = urlParams.get('param1');
    console.log(`param1Value bc: ${param1Value}`);
            
    var ctx = document.getElementById('platformChart').getContext('2d');
    var platformChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function updateChart(country) {

        var filteredData = data.filter(d => d.country === country);

        var outputElement = document.getElementById('countryName');
        outputElement.innerHTML = country;

        var platforms = [...new Set(filteredData.map(d => d.platform))];
        var moviesData = platforms.map(platform => {
            return filteredData.filter(d => d.type === 'Movie' && d.platform === platform).length;
        });
        var tvShowsData = platforms.map(platform => {
            return filteredData.filter(d => d.type === 'TV Show' && d.platform === platform).length;
        });

        platformChart.data.labels = platforms;
        platformChart.data.datasets = [
            {
                label: 'Movies',
                data: moviesData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            },
            {
                label: 'TV Shows',
                data: tvShowsData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }
        ];
        platformChart.update();
    }

    updateChart(param1Value);
});