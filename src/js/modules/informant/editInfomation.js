'use strict';
define(function(require, exports, module) {
    var EditInfomation = function() {
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {
            var _that = $(this);
            var urls = jh.utils.getURLValue().args;
            var id = parseInt(urls.id);
            jh.utils.ajax.send({
                method: 'get',
                url: '/admin/news/view',
                data: {
                    id: id
                },
                done: function(data, status, xhr) {
                    data.main_pic = jh.arguments.viewImgRoot + data.response.main_pic;
                    var contentHTML = jh.utils.template('addInfomation_content_template', data);
                    $('#editInfoForm').html(contentHTML);
                    // 初始化ue和上传
                    var editor = jh.utils.ueditor('inf_container', {
                        initialFrameHeight: 500
                    });
                    jh.utils.uploader.init({
                        pick: {
                            id: '#main_pic'
                        },
                        fileNumLimit: 1,
                        formData: {
                            size_type: 'news'
                        }
                    });

                    //覆盖区域
                    var area = data.response.area ? data.response.area.split(",") : '';
                    var area_name = data.response.area_str ? data.response.area_str.split(",") : '';
                    var str = '<option value="0">所有区域</option>';
                    var flag = 1;
                    jh.utils.ajax.send({
                        method: 'post',
                        url: '/admin/city/list',
                        data: {
                            status: 1, //区域是否开通，0关闭，1开通
                        },
                        done: function(data, status, xhr) {
                            var list = data.response.list;
                            for (var j = 0; j < list.length; j++) {
                                str += '<option value="' + list[j].code + '">' + list[j].name + '</option>';
                            }
                            for (var i = 0; i < area.length; i++) {
                                flag = 1;
                                for (var k = 0; k < list.length; k++) {
                                    if (area[i] == list[k].code || area[i] == 0) {
                                        flag = 0;
                                    }
                                }
                                if (flag) {
                                    str += '<option value="' + area[i] + '">' + area_name[i] + '</option>';
                                }
                            }
                            $('#areaItem').html(str).val(area).select2();
                        }
                    });
                    $('#areaItem').on('change', function() {
                        var _this = $(this);
                        var codes = _this.val();
                        if (codes[0] === '0') {
                            _this.val(0);
                            _this.trigger('change.select2');
                        }
                    });
                }
            });
        };
        this.registerEvent = function() {
            // 点击提交
            jh.utils.validator.init({
                id: 'editInfoForm',
                submitHandler: function() {
                    jh.utils.alert({
                        content: '是否确认以上操作？',
                        ok: function() {
                            var data = jh.utils.formToJson('#editInfoForm');
                            if ($.isArray(data.area)) {
                                data.area = data.area.join(',');
                            }
                            jh.utils.ajax.send({
                                method: 'post',
                                url: '/admin/news/save',
                                data: data,
                                done: function(data, status, xhr) {
                                    jh.utils.alert({
                                        content: '提交成功!'
                                    });
                                    jh.utils.load('/src/modules/operate/infomationList.html');
                                }
                            });
                        },
                        cancel: function() {}
                    });
                    return false;
                }
            });
        };
    };
    module.exports = EditInfomation;
});