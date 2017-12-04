/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function XXDistributionList() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#admin-xXDistributionList-container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/distributeList',
                contentType: 'application/json',
                data: {},
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('admin-xXDistributionList-template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            //查看任务详情
            $('.dataShow').off('click', '.detail').on('click', '.detail', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.load('/src/modules/xinxiyuan/xx-distribution/xx-distribution-detail', {
                    id: id
                });
            });

            //批量分配
            $('body').off('click', '#distributeTask').on('click', '#distributeTask', function() {
                var me = $(this);
                var list = $('#admin-distributionList-container').find(':checked');
                var ids = [];
                $.each(list, function(index, item) {
                    var id = $(item).data('id');
                    ids.push(id);
                });
                ids = ids.join(',');
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

            //删除任务
            $('body').off('click', '.delete').on('click', '.delete', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '确定删除任务吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/task/delTask',
                            data: {
                                taskId: id
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '任务删除成功！',
                                    ok: function() {
                                        me.parents('tr').remove();
                                    }
                                });
                            }
                        });
                    },
                    cancel: true
                });

            });

        };
    }
    module.exports = XXDistributionList;
});