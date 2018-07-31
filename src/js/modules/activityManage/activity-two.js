/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ActivityTwo() {
        var _this = this;
        _this.form = $('#activityTwo-form');
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#activity_two_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                url: '/activity/wishlist',
                method: 'post',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                contentType: 'application/json',
                callback: function(data) {
                    data.viewImgRoot = jh.config.viewImgRoot;
                    data.stateToString = function(state){
                        var str = '';
                        switch(state){
                            case 0:
                                str = '未达标';
                                break;
                            case 1:
                                str = '已达标';
                                break;
                            case 2:
                                str = '已确认';
                                break;
                            case 3:
                                str = '已发放';
                                break;
                        }
                        return str;
                    };
                    return jh.utils.template('activity-two-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
          $('select').select2({
              minimumResultsForSearch: Infinity
          });

          // 搜索
          jh.utils.validator.init({
              id: 'activityTwo-form',
              submitHandler: function(form) {
                  _this.initContent(true);
                  return false;
              }
          });
          
          //确认达标
          $('body').off('click', '.sureGive').on('click', '.sureGive', function() {
              var me = $(this);
              var id = me.data('id');
              jh.utils.alert({
                content: '确定用户活动目标已达成？',
                ok: function(){
//                jh.utils.ajax.send({
//                  url: '/goods/deleteGoods',
//                  data: {
//                    goodsIds: id
//                  },
//                  done: function() {
//                    jh.utils.alert({
//                      content: '商品成功删除！',
//                      ok: function(){
//                        _this.initContent();
//                      },
//                      cancel: false
//                    });
//                  }
//                });
                },
                cancel: true
              });
          });
          
          //发放奖励
          $('body').off('click', '.rewardWill').on('click', '.rewardWill', function() {
              var me = $(this);
              var id = me.data('id');
              var rewardStr = jh.utils.template('send_awards_Template', {});
              jh.utils.alert({
                content: rewardStr,
                ok: function(){
                  $('#send_awards_Form').submit();
                  return false;
                },
                cancel: true
              });
              jh.utils.validator.init({
                id: 'send_awards_Form',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    jh.utils.ajax.send({
                        url: '/activity/sendCoinByBigRun',
                        data: datas,
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '奖励发放成功！',
                                ok: function() {
                                    window.location.reload();
                                    jh.utils.closeArt();
                                }
                            });
                        }
                    });
                    return false;
                }
            });
          });
        };
    }
    module.exports = ActivityTwo;
});
