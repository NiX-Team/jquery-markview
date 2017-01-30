(function ($) {
    var _loader = function (url) {
        var dfd = $.Deferred();
        $.ajax({
            url: url,
            success: function (data) {
                dfd.resolve(data);
            }
        });
        return dfd.promise();
    };
    $.fn.markview = function (options) {
        var settings = $.extend({
            'url': 'README.md',
            'style': 'tree'
        }, options);
        return this.each(function () {
            _loader(settings.url)
                .then(function (data) {
                    console.log(data);
                });
        });
    };
}(jQuery));