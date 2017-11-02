/**
 * supplierClassifyList
 * @authors jiaguishan (jiaguishan@gmail.com)
 * @date    2017-05-03 17:46:51
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function SupplierClassifyList() {
        var _this = this;
        this.init = function() {
            //初始化列表数据
            this.initList();
            //注册事件
            this.registerEvent();
        };

        this.initList = function() {
            var page = new jh.ui.page({
                url: ' /admin/business-category/list',
                method: 'post',
                ident: 'category',
                data: {},
                data_container: $('#supplier_classify_list'), //内容容器
                page_container: $('#page_container'), //分页容器
                callback: function(data) {
                    var html = jh.utils.template('supplierClassifyList_list_temp', data);
                    return html;
                }
            });
            page.init();
        };

        this.addOrEditClassify = function(type, str, id) {
            var title = type === 'add' ? '新增' : '编辑';
            var pop = null;
            jh.utils.alert({
                title: title + '分类',
                content: str,
                ok: function() {
                    pop = this;
                    $('#addOrEditClassify_form').submit();
                    return false;
                },
                cancel: function() {}
            });
            jh.utils.validator.init({
                id: 'addOrEditClassify_form',
                submitHandler: function() {
                    var name = $.trim($('#classifyName').val());
                    var ajaxOpt = {
                        url: '/admin/business-category/save',
                        method: 'post',
                        data: {
                            name: name
                        },
                        done: function() {
                            //成功后的处理
                            _this.initList();
                            pop.close().remove();
                        }
                    };
                    if (type !== 'add') {
                        ajaxOpt.data.id = id;
                    }
                    jh.utils.ajax.send(ajaxOpt);
                }
            });
        };

        this.registerEvent = function() {
            var con = $('#supplier_classify_list');
            //启用分类
            con.on('click', '.enable-classify', function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.alert({
                    content: '确认启用该分类？',
                    ok: function() {
                        jh.utils.ajax.send({
                            method: 'post',
                            url: '/admin/business-category/open',
                            data: {
                                id: id
                            },
                            done: function(returnData) {
                                //成功后的处理
                                _this.initList();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            //关闭分类
            con.on('click', '.close-classify', function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.alert({
                    content: '确认关闭该分类？',
                    ok: function() {
                        jh.utils.ajax.send({
                            method: 'post',
                            url: '/admin/business-category/close',
                            data: {
                                id: id
                            },
                            done: function(returnData) {
                                //成功后的处理
                                _this.initList();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });
            //编辑、新增分类
            $('.dataContent').on('click', '.edit-classify, .add_supplier_type', function() {
                var m = $(this);
                if (m.hasClass('edit-classify')) {
                    var id = m.data('id');
                    jh.utils.ajax.send({
                        method: 'get',
                        url: '/admin/business-category/view',
                        data: {
                            id: id
                        },
                        done: function(returnData) {
                            var response = returnData.response;
                            var str = jh.utils.template('supplierClassifyList_addOrEdit_temp', {
                                id: response.id,
                                classifyName: response.name
                            });
                            _this.addOrEditClassify('edit', str, response.id);
                        }
                    });
                } else {
                    var str = jh.utils.template('supplierClassifyList_addOrEdit_temp', {});
                    _this.addOrEditClassify('add', str);
                }
            });
        };
    }

    module.exports = SupplierClassifyList;
});