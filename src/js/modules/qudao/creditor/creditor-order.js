/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorOrder() {
        var _this = this;
        _this.form = $('#admin-creditorOrderList-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {

            var page = new jh.ui.page({
                data_container: $('#admin-creditorOrderList-container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/task/channel/loanerSure',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('admin-creditorOrderList-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            jh.utils.ajax.send({
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var data = returnData.data;
                    var optionStr = '';
                    for (var i = 0; i < data.length; i++) {
                        optionStr += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $('#creditorOrder-butou').append(optionStr);
                }
            })
            // 搜索
            jh.utils.validator.init({
                id: 'admin-creditorOrderList-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });


            //查看任务详情
            $('.dataShow').off('click', '.orderDetail').on('click', '.orderDetail', function() {
                var id = $(this).data('id');
                jh.utils.load('/src/modules/qudao/creditor/creditor-order-detail', {
                    id: id
                });
            });
        };
    }
    module.exports = CreditorOrder;
});