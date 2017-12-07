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
            this.registerEvent();
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
                }
            });
        };

        this.registerEvent = function() {
            //信息修复
            $('body').off('click','#distribution-illegalList').on('click','#distribution-illegalList',function(){
                _this.searchIllegalInfo();
            });
        };
    }
    module.exports = EvidenceAuditDetail;
});