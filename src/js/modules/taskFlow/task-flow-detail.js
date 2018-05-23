/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskFlowDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initContent();
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/thirdTask/taskDetail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.officerState = jh.utils.officerState;
                    returnData.getPositionByImage = jh.utils.getPositionByImage;
                    var informalStr = jh.utils.template('task_flow_detail_template', returnData);
                    $('.flowDetailContent').html(informalStr);
                    
                    
                }
            });
        };
    }
    module.exports = TaskFlowDetail;
});