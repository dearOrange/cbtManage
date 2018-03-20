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
        data_container: $('#task_list_container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/task/taskList',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          data.passState = $('#state').val();
          if (data.passState == '1') {
            $('.distributeTask').css('display', '');
          } else {
            $('.distributeTask').css('display', 'none');
          }
          return jh.utils.template('taskList_content_template', data);
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
        }else if(state === '7'){
          jh.utils.load("/src/modules/xinxiyuan/task/task-list-detailNewTask", {
            id: id
          });
        }
      });

      //切换状态
      $('body').off('click', '.taskState').on('click', '.taskState', function(event, param) {
        var mine = $(this);
        var state = mine.data('state');
        $(this).addClass("active").siblings().removeClass("active");
        if (state === 'matched') {
          $('.successTask').addClass('hide');
          $('.taskLocation').removeClass('hide');
          $('.textCon').html('匹配成功时间');
          $('.newTaskTd').addClass('hide').prev().removeClass('hide');
        }else if(state === 'newTask'){
          $('.successTask').addClass('hide');
          $('.newTaskTd').removeClass('hide').prev().addClass('hide').siblings('.taskLocation').addClass('hide');
        } else {
          $('.newTaskTd').addClass('hide');
          $('.successTask').removeClass('hide');
          $('.taskLocation').addClass('hide');
          $('.textCon').html('任务发布时间');
        }
        var arr = [{
          val: 'unarrange',
          name: "渠道经理未分配",
          flag: 'trcaing'
        }, {
          val: 'tracing',
          name: "线索未提交",
          flag: 'trcaing'
        }, {
          val: 'clueChecking',
          name: "线索审核中",
          flag: ''
        }, {
          val: 'unvaluation',
          name: "待估价",
          flag: 'trcaing'
        }, {
          val: 'unconfirmed',
          name: "待债权方确认",
          flag: 'trcaing'
        }, {
          val: 'voucherChecking',
          name: "凭证审核中",
          flag: 'trcaing'
        }, {
          val: 'voucherInvalid',
          name: "凭证审核未通过",
          flag: 'trcaing'
        }, {
          val: 'hunterUnreceive',
          name: "捕头未接受",
          flag: 'trcaing'
        }, {
          val: 'hunterReceive',
          name: "捕头已接受",
          flag: 'trcaing'
        }, {
          val: 'platReceive',
          name: "平台已收车",
          flag: ''
        }, {
          val: 'upstreamReceive',
          name: "债权方已收车",
          flag: ''
        }, {
          val: 'closed',
          name: "已失效",
          flag: ''
        }];

        var optionArr = [];
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (state === 'all') {
            optionArr.push(item);
            continue;
          }
          if (item.flag.indexOf(state) !== -1) {
            optionArr.push(item);
          }
        }
        var str = '<option value="">全部</option>';
        for (var j = 0; j < optionArr.length; j++) {
          var temp = optionArr[j];
          str += '<option value="' + temp.val + '">' + temp.name + '</option>';
        }
        $("#selectCheck").html(str);


        $('select').select2({
          minimumResultsForSearch: Infinity
        });
        $('#state').val(mine.data('value'))
        if (param && param === 'autoClick') {

        } else {
          _this.initContent('tab');
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