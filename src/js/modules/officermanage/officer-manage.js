/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function OfficerManage() {
        var _this = this;
        _this.form = $('#admin-officerManager-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#officer_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/downstreams/channel/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    var contentHtml = jh.utils.template('officerManager_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
        };
        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'admin-officerManager-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.officerDetail').on('click', '.officerDetail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/officermanage/officer-manage-detail", {
                    id: id
                })

            });


        };
    }
    module.exports = OfficerManage;
});