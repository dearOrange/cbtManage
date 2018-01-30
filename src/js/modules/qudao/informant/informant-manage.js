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
                	data.officerClueState = jh.utils.officerClueState;
                    return jh.utils.template('informantManage_content_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            //认证成为捕头
            $('body').off('click', '.changeOfficer').on('click', '.changeOfficer', function() {
            	var id = $(this).data('id');
                jh.utils.load('/src/modules/qudao/informant/informant-manage-detail', {
                    id: id
                });
            });
        };
    }
    module.exports = InformantManage;
});