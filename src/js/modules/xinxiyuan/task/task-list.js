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
            this.registerEvent();
        };

        this.registerEvent = function() {
            jh.utils.newGetImageAddress('Ft769iUzXOW5itB6BfhF4tfMrImc');
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
            //              uploadAccept:function(file, response){
            //                  alert(response)
            //              }
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
                var alertStr = jh.utils.template('task_detail_template', {});
                jh.utils.alert({
                    content: alertStr
                });
                //                  }
                //              });

            });

            //分配捕头
            $('body').off('click', '.divied').on('click', '.divied', function() {
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
                var alertDivied = jh.utils.template('task_divied_template', {});
                jh.utils.alert({
                    content: alertDivied,
                });
                //                  }
                //              });

            });

            //删除任务
            $('body').off('click', '.delete').on('click', '.delete', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '确定删除任务吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/task/delTask',
                            data: {
                                taskId: id
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '任务删除成功！',
                                    ok: function() {
                                        me.parents('tr').remove();
                                    }
                                });
                            }
                        });
                    },
                    cancel: true
                });

            });

        };
    }
    module.exports = TaskList;
});