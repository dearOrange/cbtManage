/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function FinanceList() {
        var _this = this;
        _this.form = $('#finance-list-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2();
        };
		this.initContent = function(isSearch) {
			Mock.mock(REQUESTROOT+'/finance/taskOrderList', {
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
                data_container: $('#finance_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/finance/taskOrderList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                	if(data.loanerMoneyStatus == 0){
	            		data.loanerMoneyStatus == "未收款";
	            	}else if(data.loanerMoneyStatus == 1){
	            		data.loanerMoneyStatus == "已收款";
	            	}
	            	if(data.hunterMoneyStatus == 0){
	            		data.hunterMoneyStatus == "未放款";
	            	}else if(data.hunterMoneyStatus == 1){
	            		data.hunterMoneyStatus == "已放款";
	            	}
                    return jh.utils.template('finance-list-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
           
            // 搜索
            jh.utils.validator.init({
                id: 'finance-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.finance-detail').on('click', '.finance-detail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/finance/finance-detail",{
                	id:id
                })

            });


        };
    }
    module.exports = FinanceList;
});