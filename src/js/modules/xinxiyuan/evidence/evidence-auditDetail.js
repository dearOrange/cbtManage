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
		                
		                	_this.uploadVouch();
		               
		                
		            });
		            
		            jh.utils.uploader.init({
                        fileNumLimit: 5,
                        pick: {
                            id: '#entrustUrl'
                        }
                    });
                    
                    
                }
            });
        };
        
        //上传平台委托书
        this.uploadVouch = function() {
        	var datas = jh.utils.formToJson($('#uploadVouch-form'));
        	if (!datas.entrustUrl) {
                jh.utils.confirm({
                    content: '请上传委托书原件！',
                    ok: true,
                    cancel: true
                });
                return false;
            }
        	datas.entrustUrl = jh.utils.isArray(datas.entrustUrl) ? datas.entrustUrl.join(',') : datas.entrustUrl;
        	
		    var contentTemplate = jh.utils.template('evidence_audit_template', {});
        	jh.utils.alert({
            	title: '凭证审核',
            	content: contentTemplate,
            	ok:function(){
            		datas.checkingState = $('.auditThrough').filter(":checked").val();
            		datas.taskId = args.id;
            		datas.reason = $('.reason').val();
            		jh.utils.ajax.send({
            			url: '/task/checkingVoucher',
            			data: datas,
            			done: function(data){
            				jh.utils.alert({
            					content: '已审核',
            					ok: function(){
            						jh.utils.load('/src/modules/xinxiyuan/evidence/evidence-audit');
            					}
            				})
            			}
            		})
            	},
            	cancel:true
            })
        }

    }
    module.exports = EvidenceAuditDetail;
});