'use strict';
define(function(require, exports, module) {
    function AddAccount() {
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
                    let htmls = '<option value="">全部</option>';
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
                    let htmls = '<option value="">全部</option>';
                    $.each(data.response.list, function(index, val) {
                        htmls += '<option value="' + val.id + '">' + val.company_name + '</option>';
                    });
                    $('#company').html(htmls);
                }
            });
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
            $('select').select2();
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
                        let htmls;
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

                            var jsencrypt = new JSEncrypt();
                            jsencrypt.setPublicKey(jh.arguments.public_key);
                            datas.passwd = jsencrypt.encrypt(datas.passwd);

                            jh.utils.ajax.send({
                                method: 'post',
                                url: '/admin/user/create',
                                data: datas,
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
    module.exports = AddAccount;
});
