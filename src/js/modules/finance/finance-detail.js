/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function FinanceDetail() {
		var _this = this;
		var args = jh.utils.getURLValue().args;
		this.init = function() {
			this.initDetail();
		};

		this.initDetail = function() {
			
			jh.utils.ajax.send({
				url: '/task/finance/detail',
				data: {
					taskId: args.id
				},
				done: function(returnData) {
					var mineData = returnData.data;
					returnData.menuState = jh.utils.menuState;
					returnData.viewImgRoot = jh.config.viewImgRoot;
					if (mineData.hunterMoneyStatus == 0 && mineData.infoMoneyStatus == 0) {
						returnData.finalsendmoney = mineData.assetPrice + mineData.thirdpartyPrice;
					} else if (mineData.hunterMoneyStatus == 0 && mineData.infoMoneyStatus == 1) {
						returnData.finalsendmoney = mineData.thirdpartyPrice;
					} else if (mineData.hunterMoneyStatus == 1 && mineData.infoMoneyStatus == 0) {
						returnData.finalsendmoney = mineData.assetPrice;
					} else {
						returnData.finalsendmoney = mineData.assetPrice + mineData.thirdpartyPrice;
					}
					returnData.finalilmoney = mineData.assetPrice + mineData.thirdpartyPrice;
					var html = jh.utils.template('finance_detail_template', returnData);
					$('.financeDetailContent').html(html);
					$("select").select2({
						minimumResultsForSearch:Infinity
					});

					//平台确定收到款
					$('body').off('click', '.platSure').on('click', '.platSure', function() {
						jh.utils.alert({
							content: '确定已经收到对方款项了吗？',
							ok: function() {
								var datas = jh.utils.formToJson($('#plat-sure-money'));
								datas.taskId = args.id;
								jh.utils.ajax.send({
									method: 'post',
									url: '/finance/loanerMoneySure',
									data: datas,
									done: function(returnData) {
										window.location.reload();
									}
								});
							},
							cancel: true
						})
					});

					//提前放款
					$('body').off('click', '.advanceLoan').on('click', '.advanceLoan', function() {
						jh.utils.alert({
							content: '确定给捕头提前放款吗？提前放款需要经过审核！',
							ok: function() {
								jh.utils.ajax.send({
									url: '/finance/hunterMoneySure',
									data: {
										taskId: args.id
									},
									done: function(returnData) {
										window.location.reload();
									}

								});
							},
							cancel: true
						})
					});

				}
			});
		};

	}
	module.exports = FinanceDetail;
});