/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function CreditorOrderDetail() {
		var _this = this;
		var args = jh.utils.getURLValue().args;
		this.init = function() {
			this.initContent();
			this.registerEvent();
		};

		this.initContent = function() {
			
			jh.utils.ajax.send({
				url: '/task/channel/detail',
				data: {
					taskId: args.id
				},
				done: function(returnData) {
					returnData.menuState = jh.utils.menuState;
					returnData.viewImgRoot = jh.config.viewImgRoot;
					var html = jh.utils.template('creditor_detail_template', returnData);
					$('.creditorOrderContent').html(html);
					_this.searchIllegalInfo(); //查询违章信息
					//确认收车
					$('body').off('click', '.isSure').on('click', '.isSure', function() {
						jh.utils.alert({
							content: '确认收到车了吗？',
							ok: function() {
								jh.utils.ajax.send({
									url: 'task/platReceive',
									data: {
										taskId: args.id
									},
									done: function(returnData) {
										jh.utils.alert({
											content: '已确认',
											ok: true
										})
									}
								});
							},
							cancel: true
						})

					})
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
					console.log(args.id)
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
					done: function(returnData) {
						_this.searchIllegalInfo();
					}
				})
			});
		};
	}
	module.exports = CreditorOrderDetail;
});