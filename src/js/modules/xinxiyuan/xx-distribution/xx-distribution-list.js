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

        this.initSheriff = function(type) {
            Mock.mock(REQUESTROOT + '/task/downStreamListByChannel', {
                'code': 'SUCCESS',
                'data|10': [{
                    'id|+1': 1,
                    'name': Mock.Random.cname(),
                    'operatorProvinceVoList|1-10':[{
                        'provinceCode': 0,
                        'provinceName': Mock.Random.province()
                    }]
                }]
            });
            jh.utils.ajax.send({
                url: '/operator/getAllChannel',
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
            var source = require('/src/templates/channel-distribution.tpl');
            var render = jh.utils.template.compile(source);
            var str = render({list:arr});
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
                var ids = jh.utils.getCheckboxValue('admin-xXDistributionList-container');
                _this.initSheriff(ids);
            });

            //批量分配
            $('body').off('click', '.distribution').on('click', '.distribution', function() {
                var me = $(this);
                var ids = me.data('id');
                _this.initSheriff(ids);
            });

            //批量分配
            $('body').off('click', '.qd-distribution-tab li').on('click', '.qd-distribution-tab li', function() {
                var me = $(this);
                me.addClass('active').siblings().removeClass('active');
                var ind = me.index();
                $('#qd-distribution-tab'+ind).removeClass('hide').siblings().addClass('hide');
            });
            
        };
    }
    module.exports = XXDistributionList;
});