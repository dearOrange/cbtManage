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

        this.init = function() {
        	this.initContent();
        };

		this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#luck_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/trace/luckTask',
                contentType: 'application/json',
                data: {},
                callback: function(data) {
                    return jh.utils.template('luckList_content_template', data);
                }
            });
            page.init();
        };
    }
    module.exports = LuckList;
});