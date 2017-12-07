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
                    returnData.viewImgRoot = jh.config.viewImgRoot;
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
					
					//预估价格
					$('body').off('click', '.priceStorage').on('click', '.priceStorage', function() {
						
						jh.utils.ajax.send({
							url: '/task/estimate',
							data: {
								carPrice: $('#salvage').val(),
								estimatedMinPrice: $('#minMoney').val(),
								estimatedMaxPrice: $('#maxMoney').val(),
								taskId: data.args.id
							},
							done: function(returnData) {
								jh.utils.alert({
									content: '价格预估完毕',
									ok: true
								})
							}
						});
					})
					
					//确认价格
					$('body').off('click', '.surePrice').on('click', '.surePrice', function() 
						jh.utils.ajax.send({
							url: '/task/fixPrice',
							data: {
								finalPrice: $('#finalPrice').html(),
								assetPrice: $('#assetPrice').val(),
								thirdpartyPrice: $('#thirdpartyPrice').val(),
								baileePrice: $('#baileePrice').html()
							},
							done: function(returnData) {
								jh.utils.alert({
									content: '价格确认完毕',
									ok: true
								})
							}
						});
					})
				}
			});
			
		};
	}
	module.exports = CreditorManageDetail;
});