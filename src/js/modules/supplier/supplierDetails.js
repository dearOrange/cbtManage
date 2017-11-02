'use strict';
define(function(require, exports, module) {
    function SupplierDetails() {
        this.init = function() {
            this.initData();
        };

        this.initData = function() {
            var _id = jh.utils.getURLValue().args.id;
            jh.utils.ajax.send({
                url: '/admin/provider/view',
                method: 'GET',
                data: {
                    id: _id
                },
                done: function(data) {
                    var datas = data.response;
                    var html = jh.utils.template('supplier_details_template', data);
                    $('#supplierDetails').html(html);
                    // 服务区域
                    var service_region_str = datas.service_region_str;
                    var service_region_str_arr = service_region_str.split(',');
                    var service_region_lis = '';
                    for (var i = 0; i < service_region_str_arr.length; i++) {
                        service_region_lis += '<li>' + service_region_str_arr[i] + '</li>';
                    }
                    $('#service_region').html(service_region_lis);
                    // 供应商logo
                    var logo_pic_str = datas.logo_pic;
                    if (logo_pic_str) {
                        var logo_pic_html = '<li><img src=' + jh.arguments.viewImgRoot + logo_pic_str + ' /></li>';
                        $('#logo_pic').html(logo_pic_html);
                    }
                    //营业证书
                    var certificate_pic_str = datas.certificate_pic;
                    if (certificate_pic_str) {
                        var certificate_pic_arr = stringToArray(certificate_pic_str);
                        var certificate_pic_htmls = '';
                        for (var i = 0; i < certificate_pic_arr.length; i++) {
                            certificate_pic_htmls += '<li><img src=' + jh.arguments.viewImgRoot + certificate_pic_arr[i] + ' /></li>';
                        }
                        $('#certificate_pic').html(certificate_pic_htmls);
                    }
                    //宣传主页
                    var main_pic_str = datas.main_pic;
                    if (main_pic_str) {
                        var main_pic_arr = stringToArray(main_pic_str);
                        var main_pic_htmls = '';
                        for (var i = 0; i < main_pic_arr.length; i++) {
                            main_pic_htmls += '<li><img src=' + jh.arguments.viewImgRoot + main_pic_arr[i] + ' /></li>';
                        }
                        $('#main_pic').html(main_pic_htmls);
                    }
                    // 详情
                    $('#corp_introduction').append(datas.corp_introduction);
                }
            });

            // 字符串转换数组
            function stringToArray(string) {
                var arr;
                if (jh.utils.isString(string)) {
                    arr = string.split(',');
                }
                return arr;
            }
        };
    }
    module.exports = SupplierDetails;
});