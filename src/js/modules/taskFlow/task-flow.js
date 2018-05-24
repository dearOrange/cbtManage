/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskFlow() {
        var _this = this;
        _this.form = $('#task-flow-form');
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#task_flow_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/tree/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('task-flow-template', data);
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
                id: 'task-flow-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.task-flow-detail').on('click', '.task-flow-detail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/taskFlow/task-flow-detail", {
                    id: id
                })
            });

        };
    }
    module.exports = TaskFlow;
});