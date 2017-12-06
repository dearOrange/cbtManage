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
                }
            });
        };

        this.searchIllegalInfo = function() {
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

        this.registerEvent = function() {
            //信息修复
            $('body').off('click', '#distribution-illegalList').on('click', '#distribution-illegalList', function() {
                jh.utils.ajax.send({
					url: '/clue/bondRepair',
					data: {
						taskIds: args.id
					},
					done: function(returnData){
						_this.searchIllegalInfo();
					}
				})
            });
        };
    }
    module.exports = XXDistributionDetail;
});