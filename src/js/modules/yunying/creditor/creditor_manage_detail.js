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
					//批量导入
					jh.utils.uploader.init({
		                hiddenName: 'test',
		                server:'/task/import',
		                pick: {
		                    id: '#importFile'
		                },
		                accept: {
		                    title: 'Applications',
		                    extensions: 'xls,xlsx',
		                    mimeTypes: 'application/xls,application/xlsx'
		                }
		            },{
		            	uploadAccept:function(file, response){
		            		alert(response)
		            	}
		            });
		            //删除
		            $('body').off('click', '#removeFile').on('click', '#removeFile', function() {
		            	var removeId = jh.utils.getCheckboxValue('subTask_container',"value");
		            	jh.utils.alert({
		                    content: '确定删除吗？',
		                    ok:function(){
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
							cancel:true
						})
					})
				}
			});

		};
	}
	module.exports = CreditorManageDetail;
});