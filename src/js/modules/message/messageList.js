'use strict';
define(function(require, exports, module) {
    function MessageList() {
        var that = this;
        this.init = function() {
            this.initList();
            this.registerEvent();
        };
        this.initList = function() {
            // 分页
            var page = new jh.ui.page({
                url: '/admin/message/message-list',
                method: 'POST',
                ident: 'message',
                data_container: $('#message_item'),
                page_container: $('#page_container'),
                callback: function(data) {
                    var listHtml = jh.utils.template('message_list_template', data);
                    return listHtml;
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            //新增
            $('#addMessageBtn').on('click', function() {
                jh.utils.load('/src/modules/message/addMessage.html');
            });
            // 编辑
            $('#message_list').on('click', '.messageEditBtn', function() {
                var info = getStatusAndID($(this));
                if (info.status == 1) {
                    jh.utils.load('/src/modules/message/editMessage.html', {
                        id: info.id
                    });
                }
            });
            // 发布
            $('#message_list').on('click', '.messagePublishBtn', function() {
                var _this = this;
                var info = getStatusAndID($(this));
                if (info.status == 1) {
                    jh.utils.alert({
                        content: '确认发布该条消息？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/message/publish-message',
                                method: 'POST',
                                data: {
                                    id: info.id
                                },
                                done: function(data) {
                                    jh.utils.alert({
                                        content: '消息已发布'
                                    });
                                    that.initList();
                                },
                                fail: function() {
                                    jh.utils.alert({
                                        content: '消息发布失败，请再次发布'
                                    });
                                    $(_this).closest('tr').css('backgroundColor', '#fff3f4');
                                    $(_this).closest('.operaList').append('<li class="warn">发布失败</li>');
                                }
                            })
                        },
                        cancel: function() {}
                    });
                }
            });
            // 删除
            $('#message_list').on('click', '.messageDeleteBtn', function() {
                var info = getStatusAndID($(this));
                if (info.status == 1) {
                    jh.utils.alert({
                        content: '确认删除该条消息？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/message/delete-message',
                                method: 'POST',
                                data: {
                                    id: info.id
                                },
                                done: function(data) {
                                    that.initList();
                                }
                            })
                        },
                        cancel: function() {}
                    });
                }
            });
            // 获取状态和id
            function getStatusAndID(that) {
                var status = that.closest('tr').data('status');
                var id = that.closest('tr').data('id');
                return {
                    'status': status,
                    'id': id
                };
            }
        };
    }
    module.exports = MessageList;
});