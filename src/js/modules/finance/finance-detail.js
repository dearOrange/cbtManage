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
			Mock.mock(REQUESTROOT + '/task/finance/detail?taskId=' + args.id, {
				code: 'SUCCESS',
				msg: '请求成功',
				data: {
					'id|+1': 1,
					'carNumber': /[浙川沪][A-Z][a-zA-Z0-9]{5}/,
					'carPrice|1-3.1-2': 1,
					'chuzhi|1-2.1-2': 1,
					'carColor': /[白黑灰色*红]/,
					'carId': Mock.Random.word(),
					'engineId': Mock.Random.word(),
					'carBrand': /(众泰|宝马|吉利汽车|奔驰|奥迪)/,
					'carSeries': /(众泰SR7|奔驰S级|A4L|宝马X6)/,
					'carModel': /(2016款 1.5T CVT魔方之门版 国IV|2010款 2.0L EX|2013款 Boxster 2.7L|2008款 S 600 L)/,
					'companyName': Mock.Random.ctitle(6, 18),
					'contactPhone': /1[34578]\d{9}/,
					'createAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
					'fingerprint': Mock.Random.county(true),
					'ipCity': Mock.Random.county(true),
					'lastUpdateAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
					'location': Mock.Random.city()
				}
			});
			jh.utils.ajax.send({
				url: '/task/finance/detail',
				data: {
					taskId: args.id
				},
				done: function(returnData) {
					returnData.menuState = jh.utils.menuState;
					returnData.viewImgRoot = jh.config.viewImgRoot;
					if (returnData.hunterMoneyStatus == "0" && returnData.infoMoneyStatus == "0") {
						returnData.finalsendmoney = returnData.assetPrice - 0 + returnData.thirdpartyPrice;
					} else if (returnData.hunterMoneyStatus == "0" && returnData.infoMoneyStatus == "1") {
						returnData.finalsendmoney = returnData.thirdpartyPrice;
					} else if (returnData.hunterMoneyStatus == "1" && returnData.infoMoneyStatus == "0") {
						returnData.finalsendmoney = returnData.assetPrice;
					} else {
						returnData.finalsendmoney = returnData.assetPrice - 0 + returnData.thirdpartyPrice;
					}
					returnData.finalilmoney = returnData.assetPrice - 0 + returnData.thirdpartyPrice;
					var html = jh.utils.template('finance_detail_template', returnData);
					$('.financeDetailContent').html(html);
					$("select").select2();

					//平台确定收到款
					$('body').off('click', '.platSure').on('click', '.platSure', function() {
						jh.utils.alert({
							content: '确定已经收到对方款项了吗？',
							ok: function() {
								var datas = jh.utils.formToJson($('#plat-sure-money'));
								datas.taskId = args.id;
								console.log(datas);
								return false;
								jh.utils.ajax.send({
									url: '/finance/loanerMoneySure',
									data: datas,
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
										jh.utils.alert({
											content: '正在审核，请耐心等待！',
											ok: true
										})
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