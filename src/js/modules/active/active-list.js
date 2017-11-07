'use strict';
define(function(require, exports, module) {
    function ActiveList() {
        var _this = this;
        _this.form = $('#active-list-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#order_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                ident: 'news',
                url: '/trace/list',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    data.viewImgRoot = jh.arguments.viewImgRoot;
                    var contentHtml = jh.utils.template('activeList_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
            $('#role').select2();
        };
       this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'active-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //通过
            $('.dataShow').off('click','.agreement').on('click', '.agreement', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '是否确认通过？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/passed',
                            data: {
                                traceId: id
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(data, status, xhr) {
                                _this.initContent();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            //拒绝
            $('.dataShow').off('click','.pass').on('click', '.pass', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '是否确认拒绝？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/refuse',
                            data: {
                                traceId: id
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(data, status, xhr) {
                                _this.initContent();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            //开关活动
            $('body').off('click','.active-switch').on('click', '.active-switch', function() {
                var me = $(this);
                var isOpen = me.data('isOpen');
                var editOpen = isOpen === 'true' ? 'false' : 'true';
                jh.utils.alert({
                    title: '改变活动状态',
                    content: '<div>请输入密码</div><div><input type="password" name="password" id="editActivePassword"/></div>',
                    ok: function() {
                        var pas = $('#editActivePassword');
                        var val = $.trim(pas.val());
                        if(val === ''){
                            return false;
                        }
                        jh.utils.ajax.send({
                            url: '/system/setActive',
                            data: {
                                isOpen: editOpen,
                                password: val
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(data) {
                                window.location.reload();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

        };
    }
    module.exports = ActiveList;
});