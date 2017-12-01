/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function CreditorManageDetail() {
		var _this = this;
		_this.form = $('#creditor-manage-form');

		this.init = function() {
			this.registerEvent();
		};
		this.registerEvent = function() {
			var data = jh.utils.getURLValue();
			jh.utils.ajax.send({
				url: '/task/info/detail',
				data: {
					taskId: data.args.id
				},
				done: function(returnData) {
					returnData.menuState = jh.utils.menuState;
                    returnData.viewRoot = jh.config.viewImgRoot;
                    returnData.taskId = data.args.id;
					var creditorStr = jh.utils.template('restoration_detail_template', returnData);
					$('.restorationContent').html(creditorStr);
					var picArr = ['carPhoto', 'carNumberPhoto'];
					for (var i = 0; i < 2; i++) {
						jh.utils.uploader.init({
							isAppend: false,
							pick: {
								id: '#' + picArr[i]
							}
						});
					}

					
					//客户标签
//					$('body').off('click', '.addstorage').on('click', '.addstorage', function() {
//						
//						jh.utils.ajax.send({
//							url: '/upstreams/updateTag',
//							data: {
//								tag: $('.customerStyle').val(),
//								upstreamId: data.args.id
//							},
//							done: function(returnData) {
//								console.log(returnData)
//							}
//						});
//					})
				}
			});
			
		};
	}
	module.exports = CreditorManageDetail;
});