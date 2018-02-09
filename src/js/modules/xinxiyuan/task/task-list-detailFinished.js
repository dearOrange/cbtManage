/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskListDetailFinished() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.officerState = jh.utils.officerState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('task_detailFinished_template', returnData);
                    $('#task_detailFinished_content').html(html);
                    _this.searchIllegalInfo();
                    _this.initYjList();
                }
            });
        };
        this.searchIllegalInfo = function() {
            var page = new jh.ui.page({
                data_container: $('#task_detailFinished_wzInfoList'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/clue/illegalList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('task_detailFinished_wzInfoTemplate', data);
                }
            });
            page.init();
        };

        this.initYjList = function() {
            var page = new jh.ui.page({
                data_container: $('#task_detailFinished_yjxjContent'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/record/bargainList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('task_detailFinished_yjxjTemplate', data);
                }
            });
            page.init();
        };
    }
    module.exports = TaskListDetailFinished;
});