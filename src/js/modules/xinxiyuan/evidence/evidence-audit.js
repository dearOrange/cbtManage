/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function EvidenceAudit() {
        var _this = this;
        _this.form = $('#admin-evidenceAuditList-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#admin-evidenceAuditList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/checkingList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                callback: function(data) {
                    return jh.utils.template('admin-evidenceAuditList-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: _this.form.attr('id'),
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/xinxiyuan/evidence/evidence-auditDetail', {
                    id: id
                });
            });

        };
    }
    module.exports = EvidenceAudit;
});