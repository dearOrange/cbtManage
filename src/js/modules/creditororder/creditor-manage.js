/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorManage() {
        var _this = this;
        _this.form = $('#creditor-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#creditor_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/upstreams/infoList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('creditorManage_content_template', data);
                }
            });
            page.init();
            $('#upstreamId').select2({
                placeholder: '债权人选择',
                allowClear: true
            });
        };
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

            // 搜索
            jh.utils.validator.init({
                id: 'creditor-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
//              jh.utils.ajax.send({
//                  url: '/trace/matchedTrace',
//                  data: {
//                      taskId: id
//                  },
//                  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
//                  done: function(returnData, status, xhr) {
                        var alertStr = jh.utils.template('creditor_detail_template', { });
                        jh.utils.alert({
                            content: alertStr,
                        });
//                  }
//              });

            });
            
            //分配捕头
//          $('body').off('click', '.divied').on('click', '.divied', function() {
//              var me = $(this);
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
//                      var alertDivied = jh.utils.template('task_divied_template', { });
//                      jh.utils.alert({
//                          content: alertDivied,
//                      });
//                  }
//              });

//          });
                
        };
    }
    module.exports = CreditorManage;
});