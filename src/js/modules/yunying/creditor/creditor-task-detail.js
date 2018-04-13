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
              }
          });
        };
    }
    module.exports = CreditorTask;
});