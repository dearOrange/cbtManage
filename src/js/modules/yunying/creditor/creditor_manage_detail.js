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
				url: '/upstreams/detail',
				data: {
					upstreamId: data.args.id
				},
				done: function(returnData) {
					returnData.menuState = jh.utils.menuState;
					var creditorStr = jh.utils.template('admin_creditorDetail_template', returnData);
					$('.detail-content').html(creditorStr);
					var picArr = ['businessLicense', 'legalPersonIdImg', 'legalPersonHandIdImg', 'linkmanIdImg', 'linkmanHandIdImg'];
					for (var i = 0; i < 5; i++) {
						jh.utils.uploader.init({
							isAppend: false,
							pick: {
								id: '#' + picArr[i]
							}
						});
					}

					var page = new jh.ui.page({
						data_container: $('#subtotal_container'),
						page_container: $('#page_container'),
						method: 'post',
						url: '/record/contactList',
						contentType: 'application/json',
						data: {
							upstreamId: data.args.id
						},
						callback: function(data) {
							return jh.utils.template('addSubtotal_template', data);
						}
					});
					page.init();

					var pageTask = new jh.ui.page({
						data_container: $('#subTask_container'),
						page_container: $('#page_task_container'),
						method: 'post',
						url: '/task/upstreamTask',
						contentType: 'application/json',
						data: {
							upstreamId: data.args.id
						},
						callback: function(data) {
							return jh.utils.template('taskSubtotal_template', data);
						}
					});
					pageTask.init();

					//          添加小计
					$('body').off('click', '.addSubtotal').on('click', '.addSubtotal', function() {
						var addStr = jh.utils.template('creditor_addSubtotal_template', {});
						jh.utils.alert({
							content: addStr,
							ok: function() {
								jh.utils.ajax.send({
									url: '/record/addContact',
									data: {
										content: $('#subContent').val(),
										contacts: $('#subPerson').val(),
										contactPhone: $('#subStyle').val(),
										upstreamId: data.args.id
									},
									done: function(returnData) {
										console.log(datas)
									}
								});
							}
						});
					})

					//客户标签
					$('body').off('click', '.addstorage').on('click', '.addstorage', function() {

						jh.utils.ajax.send({
							url: '/upstreams/updateTag',
							data: {
								tag: $('.customerStyle').val(),
								upstreamId: data.args.id
							},
							done: function(returnData) {
								console.log(returnData)
							}
						});
					})

					//协助任务发布
					$('body').off('click', '.helpTask').on('click', '.helpTask', function() {
						var me = $(this);
						var alertInfo = jh.utils.template('customer-addTask-template', {});
						jh.utils.alert({
							content: alertInfo,
							ok: function() {
								$('#customer-addTask-form').submit();
								return false;
							},
							cancel: true
						});

						jh.utils.validator.init({
							id: 'customer-addTask-form',
							submitHandler: function(form) {
								var datas = jh.utils.formToJson(form);
								datas.carNumber = datas.carNumber_province + datas.add_carNumber;
								datas.attachment = jh.utils.isArray(datas.attachment) ? datas.attachment : [datas.attachment];
								delete datas.carNumber_province;
								delete datas.add_carNumber;
								jh.utils.ajax.send({
									url: '/task/helpIssue',
									method: 'post',
									contentType: 'application/json',
									data: datas,
									done: function() {
										jh.utils.alert({
											content: '任务发布成功！',
											ok: true,
											cancel: false
										});
									}
								});
								return false;
							}
						});

						jh.utils.uploader.init({
							pick: {
								id: '#attachment'
							}
						});

						jh.utils.ajax.send({
							url: '/car/brand',
							done: function(result) {
								var str = '<option value="">请选择品牌</option>';
								$.each(result.data, function(index, item) {
									str += '<option value="' + item.id + '">' + item.name + '</option>';
								});
								$('#customer-addTask-carBrand').html(str);
							}
						});
					})

					//批量导入
					jh.utils.uploader.init({
						hiddenName: 'test',
						server: '/task/import',
						pick: {
							id: '#importFile'
						},
						accept: {
							title: 'Applications',
							extensions: 'xls,xlsx',
							mimeTypes: 'application/xls,application/xlsx'
						}
					}, {
						uploadAccept: function(file, response) {
							alert(response)
						}
					});
					//删除
					$('body').off('click', '#removeFile').on('click', '#removeFile', function() {
						var removeId = jh.utils.getCheckboxValue('subTask_container', "value");
						if (removeId == "") {
							jh.utils.alert({
								content: '请选择需要删除的任务！',
								ok: true,
								cancel: false
							});
							return false;
						}
						jh.utils.alert({
							content: '确定删除吗？',
							ok: function() {
								jh.utils.ajax.send({
									url: '/task/helpDel',
									data: {
										taskIds: removeId
									},
									done: function(returnData) {
										jh.utils.alert({
											content: '已删除',
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
	}
	module.exports = CreditorManageDetail;
});