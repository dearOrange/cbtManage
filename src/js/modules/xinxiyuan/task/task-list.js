/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function TaskList() {
    var _this = this;
    _this.form = $('#task-list-form');

    this.init = function() {
      this.initContent();
      this.initTaskTotalCount();
      this.registerEvent();
    };
    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#taskTableCon'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/task/taskList',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          data.passState = $('#state').val();
          return jh.utils.template('taskList_content_template', data);
//        $('#taskTableCon').html(tableStr);
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
    this.registerEvent = function() {
      // 搜索
      jh.utils.validator.init({
        id: 'task-list-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });

      $('select').select2({
        minimumResultsForSearch: Infinity
      });

      $('.public_price').blur(function() {
        var minprice = $('#minprice').val();
        var maxprice = $('#maxprice').val();
        if (maxprice && minprice) {
          if (minprice > maxprice) {
            jh.utils.alert({
              content: '最小值不能比最大值大！！！',
              ok: function() {
                maxprice;
              }
            })
          }
        }
      })

      //查看任务详情
      $('.dataShow').off('click', '.taskList-detail').on('click', '.taskList-detail', function() {
        var id = $(this).data('id');
        var state = $('#state').val();
        if (state === '1' || state === '6') {
          jh.utils.load("/src/modules/xinxiyuan/task/task-list-detail", {
            id: id
          });
        } else if (state === '2') {
          jh.utils.load("/src/modules/xinxiyuan/task/task-list-detailTrcaing", {
            id: id
          });
        } else if (state === '3' || state === '4') {
          jh.utils.load("/src/modules/xinxiyuan/task/task-list-detailFinished", {
            id: id
          });
        } else if (state === '7') {
          jh.utils.load("/src/modules/xinxiyuan/task/task-list-detailNewTask", {
            id: id
          });
        }
      });

      //任务状态tab切换
      $('body').off('click', '#taskState>li').on('click', '#taskState>li', function(event, param) {
        //当前元素、任务状态state、批量匹配容器
        //表头：时间、匹配模板名称、匹配表单容器
        var m = $(this),
          state = m.data('state'),
          stateValue = m.data('value'),
          batchOperater = $('#batchOperater'),
          batchDistribute = $('#batchDistribute'),
          closeTaskDistribute = $('#closeTaskDistribute');
        var textCon = $('.textCon'),
          matchTemplateName = '',
          matchForm = $('#match-container');
        m.addClass('active').siblings().removeClass('active'); //tab状态切换
        /**
         * 根据不同的任务状态state显示不同匹配表单
         */
        if (state === 'matched') {
          batchOperater.addClass('hide');
          textCon.text('匹配成功时间');
          matchTemplateName = 'matchSuccess-template';
        } else if (state === 'newTask') {
          batchOperater.addClass('hide');
          matchTemplateName = 'unAudit-template';
        } else {
          batchOperater.removeClass('hide');
          textCon.text('任务发布时间');
          matchTemplateName = 'otherMatch-template';
        }
        if (stateValue === 1) {
          batchDistribute.removeClass('hide');
        }else {
          batchDistribute.addClass('hide');
        }
        if (stateValue === 1 || stateValue === 2) {
          closeTaskDistribute.removeClass('hide');
        }else {
          closeTaskDistribute.addClass('hide');
        }
        

        var locationArr = ['京','粤','皖','闽','甘','桂','贵','琼','冀','豫','黑','鄂','湘','吉','苏','赣','辽','蒙','宁','青','鲁','晋','陕','陕','沪','川','津','藏','新','云','浙','渝','港','澳','台'];

        var matchFormStr = jh.utils.template(matchTemplateName, {locationArr}); //拼接匹配表单模板
        matchForm.html(matchFormStr); //插入dom

        //任务状态数组
        var taskStateKeyArr = ['unarrange', 'tracing', 'clueChecking', 'unvaluation', 'unconfirmed', 'voucherChecking', 'voucherInvalid', 'hunterUnreceive', 'hunterReceive', 'platReceive', 'upstreamReceive', 'closed'];
        var taskStateValueArr = ['渠道经理未分配', '线索未提交', '线索审核中', '待估价', '待债权方确认', '凭证审核中', '凭证审核未通过', '捕头未接受', '捕头已接受', '平台已收车', '债权方已收车', '已失效'];


        var str = '<option value="">全部</option>';
        for (var i = 0, num = taskStateKeyArr.length; i < num; i++) {
          var key = taskStateKeyArr[i];
          var value = taskStateValueArr[i];
          str += '<option value="' + key + '">' + value + '</option>';
        }
        //任务状态
        $("#selectCheck").html(str);
        //美化select 隐藏搜索框
        $('select').select2({
          minimumResultsForSearch: Infinity
        });

        $('#state').val(m.data('value'))
        if (param && param === 'autoClick') {
          //自动触发则不进行处理
        } else {
          _this.initContent('tab'); //手动点击则进行列表查询
        }

      })

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
        var source = jh.utils.getChannelHtml(true);
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

      //一键修复
      $('body').off('click', '.allrepair').on('click', '.allrepair', function() {
        var checkId = jh.utils.getCheckboxValue('task_list_container', "value");
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
                    }
                  })
                }, 10000);
              }
            })
          },
          cancel: true
        });
      })


      //批量分配
      $('body').off('click', '.distributeTask').on('click', '.distributeTask', function() {
        var me = $(this);
        var taskIds = jh.utils.getCheckboxValue('task_list_container');
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
      
      //批量关闭
      $('body').off('click', '.closeMoreTask').on('click', '.closeMoreTask', function() {
        var me = $(this);
        var taskIds = jh.utils.getCheckboxValue('task_list_container');
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
                  },
                  cancel: false
                });
              }
            });
          },
          cancel: true
        });
      });
      
      //关闭任务
      $('body').off('click', '.closeTask').on('click', '.closeTask', function() {
        var taskId = $(this).data('id');
        jh.utils.alert({
          title: '关闭任务',
          content: '确定关闭所选的任务吗？\n关闭后任务将不可开启',
          ok: function() {
            jh.utils.ajax.send({
              url: '/task/delTask',
              data: {
                taskIds: taskId
              },
              done: function(returnData) {
                jh.utils.alert({
                  content: '任务关闭成功！',
                  ok: function() {
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

      //查看违章
      $('body').off('dblclick', '.showTr').on('dblclick', '.showTr', function() {
        var me = $(this);
        _this.id = me.data('info').id;
        jh.utils.ajax.send({
          method: 'post',
          url: '/clue/illegalList',
          contentType: 'application/json',
          data: {
            pageNum: 1,
            pageSize: 10,
            params: {
              taskId: _this.id
            }
          },
          done: function(data) {
            var strInfo = jh.utils.template('searchIllegalInfo-template', data.data);
            jh.utils.alert({
              title: me.data('info').carNumber,
              content: strInfo
            })
          }
        })

      });

    };
  }
  module.exports = TaskList;
});