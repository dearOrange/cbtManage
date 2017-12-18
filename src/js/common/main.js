/**
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-04-18 11:39:52
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function Main() {
        var _this = this;
        _this.roleType = sessionStorage.getItem('admin-roleType');
        _this.requestDate = 60 * 1000;
        _this.requestInterId = null;
        this.init = function() {
            this.initPlugins();
            _this.initMenu();
            _this.registerEvent();

            var username = sessionStorage.getItem('admin-username');
            $('#usernameText').text(username);
            $('#index_logo').attr('href', ROOTURL);

            _this.initUnReadMessage();
debugger
            $.ajax({
                url: ROOTURL + '/src/templates/channel-distribution.tpl'
            }).
            done(function(data){
                console.log(data);
            });
        };

        this.initPlugins = function() {
            window.jh = require('common'); //自定义对象
            jh.utils.template = require('template'); //为自定义函数
        };

        this.initMenu = function(res) {
            jh.utils.ajax.send({
                url: '/operator/getUserPermission',
                done: function(returnData) {
                    var menuHtml = jh.utils.template('main_leftMenu_template', { list: returnData.data });
                    $('#leftMenu-box').html(menuHtml);

                    var h = $(window).height();
                    $("#leftMenu-box").mCustomScrollbar({
                        setHeight: h - 140,
                        theme: "light"
                    });

                    /*加载时默认触发一次变化事件进行事件加载*/
                    $(window).trigger('hashchange');
                    var moduleInfo = jh.utils.getURLValue();
                    jh.utils.defaultPage(moduleInfo.module);
                }
            });
        };

        this.initUnReadMessage = function() {
            if (_this.roleType === "finance") {
                _this.requestDate *= 30;
            }
            if (_this.roleType === 'information' || _this.roleType === 'finance') {
                _this.requestInterId = window.setInterval(function() {
                    _this.requestUnReadMessage();
                }, _this.requestDate);
            }
        };

        this.requestUnReadMessage = function() {
            jh.utils.ajax.send({
                url: '/message/unread',
                done: function(returnData) {
                    var result = returnData.data;
                    if (result.length > 0) {
                        var str = jh.utils.template('newMessage_template', { message: result[0].content });
                        $('body').append(str);
                    }
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