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
        _this.form = $("#task_adopt_form");
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
                    _this.initSheriff();
					
				
                }
            });
        };
		this.initSheriff = function() {
            jh.utils.ajax.send({
                url: '/operator/getAllChannel',
                done: function(returnData) {
                    var strTemplate = jh.utils.template('xx_task_list', returnData);
                    $('.task-content').html(strTemplate);
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
			                    jh.utils.alert({
									content: '已审核！',
									ok: true
								})
			                }
                
            			});
                	},
                	cancel:true
                })
            });
            
            //情报全部拒绝
            $('body').off('click','.rejectClue').on('click','.rejectClue',function(){
            	jh.utils.alert({
                	content:'确定全部不通过吗？',
                	ok:function(){
                		jh.utils.ajax.send({
			                url: '/task/refuseAll',
			                data: {
			                	taskId: args.id
			                },
			                done: function(returnData) {
			                    jh.utils.alert({
									content: '已全部拒绝！',
									ok: true
								})
			                }
                
            			});
                	},
                	cancel:true
                })
            });
            
            //采纳情报
            $('body').off('click','.adopteInfo').on('click','.adopteInfo',function(){
            	jh.utils.alert({
                	content:'确定采纳吗？',
                	ok:function(){
                		var adoptData = jh.utils.formToJson(_this.form);
                		console.log(adoptData)
                		adoptData.taskId = args.id;
//              		adoptData.traceId = 
                		adoptData.carPrice = $("#salvage").val();
                		adoptData.estimatedMinPrice = $("#minMoney").val();
                		adoptData.estimatedMaxPrice = $("#maxMoney").val();
//              		console.log(adoptData);
                		return false;
                		jh.utils.ajax.send({
			                url: '/task/refuseAll',
			                data: adoptData,
			                done: function(returnData) {
			                    jh.utils.alert({
									content: '已采纳！',
									ok: true
								})
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