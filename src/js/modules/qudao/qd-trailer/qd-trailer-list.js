/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function QDTrailerList() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#admin-qdTrailerList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/trailerOrder',
                contentType: 'application/json',
                data: {},
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('admin-qdTrailerList-template', data);
                }
            });
            page.init();
        };

        this.initSheriff = function(type) {
            jh.utils.ajax.send({
                url: '/task/downStreamListByChannel',
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data);

                    jh.utils.alert({
                        content: str,
                        ok: _this.distribution,
                        cancel: true
                    });
                }
            });
        };

        this.distributionSheriff = function(arr) {
            var source = jh.utils.getSheriffHtml();
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

        this.distribution = function(ids) {
            var ids = jh.utils.getCheckboxValue('distribution_public_form', 'value');
            var opt = {
                url: '/task/distributeTask',
                data: {
                    taskIds: ids
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
        };

        this.registerEvent = function() {
            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/qudao/qd-trailer/qd-trailer-detail', {
                    id: id
                });
            });

            //分配
            $('body').off('click', '.distribution').on('click', '.distribution', function() {
                var me = $(this);
                var ids = me.data('id');
                _this.initSheriff(ids);
            });

            //批量分配
            $('body').off('click', '#qd-qdTrailerList-distributeTask').on('click', '#qd-qdTrailerList-distributeTask', function() {
                var me = $(this);
                var ids = jh.utils.getCheckboxValue('admin-qdTrailerList-container');
                _this.initSheriff(ids);
            });
        };
    }
    module.exports = QDTrailerList;
});