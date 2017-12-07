/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function ClueBackDetail() {
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
                    returnData.viewImgRoot = jh.config.viewImgRoot;
					var clueStr = jh.utils.template('clueBack_detail_template', returnData);
					$('.clueBack-detail').html(clueStr);
					var picArr = ['carPhoto', 'carNumberPhoto'];
					for (var i = 0; i < 2; i++) {
						jh.utils.uploader.init({
							isAppend: false,
							pick: {
								id: '#' + picArr[i]
							}
						});
					}
					
					var page = new jh.ui.page({
						data_container: $('#moneytotal_container'),
						page_container: $('#page_container'),
						method: 'post',
						url: '/record/bargainList',
						contentType: 'application/json',
						data: {
							taskId: data.args.id
						},
						callback: function(data) {
							return jh.utils.template('addMoneytotal_template', data);
						}
					});
					page.init();
					//          添加议价小计
					$('body').off('click', '.addMoneytotal').on('click', '.addMoneytotal', function() {
						var addStr = jh.utils.template('clue_addSubtotal_template', {});
						jh.utils.alert({
							content: addStr,
							ok: function() {
								jh.utils.ajax.send({
									url: '/record/addBargain',
									data: {
										content: $('#subContent').val(),
										contacts: $('#subPerson').val(),
										contactPhone: $('#subStyle').val(),
										taskId: data.args.id
									},
									done: function(returnData) {
										console.log(returnData)
									}
								});
							}
						});
					})
				}
			});

		};
	}
	module.exports = ClueBackDetail;
});