'use strict';
define(function(require, exports, module) {
    function EditRole() {
        var _id = jh.utils.getURLValue().args.id;
        this.init = function() {
            this.initPlugin();
            this.initMenu();
            this.registerEvent();
        };
        this.initPlugin = function() {
            $('input').iCheck({
                checkboxClass: 'icheckbox_flat-orange',
                radioClass: 'iradio_flat-orange',
                increaseArea: '20%'
            });
        };
        this.initMenu = function() {
            jh.utils.ajax.send({
                url: '/admin/role/one',
                method: 'POST',
                data: {
                    id: _id
                },
                done: function(data) {
                    $('#name').html(data.response.name);
                    var rights = JSON.parse(data.response.rights);
                    for (var j in rights) {
                        $('input[name=' + j + ']').iCheck('check');
                        for (var i = 0; i < rights[j].length; i++) {
                            $('#' + j).parents('.checkboxGroup').find('input[name=' + rights[j][i] + ']').iCheck('check');
                        }
                    }
                }
            });
        };
        this.registerEvent = function() {
            // 小组全选
            $('.checkboxGroup').each(function() {
                var checkAll = $(this).find('.checkall');
                var checkboxes = $(this).find('.checkself');
                checkAll.on('ifClicked ', function(event) {
                    $(this).prop('checked') ? checkboxes.iCheck('uncheck') : checkboxes.iCheck('check');
                });
                checkboxes.on('ifChanged', function(event) {
                    checkboxes.filter(':checked').length ? checkAll.iCheck('check') : checkAll.iCheck('uncheck');
                });
            })

            // 总的全选
            var checkallWhole = $('.checkallWhole');
            var checkAllBoxes = $('.checkboxGroup').find('.label_checkbox');
            var size = checkAllBoxes.length - 1;
            checkallWhole.on('ifClicked ', function(event) {
                $(this).prop('checked') ? checkAllBoxes.iCheck('uncheck') : checkAllBoxes.iCheck('check');
            });
            checkAllBoxes.on('ifChanged', function(event) {
                checkAllBoxes.filter(':checked').length > size ? checkallWhole.iCheck('check') : checkallWhole.iCheck('uncheck');
            });

            //表单提交
            jh.utils.validator.init({
                id: 'editRole',
                submitHandler: function(form) {
                    var datas = getRights(form);
                    datas.id = _id;
                    datas.name = $('#name').html();
                    jh.utils.alert({
                        content: '确认修改该角色？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/role/update',
                                method: 'POST',
                                data: datas,
                                done: function(returnData) {
                                    jh.utils.load('/src/modules/platform/roleSetList.html');
                                }
                            });
                        },
                        cancel: function() {}
                    });
                    return false;
                }
            });

            // 获取权限
            function getRights(form) {
                var final_json = {};
                var json = {};
                $('.checkboxGroup').each(function(index, el) {
                    var priIpt = $(el).find('.primary input');
                    if (priIpt.is(':checked')) {
                        var priName = priIpt.prop('name');
                        json[priName] = [];
                        var subIpt = priIpt.parents('.primary').siblings('.secondary').find('input');
                        subIpt.each(function(index, el) {
                            if ($(this).is(':checked')) {
                                var subName = $(this).prop('name');
                                json[priName].push(subName);
                            }
                        })
                    }
                });
                final_json.name = $('input[name=name]').val();
                final_json.rights = JSON.stringify(json);
                return final_json;
            }
        };
    }
    module.exports = EditRole;
});