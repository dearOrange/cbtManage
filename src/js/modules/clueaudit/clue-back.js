/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueBack() {
        var _this = this;
        _this.form = $('#clue-back-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#clue_back_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/feedbackList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('clueBack_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'clue-back-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.clueBackDetail').on('click', '.clueBackDetail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/clueaudit/clue-back-detail",{
                	id:id
                })
            });
            
            //添加议价小计
            $('.dataShow').off('click', '.addSub').on('click', '.addSub', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/clueaudit/clue-back-detail",{
                	id:id
                })
            });
        };
    }
    module.exports = ClueBack;
});