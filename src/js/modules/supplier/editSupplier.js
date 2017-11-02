'use strict';
define(function(require, exports, module) {
    function EditSupplier() {
        var _id = jh.utils.getURLValue().args.id;
        var that = this;
        var ue;

        function convertArr(string) {
            var arr;
            if (jh.utils.isString(string)) {
                arr = string.split(',');
            }
            return arr;
        }
        this.init = function() {
            this.initCommon();
            this.registerEvent();
        };
        this.initCommon = function() {
            var SupplierCommon = require('modules/supplier/supplierCommon');
            var supplierCommon = new SupplierCommon();
            supplierCommon.init(that.initList);
        };
        this.initUe = function() {
            ue = jh.utils.ueditor('corp_introduction');
        };
        this.initList = function() {
            jh.utils.ajax.send({
                url: '/admin/provider/view',
                method: 'GET',
                data: {
                    id: _id
                },
                done: function(data) {
                    var datas = data.response;
                    $('#provider_name').html(datas.provider_name);
                    $('#provider_code').html(datas.provider_code);
                    $('#business_category').html(datas.business_category_str);
                    $('#business_category').attr('value', datas.business_category);
                    $('#type').val(datas.type).trigger("change");
                    $('#scale').val(datas.scale).trigger("change");
                    $('#industry_category').val(datas.industry_category).trigger("change");
                    $('#contact_person').html(datas.contact_person);
                    $('#contact_tel').html(datas.contact_tel);
                    $('#contact_position').val(datas.contact_position);
                    $('#sailor').val(datas.sailor);
                    $('#sailor_tel').val(datas.sailor_tel);
                    $('#belong_company').val(datas.belong_company).trigger("change");
                    $('#corp_introduction').html(datas.corp_introduction);
                    that.initUe();
                    // 服务区域
                    var service_region = datas.service_region;
                    var service_region_str = datas.service_region_str;
                    var service_region_code_arr = service_region.split(',');
                    var service_region_area_arr = service_region_str.split(',');
                    var service_region_arr = [];
                    for (var i = 0; i < service_region_code_arr.length; i++) {
                        service_region_arr.push({
                            code: service_region_code_arr[i],
                            area: service_region_area_arr[i]
                        })
                    }
                    var service_region_lis = '';
                    var service_region_text = '';
                    for (var i = 0; i < service_region_arr.length; i++) {
                        service_region_lis += '<li data-id="' + service_region_arr[i].code + '"><span class="area">' + service_region_arr[i].area + '</span><span class="close">X</span></li>';
                        service_region_text += service_region_arr[i].area + ',';
                    }
                    $('#service_region').html(service_region_lis);
                    $('#service').val(service_region_text);
                    // 供应商logo
                    var logo_pic_str = datas.logo_pic;
                    if (logo_pic_str) {
                        var logo_pic_html = '<div class="upfile-item"><img data-id=' + logo_pic_str + ' src=' + jh.arguments.viewImgRoot + logo_pic_str + '><span class="delete-img" data-domid="file_0" data-fileid="WU_FILE_0"></span><input type="hidden" name="logo_pic" value=' + logo_pic_str + '></div>';
                        $('#logo').find('.upload-list').html(logo_pic_html);
                    }
                    //营业证书
                    var certificate_pic_str = datas.certificate_pic;
                    if (certificate_pic_str) {
                        var certificate_pic_arr = convertArr(certificate_pic_str);
                        var certificate_pic_htmls = '';
                        for (var i = 0; i < certificate_pic_arr.length; i++) {
                            certificate_pic_htmls += '<div class="upfile-item"><img data-id=' + certificate_pic_arr[i] + ' src=' + jh.arguments.viewImgRoot + certificate_pic_arr[i] + '><span class="delete-img" data-domid="file_0" data-fileid="WU_FILE_0"></span><input type="hidden" name="certificate_pic" value=' + certificate_pic_arr[i] + '></div>';
                        }
                        $('#certificate').find('.upload-list').html(certificate_pic_htmls);
                    }
                    //宣传主页
                    var main_pic_str = datas.main_pic;
                    if (main_pic_str) {
                        var main_pic_arr = convertArr(main_pic_str);
                        var main_pic_htmls = '';
                        for (var i = 0; i < main_pic_arr.length; i++) {
                            main_pic_htmls += '<div class="upfile-item"><img data-id=' + main_pic_arr[i] + ' src=' + jh.arguments.viewImgRoot + main_pic_arr[i] + '><span class="delete-img" data-domid="file_0" data-fileid="WU_FILE_0"></span><input type="hidden" name="main_pic" value=' + main_pic_arr[i] + '></div>';
                        }
                        $('#main').find('.upload-list').html(main_pic_htmls);
                    }
                }
            });




        };
        this.registerEvent = function() {
            //表单提交
            jh.utils.validator.init({
                id: 'editSupplier',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    datas.id = _id;
                    datas.provider_name = $('#provider_name').html();
                    datas.provider_code = $('#provider_code').html();
                    datas.contact_person = $('#contact_person').html();
                    datas.contact_tel = $('#contact_tel').html();
                    datas.business_category = $('#business_category').attr('value');
                    datas.service_region = convertArr($('#service_region').val());
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
                    jh.utils.alert({
                        content: '确认修改该供应商？',
                        ok: function() {
                            jh.utils.ajax.send({
                                url: '/admin/provider/save',
                                method: 'POST',
                                data: datas,
                                done: function(returnData) {
                                    jh.utils.load('/src/modules/supplier/supplierList.html');
                                }
                            });
                        },
                        cancel: function() {}
                    });
                    return false;
                }
            });


        };
    }
    module.exports = EditSupplier;
});
