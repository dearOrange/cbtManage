'use strict';
define(function(require, exports, module) {
    function SupplierList() {
        var that = this;
        this.init = function() {
            this.initCommon();
            this.registerEvent();
        };
        this.initCommon = function() {
            var SupplierCommon = require('modules/supplier/supplierCommon');
            var supplierCommon = new SupplierCommon();
            supplierCommon.init(that.initList);
        };
        this.initList = function(isSearch) {
            // 分页
            var page = new jh.ui.page({
                url: '/admin/provider/list',
                method: 'POST',
                ident: 'supplier',
                data: jh.utils.formToJson('#supplier_search'),
                data_container: $('#supplier_item'),
                page_container: $('#page_container'),
                isSearch: isSearch,
                callback: function(data) {
                    var listHtml = jh.utils.template('supplier_list_template', data);
                    return listHtml;
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            //搜索
            jh.utils.validator.init({
                id: 'supplier_search',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    jh.utils.ajax.send({
                        method: 'POST',
                        url: '/admin/provider/list',
                        data: datas,
                        done: function(returnData) {
                            that.initList(true);
                        }
                    });
                    return false;
                }
            });

            // 新增
            $('#addSupplierBtn').on('click', function() {
                jh.utils.load('/src/modules/supplier/addSupplier.html');
            });

            // 编辑
            $('#supplier_list').on('click', '.editSupplierBtn', function() {
                var _id = $(this).closest('tr').data('id');
                jh.utils.load('/src/modules/supplier/editSupplier.html', {
                    id: _id
                });
            });

            // 启用禁用
            $('#supplier_list').on('click', '.forbidSupplierBtn', function() {
                var _id = $(this).closest('tr').data('id');
                var _status = $(this).data('status');
                var _this = $(this);
                if (_status == 'D') {
                    jh.utils.alert({
                        content: '确认启用该供应商？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/provider/open',
                                data: {
                                    id: _id
                                },
                                method: 'POST',
                                done: function(data) {
                                    that.initList();
                                }
                            });
                        },
                        cancel: function() {}
                    });
                } else {
                    jh.utils.alert({
                        content: '确认禁用该供应商？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/provider/close',
                                data: {
                                    id: _id
                                },
                                method: 'POST',
                                done: function(data) {
                                    that.initList();
                                }
                            });
                        },
                        cancel: function() {}
                    });
                }
            });

            // 详情
            $('#supplier_list').on('click', '.supplierDetailsBtn', function() {
                var _id = $(this).closest('tr').data('id');
                jh.utils.load('/src/modules/supplier/supplierDetails.html', {
                    id: _id
                });
            });

            // 删除
            $('#supplier_list').on('click', '.deleteSupplierBtn', function() {
                var _id = $(this).closest('tr').data('id');
                if ($(this).parents('.operaList').find('.forbidSupplierBtn').data('status') == 'D') {
                    jh.utils.alert({
                        content: '确认删除该供应商？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/provider/delete',
                                method: 'POST',
                                data: {
                                    id: _id
                                },
                                done: function(data) {
                                    that.initList();
                                }
                            });
                        },
                        cancel: function() {}
                    });
                }
            });

        };
    }
    module.exports = SupplierList;
});