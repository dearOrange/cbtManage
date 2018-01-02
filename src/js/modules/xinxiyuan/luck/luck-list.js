/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function LuckList() {
        var _this = this;
        _this.form = $('#luck-list-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#luck_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/trace/luckTask',
                contentType: 'application/json',
                data: jh.utils.formToJson($('#luck-list-form')),
                callback: function(data) {
                    return jh.utils.template('luckList_content_template', data);
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
                id: 'luck-list-form',
                submitHandler: function(form) {
                    _this.initContent();
                    return false;
                }
            });
        };
    }
    module.exports = LuckList;
});