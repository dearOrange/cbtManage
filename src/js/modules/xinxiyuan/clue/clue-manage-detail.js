/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueManageDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/trace/detail',
                data: {
                    traceId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.passState = args.state;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('clueManage_detail_template', returnData);
                    $('.clueManageContent').html(html);
                    var picArr = ['carPhoto', 'carNumberPhoto'];
                    for (var i = 0; i < 2; i++) {
                        jh.utils.uploader.init({
                            isAppend: false,
                            pick: {
                                id: '#' + picArr[i]
                            }
                        });
                    }

                    jh.utils.getPositionByImage(returnData.data.carPhoto);

                }
            });
        };

        this.registerEvent = function() {
            //审核
            $('body').off('click', '.auditClue').on('click', '.auditClue', function() {
                jh.utils.alert({
                    content: '确定审核吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/adopt',
                            data:{
                                traceId: args.id
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '已审核',
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
        };
    }
    module.exports = ClueManageDetail;
});