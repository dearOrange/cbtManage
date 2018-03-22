/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorFilter() {
        var _this = this;
        _this.form = $('#creditor-filter-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2({
                minimumResultsForSearch:Infinity
            });
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#creditor_filter_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/upstreams/sifteList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('creditor_filter_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'creditor-filter-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.creditorFilterDetail').on('click', '.creditorFilterDetail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/yunying/creditor-filter/creditor-filter-detail", {
                    id: id
                })
            });
            
            $('.dataShow').off('click', '.first-filter').on('click', '.first-filter', function() {
                var id = $(this).data('id');
                jh.utils.confirm({
                    content: '确定通过初筛吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                          url: '/upstreams/screen',
                          data: {
                            upstreamId: id
                          },
                          done: function(returnData) {
                            jh.utils.alert({
                              content: '初筛成功！',
                              ok: function() {
                                window.location.reload();
                              }
                            })
                          }
                        });
                    }
                });
            });
        };
    }
    module.exports = CreditorFilter;
});