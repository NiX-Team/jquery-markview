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
                dataBlock = [];
            for (var match = pattern.exec(data), index = 0; match !== null; match = pattern.exec(data)) {
                dataBlock.push(data.substring(index, match.index));
                index = match.index;
                stack.push({
                    level: match[1].length,
                    title: match[2],
                    children: []
                });
            }
            dataBlock.push(data.substring(index, data.length));
            for (var i = 0; i < dataBlock.length; i++) {
                var str = dataBlock[i];
                dataBlock[i] = str.substring(str.indexOf('\n') + 1, str.length);
            }
            dataBlock.reverse();
            dataBlock.pop();
            stack.reverse();

            return (function parse(parent, level) {
                while (stack.length) {
                    var node = stack[stack.length - 1];
                    if (node.level > level) {
                        parent.push($.extend(stack.pop(), {
                            data: dataBlock.pop()
                        }));
                        parse(node.children, node.level);
                    } else {
                        return parent;
                    }
                }
                return parent;
            }([], 0));
        },
        _renderer = function (data, style) {
            var method = {
                fold: function (data) {
                    var $markdown = $('<article>').addClass("markdown-body");
                    (function build($parent, data) {
                        if (data.length !== 0) {
                            data.forEach(function (element) {
                                var $newDiv = build($('<div>').append($(marked(element.data))), element.children).toggle();
                                $parent.append(
                                    $('<h' + element.level + '>').text(" " + element.title)
                                    .prepend(
                                        $newDiv[0].children.length === 0 ? null :
                                        $('<span>').addClass("octicon octicon-chevron-right element-default")
                                    )
                                    .attr("style", $newDiv[0].children.length === 0 ? "" : "cursor:pointer")
                                    .click(function () {
                                        $newDiv.toggle();
                                        $(this).children("span").toggleClass("element-rotate-90deg").toggleClass("element-default");
                                    }),
                                    $newDiv[0].children.length === 0 ? null : $newDiv
                                );
                            }, this);
                        }
                        return $parent;
                    }($markdown, data));
                    return $markdown;
                },
                tree: function (data) {
                    var width = 500,
                        height = 500;
                    var g = d3.select("body").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(40,0)");
                    var tree = d3.tree()
                        .size([height, width]);
                    var root = d3.hierarchy({
                        children: data
                    });
                    tree(root);
                    console.log(root);
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
            return (method[style](data));
        };
    $.fn.markview = function (options) {
        var settings = $.extend({
            style: 'fold',
            loadData: null
        }, options);
        return this.each(function () {
            var $this = $(this);
            _loader(settings)
                .then(function (data) {
                    $this.append(_renderer(
                        _parser(data),
                        settings.style
                    ));
                });
        });
    };
}(jQuery, marked, d3));
