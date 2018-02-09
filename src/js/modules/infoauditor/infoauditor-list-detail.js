/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InfoauditorListDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.officerState = jh.utils.officerState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('infoauditor_detail_template', returnData);
                    $('.taskListContent').html(html);
                    _this.searchIllegalInfo();
					_this.initYjList();

                }
            });
        };
        //查询违章信息列表
        this.searchIllegalInfo = function(obj) {
            var page = new jh.ui.page({
                data_container: $('#infoauditor_detail_wzInfoList'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/clue/illegalList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('infoauditor_detailFinished_wzInfoTemplate', data);
                },
                onload: function() {
                    if (obj) {
                        window.setTimeout(function() {
                            $('#taskList-illegalList').removeClass('disabled');
                            $('#taskList-illegalList').siblings().remove();
                        }, 1000);
                    }
                }
            });
            page.init();
        };
        
        
        this.initYjList = function() {
            var page = new jh.ui.page({
                data_container: $('#infoauditor_detailFinished_yjxjContent'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/record/bargainList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('infoauditor_detailFinished_yjxjTemplate', data);
                }
            });
            page.init();
        };

        
    }
    module.exports = InfoauditorListDetail;
});