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
            this.registerEvent();
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
                }
            });
        };

        this.initAllButou = function() {
            var opt = {
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var str = '<option value="">全部</option>';
                    $.each(returnData.data, function(index, item) {
                        str += '<option value="' + item.id + '">' + item.name + '</option>';
                    });
                    $('#qd-distributionList-downstreamId').html(str);
                }
            };
            jh.utils.ajax.send(opt);
        };


        this.registerEvent = function() {
            //信息修复
            $('body').off('click','#distribution-illegalList').on('click','#distribution-illegalList',function(){
                _this.searchIllegalInfo();
            });
        };
    }
    module.exports = QDTailerDetail;
});