/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
	function FinanceList() {
		var _this = this;
		_this.form = $('#finance-list-form');

		this.init = function() {
			this.initContent();
			this.registerEvent();
			$('select').select2();
		};
		this.initContent = function(isSearch) {
			
			var page = new jh.ui.page({
				data_container: $('#finance_list_container'),
				page_container: $('#page_container'),
				method: 'post',
				url: '/finance/taskOrderList',
				contentType: 'application/json',
				data: jh.utils.formToJson(_this.form),
				isSearch: isSearch,
				callback: function(data) {
					return jh.utils.template('finance-list-template', data);
				}
			});
			page.init();
		};
		this.registerEvent = function() {

			// 搜索
			jh.utils.validator.init({
				id: 'finance-list-form',
				submitHandler: function(form) {
					_this.initContent(true);
					return false;
				}
			});

			//查看任务详情
			$('.dataShow').off('click', '.finance-detail').on('click', '.finance-detail', function() {
				var id = $(this).data('id');
				jh.utils.load("/src/modules/finance/finance-detail", {
					id: id
				})

			});

		};
	}
	module.exports = FinanceList;
});