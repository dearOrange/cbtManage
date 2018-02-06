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
        	this.initLogin();
            _this.initMenu();
            _this.registerEvent();

            var username = sessionStorage.getItem('admin-username');
            $('#usernameText').text(username);
            $('#index_logo').attr('href', ROOTURL);

            _this.initUnReadMessage();
        };
		this.initLogin = function() {
			jh.utils.ajax.send({
                url: '/operator/info',
                done: function(returnData) {
                    var isData = returnData.data;
                    if(!isData.wechat || !isData.mobile || !isData.email) {
                    	jh.utils.load("/src/modules/person/person-center");
                    	$('#leftMenu-box').addClass('hide');
                    }
                }
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
                        setHeight: h - 60,
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
            if (_this.roleType === "channel") {
                _this.requestDate *= 5;
            }
            if (_this.roleType === 'info' || _this.roleType === 'finance' || _this.roleType === 'infoauditor' || _this.roleType === 'channel') {
                _this.requestInterId = window.setInterval(function() {
                    _this.requestUnReadMessage();
                    if(_this.roleType === 'finance'){
                        _this.requestNewMoneyNum();
                    }else if( _this.roleType === 'info' || _this.roleType === 'infoauditor' ){
                    	_this.requestNewTraceNum();
                    }
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

        this.requestNewTraceNum = function() {
            jh.utils.ajax.send({
                url: '/trace/countNew',
                done: function(returnData) {
                    var list = $('.first-menu-item');
                    if(returnData.data.num > 0){
	                    $(list).each(function(){
                        	if($(this).attr('data-url') === '/src/modules/xinxiyuan/clue/clue-manage'){
                        		var supNum = '<sup>'+returnData.data.num+'</sup>';
		                    	$(this).parent().find('sup').remove().end().append(supNum);
	                        }
	                    });
                	}
                }
            });
        };

        this.requestNewMoneyNum = function() {
            jh.utils.ajax.send({
                url: '/withdraw/countNew',
                done: function(returnData) {
                    var list = $('.first-menu-item');
                	if(returnData.data.num > 0){
                    	$(list).each(function(){
                    		if($(this).attr('data-url') === '/src/modules/sendMoney/sendMoney-list'){
                        		var supNumMoney = '<sup>'+returnData.data.num+'</sup>';
		                    	$(this).parent().find('sup').remove().end().append(supNumMoney);
	                        }
                    	});
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