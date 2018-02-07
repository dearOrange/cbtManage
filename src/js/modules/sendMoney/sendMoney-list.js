/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function SendMoneyList() {
		var _this = this;
		_this.form = $('#sendMoney-list-form');
		this.init = function() {
			this.initContent();
			this.registerEvent();
		};
		this.initContent = function(isSearch) {
			var page = new jh.ui.page({
				data_container: $('#sendMoney_list_container'),
				page_container: $('#page_container'),
				form_container: _this.form,
				method: 'post',
				url: '/withdraw/list',
				contentType: 'application/json',
				data: jh.utils.formToJson(_this.form),
				isSearch: isSearch,
				callback: function(data) {
					return jh.utils.template('sendMoney-list-template', data);
				}
			});
			page.init();
		};
		this.registerEvent = function() {
			// 搜索
			jh.utils.validator.init({
				id: 'sendMoney-list-form',
				submitHandler: function(form) {
					_this.initContent(true);
					return false;
				}
			});

			//查看任务详情
			$('.dataShow').off('click', '.sendMoney-detail').on('click', '.sendMoney-detail', function() {
				var id = $(this).data('id');
				var state = $(this).data('state');
				jh.utils.load("/src/modules/sendMoney/sendMoney-detail", {
					id: id
				})
			});

			//打款
			$('body').off('click', '.sendMoney').on('click', '.sendMoney', function() {
				var me = $(this);
				var data = me.data('infos');
				data.viewImgRoot = jh.config.viewImgRoot;
				var alertContent = jh.utils.template('sendMoneyList_sure_template', data);
				var id = $(this).data('id');
				jh.utils.alert({
					content: alertContent,
					ok: function() {
						var datas = jh.utils.formToJson($('#play-money-form'));
						datas.drawId = id;
						jh.utils.ajax.send({
							url: '/withdraw/confirm',
							data: datas,
							done: function(returnData) {
								jh.utils.alert({
									content: '已打款',
									ok: function(){
                                    	window.location.reload();
                                    }
								})
							}
						});
					},
					cancel: true
				});
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
			$('body').off('click', '#selectPay').on('click', '#selectPay', function() {
				var selectVal = $("#selectPay").val();
				$('.changePaystyle').eq(selectVal-1).attr("id", "payStyle").siblings().removeAttr("id");
			});
		};
	}
	module.exports = SendMoneyList;
});