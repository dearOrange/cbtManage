/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function OfficerManageDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
        };

        this.initDetail = function() {
        	Mock.mock(REQUESTROOT+'/downstreams/channel/detail?downstreamId='+args.id, {
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
                url: '/downstreams/channel/detail',
                data: {
                    downstreamId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('officer_detail_template', returnData);
                    $('.officer-detail').html(html);
                    var picArr = ['businessLicense', 'legalPersonIdImg', 'legalPersonHandIdImg', 'linkmanIdImg', 'linkmanHandIdImg'];
					for (var i = 0; i < 5; i++) {
						jh.utils.uploader.init({
							isAppend: false,
							pick: {
								id: '#' + picArr[i]
							}
						});
					}
                    
		            //认证
                   	$('body').off('click','.officerAudit').on('click','.officerAudit',function(){
                   		var rejectCon = jh.utils.template('officer_audit_template', {});
		            	jh.utils.alert({
		                	content: rejectCon,
		                	ok:function(){
		                		var throughState = $('.through').filter(':checked').val();
		                		jh.utils.ajax.send({
		                			method:'post',
					                url: '/downstreams/channel/approve',
					                data: {
					                	downstreamId: args.id,
					                	approveStatus: throughState
					                },
					                done: function(returnData) {
					                    jh.utils.alert({
						                	content: '操作成功',
						                	ok:true
						                })
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
    module.exports = OfficerManageDetail;
});