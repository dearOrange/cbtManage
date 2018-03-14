/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InformalTaskDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initContent();
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    returnData.officerState = jh.utils.officerState;
                    returnData.getPositionByImage = jh.utils.getPositionByImage;
                    var informalStr = jh.utils.template('informal_task_detail_template', returnData);
                    $('.informalContent').html(informalStr);
                    
                    
                }
            });
        };
    }
    module.exports = InformalTaskDetail;
});