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
                            var username = jh.utils.cookie.get('admin-username');
                            $('#usernameText').text(username);
            //             }
            //         });
            //     },
            //     fail: function() {
            //         jh.utils.cookie.deleteCookie('username');
            //         window.location.href = jh.arguments.pageLogin;
            //     }
            // });
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            
            jh.utils.template = require('template'); //为自定义函数
            require('plugin/icheck/icheck.min'); //复选框
            require('plugin/select2/select2.min');
            require('lib/exif/exif.js');

        };

        this.initMenu = function(res) {
            var menuData = require('menuJson/leftMenu');
            var menuHtml = jh.utils.template('main_leftMenu_template', menuData);
            $('#leftMenu-box').html(menuHtml);

            var firstMenu = $('#leftMenu-box').children('li');
            var secondMenu = firstMenu.children('ul').children('li');
            var username = jh.utils.cookie.get('admin-username');

            // $.each(secondMenu, function(index, item) {
            //     item = $(item);
            //     var menuItem = item.children('a');
            //     var flag = menuItem.data('flag');
            //     if (username !== 'admin' && !flag) {
            //         item.remove();
            //     } else if (username !== 'admin' && flag && !res[flag]) {
            //         item.remove();
            //     }
            // });
            $.each(firstMenu, function(index, item) {
                item = $(item);
                if (item.children('ul').children('li').length === 0) {
                    item.remove();
                }
            });
        };

        this.registerEvent = function() {
            var InitRegisterEvent = require('common/initRegisterEvent');
            var register = new InitRegisterEvent();
            register.init();
        };
    }
    module.exports = Main;
});