/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskListDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('task_detail_template', returnData);
                    $('.taskListContent').html(html);
					
					//预估价格
					$('body').off('click', '.priceStorage').on('click', '.priceStorage', function() {
						jh.utils.ajax.send({
							url: '/task/estimate',
							data: {
								carPrice: $('#salvage').val(),
								estimatedMinPrice: $('#minMoney').val(),
								estimatedMaxPrice: $('#maxMoney').val(),
								taskId: args.id
							},
							done: function(returnData) {
								console.log(returnData)
							}
						});
					})
                }
            });
        };

        this.registerEvent = function() {
            //信息修复
            $('body').off('click','.auditClue').on('click','.auditClue',function(){
            	jh.utils.alert({
                	content:'确定审核吗？',
                	ok:function(){
                		jh.utils.ajax.send({
			                url: '/trace/adopt',
			                done: function(returnData) {
			                    
			                }
                
            			});
                	},
                	cancel:true
                })
            });
        };
    }
    module.exports = TaskListDetail;
});