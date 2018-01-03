/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function EstimatedPrice() {
        var _this = this;
        _this.form = $('#task-list-form');

        this.init = function() {
//          this.initContent();
//          this.initTaskTotalCount();
//          this.initUpstreamsList();
            this.registerEvent();
        };
//      this.initContent = function(isSearch) {
//          var page = new jh.ui.page({
//              data_container: $('#order_list_container'),
//              page_container: $('#page_container'),
//              method: 'post',
//              ident: 'news',
//              url: '/task/list',
//              data: jh.utils.formToJson(_this.form),
//              isSearch: isSearch,
//              callback: function(data) {
//                  var contentHtml = jh.utils.template('taskList_content_template', data);
//                  return contentHtml;
//              }
//          });
//          page.init();
//          $('#upstreamId').select2({
//              placeholder: '债权人选择',
//              allowClear: true
//          });
//      };
//      this.initUpstreamsList = function() {
//          jh.utils.ajax.send({
//              url: '/upstreams/list',
//              method: 'post',
//              data: {
//                  pageNum: 1,
//                  pageSize: 300,
//                  params: {
//                      companyName: '',
//                      state: 'available'
//                  }
//              },
//              done: function(returnData) {
//                  var selectBox = $('#upstreamId');
//                  var optionStr = '<option value="">请选择债权人</option>';
//                  for (var i = 0; i < returnData.data.list.length; i++) {
//                      optionStr += '<option value="' + returnData.data.list[i].id + '">' + returnData.data.list[i].companyName + '</option>';
//                  }
//                  selectBox.html(optionStr);
//                  selectBox.select2({
//                      placeholder: '选择债权人',
//                      allowClear: true
//                  });
//              }
//          });
//      };
//      this.initTaskTotalCount = function() {
//          jh.utils.ajax.send({
//              url: '/task/count',
//              done: function(returnData) {
//                  var olBox = $('#taskState');
//
//                  for (var item in returnData.data) {
//                      var sup = $('<sup></sup>');
//                      sup.text(returnData.data[item]);
//                      olBox.find('[data-value="' + item + '"]').append(sup);
//                  }
//                  var sup = $('<sup></sup>');
//                  sup.text(returnData.data.all);
//                  olBox.find('li').last().append(sup);
//              }
//          });
//      };
        this.registerEvent = function() {

//          jh.utils.uploader.init({
//              hiddenName: 'test',
//              server:'/adminServer/task/import',
//              pick: {
//                  id: '#importFile'
//              },
//              accept: {
//                  title: 'Applications',
//                  extensions: 'xls,xlsx',
//                  mimeTypes: 'application/xls,application/xlsx'
//              }
//          },{
//          	uploadAccept:function(file, response){
//          		alert(response)
//          	}
//          });
//
//          // 搜索
//          jh.utils.validator.init({
//              id: 'task-list-form',
//              submitHandler: function(form) {
//                  _this.initContent(true);
//                  return false;
//              }
//          });

            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var infos = me.data('infos');
//              jh.utils.ajax.send({
//                  url: '/trace/matchedTrace',
//                  data: {
//                      taskId: infos.id
//                  },
//                  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//                  done: function(returnData, status, xhr) {
//                      infos.informantList = returnData.data;
//                      infos.chuzhi = parseFloat(infos.carPrice*0.15).toFixed(2)
                        var alertStr = jh.utils.template('task_detail_template', { });
                        jh.utils.alert({
                            content: alertStr,
                        });
//                  }
//              });

            });
            
            //审核
            $('body').off('click', '.audit').on('click', '.audit', function() {
                var me = $(this);
//              var infos = me.data('infos');
//              jh.utils.ajax.send({
//                  url: '/trace/matchedTrace',
//                  data: {
//                      taskId: infos.id
//                  },
//                  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//                  done: function(returnData, status, xhr) {
//                      infos.informantList = returnData.data;
//                      infos.chuzhi = parseFloat(infos.carPrice*0.15).toFixed(2)
                        var alertAudit = jh.utils.template('task_audit_template', { });
                        jh.utils.alert({
                            content: alertAudit,
                        });
//                  }
//              });

            });
            
            //分配捕头
            $('body').off('click', '.person').on('click', '.person', function() {
                var me = $(this);
//              var infos = me.data('infos');
//              jh.utils.ajax.send({
//                  url: '/trace/matchedTrace',
//                  data: {
//                      taskId: infos.id
//                  },
//                  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//                  done: function(returnData, status, xhr) {
//                      infos.informantList = returnData.data;
//                      infos.chuzhi = parseFloat(infos.carPrice*0.15).toFixed(2)
                        var alertPerson = jh.utils.template('task_person_template', { });
                        jh.utils.alert({
                            content: alertPerson,
                        });
//                  }
//              });

            });
                

            //采纳情报
//          $('body').off('click', '#agreementTrace').on('click', '#agreementTrace', function() {
//              var me = $(this);
//              var id = me.data('id');
//              jh.utils.ajax.send({
//                  url: '/trace/adopt',
//                  type: 'post',
//                  data: {
//                      traceId: id
//                  },
//                  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//                  done: function(returnData) {
//                      jh.utils.alert({
//                          content: '采纳成功',
//                          ok: function() {
//                              jh.utils.alert
//                          }
//                      });
//                  }
//              });
//          });

        };
    }
    module.exports = EstimatedPrice;
});