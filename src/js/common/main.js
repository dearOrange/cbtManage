/**
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-18 11:39:52
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function Main() {
        var _this = this;
        this.init = function() {
            this.initPlugins();

            $('#index_logo').attr( 'href', ROOTURL );

            this.checkLogin();
        };
        this.checkLogin = function() {
            // jh.utils.ajax.send({
            //     url: '/admin/user/is-login',
            //     done: function() {
            //         jh.utils.ajax.send({
            //             url: '/admin/user/get-auth',
            //             done: function(returnData) {
            //                 var res = returnData.response;
            //                 $('body').data('flag', res);
            
                            //需要获取token存储在cookie X-Token
                            _this.initMenu();
                            _this.registerEvent();
                            require('plugin/datePicker/WdatePicker');
                            /*加载时默认触发一次变化事件进行事件加载*/
                            $(window).trigger('hashchange');
                            var moduleInfo = jh.utils.getURLValue();

                            jh.utils.defaultPage(moduleInfo.module);
                            var username = $.cookie('admin-username');
                            $('#usernameText').text(username);
            //             }
            //         });
            //     },
            //     fail: function() {
            //         $.cookie('username',null);
            //         window.location.href = jh.config.pageLogin;
            //     }
            // });
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            jh.utils.template = require('template'); //为自定义函数
        };

        this.initMenu = function(res) {
            var menuData = require('menuJson/leftMenu');
            var menuHtml = jh.utils.template('main_leftMenu_template', menuData);
            $('#leftMenu-box').html(menuHtml);

            var firstMenu = $('#leftMenu-box').children('li');
            var secondMenu = firstMenu.children('ul').children('li');
            var username = $.cookie('admin-username');
        };

        this.registerEvent = function() {
            var InitRegisterEvent = require('common/initRegisterEvent');
            var register = new InitRegisterEvent();
            register.init();
        };
    }
    module.exports = Main;
});