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
            this.initCode();
            this.initPlugins();
            this.registerEvent();
        };

        this.initCode = function() {
            if(window.location.host.indexOf('.cbt.com')!==-1){
                $('#checkCode').attr('src', REQUESTROOT + '/operator/getAuthCode');
            }
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
                    datas.captchaCode = $.cookie('captchaCode'); //验证码key
                    jh.utils.ajax.send({
                        url: '/operator/login',
                        method: 'post',
                        data: datas,
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        done: function(returnData) {
                            if (returnData.code === 'SUCCESS') {
                                sessionStorage.setItem('admin-X-Token', returnData.data.token);
                                sessionStorage.setItem('admin-username', $("#username").val());
                                sessionStorage.setItem('admin-roleType', returnData.data.type);
                                window.location.href = jh.config.pageIndex;
                            }
                        },
                        fail: function(xhr) {
                            refreshCode();
                        }
                    });
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