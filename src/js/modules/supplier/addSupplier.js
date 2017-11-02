'use strict';
define(function(require, exports, module) {
    function AddSupplier() {
        var that = this;
        var ue = 1;
        this.init = function() {
            this.initCommon();
            this.registerEvent();
        };
        this.initCommon = function() {
            var SupplierCommon = require('modules/supplier/supplierCommon');
            var supplierCommon = new SupplierCommon();
            supplierCommon.init(this.initUe);
        };
        this.initUe = function() {
            ue = jh.utils.ueditor('corp_introduction');
        };
        this.registerEvent = function() {
            //表单提交
            jh.utils.validator.init({
                id: 'addSupplier',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    // 服务区域
                    var service_region = $('#service_region').find('li');
                    var service_region_arr = [];
                    for (var i = 0; i < service_region.length; i++) {
                        service_region_arr.push(service_region.eq(i).data('id'));
                    }
                    datas.service_region = service_region_arr;
                    // 营业证书
                    var certificate_pic_arr = [];
                    for (var i = 0; i < $('input[name=certificate_pic]').length; i++) {
                        certificate_pic_arr.push($('input[name=certificate_pic]').eq(i).val());
                    }
                    datas.certificate_pic = certificate_pic_arr;
                    // 宣传主页
                    var main_pic_arr = [];
                    for (var i = 0; i < $('input[name=main_pic]').length; i++) {
                        main_pic_arr.push($('input[name=main_pic]').eq(i).val());
                    }
                    datas.main_pic = main_pic_arr;
                    // 详情
                    datas.corp_introduction_word = ue.getContentTxt();
                    // 表单提交
                    jh.utils.alert({
                        content: '确认新增该供应商？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/provider/save',
                                method: 'POST',
                                data: datas,
                                done: function(returnData) {
                                    jh.utils.load('/src/modules/supplier/supplierList.html');
                                },
                                fail: function() {}
                            });
                        },
                        cancel: function() {}
                    });
                    return false;
                }
            });

            function convertArr(string) {
                var arr;
                if (jh.utils.isString(string)) {
                    arr = string.split(',');
                }
                return arr;
            }
        };
    }
    module.exports = AddSupplier;
});