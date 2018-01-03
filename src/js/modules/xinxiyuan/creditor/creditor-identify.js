/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorIdentify() {
        var _this = this;
        _this.form = $('#creditor-identify-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2({
            	minimumResultsForSearch:Infinity
            });
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#creditor_identify_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/upstreams/infoList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('creditorIdentify_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'creditor-identify-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.creditor-detail').on('click', '.creditor-detail', function() {
            	var id = $(this).data('id');
                jh.utils.load("/src/modules/xinxiyuan/creditor/creditor-identify-detail",{
                	id:id
                })
            });
            
        };
    }
    module.exports = CreditorIdentify;
});