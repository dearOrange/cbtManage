/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function CustomerManage() {
    var _this = this;
    _this.id = 0;
    _this.form = $('#customer-manage-form');
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };

    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#customer-manage-container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/task/taskList',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          return jh.utils.template('customer-manage-template', data);
        }
      });
      page.init();
    };
    
    this.initSheriff = function(taskIds) {
      jh.utils.ajax.send({
        url: '/operator/getAllChannel',
        done: function(returnData) {
          var str = _this.distributionSheriff(returnData.data);
          jh.utils.alert({
            content: str,
            ok: function() {
              var tab = $('.qd-distribution-tab li.active').index(),
                taskObj = {};
              if (!tab) {
                var radio = $('#qd-distribution-tab0').find(':checked');
                if (radio.length === 0) {
                  jh.utils.alert({
                    content: '请选择渠道经理！',
                    ok: true,
                    cancel: false
                  });
                  return false;
                }
                taskObj.type = 1;
                taskObj.channelManagerId = radio.val();
                taskObj.channelManagerName = radio.data('name');
              } else {
                taskObj.type = 2;
              }
              taskObj.taskIds = taskIds;
              _this.distribution(taskObj);
            },
            cancel: true
          });
        }
      });
    };

    this.distributionSheriff = function(arr) {
      var source = jh.utils.getChannelHtml();
      var render = jh.utils.template.compile(source);
      var str = render({ list: arr });
      return str;
    };

    this.distribution = function(taskObj) {
      jh.utils.ajax.send({
        url: '/task/distributeTask',
        data: taskObj,
        done: function(returnData) {
          jh.utils.alert({
            content: '任务分配成功！',
            ok: function() {
              _this.initContent();
            },
            cancel: false
          });
        }
      });
    };

    this.registerEvent = function() {
//    运营经理
      jh.utils.ajax.send({
        url: '/operator/getAllBusiness',
        done: function(returnData) {
          var operateData = returnData.data;
          var operateStr = "";
          for (var i = 0; i < operateData.length; i++) {
              operateStr += '<option value="' + operateData[i].id + '">' + operateData[i].name + '</option>';
          }
          $('#operateManage').append(operateStr);
          jh.utils.assignSelect('operateManage');
        }
      });
      // 搜索
      jh.utils.validator.init({
        id: 'customer-manage-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });
      //查看任务详情
      $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
        var me = $(this);
        var id = me.data('id');
        jh.utils.load('/src/modules/customerManage/customer-manage-detail', {
          id: id
        });
      });

      //批量分配
      $('body').off('click', '#taskDistribution').on('click', '#taskDistribution', function() {
        var me = $(this);
        var taskIds = jh.utils.getCheckboxValue('customer-manage-container');
        if (!taskIds) {
          jh.utils.alert({
            content: '请选择任务！',
            ok: true,
            cancel: false
          });
          return false;
        }
        _this.initSheriff(taskIds);
      });

//    任务审核
      $('#taskCheckout').click(function(){
        var taskIds = jh.utils.getCheckboxValue('customer-manage-container', "value");
        if (!taskIds) {
          jh.utils.alert({
            content: "请先选中要审核的信息",
            ok: true
          })
          return false;
        }
        var checkout = jh.utils.template('task_checkout-template',{});
        jh.utils.alert({
          title: '任务审核',
          content: checkout,
          ok:function(){
            var throughState = $('.through').filter(':checked').val();
            if(!throughState){
              jh.utils.alert({
                content: '请先选择条件',
                ok: true
              })
              return false;
            };
            jh.utils.ajax.send({
              url: '/task/verify',
              data: {
                  taskIds: taskIds,
                  validState: throughState,
                  reason: $('.textReason').val()
              },
              done: function(returnData) {
                jh.utils.alert({
                  content: '操作成功！',
                  ok: function() {
                    _this.initContent();
                  },
                  cancel: false
                });
              }
            });
          },
          cancel:true
        })
      })
      
    };

  }
  module.exports = CustomerManage;
});