/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InformantManage() {
        var _this = this;
        _this.form = $('#informant-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#informant_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/downstreams/channel/informerlist',
                contentType: 'application/json',
                data: jh.utils.formToJson($('#informant-manage-form')),
                callback: function(data) {
                    return jh.utils.template('informantManage_content_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            // 搜索
            jh.utils.validator.init({
                id: 'informant-manage-form',
                submitHandler: function(form) {
                    _this.initContent();
                    return false;
                }
            });
        };
    }
    module.exports = InformantManage;
});