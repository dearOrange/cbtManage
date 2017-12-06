/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function SendMoneyDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function() {
        	Mock.mock(REQUESTROOT+'/withdraw/detail?drawId='+args.id, {
                code: 'SUCCESS',
                msg: '请求成功',
                data: {
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
                }
            });
            jh.utils.ajax.send({
                url: '/withdraw/detail',
                data: {
                    drawId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('sendMoney_detail_template', returnData);
                    $('.sendMoneyDetail').html(html);
                    $("select").select2();
                    //打款
                   	$('body').off('click','.playMoney').on('click','.playMoney',function(){
                   		var alertContent = jh.utils.template('sendMoney_sure_template', {});
		            	jh.utils.alert({
		                	content: alertContent,
		                	ok:function(){
		                		var datas = jh.utils.formToJson($('#play-money-form'));
		                		jh.utils.ajax.send({
					                url: '/withdraw/confirm',
					                data: datas,
					                done: function(returnData){
					                	
					                }
					            });
		                	},
		                	cancel:true
		                })
		            });
		            
		            //拒绝打款
                   	$('body').off('click','.rejectMoney').on('click','.rejectMoney',function(){
                   		var rejectCon = jh.utils.template('rejectMoney_template', {});
		            	jh.utils.alert({
		                	content: rejectCon,
		                	ok:function(){
		                		jh.utils.ajax.send({
					                url: '/withdraw/refuse',
					                data: {
					                	drawId: args.id,
					                	reason: $('.rejectReason').val()
					                },
					                done: function(returnData) {
					                    
					                }
		                
		            			});
		                	},
		                	cancel:true
		                })
		            });
                }
            });
        };

    }
    module.exports = SendMoneyDetail;
});