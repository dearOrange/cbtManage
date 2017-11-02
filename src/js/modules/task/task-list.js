/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskList() {
        var _this = this;

        this.init = function() {
            this.initList();
            this.registerEvent();
        };



        this.initList = function(isSearch) {
            
            var page = new jh.ui.page({
                url: '/admin/city/list',
                method: 'post',
                ident: 'region',
                data: {
                    status: 1, //区域是否开通，0关闭，1开通
                },
                isSearch: isSearch,
                data_container: $('#region_list_container'),
                page_container: $('#page_container'),
                callback: function(data) {
                    var html = jh.utils.template('region_list_template', data);
                    return html;
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            var listCon = $('#region_list_container');

            listCon.on('click', '.close-region', function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.alert({
                    content: '确认关闭吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/admin/city/close',
                            method: 'post',
                            data: {
                                id: id
                            },
                            done: function(returnData) {
                                _this.initList(false);
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            listCon.on('click', '.hot-region-open', function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.alert({
                    content: '确认选为热门区域吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/admin/city/hot',
                            method: 'post',
                            data: {
                                id: id
                            },
                            done: function(returnData) {
                                _this.initList(false);
                            }
                        });
                    },
                    cancel: function() {}
                });
            });
            listCon.on('click', '.hot-region-close', function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.alert({
                    content: '确认关闭热门区域吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/admin/city/normal',
                            method: 'post',
                            data: {
                                id: id
                            },
                            done: function(returnData) {
                                _this.initList(false);
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            $('.areaNav').on('click', 'li', function() {
                var m = $(this);
                m.addClass('active').siblings().removeClass('active');
                var target = m.data('target');
                jh.utils.load('/src/modules/region/' + target);
            });
        };
    }
    module.exports = TaskList;
});