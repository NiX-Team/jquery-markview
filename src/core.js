(function ($, marked) {
    var _loader = function (settings) {
            return (settings.loadData());
        },
        _parser = function (data) {
            if (data[data.length - 1] !== '\n') {
                data += '\n';
            }
            var pattern = /^[ ]*(\#+)[ ]+(.*?)[ ]*\#*$/gm;

            var stack = [],
                dataBlock = [],
                levelWidth = Array.apply(null, Array(6)).map(function () {
                    return 0;
                });

            for (var match = pattern.exec(data), index = 0; match !== null; match = pattern.exec(data)) {
                dataBlock.push(data.substring(index, match.index));
                index = match.index;
                levelWidth[match[1].length - 1]++;
                stack.push({
                    level: match[1].length,
                    title: match[2],
                });
            }
            dataBlock.push(data.substring(index, data.length));
            dataBlock[0] = "\n" + dataBlock[0];
            for (var i = 0; i < dataBlock.length; i++) {
                var str = dataBlock[i];
                dataBlock[i] = str.substring(str.indexOf('\n') + 1, str.length);
            }
            dataBlock.reverse();
            stack.reverse();

            return (function parse(parent) {
                while (stack.length) {
                    var node = stack[stack.length - 1];
                    if (node.level > parent.level) {
                        if (parent.children) {
                            parent.children.push($.extend(stack.pop(), {
                                data: dataBlock.pop()
                            }));
                        } else {
                            parent.children = [];
                        }
                        parse(node, node.level);
                    } else {
                        return parent;
                    }
                }
                return parent;
            }({
                level: 0,
                width: Math.max.apply(Math, levelWidth),
                data: dataBlock.pop(),
                title: ""
            }));
        },
        _renderer = function (data, parentNode, config) {
            var method = {
                fold: function (data, parent, config) {
                    (function build($parent, data) {
                        if (data.children) {
                            data.children.forEach(function (element) {
                                var $newDiv = build($('<div>').append($(marked(element.data))), element).toggle();
                                $parent.append(
                                    $('<h' + element.level + '>').text(" " + element.title)
                                    .prepend(
                                        $newDiv[0].children.length === 0 ? null :
                                        $('<svg height="32" class="octicon octicon-chevron-right" viewBox="0 0 8 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.5 8l-5 5L1 11.5 4.75 8 1 4.5 2.5 3z"></path></svg>')
                                        .addClass("element-default")
                                    )
                                    .attr("style", $newDiv[0].children.length === 0 ? "" : "cursor:pointer")
                                    .click(function () {
                                        $newDiv.toggle();
                                        $(this).children("svg").toggleClass("element-rotate-90deg").toggleClass("element-default");
                                    }),
                                    $newDiv[0].children.length === 0 ? null : $newDiv
                                );
                            }, this);
                        }
                        return $parent;
                    }($(parent).addClass("markdown-body")
                        .append($(marked(data.data)))
                        .attr("style", config.autosize ? '' : 'width:' + config.width + 'px;height:' + config.height + 'px;'),
                        data));
                },
                tree: function (data, parent, config) {
                    var height = config.autosize ? data.width * config.cellHeight : config.height,
                        root = d3.hierarchy((data.children && data.children.length === 1) ? data.children[0] : data),
                        width = config.autosize ? root.height * config.cellWidth : config.width;
                    var g = d3.select(parent).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(40,0)");
                    var tree = d3.tree()
                        .size([height, width - 200]).separation(function (a, b) {
                            return (a.parent === b.parent ? 1 : 2) / a.depth;
                        });
                    tree(root);
                    g.selectAll(".link")
                        .data(root.descendants().slice(1))
                        .enter().append("path")
                        .attr("class", "link")
                        .attr("d", function (d) {
                            return "M" + d.y + "," + d.x +
                                "C" + (d.parent.y + 100) + "," + d.x +
                                " " + (d.parent.y + 100) + "," + d.parent.x +
                                " " + d.parent.y + "," + d.parent.x;
                        });
                    var node = g.selectAll(".node")
                        .data(root.descendants())
                        .enter().append("g")
                        .attr("class", function (d) {
                            return "node" + (d.children ? " node--internal" : " node--leaf");
                        })
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        });
                    node.append("circle")
                        .attr("r", 4.5);
                    node.append("text")
                        .attr("dy", 3)
                        .attr("x", function (d) {
                            return d.children ? -8 : 8;
                        })
                        .style("text-anchor", function (d) {
                            return d.children ? "end" : "start";
                        })
                        .text(function (d) {
                            return d.data.title;
                        });
                }
            };
            return (method[config.style](data, parentNode, config));
        };
    $.fn.markview = function (options) {
        var settings = $.extend({
            style: 'fold',
            autosize: true,
            width: "100",
            height: "100",
            cellWidth: 200,
            cellHeight: 100,
            loadData: null
        }, options);
        return this.each(function () {
            var _this = this;
            _loader(settings)
                .then(function (data) {
                    _renderer(_parser(data), _this, settings);
                });
        });
    };
}(jQuery, marked, d3));
