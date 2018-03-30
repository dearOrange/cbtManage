/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function EntrustmentListDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/verify/detail',
                data: {
                    verifyId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('entrustment_detail_template', returnData);
                    $('.entrustmentListContent').html(html);

                    //确认
                    $('body').off('click', '.isRight').on('click', '.isRight', function() {
                        var isIssueState = $('.isIssue').filter(":checked").val();
                        if(!isIssueState){
                        	jh.utils.alert({
                                content: '请选择是否出具该委托！',
                                ok: true,
                                cancel: false
                            })
                        	return false;
                        }
                        jh.utils.ajax.send({
                            url: '/verify/result',
                            data: {
                                verifyId: args.id,
                                isIssue: isIssueState
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '操作成功！',
                                    ok: function(){
                                    	window.location.reload();
                                    }
                                })
                            }
                        });
                    })
                }
            });
        };

    }
    module.exports = EntrustmentListDetail;
});