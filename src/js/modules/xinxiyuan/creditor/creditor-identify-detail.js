/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function CreditorIdentifyDetail() {
    var _this = this;
    var args = (jh.utils.getURLValue()).args;
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };
    this.initContent = function() {

      jh.utils.ajax.send({
        url: '/upstreams/detail',
        data: {
          upstreamId: args.id
        },
        done: function(returnData) {
          returnData.menuState = jh.utils.menuState;
          returnData.viewImgRoot = jh.config.viewImgRoot;
          var creditorStr = jh.utils.template('admin_creditorDetail_template', returnData);
          $('.detail-content').html(creditorStr);
          var picArr = ['businessLicense', 'legalPersonIdImg', 'legalPersonHandIdImg', 'linkmanIdImg', 'linkmanHandIdImg'];
          for (var i = 0; i < 5; i++) {
            jh.utils.uploader.init({
              isAppend: false,
              pick: {
                id: '#' + picArr[i]
              }
            });
          }
        }
      });
    };
    this.registerEvent = function() {
      //认证
      $('body').off('click', '.identify').on('click', '.identify', function() {
        var IdentifyStr = jh.utils.template('admin_creditorIdentify_template', {});
        jh.utils.alert({
          title: '债权方认证',
          content: IdentifyStr,
          ok: function() {
            var throughState = $('.through').filter(':checked').val();
            var reason = $.trim($('#identifyContent').val());
            var btn = $('[i-id="ok"]');
            var tipText = throughState == '1' ? '认证通过'  : '认证未通过';
            $('<img src="/src/img/loading.gif" height="29"/>').insertAfter(btn);
            jh.utils.ajax.send({
              url: '/upstreams/verify',
              data: {
                validState: throughState,
                reason: reason,
                upstreamId: args.id
              },
              done: function(returnData) {
                jh.utils.alert({
                  content: tipText,
                  ok: function() {
                    window.location.reload();
                  }
                })
              },
              always: function() {
                btn.siblings('img').remove();
              }
            });
            return false;
          },
          cancel: true
        })

      });

      //认证
      $('body').off('click', '.screening').on('click', '.screening', function() {
        jh.utils.confirm({
          content: '确定通过初筛吗？',
          ok: function() {
            jh.utils.ajax.send({
              url: '/upstreams/screen',
              data: {
                reason: '通过',
                upstreamId: args.id
              },
              done: function(returnData) {
                jh.utils.alert({
                  content: '初筛成功！',
                  ok: function() {
                    window.location.reload();
                  }
                })
              }
            });
          }
        });
      })

    };
  }
  module.exports = CreditorIdentifyDetail;
});