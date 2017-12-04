/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function TaskAuditDetail() {
		var _this = this;
		this.init = function() {
			this.registerEvent();
		};
		this.registerEvent = function() {
			var data = jh.utils.getURLValue();
			jh.utils.ajax.send({
				url: '/task/business/detail',
				data: {
					taskId: data.args.id
				},
				done: function(returnData) {
					returnData.menuState = jh.utils.menuState;
					var taskStr = jh.utils.template('task_detail_template', returnData);
					$('.task-detail-content').html(taskStr);

					//任务审核
		            $('body').off('click', '.taskIdentify').on('click', '.taskIdentify', function() {
		                var alertIdentify = jh.utils.template('task_identify_template', { });
		                jh.utils.alert({
		                    content: alertIdentify,
		                    ok:function(){
		                    	var throughState = $('.through').filter(':checked').val();
		                    	jh.utils.ajax.send({
		                    		url: '/task/verify',
		                    		data: {
		                    			taskIds: data.args.id,
		                    			reason: $('#identifyContent').val(),
		                    			validState: throughState
		                    		},
		                    		done: function(data){
		                    			console.log(data)
		                    		}
		                    	})
		                    },
		                    cancel:true
		                });
		            });
				}
			});

		};
	}
	module.exports = TaskAuditDetail;
});