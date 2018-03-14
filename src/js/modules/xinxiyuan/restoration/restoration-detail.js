/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function RestorationDetail() {
        var _this = this;
        _this.baileePrice = 0;
        _this.numPlus = 0;
        _this.num = 0;
        _this.form = $('#restoration-detail-form');
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.registerEvent = function(){
        	
        	$('body').off('blur', '#baileePrice').on('blur', '#baileePrice', function() {
        		var me = $(this);
        		_this.num = parseFloat($.trim($('#finalPrice').val()));
            	if( _this.num === '' ){
        			me.val('');
        		}else{
        			me.val((_this.num*0.1).toFixed(2));
        		}
        		_this.numPlus = _this.num - me.val();
            });
            
        	
            $('body').off('blur', '#assetPrice').on('blur', '#assetPrice', function() {
        		var me = $(this);
        		var menum = parseFloat($.trim(me.val()));
            	if( menum === ''){
        			$('#thirdpartyPrice').val('');
        		}else{
        			if (menum < 0 || menum > _this.numPlus) {
	        			me.val('');
	        			$('#thirdpartyPrice').val('');
	        		}else{
        				$('#thirdpartyPrice').val((_this.numPlus-menum).toFixed(2));
	        		}
        		}
            	 
            });
            $('body').off('blur', '#thirdpartyPrice').on('blur', '#thirdpartyPrice', function() {
        		var thme = $(this);
        		var thmenum = parseFloat($.trim(thme.val()));
            	if( thmenum === ''){
        			thme.val('');
        		}else{
        			if (thmenum < 0 || thmenum > _this.numPlus) {
	        			thme.val('');
	        		}else{
        				$('#assetPrice').val((_this.numPlus-thme.val()).toFixed(2));
	        		}
        		}
            	 
            });
        };
        this.initValidator = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'restoration-detail-form',
                submitHandler: function(form) {
                    form = $(form);
                    var datas = jh.utils.formToJson(form);
                    var submit = form.find('input[type="submit"]');
                    var arr = submit.hasClass('priceStorage') ? '/task/estimate,价格预估完毕' : '/task/fixPrice,价格确认完毕';
                    arr = arr.split(',');
                    jh.utils.ajax.send({
                        url: arr[0],
                        data: datas,
                        done: function(returnData) {
                            jh.utils.alert({
                                content: arr[1],
                                ok: function(){
                                    jh.utils.load('/src/modules/xinxiyuan/restoration/restoration-list');
                                }
                            });
                        }
                    });
                    return false;
                }
            });
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    returnData.baileePrice = (parseFloat(returnData.data.finalPrice)*0.1).toFixed(2);
                    var creditorStr = jh.utils.template('restoration_detail_template', returnData);
                    $('.restorationContent').html(creditorStr);
                    
                    _this.baileePrice = returnData.baileePrice;
                    
                    _this.num = parseFloat($.trim($('#finalPrice').val()));
                    _this.numPlus = _this.num - $('#baileePrice').val();
                    
                    _this.initValidator();
                    $('#taskId').val(args.id);
                    var picArr = ['carPhoto', 'carNumberPhoto'];
                    for (var i = 0; i < 2; i++) {
                        jh.utils.uploader.init({
                            isAppend: false,
                            pick: {
                                id: '#' + picArr[i]
                            }
                        });
                    }
                }
            });
        };
    }
    module.exports = RestorationDetail;
});