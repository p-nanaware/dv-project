// Feel free to change or delete any of the code you see in this editor!
var svg = d3.select("#barChartRaceContainer").append("svg")
    .attr("width", 960)
    .attr("height", 600);


var tickDuration = 2500;

var top_n = 4;
var height = 600;
var width = 960;

const margin = {
    top: 80,
    right: 0,
    bottom: 5,
    left: 0
};

let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

let subTitle = svg.append("text")
    .attr("class", "subTitle")
    .attr("y", 55)
    .html("Value");

let caption = svg.append('text')
    .attr('class', 'caption')
    .attr('x', width)
    .attr('y', height - 5)
    .style('text-anchor', 'end')

let year = 2008;


d3.csv('https://raw.githubusercontent.com/p-nanaware/dv-project/main/data/platform_count.csv').then(function (data) {
    //if (error) throw error;

    console.log(data);

    data.forEach(d => {
        d.value = +d.value,
            d.lastValue = +d.lastValue,
            d.value = isNaN(d.value) ? 0 : d.value,
            d.year = +d.year; // Convert 'year' to a number
        if (d.name === 'Netflix') {
            d.colour = '#E50914';
        } else if (d.name === 'Hulu') {
            d.colour = '#1DBF73'; // Hulu green
        } else if (d.name === 'Amazon Prime Video') {
            d.colour = '#00A8E1'; // Amazon blue
        } else if (d.name === 'Disney') {
            d.colour = '#003366'; // Disney blue
        }

        else {
            d.colour = d3.hsl(Math.random() * 360, 0.75, 0.75);
        }
    });


    let yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
        .sort((a, b) => b.value - a.value)
        .slice(0, top_n);

    yearSlice.forEach((d, i) => d.rank = i);

    console.log('yearSlice: ', yearSlice)

    let x = d3.scaleLinear()
        .domain([0, d3.max(yearSlice, d => d.value)])
        .range([margin.left, width - margin.right - 65]);

    let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height - margin.bottom, margin.top]);

    let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

    svg.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);

    svg.selectAll('rect.bar')
        .data(yearSlice, d => d.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', d => x(d.value) - x(0) - 1)
        .attr('y', d => y(d.rank) + 15)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', d => d.colour);

    svg.selectAll('text.label')
        .data(yearSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) - 20)
        .html(d => d.name);

    svg.selectAll('text.valueLabel')
        .data(yearSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
        .html(d => d3.format(',.0f')(d.lastValue));

    let yearText = svg.append('text')
        .attr('class', 'yearText')
        .attr('x', width - margin.right)
        .attr('y', height - 25)
        .style('text-anchor', 'end')
        .html(~~year)

    function tickerCallback(e) {

        yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
            .sort((a, b) => b.value - a.value)
            .slice(0, top_n);

        yearSlice.forEach((d, i) => d.rank = i);

        //console.log('IntervalYear: ', yearSlice);

        x.domain([0, d3.max(yearSlice, d => d.value)]);

        svg.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .call(xAxis);

        let bars = svg.selectAll('.bar').data(yearSlice, d => d.name);

        bars
            .enter()
            .append('rect')
            .attr('class', d => `bar ${d.name.replace(/\s/g, '_')}`)
            .attr('x', x(0) + 1)
            .attr('width', d => x(d.value) - x(0) - 1)
            .attr('y', d => y(top_n + 1) + 5)
            .attr('height', y(1) - y(0) - barPadding)
            .style('fill', d => d.colour)
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + 5);

        bars
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d.value) - x(0) - 1)
            .attr('y', d => y(d.rank) + 5);

        bars
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d.value) - x(0) - 1)
            .attr('y', d => y(top_n + 1) + 5)
            .remove();

        let labels = svg.selectAll('.label')
            .data(yearSlice, d => d.name);

        labels
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(top_n + 1) + 5)
            .html(d => d.name)
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) - 20);


        labels
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) - 20);

        labels
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(top_n + 1) + 5)
            .remove();



        let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.name);

        valueLabels
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(top_n + 1) + 5)
            .html(d => d3.format(',.0f')(d.lastValue))
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1);

        valueLabels
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1)
            .tween("text", function (d) {
                let i = d3.interpolateRound(d.lastValue, d.value);
                return function (t) {
                    this.textContent = d3.format(',')(i(t));
                };
            });


        valueLabels
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(top_n + 1) + 5)
            .remove();

        yearText.html(~~year);


        if (year == 2021) ticker.stop();
        year = d3.format('.1f')((+year) + 1.0);
    }

    let ticker = d3.interval(tickerCallback, tickDuration);

    let replayButton = document.getElementById("replayButton");

    replayButton.addEventListener("click", function () {
        year = 2008;
        ticker.stop();
        ticker = d3.interval(tickerCallback, tickDuration);
    });

});

