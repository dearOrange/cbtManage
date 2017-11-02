'use strict';
define(function(require, exports, module) {
    function EditMessage() {
        var _id = jh.utils.getURLValue().args.id;
        var that = this;
        this.init = function() {
            this.initPlugin();
            this.initData();
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
            $('#is_push').on('ifChanged', function() {
                $(this).is(':checked') ? $(this).val(1) : $(this).val(0);
            });
        };
        this.initData = function() {
            // 加载数据
            jh.utils.ajax.send({
                url: '/admin/message/message',
                method: 'GET',
                data: {
                    id: _id
                },
                done: function(data) {
                    var datas = data.response;
                    $('#title').val(datas.title);
                    $('#content').val(datas.content);
                    $('#link_url').val(datas.link_url);
                    $('#token').val(datas.token);
                    datas.is_push ? $('#is_push').iCheck('check') : $('#is_push').iCheck('uncheck');
                    $('#is_push').is(':checked') ? $('#is_push').val(1) : $('#is_push').val(0);
                    $('#type').val(datas.type);
                    $('#type').select2();
                    that.render(datas.type, datas.obj_id);
                }
            });
        };
        this.render = function(type, id) {
            if (type === 1) {
                var opt = '<option value = "0">---</option>';
                $('#obj_id').html(opt);
                $('#obj_id').val(id);
                $('#link').show();
            } else if (type === 2) {
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
                        $('#obj_id').val(id);
                    }
                });
            } else if (type === 3) {
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
                        $('#obj_id').val(id);
                    }
                });
            }
            $('#obj_id').select2();
        };
        this.registerEvent = function() {
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
            });

            // 表单提交
            jh.utils.validator.init({
                id: 'editMessage',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    datas.is_push = $('#is_push').val();
                    datas.id = _id;
                    jh.utils.alert({
                        content: '确认修改该条消息？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/message/edit-message',
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
    module.exports = EditMessage;
});