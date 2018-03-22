/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function CreditorFilterDetail() {
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
          var creditorStr = jh.utils.template('creditor_detail_template', returnData);
          $('.filter-detail-content').html(creditorStr);
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
      
      //初筛
      $('body').off('click', '.screening').on('click', '.screening', function() {
        jh.utils.confirm({
          content: '确定通过初筛吗？',
          ok: function() {
            jh.utils.ajax.send({
              url: '/upstreams/screen',
              data: {
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
  module.exports = CreditorFilterDetail;
});