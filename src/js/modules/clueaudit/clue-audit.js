/**
 * OpenList
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueAudit() {
        var _this = this;
        _this.form = $('#admin-clueAuditList-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#admin-clueAuditList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/trace/channel/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('admin-clueAuditList-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            //          获取捕头
            jh.utils.ajax.send({
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var data = returnData.data;
                    var optionStr = '';
                    for (var i = 0; i < data.length; i++) {
                        optionStr += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $('#clueAudit-butou').append(optionStr);
                }
            })

            //查询
            jh.utils.validator.init({
                id: 'admin-clueAuditList-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.clue-audit-detail').on('click', '.clue-audit-detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/clueaudit/clue-audit-detail', {
                    id: id
                });
            });
        };
    }
    module.exports = ClueAudit;
});