'use strict';
define(function(require, exports, module) {
    function AccountSetList() {
        let _that = this;
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                url: '/admin/user/list',
                method: 'POST',
                ident: 'account',
                data: jh.utils.formToJson($('#account_form')),
                data_container: $('#account_list_container'),
                page_container: $('#page_container'),
                isSearch: isSearch,
                callback: function(data) {
                    var html = jh.utils.template('accountSetList_content_template', data);
                    return html;
                },
                onload: function() {
                    $('input').iCheck({ /*复选框*/
                        checkboxClass: 'icheckbox_flat-orange',
                        radioClass: 'iradio_flat-orange',
                        increaseArea: '20%'
                    });
                    var checkAll = $('.checkall');
                    var checkboxes = $('.checkself');
                    var size = checkboxes.length - 1;
                    checkAll.iCheck('uncheck');
                    checkAll.on('ifClicked ', function(event) {
                        if ($(this).prop('checked')) {
                            checkboxes.iCheck('uncheck');
                        } else {
                            checkboxes.iCheck('check');
                        }
                    });
                    checkboxes.on('ifChanged', function(event) {
                        if (checkboxes.filter(':checked').length > size) {
                            checkAll.iCheck('check');
                        } else {
                            checkAll.iCheck('uncheck');
                        }
                    });
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            jh.utils.validator.init({
                id: 'account_form',
                submitHandler: function() {
                    _that.initContent(true);
                }
            });
            jh.utils.ajax.send({
                method: 'GET',
                url: '/admin/role/all',
                done: function(data, status, xhr) {
                    let htmls = '<option value="0">全部</option>';
                    $.each(data.response.list, function(index, val) {
                        htmls += '<option value="' + val.id + '">' + val.name + '</option>';
                    });
                    $('#role_id').html(htmls);
                }
            });
            jh.utils.ajax.send({
                method: 'GET',
                url: '/admin/company/list',
                done: function(data, status, xhr) {
                    let htmls = '<option value="0">全部</option>';
                    $.each(data.response.list, function(index, val) {
                        htmls += '<option value="' + val.id + '">' + val.company_name + '</option>';
                    });
                    $('#company').html(htmls);
                }
            });
            $('select').select2();
            //点击新增角色、编辑角色页面跳转
            $('#addAccount').on('click', function() {
                jh.utils.load('/src/modules/platform/addAccount.html');

            });

            $('.dataShow').on('click', '.edit', function(event) {
                let id = $(this).data('id');
                jh.utils.load('/src/modules/platform/editAccount.html', {
                    id: id
                });
            });
            $(".dataShow").on('click', '.delete', function(event) {
                let that = $(this);
                let nick_name = $(this).data('name');
                jh.utils.alert({
                    content: '确定删除账号吗',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/admin/user/del',
                            method: 'POST',
                            data: {
                                nick_name: nick_name
                            },
                            done: function(data) {
                                _that.initContent();
                                that.parents('.trData').remove();
                            },
                        });
                    },
                    cancel: function() {}
                });
            });
            $('#batchDelete').click(function(event) {
                let nick_names = '';
                $.each($('.checkself:checked'), function(index, val) {
                    nick_names += $(val).parents('.order').next('td').text() + ',';
                });
                nick_names = nick_names.substr(0, nick_names.length - 1);
                if (nick_names.length == 0) {
                    jh.utils.alert({
                        content: '请勾选你需要删除的账号'
                    })
                    return false;
                }
                jh.utils.alert({
                    content: '确定删除账号吗',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/admin/user/del-multi',
                            method: 'POST',
                            data: {
                                nick_names: nick_names
                            },
                            done: function(data) {
                                _that.initContent();
                            },
                        });
                    },
                    cancel: function() {}
                });
            });
        };
    }
    module.exports = AccountSetList;
});
