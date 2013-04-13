(function ($) {
    $.fn.ajaxPager = function (settings) {
        var container = this;
        var options = $.extend({
            showNum:6,
            pageSize:5,
            url:"",
            param:{},
            autoShow:true,
            hideEmpty:false,
            callback:function (data) {
            },
            getTotal:function (data) {
                return data.total;
            },
            getData:function (data) {
                return data.data;
            },
            navText:{
                first:'首页',
                prev:'上一页',
                next:'下一页',
                last:'末页'
            }
        }, settings || {});
        var total;
        var showNum;
        var pageSize;
        var curPage;
        var url;
        var param;

        function init() {
            showNum = options.showNum;
            pageSize = options.pageSize;
            curPage = 0;
            url = options.url;
            param = options.param;

            var pages = $("<div class='ajaxPager'>");
            var pageNode = $("<a href='javascript:void(0)'/>");
            var navNode = pageNode.clone().addClass('page-nav');
            pages.append(navNode.clone().addClass('first_page').text(options.navText.first))
                .append(navNode.clone().addClass('prev_page').text(options.navText.prev));
            for (var i = 1; i <= showNum; i++) {
                pages.append(pageNode.clone().addClass('active').text(i));
            }
            pages.append(navNode.clone().addClass('next_page').text(options.navText.next))
                .append(navNode.clone().addClass('last_page').text(options.navText.last));
            container.hide().prepend(pages);
            container.on('click', 'a.active', function () {
                show($(this).text());
            });
            container.on('click', 'a.first_page', function () {
                show(1);
            });
            container.on('click', 'a.last_page', function () {
                show(total);
            });
            container.on('click', 'a.prev_page', function () {
                show(curPage - 1 > 0 ? curPage - 1 : 1);
            });
            container.on('click', 'a.next_page', function () {
                show(curPage + 1 < total ? curPage + 1 : total);
            });
        }

        function show(page) {
            if (page == null) {
                page = curPage;
            }
            $.getJSON(url, $.extend({}, param, {page:page, pagesize:pageSize}), function (data) {
                var totalCount = options.getTotal(data);
                total = Math.ceil(totalCount / pageSize);
                curPage = page;
                options.callback.call(container, options.getData(data));
                if (options.hideEmpty && total <= 1) {
                    container.hide()
                } else {
                    update();
                    container.show();
                }
            })
        }

        function update() {
            $(".page-nav").show();
            if (curPage == 1) {
                $(".first_page,.prev_page").hide();
            }
            if (curPage == total) {
                $(".next_page,.last_page").hide();
            }
            var start = curPage - (showNum % 2 == 0 ? showNum : showNum - 1) / 2;
            if (start + showNum - 1 > total) {
                start = total - showNum + 1;
            }
            if (start < 1) {
                start = 1;
            }
            var node = $("a.prev_page", container).next();
            for (var i = start; i < start + showNum; i++) {
                if (i > total) {
                    node.hide();
                } else if (i != curPage) {
                    node.text(i).addClass('active').show();
                } else {
                    node.text(i).removeClass('active').show();
                }
                node = node.next();
            }
            container.show();
        }

        function changeSource(newurl, newparam) {
            url = newurl;
            param = newparam;
        }

        function setParam(key, value) {
            if (value == null) {
                param = $.extend(param, key);
            } else {
                param.key = value;
            }
        }

        function setPagesize(value) {
            if (value == null) {
                return pageSize;
            } else {
                pageSize = value;
                return this;
            }
        }

        init();
        if (options.autoShow) {
            show(1);
        }
        return {
            show:show,
            update:update,
            changeSource:changeSource,
            setParam:setParam,
            pageSize:setPagesize,
            getPage:function () {
                return curPage;
            }
        }
    }
})(jQuery);