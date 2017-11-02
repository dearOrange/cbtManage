'use strict';
define(function(require, exports, module) {
    function RoleSetList() {
        var that = this;
        this.init = function() {
            this.initList();
            this.registerEvent();
        };
        this.initList = function() {
            // 分页
            var page = new jh.ui.page({
                url: '/admin/role/list',
                method: 'GET',
                ident: 'role',
                data_container: $('#roleSet_item'),
                page_container: $('#page_container'),
                callback: function(data) {
                    var listHtml = jh.utils.template('roleSet_list_template', data);
                    return listHtml;
                },
                onload: function() {
                    $('input').iCheck({ /*复选框*/
                        checkboxClass: 'icheckbox_flat-orange',
                        radioClass: 'iradio_flat-orange',
                        increaseArea: '20%'
                    });
                    //全选
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
            //新增角色
            $('#addRole').on('click', function() {
                jh.utils.load('/src/modules/platform/addRole.html');
            });
            //编辑角色
            $('#roleSet_list').on('click', '.editRoleBtn', function() {
                var _id = $(this).closest('tr').data('id');
                jh.utils.load('/src/modules/platform/editRole.html', {
                    id: _id
                });
            });
            //删除
            $('#roleSet_list').on('click', '.deleteRoleBtn', function() {
                var _this = $(this);
                var roleName = _this.closest('tr').find('.role_name').html();
                jh.utils.alert({
                    content: '确认删除该角色？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/admin/role/del',
                            method: 'GET',
                            data: {
                                name: roleName
                            },
                            done: function(data) {
                                that.initList();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });
            //批量删除
            $('#batchDelete').on('click', function() {
                var roleNames = [];
                $('.checkself').each(function(index, el) {
                    if ($(this).is(':checked')) {
                        var roleName = $(el).closest('tr').find('.role_name').html();
                        roleNames.push(roleName);
                    }
                });
                var roleNamesStr = roleNames.join(',');
                if (roleNames.length) {
                    jh.utils.alert({
                        content: '确认删除选中的角色？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/role/del-multi',
                                method: 'get',
                                data: {
                                    names: roleNamesStr
                                },
                                done: function(data) {
                                    that.initList();
                                }
                            });
                        },
                        cancel: function() {}
                    });
                } else {
                    jh.utils.alert({
                        content: '请勾选您所要删除的角色'
                    });
                }

            });
        };
    }
    module.exports = RoleSetList;
});