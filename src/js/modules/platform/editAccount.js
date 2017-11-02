'use strict';
define(function(require, exports, module) {
    function EditAccount() {
        this.userData = {};
        this.ajaxSt = 0;
        let that = this;
        this.init = function() {
            this.initContent();
            this.registerEvent();

        };

        this.initContent = function() {
            $('input').iCheck({
                checkboxClass: 'icheckbox_flat-orange',
                radioClass: 'iradio_flat-orange',
                increaseArea: '20%'
            });
            jh.utils.ajax.send({
                method: 'GET',
                url: '/admin/role/all',
                done: function(data, status, xhr) {
                    let htmls = '<option value="">---</option>';
                    $.each(data.response.list, function(index, val) {
                        htmls += '<option value="' + val.id + '">' + val.name + '</option>';
                    });
                    $('#role_id').html(htmls);
                    that.ajaxSt++;
                    that.checkAjax();
                }
            });
            jh.utils.ajax.send({
                method: 'GET',
                url: '/admin/company/list',
                done: function(data, status, xhr) {
                    let htmls = '<option value="">---</option>';
                    $.each(data.response.list, function(index, val) {
                        htmls += '<option value="' + val.id + '">' + val.company_name + '</option>';
                    });
                    $('#company').html(htmls);
                    that.ajaxSt++;
                    that.checkAjax();
                }
            });

        };

        this.checkAjax = function() {
            if (that.ajaxSt < 2) {
                return false;
            }
            let userId = jh.utils.getURLValue().args.id;
            jh.utils.ajax.send({
                method: 'post',
                url: '/admin/user/one',
                data: {
                    id: parseInt(userId),
                },
                done: function(data) {
                    that.userData = data.response;
                    $('#name').val(data.response.name);
                    $('#mobile').html(data.response.mobile);
                    $('#company').val(parseInt(data.response.company));
                    jh.utils.ajax.send({
                        method: 'GET',
                        url: '/admin/office/list',
                        data: {
                            id: $('#company').val()
                        },
                        done: function(data, status, xhr) {
                            let htmls = '<option value="">---</option>';
                            $.each(data.response.list, function(index, val) {
                                htmls += '<option value="' + val.id + '">' + val.office + '</option>';
                            });
                            $('#office').html(htmls);
                            $('#office').val(that.userData.office);
                        }
                    });

                    $('#real_name').val(data.response.real_name);
                    $('#nick_name').html(data.response.nick_name);
                    $('#role_id').val(data.response.role_id);
                    data.response.status == 1 ? $('#status').iCheck('check') : $('#status').iCheck('uncheck');

                    that.ajaxSt = 0;
                    $('select').select2();
                }
            });

        };
        this.registerEvent = function() {
            $('#company').on('change', function(event) {
                jh.utils.ajax.send({
                    method: 'GET',
                    url: '/admin/office/list',
                    data: {
                        id: $('#company').val()
                    },
                    done: function(data, status, xhr) {
                        let htmls = '<option value="">---</option>';
                        $.each(data.response.list, function(index, val) {
                            htmls += '<option value="' + val.id + '">' + val.office + '</option>';
                        });
                        $('#office').html(htmls);
                    }
                });
            });
            jh.utils.validator.init({
                id: 'addAccount',
                submitHandler: function() {
                    jh.utils.alert({
                        content: '确定提交？',
                        ok: function() {
                            var datas = jh.utils.formToJson($('#addAccount'));
                            datas.status = datas.status == 'on' ? 1 : 2;
                            datas.passwd = datas.passwd == undefined ? '' : datas.passwd;

                            var jsencrypt = new JSEncrypt();
                            jsencrypt.setPublicKey(jh.arguments.public_key);
                            datas.passwd = jsencrypt.encrypt(datas.passwd);

                            $.extend(that.userData, datas);
                            jh.utils.ajax.send({
                                method: 'post',
                                url: '/admin/user/update',
                                data: that.userData,
                                done: function(data, status, xhr) {
                                    jh.utils.load('/src/modules/platform/accountSetList.html');
                                }
                            });
                        },
                        cancel: function() {}
                    });
                }
            });
        };
    }
    module.exports = EditAccount;
});
