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
    _this.roleType = sessionStorage.getItem('admin-roleType');
    this.init = function() {
      this.initContent();
      this.registerEvent();
      if(_this.roleType === 'businessmanager'){
        $('#taskDistribution').removeClass('hide');
      }else{
        $('#businessManager').html('');
        $('#taskDistribution').addClass('hide');
      }
    };

    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#customer-manage-container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/upstreams/customerList',
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
        url: '/operator/getAllBusiness',
        done: function(returnData) {
          var str = jh.utils.template('customer-checkout-template', returnData)
          jh.utils.alert({
            title:'债权方分配',
            content: str,
            ok: function() {
              var radio = $('#customer-distribution').find(':checked'), customerObj = {};
              if(!radio){
                jh.utils.alert({
                  content: '请选择商务经理！',
                  ok: true,
                  cancel: false
                });
                return false;
              }
              customerObj.upstreamId = taskIds;
              customerObj.businessManagerId = radio.val();
              _this.distribution(customerObj)
            },
            cancel: true
          });
        }
      });
    };

    this.distribution = function(taskObj) {
      jh.utils.ajax.send({
        url: '/upstreams/updatebusinessManager',
        data: taskObj,
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

//    债权方初筛
      $('#taskCheckout').click(function(){
        var taskIds = jh.utils.getCheckboxValue('customer-manage-container', "value");
        if (!taskIds) {
          jh.utils.alert({
            content: "请先选中要初筛的信息",
            ok: true
          })
          return false;
        }
        jh.utils.alert({
          content: '确定将选中的任务通过初筛？',
          ok: function() {
            jh.utils.ajax.send({
              url: '/upstreams/screen',
              data: {
                upstreamId: taskIds
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
          cancel: false
        })
        
      })
      
    };

  }
  module.exports = CustomerManage;
});