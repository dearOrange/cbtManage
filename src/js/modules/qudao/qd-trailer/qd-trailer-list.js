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

        this.registerEvent = function() {
            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/qudao/qd-trailer/qd-trailer-detail', {
                    id: id
                });
            });

            //批量分配
            $('body').off('click', '#qd-qdTrailerList-distributeTask').on('click', '#qd-qdTrailerList-distributeTask', function() {
                var me = $(this);
                var ids = jh.utils.getCheckboxValue('admin-qdTrailerList-container');
                
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
                return false;
                jh.utils.ajax.send(opt);
            });
        };
    }
    module.exports = QDTrailerList;
});