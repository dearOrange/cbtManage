/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function InformantAward() {
    var _this = this;
    _this.form = $('#informant-award-form');
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };

    this.initContent = function(isSearch) {
      var dataForm = jh.utils.formToJson(_this.form);
      dataForm.tabType = '1';
      var page = new jh.ui.page({
        data_container: $('#informant_award_container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/activity/list',
        contentType: 'application/json',
        data: dataForm,
        isSearch: isSearch,
        callback: function(data) {
          data.showBounty = function(jsons){
            jsons = JSON.parse(jsons);
            var str = '';
            if(jsons.length>0){
              for(var i =0,num =jsons.length;i<num;i++){
                var item = jsons[i];
                str += '<p><span>'+item.name+'</span>:'+item.min+'-'+item.max+'</p>';
              }
            }
            return str;
          };
          return jh.utils.template('informant-award-template', data);
        }
      });
      page.init();
    };

    this.registerEvent = function() {
      //新增档位
      $('body').off('click', '.add_dangwei').on('click', '.add_dangwei', function() {
        var m = $(this);
        var con = $('#dangweiList');
        if (con.children('tr').length >= 5) {
          return false;
        }
        var str = jh.utils.template('add_dangwei_template', {});
        con.append(str);
      })

      //删除档位
      $('body').off('click', '.remove_dangwei').on('click', '.remove_dangwei', function() {
        var m = $(this);
        m.closest('tr').remove();
      })

      $('select').select2({
        minimumResultsForSearch: Infinity
      });

      // 搜索
      jh.utils.validator.init({
        id: 'informant-award-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });

      //新建活动
      $('body').off('click', '#increate-award').on('click', '#increate-award', function() {
        var newAward = jh.utils.template('new-increate-award-template', {});
        jh.utils.alert({
          title: '新建线人奖励活动',
          content: newAward,
          ok: function() {
            $('#new-increate-award-form').submit();
            return false;
          },
          okValue: '新建',
          cancel: true
        })
        jh.utils.validator.init({
          id: 'new-increate-award-form',
          submitHandler: function(form) {
            var datas = jh.utils.formToJson(form);
            datas.type = 1;
            if (datas.kind === "1") {
              datas.bounty = [];
              if (jh.utils.isArray(datas.name)) {
                for (var i = 0, num = datas.name.length; i < num; i++) {
                  datas.bounty.push({
                    name: datas.name[i],
                    min: datas.min[i],
                    max: datas.max[i]
                  })
                }
              } else {
                datas.bounty.push({
                  name: datas.name,
                  min: datas.min,
                  max: datas.max
                })
              }
              datas.bounty = JSON.stringify(datas.bounty);
            }
            
            jh.utils.ajax.send({
              url: '/activity/create',
              data: datas,
              method: 'post',
              done: function(returnData) {
                jh.utils.alert({
                  content: '新增活动成功',
                  ok: function() {
                    jh.utils.closeArt();
                    _this.initContent();
                  }
                })
              }
            });
            return false;
          }
        });
      })

      //停止活动
      $('body').off('click', '.stopAward').on('click', '.stopAward', function() {
        var awardsId = $(this).data('id');
        var stopAward = jh.utils.template('stop-award-template', {});
        jh.utils.alert({
          title: '停止活动',
          content: stopAward,
          ok: function() {
            jh.utils.ajax.send({
              method: 'get',
              url: '/activity/close',
              data: {
                activityId: awardsId
              },
              done: function(returnData) {
                jh.utils.alert({
                  content: '活动已停止',
                  ok: function() {
                    _this.initContent();
                  }
                })
              }

            });
          },
          cancel: true
        })
      })
    };
  }
  module.exports = InformantAward;
});