d3.json('durations.json').then(function(data) {

    var urlParams = new URLSearchParams(window.location.search);
    var param1Value = urlParams.get('param1');
    console.log(`param1Value lc: ${param1Value}`);

    data.forEach(function(d) {
        d.release_year = new Date(+d.release_year, 0, 1);
        d.duration = +d.duration;
    });

    var margin = {top: 40, right: 20, bottom: 50, left: 70},
        width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valueline = d3.line()
        .x(function(d) { return x(d.release_year); })
        .y(function(d) { return y(d.duration); });

    var svg = d3.select("#lineChartSVG")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function(d) { return d.release_year; }));
    y.domain([0, d3.max(data, function(d) { return d.duration; })]);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axis-label")
        .attr('stroke', 'white')
        .attr('fill', 'white')
        .attr('stroke-width', '0.05')
        .text("Average Minutes");

    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.bottom - 10) + ")")
        .attr("class", "axis-label")
        .attr('stroke', 'white')
        .attr('fill', 'white')
        .attr('stroke-width', '0.05')
        .text("Year");

    function updateData(selectedCountry) {
        var filteredData = data.filter(function(d) { return d.country === selectedCountry; });
        svg.selectAll(".line")
            .data([filteredData])
            .attr("d", valueline);
    }

    updateData(param1Value);

})