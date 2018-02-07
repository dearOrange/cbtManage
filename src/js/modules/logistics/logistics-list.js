/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function LogisticsList() {
        var _this = this;
        _this.form = $('#logistics-list-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2({
            	minimumResultsForSearch:Infinity
            });
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#logistics_list_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/logistics/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    var contentHtml = jh.utils.template('logisticsList_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
        };
        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'logistics-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.logisticsDetail').on('click', '.logisticsDetail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/logistics/logistics-list-detail", {
                    id: id
                })

            });


        };
    }
    module.exports = LogisticsList;
});