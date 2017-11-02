'use strict';
define(function(require, exports, module) {
    function SupplierCommon() {
        var limit = 0,
            _this = this,
            fn;
        this.init = function(callback) {
            fn = callback;
            this.initOption();
            this.initUploader();
            this.initCitys();
        };
        this.applyCallback = function() {
            if (limit === 2) {
                fn();
            }
        };
        this.initOption = function() {
            // 经营类别
            jh.utils.ajax.send({
                method: 'post',
                url: '/admin/business-category/list',
                data: {
                    pageSize: 100
                },
                done: function(data) {
                    let htmls = '<option value="">---</option>';
                    $.each(data.response.list, function(index, val) {
                        htmls += '<option value="' + val.id + '">' + val.name + '</option>';
                    });
                    $('select[name=business_category]').append(htmls);
                    limit++;
                    _this.applyCallback();
                }
            });

            // 所属公司
            jh.utils.ajax.send({
                method: 'post',
                url: '/admin/company/list',
                done: function(data) {
                    let htmls = '<option value="">---</option>';
                    $.each(data.response.list, function(index, val) {
                        htmls += '<option value="' + val.id + '">' + val.company_name + '</option>';
                    });
                    $('select[name=belong_company]').append(htmls);
                    limit++;
                    _this.applyCallback();
                }
            });

            //本地定义下拉框option数据
            var optionMenu = require('simulationData/optionMenu');

            // 企业类型
            var companyType = getOptions(optionMenu.companyType);
            $('select[name=type]').append(companyType);

            // 企业规模
            var companyScale = getOptions(optionMenu.companyScale);
            $('select[name=scale]').append(companyScale);

            // 行业类型
            var industryCategory = getOptions(optionMenu.industryCategory);
            $('select[name=industry_category]').append(industryCategory);

            // 下拉框插件
            $('select').select2();

            // js写placeholder，解决ie下的兼容性问题
            var input_city = $('#inputCity');
            input_city.on('focus', function() {
                if ($(this).val() == '请输入您要搜索的地区') {
                    $(this).val('');
                }
            }).on('blur', function() {
                if ($(this).val() == '') {
                    $(this).val('请输入您要搜索的地区');
                }
            });

            function getOptions(arr) {
                let htmls = '<option value="">---</option>';
                for (var i = 0; i < arr.length; i++) {
                    htmls += '<option value="' + arr[i].id + '">' + arr[i].type + '</option>';
                }
                return htmls;
            }
        };
        this.initUploader = function() {
            // 图片上传
            var uploaderArr = [{
                id: 'certificate_pic',
                limit: 5,
                imgLimit: 'all'
            }, {
                id: 'logo_pic',
                limit: 1,
                imgLimit: 'provider_logo'
            }, {
                id: 'main_pic',
                limit: 5,
                imgLimit: 'provider_main_pic'
            }];
            for (var i = 0; i < uploaderArr.length; i++) {
                jh.utils.uploader.init({
                    pick: {
                        id: '#file_' + i
                    },
                    formData: {
                        size_type: uploaderArr[i].imgLimit
                    },
                    hiddenName: uploaderArr[i].id,
                    fileNumLimit: uploaderArr[i].limit
                });
            }
        };
        this.initCitys = function() {
            // 点击输入框显示关键字相关省市
            $('#inputCity').on('input click', function(ev) {
                var keyword = $(this).val();
                var getAreasByKey = new GetAreasByKey(keyword);
                getAreasByKey.init();
                ev.stopPropagation();
            });
            //输入框失去焦点检测值是否为空
            $('#inputCity').on('blur',function(){
                $('#service').focus();
            });
            // 点击文档隐藏关键字相关省市
            $(document).on('click', function() {
                $('#cityList').slideUp();
            });
            $('#cityList').on('click', 'li', function() {
                var area = { 'code': $(this).data('id'), 'area': $(this).html(), 'parent_id': $(this).data('parent_id') };
                var checkArea = new CheckArea(area);
                checkArea.init();
            });
            // 删除地区
            $('#service_region').on('click', '.close', function() {
                $(this).closest('li').remove();
                $('#service').focus();
                // 获取到列表中已选地区
                var selectedCitys = $('#service_region').find('li');
                var selected_str = '';
                for (var i = 0; i < selectedCitys.length; i++) {
                    selected_str += selectedCitys.eq(i).find('.area').html() + ',';
                }
                $('#service').val(selected_str);
            });
            /**
             * [GetAreasByKey description] 通过关键字拿到相关省市
             * @param {[type]} key [description] 字符串
             */
            function GetAreasByKey(key) {
                var m = this;
                m.key = key || '';
                m.areas = []; //所有的省市
                m.aboutAreas = []; //相关的省市
            }
            GetAreasByKey.prototype.init = function() {
                var m = this;
                var datas = require('simulationData/citys').RECORDS;
                for (var i = 0; i < datas.length; i++) {
                    m.areas.push({ 'code': datas[i].code, 'area': datas[i].area, 'parent_id': datas[i].parent_id });
                }
                m.getAboutAreas();
            };
            GetAreasByKey.prototype.getAboutAreas = function() {
                var m = this;
                for (var i = 0; i < m.areas.length; i++) {
                    if (m.areas[i].area.indexOf(m.key) !== -1) {
                        m.aboutAreas.push({ 'code': m.areas[i].code, 'area': m.areas[i].area, 'parent_id': m.areas[i].parent_id });
                    }
                }
                var htmls = m.renderList(m.aboutAreas);
                $('#cityList').html(htmls).slideDown();
            };
            GetAreasByKey.prototype.renderList = function(arr){
                var lis = '';
                for (var i = 0; i < arr.length; i++) {
                    lis += '<li data-id=' + arr[i].code + ' data-parent_id=' + arr[i].parent_id + '>' + arr[i].area + '</li>';
                }
                return lis;
            };


            /**
             * [CheckArea description] 选择省市
             * @param {[type]} area [description] 省或市的json，有code,parent_code和area三条信息
             */
            function CheckArea(area) {
                var m = this;
                m.area = {};
                $.extend(m.area, area);
                m.selectedBefore = []; //选择之前的地区，每一项为json，有code,parent_code和area三条信息
                m.selectedBeforeCode = []; //选择之前的地区，每一项是地区的code值
                m.selectedAfter = []; //选择之后的地区
                m.provs = []; //所有的省
            }
            CheckArea.prototype.init = function() { // 获取到已选地区
                var m = this;
                m.getAllProvs();
                var selected_areas = $('#service_region').find('li');
                for (var i = 0; i < selected_areas.length; i++) {
                    // 后台提供数据
                    // m.selectedBefore.push({ 'code': selected_areas.eq(i).data('id'), 'area': selected_areas.eq(i).find('.area').html(), 'parent_id': selected_areas.eq(i).data('parent_id') });
                    // 后台不提供数据
                    m.selectedBefore.push({ 'code': selected_areas.eq(i).data('id'), 'area': selected_areas.eq(i).find('.area').html(), 'parent_id': Number(parseInt(selected_areas.eq(i).data('id') / 10000) + '0000') });
                    m.selectedBeforeCode.push(selected_areas.eq(i).data('id'));
                }
                $('#service').focus();
                if (m.area.parent_id === 1) { //选中省
                    m.checkProv();
                } else { //选中市
                    m.checkCity();
                }
            };
            CheckArea.prototype.getAllProvs = function() {
                var m = this;
                var datas = require('simulationData/citys').RECORDS;
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i].parent_id === 1) {
                        m.provs.push({ 'code': datas[i].code, 'area': datas[i].area, 'parent_id': datas[i].parent_id });
                    }
                }
            };
            CheckArea.prototype.checkProv = function() {
                var m = this;
                var findProv = m.findValue(m.area.code, m.selectedBeforeCode);
                if (findProv !== -1) { //已选中了该省
                    jh.utils.alert({ content: '您已选中该省份' });
                    m.selectedAfter = m.selectedBefore;
                    m.renderHtml();
                } else { //没有选中该省
                    jh.utils.ajax.send({
                        method: 'get',
                        url: '/admin/service-region/get-city-by-province',
                        data: {
                            code: m.area.code,
                        },
                        done: function(data) {
                            var citys = data.response.list;
                            m.selectedAfter = m.cutRepect(m.selectedBefore, citys);
                            m.selectedAfter.push(m.area);
                            m.renderHtml();
                        }
                    });
                }
            };
            CheckArea.prototype.checkCity = function() {
                var m = this;
                var findCity = m.findValue(m.area.code, m.selectedBeforeCode);
                if (findCity !== -1) { //已选中了该市
                    jh.utils.alert({ content: '您已选中该城市' });
                    m.selectedAfter = m.selectedBefore;
                    m.renderHtml();
                } else { //没有选中该市
                    var findProv = m.findValue(m.area.parent_id, m.selectedBeforeCode);
                    if (findProv !== -1) { //已选中该市对应的省
                        m.selectedAfter = m.selectedBefore;
                        m.selectedAfter.splice(findProv, findProv + 1);
                        m.selectedAfter.push(m.area);
                        m.renderHtml();
                    } else { //没选中该市对应的省
                        jh.utils.ajax.send({
                            method: 'get',
                            url: '/admin/service-region/get-city-by-province',
                            data: {
                                code: m.area.parent_id,
                            },
                            done: function(data) {
                                var citys = data.response.list;
                                var selectedBeforeByThis = []; //该城市对应的省份下选中的市
                                for (var i = 0; i < m.selectedBefore.length; i++) {
                                    if (m.selectedBefore[i].parent_id === m.area.parent_id) {
                                        selectedBeforeByThis.push(m.selectedBefore[i]);
                                    }
                                }
                                if (selectedBeforeByThis.length === citys.length - 1) { //该市对应的省下全部的市全被选中
                                    m.selectedAfter = m.cutRepect(m.selectedBefore, citys);
                                    for (var i = 0; i < m.provs.length; i++) {
                                        if (m.provs[i].code === m.area.parent_id) {
                                            m.selectedAfter.push(m.provs[i]);
                                        }
                                    }
                                    m.renderHtml();
                                } else { //该市对应的省下全部的市未全被选中
                                    m.selectedAfter = m.selectedBefore;
                                    m.selectedAfter.push(m.area);
                                    m.renderHtml();
                                }
                            }
                        });
                    }
                }
            };
            CheckArea.prototype.cutRepect = function(objArr, filArr) { //数组去重，数组中的每一项为区域，objArr：目标数组，filArr：筛选数组
                var temp_arr = []; //临时数组
                var target_arr = []; //目标数组
                for (var i = 0; i < filArr.length; i++) {
                    temp_arr[filArr[i].code] = true;
                }
                for (var i = 0; i < objArr.length; i++) {
                    if (!temp_arr[objArr[i].code]) {
                        target_arr.push(objArr[i]);
                    }
                }
                return target_arr;
            };
            CheckArea.prototype.findValue = function(val, arr) { //数组查值，有返回位置（从0开始算），无返回-1
                var find = $.inArray(val, arr);
                return find;
            };
            CheckArea.prototype.renderHtml = function() {
                var m = this;
                $('#service_region').html(m.renderList(m.selectedAfter));
                $('#service').val(m.renderStr(m.selectedAfter));
            };
            CheckArea.prototype.renderList = function(arr){
                var lis = '';
                for (var i = 0; i < arr.length; i++) {
                    lis += '<li data-id="' + arr[i].code + '" data-parent_id="' + arr[i].parent_id + '"><span class="area">' + arr[i].area + '</span><span class="close">X</span></li>' ;
                }
                return lis;
            };
            CheckArea.prototype.renderStr = function(arr){
                var str = '';
                for (var i = 0; i < arr.length; i++) {
                    str += arr[i].area + ',';
                }
                return str;
            };
        };
    }
    module.exports = SupplierCommon;
});
