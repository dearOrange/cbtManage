/**
 * OpenDetail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function XXDistributionDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        //初始化详情
        this.initDetail = function(isSearch) {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    var html = jh.utils.template('admin-xXDistributionDetail-template', returnData);
                    $('#admin-xXDistributionDetail-container').html(html);
                    _this.searchIllegalInfo(); //查询违章信息
                    _this.initSheriff();
                }
            });
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
                    $('#xx_task_distribution').html(str);
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

        //查询违章信息列表
        this.searchIllegalInfo = function(obj) {
            var page = new jh.ui.page({
                data_container: $('#distribution-illegalList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/clue/illegalList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('distribution-illegalList-template', data);
                },
                onload:function(){
                    if(obj){
                        window.setTimeout(function(){
                            $('#distribution-illegalList').removeClass('disabled');
                            $('#distribution-illegalList').siblings().remove();
                        },1300);
                    }
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            //信息修复
            $('body').off('click', '#distribution-illegalList').on('click', '#distribution-illegalList', function() {
                var me = $(this);
                if(me.hasClass('disabled')){
                    return false;
                }
                $('<img src="/src/img/loading.gif" height="29"/>').insertAfter(me);
                me.addClass('disabled');
                jh.utils.ajax.send({
					url: '/clue/bondRepair',
					data: {
						taskIds: args.id
					},
					done: function(returnData){
						_this.searchIllegalInfo(me);
					}
				})
            });
        };
    }
    module.exports = XXDistributionDetail;
});