/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function OfficerManageDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/downstreams/channel/detail',
                data: {
                    downstreamId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.officerClueState = jh.utils.officerClueState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var menuState = function(state) {
                        switch (state) {
                            case "all":
                                state = "可找车可拖车";
                                break;
                            case "trace":
                                state = "只找车";
                                break;
                            case "recycle":
                                state = "只拖车";
                                break;
                            case "tracerecycle":
                                state = "找车+拖车一体";
                                break;
                        }
                        return state;
                    }
                    returnData.stateToString = menuState;
                    var html = jh.utils.template('officer_detail_template', returnData);
                    $('.officer-detail').html(html);
                    var picArr = ['businessLicense', 'legalPersonIdImg', 'legalPersonHandIdImg', 'linkmanIdImg', 'linkmanHandIdImg'];
                    for (var i = 0; i < 5; i++) {
                        jh.utils.uploader.init({
                            isAppend: false,
                            pick: {
                                id: '#' + picArr[i]
                            }
                        });
                    }

                    //认证
                    $('body').off('click', '.officerAudit').on('click', '.officerAudit', function() {
                        var rejectCon = jh.utils.template('officer_audit_template', {});
                        jh.utils.alert({
                        	title: '捕头认证',
                            content: rejectCon,
                            ok: function() {
                                var throughState = $('.through').filter(':checked').val();
                                var btn = $('[i-id="ok"]');
                                $('<img src="/src/img/loading.gif" height="29"/>').insertAfter(btn);
                                jh.utils.ajax.send({
                                    method: 'post',
                                    url: '/downstreams/channel/approve',
                                    data: {
                                        downstreamId: args.id,
                                        approveStatus: throughState,
                                        reason: $('.butouReason').val()
                                    },
                                    done: function(returnData) {
                                        jh.utils.alert({
                                            content: '操作成功',
                                            ok: function() {
                                                window.location.reload();
                                            }
                                        })
                                    },
                                    always:function(){
                                        btn.siblings('img').remove();
                                    }

                                });
                                return false;
                            },
                            cancel: true
                        })
                    });
                }
            });
        };

    }
    module.exports = OfficerManageDetail;
});