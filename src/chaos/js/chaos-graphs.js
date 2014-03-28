var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1024 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var xScale = d3.scale.linear()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return xScale(d.index); })
    .y(function(d) { return yScale(d.value); });

var x0 = 0.06;
var samples = 200;

var chaosGraphs = {

    addGraph: function(graphName, graphFunction, initialK) {

        function DataPoint(index, previousValue, value) {
            this.index = index;
            this.previousValue = previousValue;
            this.value = value;
        }

        function rnd(x,p) {
            //error checking
            if(p<0) {
                p=0;
            } else if(p>15) {
                p=15;
            }
            var a=[
                1,
                10,
                100,
                1000,
                10000,
                100000,
                1000000,
                10000000,
                100000000,
                1000000000,
                10000000000,
                100000000000,
                1000000000000,
                10000000000000,
                100000000000000,
                1000000000000000];
            return Math.round(x*a[p])/a[p];
        }

        function updateKLabel(labelId, newValue) {
            var label = document.getElementById(labelId);
            label.innerHTML = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>k</mi><mo>=</mo><mn>' + newValue + '</mn></math>';
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, labelId]);
        }

        var data = [];
        data.push(new DataPoint(0, rnd(x0, 10), rnd(graphFunction(x0, initialK), 10)));

        for (var i=1; i<=samples; i++) {
            var previousX = data.pop();
            var nextX = graphFunction(previousX.value, initialK);
            data.push(previousX);
            if (isFinite(nextX)) {
                data.push(new DataPoint(i, rnd(previousX.value, 10), rnd(nextX, 10)));
            } else {
                data.push(previousX.copy.index = i);
            }
        }

        // Draw the t v.s. x graph

        var svg1 = d3.select("#" + graphName + "Div").append("svg")
            .attr("id", graphName + "1")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        xScale.domain(d3.extent(data, function(d) { return d.index; }));
        yScale.domain(d3.extent(data, function(d) { return d.value; }));

        svg1.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg1.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg1.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        // Draw the x v.s. x+1 graph

        var svg2 = d3.select("#" + graphName + "Div").append("svg")
            .attr("id", graphName + "2")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        xScale.domain(d3.extent(data, function(d) { return d.previousValue; }));
        yScale.domain(d3.extent(data, function(d) { return d.value; }));

        svg2.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg2.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg2.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function(d) {
                return xScale(d.previousValue);
            })
            .attr("cy", function(d) {
                return yScale(d.value);
            })
            .attr("r", 3);

        return function (kAmount) {
            updateKLabel(graphName + "KLabel", kAmount);
            $("#" + graphName + "1").remove();
            $("#" + graphName + "2").remove();
            chaosGraphs.addGraph(graphName, graphFunction, kAmount);
        }
    }

};