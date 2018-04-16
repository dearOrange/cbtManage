/**
 * OpenList
 * @authors jiaguisshan
 * @date    2017-11-28 16:22:12
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorTask() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.registerEvent();
        };
        
        this.registerEvent = function() {
          jh.utils.ajax.send({
              url: '/task/business/detail',
              data: {
                  taskId: args.id
              },
              done: function(returnData) {
                returnData.menuState = jh.utils.menuState;
                returnData.viewImgRoot = jh.config.viewImgRoot;
                var str = jh.utils.template('creditor-taskDetail-template', returnData);
                $('#creditor-task-form').html(str);
                _this.searchIllegalInfo();
              }
          });
        };
        //查询违章信息列表
        this.searchIllegalInfo = function() {
          var page = new jh.ui.page({
            data_container: $('#task_detail_wzInfoList'),
            page_container: $('#page_container'),
            method: 'post',
            isSearch: true,
            url: '/clue/illegalList',
            contentType: 'application/json',
            data: {
                taskId: args.id
            },
            callback: function(data) {
                return jh.utils.template('task_detail_wzInfoTemplate', data);
            }
          });
          page.init();
        };
    }
    module.exports = CreditorTask;
});