/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function XXDistributionList() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#admin-xXDistributionList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/distributeList',
                contentType: 'application/json',
                data: {},
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('admin-xXDistributionList-template', data);
                }
            });
            page.init();
        };

        this.initSheriff = function(taskIds) {
            jh.utils.ajax.send({
                url: '/operator/getAllChannel',
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data);
                    jh.utils.alert({
                        content: str,
                        ok: function() {
                            var tab = $('.qd-distribution-tab li.active').index(),
                                taskObj = {};
                            if (!tab) {
                                var radio = $('#qd-distribution-tab0').find(':checked');
                                if (radio.length === 0) {
                                    jh.utils.alert({
                                        content: '请选择渠道经理！',
                                        ok: true,
                                        cancel: false
                                    });
                                    return false;
                                }
                                taskObj.type = 1;
                                taskObj.channelManagerId = radio.val();
                                taskObj.channelManagerName = radio.data('name');
                            } else {
                                taskObj.type = 2;
                            }
                            taskObj.taskIds = taskIds;
                            _this.distribution(taskObj);
                        },
                        cancel: true
                    });
                }
            });
        };

        this.distributionSheriff = function(arr) {
            var source = require('/src/templates/channel-distribution.tpl');
            var render = jh.utils.template.compile(source);
            var str = render({ list: arr });
            return str;
        };

        this.distribution = function(taskObj) {
            jh.utils.ajax.send({
                url: '/task/distributeTask',
                data: taskObj,
                done: function(returnData) {
                    jh.utils.alert({
                        content: '任务分配成功！',
                        ok: function() {
                            _this.initContent();
                        },
                        cancel: false
                    });
                }
            });
        };

        this.registerEvent = function() {
            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/xinxiyuan/xx-distribution/xx-distribution-detail', {
                    id: id
                });
            });

            //批量分配
            $('body').off('click', '#distributeTask').on('click', '#distributeTask', function() {
                var me = $(this);
                var taskIds = jh.utils.getCheckboxValue('admin-xXDistributionList-container');
                if (!taskIds) {
                    jh.utils.alert({
                        content: '请选择任务！',
                        ok: true,
                        cancel: false
                    });
                }
                _this.initSheriff(taskIds);
            });

            //分配
            $('body').off('click', '.distribution').on('click', '.distribution', function() {
                var me = $(this);
                var taskIds = me.data('id');
                _this.initSheriff(taskIds);
            });
        };
    }
    module.exports = XXDistributionList;
});