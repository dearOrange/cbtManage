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

        this.initYjList = function() {
            var page = new jh.ui.page({
                data_container: $('#moneytotal_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/record/bargainList',
                isSearch: true,
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('addMoneytotal_template', data);
                }
            });
            page.init();
        };

        this.initDetail = function(isSearch) {
            jh.utils.ajax.send({
                url: '/task/channel/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.officerState = jh.utils.officerState;
                    returnData.taskId = args.id;
                    var html = jh.utils.template('admin-clueAuditDetail-template', returnData);
                    $('#admin-clueAuditDetail-container').html(html);
                    _this.searchIllegalInfo(); //查询违章信息

                    _this.initYjList();
                }
            });
        };

        this.searchIllegalInfo = function() {
            var page = new jh.ui.page({
                data_container: $('#distribution-illegalList-container'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
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
            //线索审核
            $('body').off('click', '.clueaudit').on('click', '.clueaudit', function() {
            	var traceId = $(this).data("id");
                var rejectCon = jh.utils.template('clue_audit_template', {});
                jh.utils.alert({
                    content: rejectCon,
                    ok: function() {
                        var throughState = $('.through').filter(':checked').val();
                        if(!throughState){
                        	jh.utils.alert({
                        		content: '请先选择条件',
                        		ok: true
                        	})
                        	return false;
                        };
                        jh.utils.ajax.send({
                            method: 'post',
                            url: '/trace/channel/check',
                            data: {
                                traceId: traceId,
                                verifyStatus: throughState,
                                reason: $('.textReason').val()
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '操作成功',
                                    ok: function(){
                                        window.location.reload();
                                    }
                                })
                            }

                        });
                    },
                    cancel: true
                })
            });
            
            //添加议价小计
            $('body').off('click', '.addMoneytotal').on('click', '.addMoneytotal', function() {
                var addStr = jh.utils.template('clueaudit_addSubtotal_template', {});
                jh.utils.alert({
                    content: addStr,
                    ok: function() {
                    	var dataForm = jh.utils.formToJson($('#sub-customer-form'));
                    	dataForm.taskId = args.id;
                    	var mobile1 = /^1[3|4|5|6|7|8][0-9]{9}$/;
				        var mobile2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
				        var mobile3 = /^400-[0-9]{3}-[0-9]{4}$/;
                    	if(mobile1.test(dataForm.contactPhone) || mobile2.test(dataForm.contactPhone) || mobile3.test(dataForm.contactPhone)) {
                    		jh.utils.ajax.send({
	                            url: '/record/addBargain',
	                            data: dataForm,
	                            done: function(returnData) {
	                            	jh.utils.alert({
	                            		content: '添加议价小计成功！',
	                            		ok:function(){
	                            			_this.initYjList();
	                            			jh.utils.closeArt();
	                            		},
	                            		cancel:false
	                            	});
	                                
	                            }
	                        });
                    	}else {
                    		jh.utils.alert({
                        		content: '请填写正确的联系方式',
                        		ok:true
                        	});
                    	}
                    	return false;
                    }
                });
            });
        };
    }
    module.exports = ClueAuditDetail;
});