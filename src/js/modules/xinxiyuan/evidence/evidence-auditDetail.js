/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function EvidenceAuditDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function(isSearch) {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    var html = jh.utils.template('admin-evidenceAuditDetail-template', returnData);
                    $('#admin-evidenceAuditDetail-container').html(html);
                    
                    //凭证审核
		            $('body').off('click','.isSure').on('click','.isSure',function(){
		                var contentTemplate = jh.utils.template('evidence_audit_template', {});
		                jh.utils.alert({
		                	content: contentTemplate,
		                	ok:function(){
		                		var throughState = $('.auditThrough').filter(":checked").val();
		                		jh.utils.ajax.send({
		                			url: '/task/checkingVoucher',
		                			data: {
		                				taskId: args.id,
		                				reason: $('.reason').val(),
		                				checkingState: throughState
		                			},
		                			done: function(data){
		                				jh.utils.alert({
		                					content: '已审核',
		                					ok: function(){
		                						window.history.go(-1);
		                					}
		                				})
		                			}
		                		})
		                	},
		                	cancel:true
		                })
		            });
                }
            });
        };

    }
    module.exports = EvidenceAuditDetail;
});