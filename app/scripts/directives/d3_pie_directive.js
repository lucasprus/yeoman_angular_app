'use strict';
angular.module('d3PieDirective', ['d3'])
  .directive('d3Pie', ['$window', 'd3Service', '$log', '$filter',
    function ($window, d3Service, $log, $filter) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          title: '@chartTitle',
          key: '@',
          value: '@',
          width: '@chartWidth',
          height: '@chartHeight',
          paddingTop: '@chartPaddingTop',
          paddingBottom: '@chartPaddingBottom',
          paddingLeft: '@chartPaddingLeft',
          paddingRight: '@chartPaddingRight',
          maxSlices: '@',
          radius: '@',
          minRadius: '@',
          maxRadius: '@'
        },
        template: '<div class="chart-container"></div>',
        replace: true,
        link: function (scope, element) {

          d3Service.d3().then(function (d3) {

            $log.log('Called d3Pie link function');

            var dataKey = scope.key,
              dataValue = scope.value,
              d3Element = d3.select(element[0]),
              padding = {
                top: parseInt(scope.paddingTop, 10) || 50,
                bottom: parseInt(scope.paddingBottom, 10) || 50,
                left: parseInt(scope.paddingLeft, 10) || 50,
                right: parseInt(scope.paddingRight, 10) || 50
              },
              width = parseInt(scope.width, 10) || parseInt(d3Element.style('width'), 10) || 800,
              height = parseInt(scope.height, 10) || parseInt(d3Element.style('height'), 10) || 400,
              innerWidth = width - padding.left - padding.right,
              innerHeight = height - padding.top - padding.bottom,
              radius = parseInt(scope.radius, 10) || Math.min(innerWidth, innerHeight) / 2,
              minRadius = parseInt(scope.minRadius, 10) || null,
              maxRadius = parseInt(scope.maxRadius, 10) || null;

            if (minRadius) {
              radius = Math.max(radius, minRadius);
            }

            if (maxRadius) {
              radius = Math.min(radius, maxRadius);
            }

            var maxSlices = parseInt(scope.maxSlices, 10) || 7;

            var color = d3.scale.category10();
            /*var color = d3.scale.ordinal()
              .range(['#4682B4', '#AFDDEE', '#1A3E71', '#3FA9F5', '#B0C4DE', '#8388B2', '#5884B2', '#8388B2']);*/
            // var color = d3.scale.ordinal().range(['#98abc5', '#d0743c', '#ff8c00', '#8a89a6', '#7b6888', '#6b486b', '#a05d56']);

            var svg = d3Element.append('svg')
              .attr('width', width)
              .attr('height', height);

            var tooltip = d3Element
              .append('div')
              .attr('class', 'chart-tooltip')
              .style('display', 'none');

            var arc = d3.svg.arc()
              .outerRadius(radius - 10)
              .innerRadius(0);

            var pie = d3.layout.pie()
              .sort(null)
              .value(function (d) {
                return d[dataValue];
              });

            scope.$watch('data', function (newData) {
              $log.log('$watch d3Pie data', newData);
              scope.render(newData);
            }, true);

            scope.render = function (data) {
              $log.log('Render d3Pie chart');

              svg.selectAll('*')
                .remove();

              svg.append('text')
                .attr('transform', 'translate(' + (padding.left) + ',0)')
                .attr('dy', '3em')
                .attr('class', 'pie-chart-title')
                .text(scope.title);

              var legend = svg
                .append('g')
                .attr('transform', 'translate(' + (innerWidth + padding.left) + ',' + padding.top + ')');

              if (!data || !data.length) {
                svg.append('circle')
                  .attr('r', radius - 10)
                  .attr('class', 'pie-chart-no-data-circle')
                  .attr('transform', 'translate(' + (padding.left + radius) + ',' + (padding.top + radius) + ')');

                svg.append('text')
                  .attr('transform', 'translate(' + (padding.left + radius) + ',' + (padding.top + radius) + ')')
                  .attr('dy', '1em')
                  .attr('class', 'pie-chart-no-data-text')
                  .style('text-anchor', 'middle')
                  .text('No data available');

                return;
              }

              var dataCopy = angular.copy(data);

              var chart = svg
                .append('g')
                .attr('transform', 'translate(' + (padding.left + radius) + ',' + (padding.top + radius) + ')');

              var total = 0;
              dataCopy.forEach(function (d) {
                total += d[dataValue];
              });

              /*dataCopy.sort(function (a, b) {
                if (a[dataValue] > b[dataValue]) {
                  return -1;
                }

                if (a[dataValue] < b[dataValue]) {
                  return 1;
                }

                return 0;
              });*/

              if (maxSlices < dataCopy.length) {
                var others = dataCopy.splice(maxSlices - 1, dataCopy.length - maxSlices + 1);

                var othersTotal = 0;
                others.forEach(function (d) {
                  othersTotal = othersTotal + d[dataValue];
                });

                var othersObj = {};
                othersObj[dataKey] = 'others';
                othersObj[dataValue] = othersTotal;

                dataCopy.push(othersObj);
              }

              dataCopy.forEach(function (d) {
                d.percentage = d3.format('%')(d[dataValue] / total);
              });

              var g = chart.selectAll('.arc')
                .data(pie(dataCopy))
                .enter()
                .append('g')
                .attr('class', 'arc');

              g.append('path')
                .attr('d', arc)
                .style('fill', function (d) {
                  return color(d.data[dataKey]);
                });

              g.append('text')
                .attr('transform', function (d) {
                  return 'translate(' + arc.centroid(d)
                    .map(function (v) {
                      return 1.2 * v;
                    }) + ')';
                })
                .attr('dy', '.35em')
                .style('text-anchor', 'middle')
                .text(function (d) {
                  return d.data.percentage;
                });

              g
                .on('mouseenter', function (d) {

                  var centroid = arc.centroid(d);

                  tooltip
                    .style('display', null)
                    .html('<span class=\"chart-tooltip-label\">' + d.data[dataKey] + ': </span>' + '<span class=\"chart-tooltip-value\">' + $filter('number')(d.data[dataValue]) + '</span>');

                  var tooltipWidth = parseInt(tooltip.style('width'), 10) || 0,
                    tooltipPaddingLeft = parseInt(tooltip.style('padding-left'), 10) || 0,
                    tooltipBorderLeft = parseInt(tooltip.style('border-left'), 10) || 0,
                    tooltipPaddingRight = parseInt(tooltip.style('padding-right'), 10) || 0,
                    tooltipBorderRight = parseInt(tooltip.style('border-right'), 10) || 0;

                  var tooltipHeight = parseInt(tooltip.style('height'), 10) || 0,
                    tooltipPaddingTop = parseInt(tooltip.style('padding-top'), 10) || 0,
                    tooltipBorderTop = parseInt(tooltip.style('border-top'), 10) || 0,
                    tooltipPaddingBottom = parseInt(tooltip.style('padding-bottom'), 10) || 0,
                    tooltipBorderBottom = parseInt(tooltip.style('border-bottom'), 10) || 0;

                  var totalTooltipWidth = tooltipWidth + tooltipPaddingLeft + tooltipBorderLeft + tooltipPaddingRight + tooltipBorderRight,
                    totalTooltipHeight = tooltipHeight + tooltipPaddingTop + tooltipBorderTop + tooltipPaddingBottom + tooltipBorderBottom;

                  var cosine = centroid[0] / (radius / 2),
                    sine = centroid[1] / (radius / 2);

                  this.setAttribute('transform', 'translate(' + 3 * cosine + ',' + 3 * sine + ')');

                  tooltip
                    .style('left', padding.left + radius + centroid[0] * 2 + ((20 + totalTooltipWidth / 2) * cosine) - totalTooltipWidth / 2 + 'px')
                    .style('top', padding.top + radius + centroid[1] * 2 + ((20 + totalTooltipHeight / 2) * sine) - totalTooltipHeight / 2 + 'px');

                })
                .on('mouseleave', function () {
                  tooltip.style('display', 'none');

                  // var arcStyle = this.getElementsByTagName('path')[0].style;
                  // arcStyle.stroke = null;
                  // arcStyle.strokeWidth = null;

                  this.removeAttribute('transform');

                });

              var legendEntry = legend.selectAll('.legend')
                .data(dataCopy)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (d, i) {
                  return 'translate(0,' + i * 20 + ')';
                });

              legendEntry.append('rect')
                .attr('x', 12)
                .attr('y', 4)
                .attr('width', 12)
                .attr('height', 12)
                .style('fill', function (d) {
                  return color(d[dataKey]);
                });

              legendEntry.append('text')
                .attr('x', 0)
                .attr('y', 10)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text(function (d) {
                  return d[dataKey];
                });

            };
          });
        }
      };
    }
  ]);
