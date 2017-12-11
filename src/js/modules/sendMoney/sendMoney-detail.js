/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function SendMoneyDetail() {
		var _this = this;
		var args = jh.utils.getURLValue().args;
		this.init = function() {
			this.initDetail();
		};

		this.initDetail = function() {
			jh.utils.ajax.send({
				url: '/withdraw/detail',
				data: {
					drawId: args.id
				},
				done: function(returnData) {
					returnData.menuState = jh.utils.menuState;
					returnData.viewImgRoot = jh.config.viewImgRoot;
					var html = jh.utils.template('sendMoney_detail_template', returnData);
					$('.sendMoneyDetail').html(html);
					$("select").select2();

					//打款
					$('body').off('click', '.playMoney').on('click', '.playMoney', function() {
						var alertContent = jh.utils.template('sendMoney_sure_template', returnData);
						
						jh.utils.alert({
							content: alertContent,
							ok: function() {
								var datas = jh.utils.formToJson($('#play-money-form'));
								datas.drawId = args.id;
								jh.utils.ajax.send({
									url: '/withdraw/confirm',
									data: datas,
									done: function(returnData) {
										jh.utils.alert({
											content: '已打款',
											ok: true
										})
									}
								});
							},
							cancel: true
						})
						var picArr = ['voucher1', 'voucher2', 'voucher3'];
						for (var i = 0; i < 3; i++) {
							jh.utils.uploader.init({
								isAppend: false,
								pick: {
									id: '#' + picArr[i]
								}
							});
						};
					});

					//拒绝打款
					$('body').off('click', '.rejectMoney').on('click', '.rejectMoney', function() {
						var rejectCon = jh.utils.template('rejectMoney_template', {});
						jh.utils.alert({
							content: rejectCon,
							ok: function() {
								jh.utils.ajax.send({
									url: '/withdraw/refuse',
									data: {
										drawId: args.id,
										reason: $('.rejectReason').val()
									},
									done: function(returnData) {
										jh.utils.alert({
											content: '已拒绝',
											ok: true
										})
									}

								});
							},
							cancel: true
						})
					});
					
					$('body').off('click', '#selectPay').on('click', '#selectPay', function() {
						var selectVal = $("#selectPay").val();
						$('.changePaystyle').eq(selectVal-1).attr("id", "payStyle").siblings().removeAttr("id");
					});
					
				}
			});
		};

	}
	module.exports = SendMoneyDetail;
});