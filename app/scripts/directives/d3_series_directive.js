"use strict";
angular.module("d3SeriesDirective", ["d3"])
  .directive("d3Series", ["$window", "d3Service", "$log", "$filter",
    function ($window, d3Service, $log, $filter) {
      return {
        restrict: "E",
        scope: {
          data: "=",
          title: "@chartTitle",
          width: "@chartWidth",
          height: "@chartHeight",
          paddingTop: "@chartPaddingTop",
          paddingBottom: "@chartPaddingBottom",
          paddingLeft: "@chartPaddingLeft",
          paddingRight: "@chartPaddingRight"
        },
        template: '<div class="chart-container"></div>',
        replace: true,
        link: function (scope, element) {
          d3Service.d3().then(function (d3) {
            $log.log("Called d3Series link function");

            var d3Element = d3.select(element[0]);

            var padding = {
              top: parseInt(scope.paddingTop, 10) || 50,
              bottom: parseInt(scope.paddingBottom, 10) || 50,
              left: parseInt(scope.paddingLeft, 10) || 50,
              right: parseInt(scope.paddingRight, 10) || 200
            },
              width = parseInt(scope.width, 10) || parseInt(d3Element.style('width'), 10) || 800,
              height = parseInt(scope.height, 10) || parseInt(d3Element.style('height'), 10) || 230,
              innerWidth = width - padding.left - padding.right,
              innerHeight = height - padding.top - padding.bottom;

            var x = d3.time.scale()
              .range([0, innerWidth]);

            var y = d3.scale.linear()
              .range([innerHeight, 0]);

            // var color = d3.scale.category10();
            var color = d3.scale.ordinal()
              .range(["#4682B4", "#1A3E71", "#3FA9F5", "#B0C4DE", "#AFEEEE", "#d0743c", "#ff8c00"]);
            // var color = d3.scale.ordinal().range(["#98abc5", "#d0743c", "#ff8c00", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

            var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .tickFormat(function (d) {
                return $filter('date')(d, 'd MMM');
              });

            var yAxis = d3.svg.axis()
              .scale(y)
              .ticks(5)
              .orient("left")
              .tickFormat(function (d) {
                return $filter('number')(d);
              });

            var line = d3.svg.line()
            // .interpolate("basis")
            .x(function (d) {
              return x(d.date);
            })
              .y(function (d) {
                return y(d.value);
              });

            var area = d3.svg.area()
            // .interpolate("basis")
            .x(function (d) {
              return x(d.date);
            })
              .y1(function (d) {
                return y(d.value);
              })
              .y0(innerHeight);

            var svg = d3Element
              .append("svg")
              .attr("width", width)
              .attr("height", height);

            var chart = svg
              .append("g")
              .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

            var tooltip = d3Element
              .append("div")
              .attr("class", "chart-tooltip")
              .style("display", "none");

            var legend = svg
              .append("g")
              .attr("transform", "translate(" + (innerWidth + padding.left + 10) + "," + padding.top + ")");

            scope.$watch("data", function (newData) {
              $log.log("$watch d3Series data", newData);
              scope.render(newData);
            }, true);

            scope.render = function (data) {
              $log.log("Render d3Series chart");

              chart.selectAll("*")
                .remove();

              legend.selectAll("*")
                .remove();

              if (!data) {
                return;
              }

              chart.append("rect")
                .attr("class", "overlay")
                .attr("width", innerWidth)
                .attr("height", innerHeight);

              var meta = data.meta;
              data = data.data;

              color.domain(meta);

              x.domain(d3.extent(data[0].values, function (d) {
                return d.date;
              }));

              y.domain([0, d3.max(data, function (d) {
                return d3.max(d.values, function (v) {
                  return v.value * 1.3;
                });
              })]);
              xAxis.ticks(d3.time.days, (data[0].values.length <= 7) ? null : 4);

              chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerHeight + ")")
                .call(xAxis);

              var yAxisTicks = chart.append("g")
                .attr("class", "y axis")
                .call(yAxis);

              yAxisTicks.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end");

              yAxisTicks.selectAll("line")
                .attr("x2", innerWidth);

              var section = chart.selectAll(".section")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "section");

              section.append("path")
                .attr("class", "line")
                .attr("d", function (d) {
                  return line(d.values);
                })
                .style("stroke", function (d) {
                  return color(d.name);
                });

              section.selectAll("circle")
                .data(function (d) {
                  /*return d.values.filter(function (d) {
                      return d.hasOwnProperty("label");
                    });*/
                  return d.values;
                })
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", function (d) {
                  return x(d.date);
                })
                .attr("cy", function (d) {
                  return y(d.value);
                })
                .style("fill", function (d) {
                  return color(d3.select(this.parentNode)
                    .datum()
                    .name);
                });

              section.append("path")
                .attr("class", "area")
                .attr("d", function (d) {
                  return area(d.values);
                })
                .style("fill", function (d) {
                  return color(d3.select(this.parentNode)
                    .datum()
                    .name);
                });

              var focus = chart.append("g")
                .attr("class", "focus")
                .style("display", "none");

              focus.append("circle")
                .attr("r", 8);

              /*focus.append("text")
                  .attr("x", 10)
                  .attr("y", 10)
                  .attr("dy", ".35em")
                  .attr("class", "tooltip");*/

              function mousemove() {
                var coordinates = d3.mouse(this);
                var x01 = x.invert(coordinates[0]),
                  y01 = y.invert(coordinates[1]),
                  bisectData = data[0].values,
                  bisectDate = d3.bisector(function (d) {
                    return d.date;
                  })
                    .left,
                  i = bisectDate(bisectData, x01);

                if (bisectData.length === 0) {
                  i = 0;
                } else if (i < bisectData.length && i > 0) {
                  var d0 = bisectData[i - 1],
                    d1 = bisectData[i];
                  i = x01 - d0.date > d1.date - x01 ? i : (i - 1);
                } else if (i === bisectData.length) {
                  i = bisectData.length - 1;
                }

                var d = bisectData[i];
                var value = d.value;
                var nextSeriesValue, j, l, yy01 = y(y01),
                  closestSeries = 0;

                for (j = 1, l = data.length; j < l; j = j + 1) {
                  nextSeriesValue = data[j].values[i].value;
                  if (Math.abs(y(nextSeriesValue) - yy01) <= Math.abs(y(value) - yy01)) {
                    value = nextSeriesValue;
                    closestSeries = j;
                  }
                }

                var closestName = data[closestSeries].name;

                try {
                  var activeSeries = section.select('path.line.active').datum();

                  if (Math.abs(y(data[closestSeries].values[i].value) - yy01) >= Math.abs(y(activeSeries.values[i].value) - yy01)) {
                    closestName = activeSeries.name;
                  }
                } catch (error) {}

                focus.attr("transform", "translate(" + x(d.date) + "," + y(value) + ")");
                tooltip.html('<span class="chart-tooltip-date">' + $filter('date')(d.date) + "</span>" + "<br />" + '<span class="chart-tooltip-label">' + scope.$root.label['aui.chart.' + closestName] + ": </span>" + '<span class="chart-tooltip-value">' + $filter('number')(value) + "</span>");

                tooltip.style("left", (x(d.date) + padding.left + 20) + "px")
                  .style("top", (y(value) + padding.top - 30) + "px");
              }

              focus.on("mouseover", function (d) {
                tooltip
                  .style("display", null);
              })
                .on("mouseout", function (d) {
                  tooltip.style("display", "none");
                });

              chart.on("mouseenter", function () {
                focus.style("display", null);
              })
                .on("mouseleave", function () {
                  focus.style("display", "none");
                })
                .on("mousemove", mousemove);

              var legendEntry = legend.selectAll(".legend-entry")
                .data(meta)
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                  return "translate(100," + (5 + i * 25) + ")";
                })
                .attr("class", "legend-entry");
              legendEntry.append("rect")
                .attr("x", 15)
                .attr("y", 5)
                .attr("width", 10)
                .attr("height", 10)
                .style("stroke", color)
                .on('click', function (d, i) {
                  section.select('path.line')
                    .classed("active", false);

                  section.select('path.area')
                    .classed("active", false);

                  legendEntry.select("rect")
                    .style("fill", "#fff");

                  if (angular.element(this)
                    .hasClass("active")) {
                    d3.select(this)
                      .classed("active", false);
                  } else {
                    legendEntry.select("rect")
                      .classed("active", false);
                    d3.select(this)
                      .classed("active", true);
                    d3.select(this)
                      .style("fill", color(d));

                    var elem = section.filter(function (dd, ii) {
                      return ii === i;
                    });

                    var rawElem = elem[0][0];
                    var parent = rawElem.parentNode;

                    parent.appendChild(rawElem);
                    parent.appendChild(focus[0][0]);

                    elem.select("path.line")
                      .classed("active", true);

                    elem.select("path.area")
                      .classed("active", true);
                  }

                });

              legendEntry.append("text")
                .attr("x", 0)
                .attr("y", 10)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                  return scope.$root.label['aui.chart.' + d];
                });

              chart.append("text")
                .attr("dy", "-1em")
                .attr("class", "series-chart-title")
                .text(scope.title);

            };
          });
        }
      };
    }
  ]);
