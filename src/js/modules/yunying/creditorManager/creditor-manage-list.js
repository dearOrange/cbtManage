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
        _this.form = $('#creditorManager-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#creditorManager_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/upstreams/operateManagerList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('creditorManager_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'creditorManager-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.admin-detail').on('click', '.admin-detail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/yunying/creditorManager/creditor_manage_detail", {
                    id: id
                })
            });
            //分配运营经理
            $('.dataShow').off('click', '.admin-distribution').on('click', '.admin-distribution', function() {
                var id = $(this).data('id'); //债权方id
                jh.utils.ajax.send({
                    url: '/operator/getAllBusiness',
                    done: function(returnData) {
                        var str = jh.utils.template('creditorManage_content_template', returnData);
                        jh.utils.alert({
                            title: '分配运营经理',
                            content: str,
                            ok: function() {
                                var radio = $('#creditorManager_list_distribution_form :checked');
                                var yid = radio.val();
                                if (!yid) {
                                    jh.utils.alert({
                                        content: '请选择运营经理！',
                                        ok: true,
                                        cancel: false
                                    });
                                    return false;
                                }
                                jh.utils.ajax.send({
                                    url: '/upstreams/updatebusinessManager',
                                    data: {
                                        upstreamId: id,
                                        businessManagerId: yid
                                    },
                                    done: function() {
                                        jh.utils.alert({
                                            content: '运营经理分配成功！',
                                            ok: true,
                                            cancel: false
                                        });
                                    }
                                });
                            },
                            cancel: true
                        });
                    }
                });
            });

        };
    }
    module.exports = CreditorManage;
});