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
                                str = '新许愿';
                                break;
                            case 1:
                                str = '未达成';
                                break;
                            case 2:
                                str = '已达成';
                                break;
                            case 3:
                                str = '审核未通过';
                                break;
                            case 4:
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
        this.sureRewards = function(wishStr, infos){
          jh.utils.alert({
            tittle: '完成愿望',
            content: wishStr,
            ok: function(){
              $('#send_awards_two_Form').submit();
              return false;
            },
            cancel: true
          });
          jh.utils.validator.init({
              id: 'send_awards_two_Form',
              submitHandler: function(form) {
                  var datas = jh.utils.formToJson(form);
                  datas.id = infos.id;
                  jh.utils.ajax.send({
                      url: '/activity/finishWishList',
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
          
          //查看任务详情
          $('.dataShow').off('click', '.activityTwoDetail').on('click', '.activityTwoDetail', function() {
              var info = $(this).data('info');
              jh.utils.load("/src/modules/activityManage/activity-two-detail", info)
          });
          $('body').off('click', '.isThrough').on('click', '.isThrough', function() {
            var me = $(this).val();
            if(me == 1){
              $('.result_con').addClass('hide');
              $('.sure_con').removeClass('hide');
            }else{
              $('.sure_con').addClass('hide');
              $('.result_con').removeClass('hide');
            }
          });
          //审核
          $('body').off('click', '.rewardWill').on('click', '.rewardWill', function() {
              var me = $(this);
              var id = me.data('id');
              var auditStr = jh.utils.template('wish_audit_template', {});
              jh.utils.alert({
                tittle: '心愿审核',
                content: auditStr,
                ok: function(){
                  var throughState = $('.isThrough').filter(':checked').val();
                  if(!throughState){
                    jh.utils.alert({
                      content: '请先选择条件',
                      ok: true
                    })
                    return false;
                  }else{
                    if(throughState == 1 && !($('#coin_val').val())){
                      jh.utils.alert({
                        content: '请填写金额',
                        ok: true
                      })
                      return false;
                    }
                    if(throughState == 0 && !($('#identifyContent').val())){
                      jh.utils.alert({
                        content: '请填写拒绝原因',
                        ok: true
                      })
                      return false;
                    }
                  };
                  jh.utils.ajax.send({
                    url: '/activity/checkWishList',
                    data: {
                      id: id,
                      reason: $('#identifyContent').val(),
                      status: throughState,
                      netcoin: $('#coin_val').val()
                    },
                    done: function() {
                      jh.utils.alert({
                        content: '操作成功！',
                        ok: function(){
                          _this.initContent();
                        },
                        cancel: false
                      });
                    }
                  });
                },
                cancel: true
              });
          });
          
          //确认达标
          $('body').off('click', '.sureGive').on('click', '.sureGive', function() {
            var me = $(this);
            var infos = me.data('info');
            var wishStr = jh.utils.template('send_awards_two_Template', {data: infos});
            _this.sureRewards(wishStr, infos);
          });
          
        };
    }
    module.exports = ActivityTwo;
});
