/**
 * 登录
 * @authors jiaguishan (http://tammylights.com)
 * @date    2017-04-10 19:06:37
 * @version 1.0
 */

'use strict';
define(function(require, exports, module) {
    function Login() {
        var _this = this;
        _this.key = '';
        this.init = function() {
            this.initPlugins();
            this.registerEvent();
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            jh.utils.template = require('template'); //为自定义函数
        };

        var refreshCode = function() {
            var checkCode = $('#checkCode');
            var val = checkCode.attr('src');
            val = val.replace(/\?\w+=\d+/g, '');
            checkCode.attr('src', val + '?random=' + Math.ceil(Math.random() * 100000000));
        };

        this.registerEvent = function() {
            jh.utils.validator.init({
                id: 'form_login',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form); //表单数据
                    var flag = datas.username + '_login_passError'; //本地存储flag
                    var errnum = localStorage[flag]; //错误次数

                    // var jsencrypt = new JSEncrypt();
                    // jsencrypt.setPublicKey(jh.arguments.public_key);
                    // datas.password = jsencrypt.encrypt(datas.password);

                    // jh.utils.ajax.send({
                    //     url: '/admin/user/login',
                    //     method: 'post',
                    //     data: datas,
                    //     done: function(returnData) {
                    //         if (returnData.response.id) {
                    //             if (errnum) {
                    //                 localStorage[flag] = 0;
                    //             }
                                jh.utils.cookie.set('username', datas.username);
                                window.location.href = jh.arguments.pageIndex;
                    //         }
                    //     },
                    //     fail: function(xhr) {
                    //         refreshCode();
                    //         if (xhr.result.code === 10007) {
                    //             var num;
                    //             if (errnum) {
                    //                 num = parseInt(errnum) + 1;
                    //             } else {
                    //                 num = 1;
                    //             }
                    //             localStorage[flag] = num;
                    //             var errstr = '用户名或密码错误！';
                    //             if (num >= 3) {
                    //                 errstr = '请联系管理员,找回密码！';
                    //             }
                    //             jh.utils.alert({
                    //                 content: errstr,
                    //                 ok: function() {}
                    //             });
                    //         }
                    //     }
                    // });
                    return false;
                }
            });

            $('#checkCode').on('click', function() {
                refreshCode();
            });
        };
    }
    module.exports = Login;
});