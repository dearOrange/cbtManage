/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function OfficerManage() {
        var _this = this;
        _this.form = $('#admin-officerManager-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2();
        };
        this.initContent = function(isSearch) {
        	Mock.mock(REQUESTROOT+'/downstreams/channel/list', {
                code: 'SUCCESS',
                msg: '请求成功',
                data: {
                    total: 65,
                    'list|10': [{
                        'id|+1': 1,
                        'carNumber': /[浙川沪][A-Z][a-zA-Z0-9]{5}/,
                        'carPrice|1-3.1-2':1,
                        'chuzhi|1-2.1-2':1,  
                        'carColor': /[白黑灰色*红]/,
                        'carId': Mock.Random.word(),
                        'engineId': Mock.Random.word(),
                        'carBrand': /(众泰|宝马|吉利汽车|奔驰|奥迪)/,
                        'carSeries': /(众泰SR7|奔驰S级|A4L|宝马X6)/,
                        'carModel': /(2016款 1.5T CVT魔方之门版 国IV|2010款 2.0L EX|2013款 Boxster 2.7L|2008款 S 600 L)/,
                        'companyName': Mock.Random.ctitle(6, 18),
                        'contactPhone': /1[34578]\d{9}/,
                        'createAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
                        'fingerprint': Mock.Random.county(true),
                        'ipCity': Mock.Random.county(true),
                        'lastUpdateAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
                        'location': Mock.Random.city()
                    }]
                }
            });
            var page = new jh.ui.page({
                data_container: $('#officer_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/downstreams/channel/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    var contentHtml = jh.utils.template('officerManager_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
        };
        this.registerEvent = function() {
        	
            // 搜索
            jh.utils.validator.init({
                id: 'admin-officerManager-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.officerDetail').on('click', '.officerDetail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/officermanage/officer-manage-detail",{
                	id:id
                })

            });
            
            
        };
    }
    module.exports = OfficerManage;
});