/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InformalTask() {
        var _this = this;
        _this.form = $('#informal-task-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#informal_task_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/task/offerList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('informal-task-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            // 搜索
            jh.utils.validator.init({
                id: 'informal-task-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.informal-task-detail').on('click', '.informal-task-detail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/informal-task/informal-task-detail", {
                    id: id
                })
            });

        };
    }
    module.exports = InformalTask;
});