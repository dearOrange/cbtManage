/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueManage() {
        var _this = this;
        _this.form = $('#clue-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2();
        };
        this.initContent = function(isSearch) {
        	Mock.mock(REQUESTROOT+'/trace/traceList', {
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
                data_container: $('#clue_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/trace/traceList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                	data.passState = $('#state').val();
                	if(data.passState == 0){
	            		$('.clueMatch').css("display","none");
	            	}else{
	            		$('.clueMatch').css("display","");
	            	}
	            	if(data.isArrange == 0){
	            		data.isArrange == "公开任务库";
	            	}else if(data.isArrange == 1){
	            		data.isArrange == "已分配";
	            	}
	            	if(data.isRead == 0){
	            		
	            	}else if(data.isRead == 1){
	            		
	            	}
                    return jh.utils.template('clue-manage-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'clue-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.clueManage-detail').on('click', '.clueManage-detail', function() {
            	var id = $(this).data('id');
                jh.utils.load("/src/modules/xinxiyuan/clue/clue-manage-detail",{
                	id:id
                })
            });
            //切换状态
            $('body').off('click', '.taskState').on('click', '.taskState', function() {
            	$(this).addClass("active").siblings().removeClass("active");
            	_this.form[0].reset();
            	$('select').select2();
            	_this.initContent();
            	$('#state').val($(this).data('value'))
            })
            
            //通过
            $('body').off('click','.agreement').on('click','.agreement',function(){
            	var traceIds = $(this).data('id');
            	jh.utils.alert({
                	content:'确定通过吗？',
                	ok:function(){
                		jh.utils.ajax.send({
			                url: '/trace/check',
			                data: {
			                	traceIds: traceIds,
			                	validState: 1
			                },
			                done: function(returnData) {
			                    
			                }
                
            			});
                	},
                	cancel:true
                })
            })
            //拒绝
            $('body').off('click','.pass').on('click','.pass',function(){
            	var traceIds = $(this).data('id');
            	jh.utils.alert({
                	content:'确定拒绝吗？',
                	ok:function(){
                		jh.utils.ajax.send({
			                url: '/trace/check',
			                data: {
			                	traceIds: traceIds,
			                	validState: 2
			                },
			                done: function(returnData) {
			                    
			                }
                
            			});
                	},
                	cancel:true
                })
            })
        };
    }
    module.exports = ClueManage;
});