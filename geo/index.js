// dimension of the page
const window_dims = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const svgWidth = window_dims.width / 2;
const svgHeight = window_dims.width / 3;

const loadData = d3.json("./world.geojson").then((data) => {
    const svg = d3
        .select(".choropleth")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .call(
            d3
                .drag()
                .subject(() => ({ x: 0, y: 0 }))
                .on("drag", handleDrag)
        );

    const projection = d3
        .geoOrthographic()
        .scale(250)
        .translate([svgWidth / 2, svgHeight / 2])
        .clipAngle(90);

    const geoPath_generator = d3.geoPath().projection(projection);

    const colorInterpolator = d3.interpolateRgbBasis(
        [
            "#ffffb2",
            "#fed976",
            "#feb24c",
            "#fd8d3c",
            "#f03b20",
            "#bd0026",
        ].reverse()
    );

    const linearScale = d3.scaleLinear().domain(
        d3.extent(data.features, (d) => {
            return d["properties"]["Movie"];
        })
    );

    // TV Show
    // Movie

    svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", (d) => geoPath_generator(d))
        .attr("fill", (d) =>
            colorInterpolator(linearScale(d["properties"]["Movie"]))
        )
        .attr("stroke", "black");

    function handleDrag(event) {
        // Adjust the projection based on the drag event
        const rotate = projection.rotate();
        const k = svgHeight / 100; // Sensitivity factor for panning
        projection.rotate([rotate[0] + event.dx / k, rotate[1] - event.dy / k]);

        // Redraw the globe
        svg.selectAll("path").attr("d", (d) => geoPath_generator(d));
    }
});
