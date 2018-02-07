/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function EntrustmentList() {
        var _this = this;
        _this.form = $('#entrustment-list-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#entrustment_list_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/verify/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('entrustment-list-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'entrustment-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.entrustmentList-detail').on('click', '.entrustmentList-detail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/xinxiyuan/xx-entrustment/xx-entrustment-detail", {
                    id: id
                })
            });

        };
    }
    module.exports = EntrustmentList;
});