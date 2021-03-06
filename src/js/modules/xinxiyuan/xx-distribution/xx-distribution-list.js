/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function XXDistributionList() {
    var _this = this;
    _this.id = 0;
    _this.form = $('#distribution-list-form');
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };

    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#admin-xXDistributionList-container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/task/distributeList',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          return jh.utils.template('admin-xXDistributionList-template', data);
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
      // 搜索
      jh.utils.validator.init({
        id: 'distribution-list-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });
      //查看任务详情
      $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
        var me = $(this);
        var id = me.data('id');
        jh.utils.load('/src/modules/xinxiyuan/xx-distribution/xx-distribution-detail', {
          id: id
        });
      });

      //批量分配
      $('body').off('click', '#distributeTask').on('click', '#distributeTask', function() {
        var me = $(this);
        var taskIds = jh.utils.getCheckboxValue('admin-xXDistributionList-container');
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

      //分配
      $('body').off('click', '.distribution').on('click', '.distribution', function() {
        var me = $(this);
        var taskIds = me.data('id');
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

      //一键修复
      $('body').off('click', '#allrepair').on('click', '#allrepair', function() {
        var checkId = jh.utils.getCheckboxValue('admin-xXDistributionList-container', "value");
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
  module.exports = XXDistributionList;
});