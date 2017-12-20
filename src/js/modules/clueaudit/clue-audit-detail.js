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
                        jh.utils.ajax.send({
                            method: 'post',
                            url: '/trace/channel/check',
                            data: {
                                traceId: traceId,
                                verifyStatus: throughState
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
        };
    }
    module.exports = ClueAuditDetail;
});