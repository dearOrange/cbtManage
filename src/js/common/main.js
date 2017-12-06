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
            _this.initMenu();
            _this.registerEvent();

            /*加载时默认触发一次变化事件进行事件加载*/
            $(window).trigger('hashchange');
            var moduleInfo = jh.utils.getURLValue();
            jh.utils.defaultPage(moduleInfo.module);

            var username = sessionStorage.getItem('admin-username');
            $('#usernameText').text(username);
            $('#index_logo').attr('href', ROOTURL);
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            jh.utils.template = require('template'); //为自定义函数
        };

        this.initMenu = function(res) {
            var menuData = require('menuJson/leftMenu');
            var menuHtml = jh.utils.template('main_leftMenu_template', menuData);
            $('#leftMenu-box').html(menuHtml);

            var h = $(window).height();
            $("#leftMenu-box").mCustomScrollbar({
                setHeight: h - 60,
                theme: "light"
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