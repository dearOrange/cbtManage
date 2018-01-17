/**
 * OpenDetail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function QDTailerDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function(isSearch) {
            jh.utils.ajax.send({
                url: '/task/channel/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    var html = jh.utils.template('admin-qdTrailerDetail-template', returnData);
                    $('#admin-qdTrailerDetail-container').html(html);
                    _this.initSheriff();
                }
            });
        };

        this.distributionSheriff = function(arr) {
            var source = jh.utils.getSheriffHtml('radio');
            var render = jh.utils.template.compile(source);
            var menuState = function(state) {
                switch (state) {
                    case "all":
                        state = "可找车可拖车";
                        break;
                    case "trace":
                        state = "只找车";
                        break;
                    case "recycle":
                        state = "只拖车";
                        break;
                    case "tracerecycle":
                        state = "找车+拖车一体";
                        break;
                }
                return state;
            }
            var str = render({ list: arr, stateToString: menuState });
            return str;
        };

        this.initSheriff = function() {
            jh.utils.ajax.send({
                url: '/task/downstreamByTrailerChannel',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data.alldownstream);
                    $('#fpSheriffList').html(str);
                }
            });
        };
        $('body').off('click', '.sureAudit').on('click', '.sureAudit', function() {
            var ids = jh.utils.getCheckboxValue('distribution_public_form', 'value');
            var opt = {
                url: '/task/towingAllot',
                method: 'post',
                data: {
                    taskidList: args.id,
                    downstreamId: ids
                },
                done: function(returnData) {
                    jh.utils.alert({
                        content: '任务分配成功！',
                        ok: true,
                        cancel: false
                    });
                }
            };
            jh.utils.ajax.send(opt);
        });

    }
    module.exports = QDTailerDetail;
});