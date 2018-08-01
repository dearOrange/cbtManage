/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ActivityThree() {
        var _this = this;
        _this.form = $('#activityThree-form');
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#activity_three_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                url: '/activity/activity3list',
                method: 'post',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                contentType: 'application/json',
                callback: function(data) {
                    data.viewImgRoot = jh.config.viewImgRoot;
                    data.stateToString = function(state){
                        var str = '';
                        switch(state){
                            case 1:
                                str = '已发放';
                                break;
                            case 0:
                                str = '未发放';
                                break;
                            case 2:
                                str = '已拒绝';
                                break;
                        }
                        return str;
                    };
                    return jh.utils.template('activity-three-template', data);
                }
            });
            page.init();
        };
        this.sureRewards = function(rewardStr, infos){
          jh.utils.alert({
            content: rewardStr,
            ok: function(){
              $('#send_awards_three_Form').submit();
              return false;
            },
            cancel: true
          });
          jh.utils.validator.init({
              id: 'send_awards_three_Form',
              submitHandler: function(form) {
                  var datas = jh.utils.formToJson(form);
                  datas.id = infos.id;
                  datas.status = 1;
                  datas.netCoin = datas.netCoin === '' ? infos.getCoin : datas.netCoin;
                  jh.utils.ajax.send({
                      url: '/activity/sendActivity3',
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
              id: 'activityThree-form',
              submitHandler: function(form) {
                  _this.initContent(true);
                  return false;
              }
          });
          
          //拒绝
          $('body').off('click', '.rejectSend').on('click', '.rejectSend', function() {
              var me = $(this);
              var id = me.data('id');
              jh.utils.alert({
                content: '确定此条线索不符合规则吗？',
                ok: function(){
                  jh.utils.ajax.send({
                    url: '/activity/sendActivity3',
                    data: {
                      id: id,
                      netCoin: '',
                      status: 2
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
          
          //发放奖励
          $('body').off('click', '.rewardWillThree').on('click', '.rewardWillThree', function() {
            var me = $(this);
            var infos = me.data('info');
            var rewardStr = jh.utils.template('send_awards_three_Template', {data: infos});
            jh.utils.ajax.send({
                url: '/activity/findUnOpenBonus',
                data: {
                  id: infos.id,
                  type: '3'
                },
                done: function(returnData) {
                    if(returnData.data.number == 0){
                      _this.sureRewards(rewardStr, infos);
                    }else{
                      jh.utils.alert({
                        content: '用户存在未刮开的活动奖励红包，通知用户？',
                        ok: function(){
                          jh.utils.ajax.send({
                            url: '/activity/sendUnOpenBonusPush',
                            data: {
                              id: infos.id,
                              type: 3
                            },
                            done: function(returnData) {
                              jh.utils.alert({
                                content: '已通知用户！',
                                ok: function() {
                                  window.location.reload();
                                  jh.utils.closeArt();
                                }
                              })
                            }
                          })
                        },
                        cancel: true
                      });
                    }
                }
            });
          });
        };
    }
    module.exports = ActivityThree;
});
