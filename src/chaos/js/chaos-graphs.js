var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var xScale1 = d3.scale.linear()
    .range([0, width]);

var yScale1 = d3.scale.linear()
    .range([height, 0]);

var xAxis1 = d3.svg.axis()
    .scale(xScale1)
    .orient("bottom");

var yAxis1 = d3.svg.axis()
    .scale(yScale1)
    .orient("left");

var line1 = d3.svg.line()
    .x(function(d) { return xScale1(d.index); })
    .y(function(d) { return yScale1(d.value); });

var xScale2 = d3.scale.linear()
    .range([0, width]);

var yScale2 = d3.scale.linear()
    .range([height, 0]);

var xAxis2 = d3.svg.axis()
    .scale(xScale2)
    .orient("bottom");

var yAxis2 = d3.svg.axis()
    .scale(yScale2)
    .orient("left");

var x0 = 0.06
var samples = 100

function DataPoint(index, previousValue, value) {
    this.index = index;
    this.previousValue = previousValue;
    this.value = value;
}

var logistic = function(x, k) {
    return k*x*(1-x);
}

var quadratic = function(x, k) {
    return k-(x*x);
}

function rnd(x,p) {
    //error checking
    if(p<0) {
        p=0;
    } else if(p>10) {
        p=10;
    }
    var a=[1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000,10000000000];
    return Math.round(x*a[p])/a[p];
}

function graph(graphName, f, x, k) {

    var data = [];
    data.push(new DataPoint(0, rnd(x0, 10), rnd(f(x0, k), 10)));

    for (var i=1; i<=samples; i++) {
        var previousX = data.pop();
        var nextX = f(previousX.value, k);
        data.push(previousX);
        data.push(new DataPoint(i, rnd(previousX.value, 10), rnd(nextX, 10)));
    }

    // Draw the t v.s. x graph

    var svg1 = d3.select("#" + graphName + "Div").append("svg")
        .attr("id", graphName + "1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale1.domain(d3.extent(data, function(d) { return d.index; }));
    yScale1.domain(d3.extent(data, function(d) { return d.value; }));

    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis1);

    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis1);

    svg1.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line1);

    // Draw the x v.s. x+1 graph

    var svg2 = d3.select("#" + graphName + "Div").append("svg")
        .attr("id", graphName + "2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale2.domain(d3.extent(data, function(d) { return d.previousValue; }));
    yScale2.domain(d3.extent(data, function(d) { return d.value; }));

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis2);

    svg2.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function(d) {
            return xScale2(d.previousValue);
        })
        .attr("cy", function(d) {
            return yScale2(d.value);
        })
        .attr("r", 3);
}

function updateKLabel(labelId, newValue) {
    var label = document.getElementById(labelId)
    label.innerHTML = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>k</mi><mo>=</mo><mn>' + newValue + '</mn></math>';
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, labelId]);
}

function updateLogisticSlider(slideAmount) {
    updateKLabel("logisticKLabel", slideAmount);
    $("#logisticGraph1").remove();
    $("#logisticGraph2").remove();
    graph("logisticGraph", logistic, 0.4, slideAmount);
}

function updateQuadraticSlider(slideAmount) {
    updateKLabel("quadraticKLabel", slideAmount);
    $("#quadraticGraph1").remove();
    $("#quadraticGraph2").remove();
    graph("quadraticGraph", quadratic, 0.4, slideAmount);
}