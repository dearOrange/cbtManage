/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function QDDistributionList() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.initAllButou();
            this.registerEvent();
        };

        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#admin-qDDistributionList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/channelTaskList',
                contentType: 'application/json',
                data: jh.utils.formToJson('#qd-distributionList-form'),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('admin-qDDistributionList-template', data);
                }
            });
            page.init();
        };

        this.initAllButou = function() {
            var opt = {
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var str = '<option value="">全部</option>';
                    $.each(returnData.data, function(index, item) {
                        str += '<option value="' + item.id + '">' + item.name + '</option>';
                    });
                    $('#qd-distributionList-downstreamId').html(str);
                }
            };
            jh.utils.ajax.send(opt);
        };
        this.initSheriff = function(type) {
            jh.utils.ajax.send({
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data);

                    jh.utils.alert({
                        content: str,
                        ok: _this.distribution,
                        cancel: true
                    });
                }
            });
        };
        this.distributionSheriff = function(arr) {
            var source = require('/src/templates/sheriff-distribution.tpl');
            var render = jh.utils.template.compile(source);
            var str = render({ list: arr, stateToString: jh.utils.menuState });
            return str;
        };

        this.distribution = function(ids) {
            var ids = jh.utils.getCheckboxValue('distribution_public_form', 'value');
            var opt = {
                url: '/task/distributeTask',
                data: {
                    taskIds: ids
                },
                done: function(returnData) {
                    jh.utils.alert({
                        content: '任务分配成功！',
                        ok: true,
                        cancel: false
                    });
                }
            };
            jh.utils.ajax.send(opt);
        };
        this.registerEvent = function() {

            //查询
            jh.utils.validator.init({
                id: 'qd-distributionList-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/qudao/qd-distribution/qd-distribution-detail', {
                    id: id
                });
            });
            //分配
            $('body').off('click', '.distribution').on('click', '.distribution', function() {
                var me = $(this);
                var ids = me.data('id');
                _this.initSheriff(ids);
            });

            //批量分配
            $('body').off('click', '#distributeTask').on('click', '#distributeTask', function() {
                var me = $(this);
                var ids = jh.utils.getCheckboxValue('admin-qDDistributionList-container');
                _this.initSheriff(ids);
            });
        };
    }
    module.exports = QDDistributionList;
});