/**
 * OpenDetail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function QDDistributionDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.initDetail = function(isSearch) {
            jh.utils.ajax.send({
                url: '/task/channel/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    var html = jh.utils.template('admin-qDDistributionDetail-template', returnData);
                    $('#admin-qDDistributionDetail-container').html(html);
                    _this.searchIllegalInfo();//查询违章信息
                    _this.initSheriff();//分配捕头
                }
            });
        };

        this.searchIllegalInfo = function(){
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
                }
            });
            page.init();
        };
		this.distributionSheriff = function(arr) {
            var source = require('/src/templates/sheriff-distribution.tpl');
            var render = jh.utils.template.compile(source);
            var menuState = function(state) {
                switch (state) {
                    case "all":
                        state = "可找车可拖车";
                        break;
                    case "trace":
                        state = "只找车";
                        break;
                    case "recycle":
                        state = "只拖车";
                        break;
                    case "tracerecycle":
                        state = "找车+拖车一体";
                        break;
                }
                return state;
            }
            var str = render({ list: arr, stateToString: menuState });
            return str;
        };

        this.initSheriff = function() {
            jh.utils.ajax.send({
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data);
                    $('#fpSheriffList').html(str);

                }
            });
        };
        $('body').off('click','.sureAudit').on('click','.sureAudit',function(){
        	var ids = jh.utils.getCheckboxValue('distribution_public_form', 'value');
            var opt = {
            	method: 'post',
                url: '/task/allotDownStream',
                data: {
                    taskId: args.id,
                    downstreamlist: ids
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
        });
        this.registerEvent = function() {
            //信息修复
            $('body').off('click','#distribution-illegalList').on('click','#distribution-illegalList',function(){
                _this.searchIllegalInfo();
            });
        };
    }
    module.exports = QDDistributionDetail;
});