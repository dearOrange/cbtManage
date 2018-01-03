/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskAudit() {
        var _this = this;
        _this.form = $('#task-audit-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2({
            	minimumResultsForSearch:Infinity
            });
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#task_audit_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/newTaskList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('taskAudit_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'task-audit-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataAudit').off('click', '.detail').on('click', '.detail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/yunying/task/task-audit-detail", {
                    id: id
                })

            });

            //任务审核
            $('body').off('click', '.onlyIdentify').on('click', '.onlyIdentify', function() {
                var alertIdentify = jh.utils.template('taskonly_identify_template', {});
                var dataId = $(this).data('id');
                jh.utils.alert({
                    content: alertIdentify,
                    ok: function() {
                        var throughState = $('.onlythrough').filter(':checked').val();
                        jh.utils.ajax.send({
                            url: '/task/verify',
                            data: {
                                taskIds: dataId,
                                reason: $.trim($('#identifyContents').val()),
                                validState: throughState
                            },
                            done: function(data) {
                                jh.utils.alert({
                                    content: '任务操作成功！',
                                    ok: function(){
                                        _this.initContent();
                                    },
                                    cancel: false
                                });
                            }
                        })
                    },
                    cancel: true
                });
            });

            //批量审核
            $('.allIdentify').click(function() {
                var alertIdentify = jh.utils.template('taskonly_identify_template', {});
                var checkId = jh.utils.getCheckboxValue('task_audit_container', "value");
                if (!checkId) {
                    jh.utils.alert({
                        content: '请选择需要审核的任务！',
                        ok: true,
                        cancel: false
                    });
                    return false;
                }
                jh.utils.alert({
                    content: alertIdentify,
                    ok: function() {
                        var throughState = $('.onlythrough').filter(':checked').val();
                        jh.utils.ajax.send({
                            url: '/task/verify',
                            data: {
                                taskIds: checkId,
                                reason: $.trim($('#identifyContents').val()),
                                validState: throughState
                            },
                            done: function(data) {
                                jh.utils.alert({
                                    content: '批量操作成功！',
                                    ok: function(){
                                        _this.initContent();
                                    },
                                    cancel: false
                                });
                            }
                        })
                    },
                    cancel: true
                });
            })

        };
    }
    module.exports = TaskAudit;
});