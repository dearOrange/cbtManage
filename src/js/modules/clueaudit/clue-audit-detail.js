/**
 * OpenDetail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueAuditDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.initDetail = function(isSearch) {
        	Mock.mock(REQUESTROOT+'/task/channel/detail?taskId='+args.id, {
                code: 'SUCCESS',
                msg: '请求成功',
                data: {
                        'id|+1': 1,
                        'carNumber': /[浙川沪][A-Z][a-zA-Z0-9]{5}/,
                        'carPrice|1-3.1-2':1,
                        'chuzhi|1-2.1-2':1,  
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
                url: '/task/channel/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    var html = jh.utils.template('admin-clueAuditDetail-template', returnData);
                    $('#admin-clueAuditDetail-container').html(html);
                    _this.searchIllegalInfo();//查询违章信息
                    
                    var page = new jh.ui.page({
						data_container: $('#moneytotal_container'),
						page_container: $('#page_container'),
						method: 'post',
						url: '/record/bargainList',
						contentType: 'application/json',
						data: {
							taskId: args.id
						},
						callback: function(data) {
							return jh.utils.template('addMoneytotal_template', data);
						}
					});
					page.init();
					
					//线索审核
                   	$('body').off('click','.clueaudit').on('click','.clueaudit',function(){
                   		var rejectCon = jh.utils.template('clue_audit_template', {});
		            	jh.utils.alert({
		                	content: rejectCon,
		                	ok:function(){
		                		var throughState = $('.through').filter(':checked').val();
		                		jh.utils.ajax.send({
		                			method:'post',
					                url: '/trace/channel/check',
					                data: {
					                	traceId: args.id,
					                	verifyStatus: throughState
					                },
					                done: function(returnData) {
					                    jh.utils.alert({
						                	content: '操作成功',
						                	ok:true
						                })
					                }
		                
		            			});
		                	},
		                	cancel:true
		                })
		            });
                }
            });
        };

        this.searchIllegalInfo = function(){
            var page = new jh.ui.page({
                data_container: $('#distribution-illegalList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/clue/illegalList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('distribution-illegalList-template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            //信息修复
            $('body').off('click','#distribution-illegalList').on('click','#distribution-illegalList',function(){
                jh.utils.ajax.send({
					url: '/clue/bondRepair',
					data: {
						taskIds: args.id
					},
					done: function(returnData){
						_this.searchIllegalInfo();
					}
				})
            });
        };
    }
    module.exports = ClueAuditDetail;
});