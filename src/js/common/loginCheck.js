/**
 * check is login
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-20 14:29:47
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CheckLogin() {
        var _this = this;

        this.init = function() {
            this.initPlugins();
            this.checkLogin();
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
        };

        this.checkLogin = function() {
            var token = $.cookie('admin-X-Token');
            if(token){
                window.location.href = jh.config.pageIndex;
            }else{
                window.location.href = jh.config.pageLogin;
            }
            // jh.utils.ajax.send({
            //     url: '/admin/user/is-login',
            //     done: function(returnData) {
            //         window.location.href = jh.config.pageIndex;
            //         $.cookie('islogin', true);
            //     },
            //     fail: function(returnData) {
            //         window.location.href = jh.config.pageLogin;
            //     }
            // });
        };
    }
    module.exports = CheckLogin;
});


