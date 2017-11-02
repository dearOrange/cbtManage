'use strict';
define(function(require, exports, module) {
    function AddMessage() {
        this.init = function() {
            this.initPlugin();
            this.registerEvent();
        };
        this.initPlugin = function() {
            // 复选框
            $('input').iCheck({
                checkboxClass: 'icheckbox_flat-orange',
                radioClass: 'iradio_flat-orange',
                increaseArea: '20%'
            });
            // 复选框操作
            $('#is_push').is(':checked') ? $('#is_push').val(1) : $('#is_push').val(0);
            $('#is_push').on('ifChanged', function() {
                $(this).is(':checked') ? $(this).val(1) : $(this).val(0);
            });
            // 下拉框
            $('#type').select2();
            $('#obj_id').select2();
        };
        this.registerEvent = function() {
            // token
            jh.utils.ajax.send({
                url: '/admin/message/create-token',
                method: 'POST',
                done: function(data) {
                    $('#token').val(data.response.token);
                }
            });

            // 分类
            $('#type').on('change', function() {
                var type = $(this).val();
                if (type == 2) {
                    jh.utils.ajax.send({
                        url: '/admin/provider/list',
                        method: 'POST',
                        data: {
                            pageSize: 100
                        },
                        done: function(data) {
                            var datas = data.response.list;
                            var opts = '';
                            for (var i = 0; i < datas.length; i++) {
                                opts += '<option value="' + datas[i].id + '">' + datas[i].provider_name + '</option>';
                            }
                            $('#obj_id').html(opts);
                            $('#link').hide();
                        }
                    });
                } else if (type == 3) {
                    jh.utils.ajax.send({
                        url: '/admin/activity/activity-list',
                        method: 'POST',
                        data: {
                            pageSize: 100
                        },
                        done: function(data) {
                            var datas = data.response.list;
                            var opts = '';
                            for (var i = 0; i < datas.length; i++) {
                                opts += '<option value="' + datas[i].id + '">' + datas[i].name + '</option>';
                            }
                            $('#obj_id').html(opts);
                            $('#link').hide();
                        }
                    });
                } else {
                    var opts = '<option value = "0">---</option>';
                    $('#obj_id').html(opts);
                    $('#link').show();
                }
            })

            // 表单提交
            jh.utils.validator.init({
                id: 'addMessage',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    datas.is_push = $('#is_push').val();
                    jh.utils.alert({
                        content: '确认增加该条消息？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/message/add-message',
                                method: 'POST',
                                data: datas,
                                done: function(returnData) {
                                    jh.utils.load('/src/modules/message/messageList.html');
                                }
                            });
                        },
                        cancel: function() {}
                    });
                    return false;
                }
            });
        };
    }
    module.exports = AddMessage;
});