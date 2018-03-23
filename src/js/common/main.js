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
    _this.requestDate = 1000;
    _this.requestInterId = null;
    this.init = function() {
      this.initPlugins();
      this.initLogin();
      _this.initMenu();
      _this.registerEvent();

      var username = sessionStorage.getItem('admin-username');
      $('#usernameText').text(username);
      $('#index_logo').attr('href', ROOTURL);

      //启动未读消息和数量统计
      _this.initUnReadMessage();
      _this.requestCountNew();

      //第一次加载页面时请求未读消息
      _this.requestUnReadMessage();
    };
    this.initLogin = function() {
      jh.utils.ajax.send({
        url: '/operator/info',
        done: function(returnData) {
          var isData = returnData.data;
          if (!isData.wechat || !isData.mobile || !isData.email) {
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
      _this.requestDate *= 15;
      _this.requestInterId = window.setInterval(function() {
        //每15秒请求一次未读消息
        _this.requestUnReadMessage();

        _this.requestCountNew();

      }, _this.requestDate);
    };

    //获取未读消息
    this.requestUnReadMessage = function() {
      jh.utils.ajax.send({
        url: '/message/unread',
        done: function(returnData) {
          var result = returnData.data;
          if (result.length > 0) {
            result = result.reverse();
            for (var i = 0, num = result.length; i < num; i++) {
              var item = result[i];
              var str = jh.utils.template('newMessage_template', item);
              $('body').append(str);
            }
          }
        }
      });
    };

    this.requestCountNew = function() {
      jh.utils.ajax.send({
        url: '/message/countNew',
        done: function(returnData) {
          var list = $('.first-menu-item');
          if (returnData.data.length > 0) {
            //所有菜单循环
            $(list).each(function(index, item) {
              item = $(item);
              var curUrl = item.attr('data-url');
              $.each(returnData.data, function(i, temp) {
                var tempUrl = jh.utils.getCountNewByType(temp.type);
                console.log(curUrl, tempUrl);
                if (curUrl === tempUrl) {
                  var supNum = '<sup>' + temp.num + '</sup>';
                  item.parent().find('sup').remove().end().append(supNum);
                }
              });
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