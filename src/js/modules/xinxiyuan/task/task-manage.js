/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function TaskManage() {
    var _this = this;
    _this.id = 0;
    _this.form = $('#task-manage-form');
    _this.roleType = sessionStorage.getItem('admin-roleType');
    this.init = function() {
      this.initContent();
      this.initTaskTotalCount();
      this.registerEvent();
      if(_this.roleType !== 'info'){
        $('#taskDistribution').addClass('hide');
        $('#allrepair').addClass('hide');
      }else{
        $('#taskDistribution').removeClass('hide');
        $('#allrepair').removeClass('hide');
      }
      if(_this.roleType === 'business' || _this.roleType === 'businessmanager'){
        $('#taskCheckout').removeClass('hide');
      }else{
        $('#taskCheckout').addClass('hide');
      }
      
    };

    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#task-manage-container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/task/taskList',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          return jh.utils.template('task-manage-template', data);
        }
      });
      page.init();
    };
    
    this.initTaskTotalCount = function() {
      jh.utils.ajax.send({
        url: '/task/count',
        done: function(returnData) {
          var olBox = $('#taskState');

          for (var item in returnData.data) {
            var sup = $('<sup></sup>');
            sup.text(returnData.data[item]);
            olBox.find('[data-state="' + item + '"]').append(sup);
          }
          var sup = $('<sup></sup>');
        }
      });
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
//            if (tab) {
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
//            } else {
//              taskObj.type = 2;
//            }
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
              _this.initTaskTotalCount();
            },
            cancel: false
          });
        }
      });
    };

    this.registerEvent = function() {
      // 搜索
      jh.utils.validator.init({
        id: 'task-manage-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });
      //查看任务详情
      $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
        var me = $(this);
        var id = me.data('id'),
            car = me.data('car');
        jh.utils.load('/src/modules/xinxiyuan/task/task-manage-detail', {
          id: id,
          car: car
        });
      });

      //批量分配
      $('body').off('click', '#taskDistribution').on('click', '#taskDistribution', function() {
        var me = $(this);
        var taskIds = jh.utils.getCheckboxValue('task-manage-container');
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

      //一键修复
      $('body').off('click', '#allrepair').on('click', '#allrepair', function() {
        var checkId = jh.utils.getCheckboxValue('task-manage-container', "value");
        if (!checkId) {
          jh.utils.alert({
            content: "请先选中要修复的信息",
            ok: true
          })
          return false;
        }
        jh.utils.alert({
          content: "确定修复吗",
          ok: function() {
            jh.utils.ajax.send({
              url: '/clue/bondRepair',
              data: {
                taskIds: checkId
              },
              done: function(data) {
                (new jh.ui.shadow()).init();
                window.setTimeout(function() {
                  (new jh.ui.shadow()).close();
                  jh.utils.alert({
                    content: "信息已修复",
                    ok: function() {
                      _this.initContent();
                      _this.initTaskTotalCount();
                    }
                  })
                }, 10000);
              }
            })
          },
          cancel: true
        });
      })
      
      //批量关闭
      $('body').off('click', '#closeTaskDistribute').on('click', '#closeTaskDistribute', function() {
        var me = $(this);
        var taskIds = jh.utils.getCheckboxValue('task-manage-container');
        if (!taskIds) {
          jh.utils.alert({
            content: '请选择任务！',
            ok: true,
            cancel: false
          });
          return false;
        };
        jh.utils.alert({
          title: '关闭任务',
          content: '确定关闭所选的任务吗？关闭后任务将不可开启',
          ok: function() {
            jh.utils.ajax.send({
              url: '/task/delTask',
              data: {
                taskIds: taskIds
              },
              done: function(returnData) {
                jh.utils.alert({
                  content: '任务关闭成功！',
                  ok: function() {
                    _this.initContent();
                    _this.initTaskTotalCount();
                  },
                  cancel: false
                });
              }
            });
          },
          cancel: true
        });
      });
      
      //任务状态tab切换
      $('body').off('click', '#taskOccurAt>li.occurAtState').on('click', '#taskOccurAt>li.occurAtState', function(event, param) {
        var m = $(this);
        m.addClass('occurAtActive').siblings().removeClass('occurAtActive'); //tab状态切换
        $('#occurAt').val(m.data('value'))
        if (param && param === 'autoClick') {
          //自动触发则不进行处理
        } else {
          _this.initContent('tab'); //手动点击则进行列表查询
        }
      })
      
      $('body').off('click', '#taskCanExecute>li.occurAtState').on('click', '#taskCanExecute>li.occurAtState', function(event, param) {
        var m = $(this);
        m.addClass('occurAtActive').siblings().removeClass('occurAtActive'); //tab状态切换
        $('#canExecute').val(m.data('value'));
        if (param && param === 'autoClick') {
          //自动触发则不进行处理
        } else {
          _this.initContent('tab'); //手动点击则进行列表查询
        }
      })
      var state = [], stateStr = '';
      $('#taskState>li').each(function(index, item){
        $('.occurAtStateAll').addClass("occurAtActive").siblings().removeClass('occurAtActive');
        $(item).click(function(event, param){
          var aaa = $(this).data('value');
          if(aaa === ''){
            $(this).addClass("occurAtActive").siblings().removeClass('occurAtActive');
            state = [];
            stateStr = '';
          }else{
            $('.occurAtStateAll').removeClass('occurAtActive');
            if(state.indexOf(aaa) == -1){
              state.push(aaa);
            }
            if($(this).is(".occurAtActive")){
              $(this).removeClass("occurAtActive");
              state.remove(aaa);
            }else{
              $(this).addClass("occurAtActive");
            }
            stateStr = state.join(',');
          }
          if(state.length == 0){
            $('.occurAtStateAll').addClass("occurAtActive").siblings().removeClass('occurAtActive');
          }
          $('#state').val(stateStr);
          if (param && param === 'autoClick') {
            //自动触发则不进行处理
          } else {
            _this.initContent('tab'); //手动点击则进行列表查询
          }
        })
      })
      
//    任务审核
      $('#taskCheckout').click(function(){
        var taskIds = jh.utils.getCheckboxValue('task-manage-container', "value");
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
                    _this.initTaskTotalCount();
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

    //查询违章信息列表
    this.searchIllegalInfo = function() {
      var page = new jh.ui.page({
        data_container: $('#search-illegalList-container'),
        page_container: $('#page_container'),
        method: 'post',
        isSearch: true,
        url: '/clue/illegalList',
        contentType: 'application/json',
        data: {
          taskId: _this.id
        },
        callback: function(data) {
          return jh.utils.template('search-illegalList-template', data);
        }
      });
      page.init();
    };
    
  }
  module.exports = TaskManage;
});