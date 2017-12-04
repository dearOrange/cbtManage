/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorManage() {
        var _this = this;
        _this.form = $('#creditor-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#creditor_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/upstreams/operateList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('creditorManage_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'creditor-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.admin-detail').on('click', '.admin-detail', function() {
            	var id = $(this).data('id');
                jh.utils.load("/src/modules/creditororder/creditor_manage_detail",{
                	id:id
                })
            });
            
        };
    }
    module.exports = CreditorManage;
});