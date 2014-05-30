'use strict';
angular.module('d3BarsDirective', ['d3'])
  .directive('d3Bars', ['$window', 'd3Service', '$log', '$filter',
    function ($window, d3Service, $log, $filter) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          title: '@chartTitle',
          width: '@chartWidth',
          height: '@chartHeight',
          paddingTop: '@chartPaddingTop',
          paddingBottom: '@chartPaddingBottom',
          paddingLeft: '@chartPaddingLeft',
          paddingRight: '@chartPaddingRight'
        },
        template: '<div class="chart-container"></div>',
        replace: true,
        link: function (scope, element) {
          d3Service.d3().then(function (d3) {
            $log.log('Called d3Bars link function');

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

            var x0 = d3.scale.ordinal()
              .rangeRoundBands([0, innerWidth], 0.1);
            var x1 = d3.scale.ordinal();
            var y = d3.scale.linear()
              .range([innerHeight, 0]);

            // var color = d3.scale.category10();
            var color = d3.scale.ordinal()
              .range(['#4682B4', '#1A3E71', '#3FA9F5', '#B0C4DE', '#AFEEEE', '#d0743c', '#ff8c00']);
            // var color = d3.scale.ordinal().range(['#98abc5', '#d0743c', '#ff8c00', '#8a89a6', '#7b6888', '#6b486b', '#a05d56']);

            var xAxis = d3.svg.axis()
              .scale(x0)
              .orient('bottom');

            var yAxis = d3.svg.axis()
              .scale(y)
              .ticks(5)
              .orient('left')
              .tickFormat(function (d) {
                return $filter('number')(d);
              });

            var svg = d3Element
              .append('svg')
              .attr('width', width)
              .attr('height', height);

            var chart = svg
              .append('g')
              .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

            var tooltip = d3Element
              .append('div')
              .attr('class', 'chart-tooltip')
              .style('display', 'none');

            var legend = svg
              .append('g')
              .attr('transform', 'translate(' + (innerWidth + padding.left + 10) + ',' + padding.top + ')');

            scope.$watch('data', function (newData) {
              $log.log('$watch d3Bars data', newData);
              scope.render(newData);
            }, true);

            scope.render = function (data) {
              $log.log('Render d3Bars chart');

              chart.selectAll('*')
                .remove();

              legend.selectAll('*')
                .remove();

              if (!data) {
                return;
              }

              var valueNames = data[0].value.map(function (d) {
                return d.key;
              });

              x0.domain(data.map(function (d) {
                return d.key;
              }));

              x1.domain(valueNames)
                .rangeRoundBands([0, x0.rangeBand()]);

              y.domain([0, d3.max(data, function (d) {
                return d3.max(d.value, function (d) {
                  return d.value * 1.3;
                });
              })]);

              chart.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + innerHeight + ')')
                .call(xAxis);

              var yAxisTicks = chart.append('g')
                .attr('class', 'y axis')
                .call(yAxis);

              yAxisTicks.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end');

              yAxisTicks.selectAll('line')
                .attr('x2', innerWidth);

              var group = chart.selectAll('.group')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'g')
                .attr('transform', function (d) {
                  return 'translate(' + x0(d.key) + ',0)';
                });

              var bar = group.selectAll('rect')
                .data(function (d) {
                  return d.value;
                })
                .enter()
                .append('rect')
                .attr('width', x1.rangeBand())
                .attr('x', function (d) {
                  return x1(d.key);
                })
                .attr('y', function (d) {
                  return y(d.value);
                })
                .attr('height', function (d) {
                  return innerHeight - y(d.value);
                })
                .style('fill', function (d) {
                  return color(d.key);
                });

              bar.on('mouseenter', function (d, dd, ddd, dddd) {
                tooltip
                  .style('display', null)
                  .html('<span class=\"chart-tooltip-label\">' + scope.$root.label['aui.chart.' + d.key] + ': </span>' + '<span class=\"chart-tooltip-value\">' + $filter('number')(d.value) + '</span>');

                var tooltipWidth = parseInt(tooltip.style('width'), 10) || 0;
                var tooltipPaddingLeft = parseInt(tooltip.style('padding-left'), 10) || 0;
                var tooltipBorderLeft = parseInt(tooltip.style('border-left'), 10) || 0;

                tooltip
                  .style('left', (x1(d.key) + x0(d3.select(this.parentNode)
                    .datum()
                    .key) + padding.left - tooltipWidth / 2 - tooltipPaddingLeft - tooltipBorderLeft + x1.rangeBand() / 2) + 'px')
                  .style('top', (y(d.value) + padding.top - 40) + 'px');
              })
                .on('mouseleave', function () {
                  tooltip.style('display', 'none');
                });

              var legendEntry = legend.selectAll('.legend')
                .data(valueNames)
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (d, i) {
                  return 'translate(100,' + i * 25 + ')';
                });

              legendEntry.append('rect')
                .attr('x', 15)
                .attr('y', 4)
                .attr('width', 12)
                .attr('height', 12)
                .style('fill', color);

              legendEntry.append('text')
                .attr('x', 0)
                .attr('y', 10)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text(function (d) {
                  return scope.$root.label['aui.chart.' + d];
                });

              chart.append('text')
                .attr('dy', '-1em')
                .attr('class', 'bar-chart-title')
                .text(scope.title);

            };
          });
        }
      };
    }
  ]);
