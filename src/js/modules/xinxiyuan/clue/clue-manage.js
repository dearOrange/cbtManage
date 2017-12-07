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
            this.initTaskTotalCount();
            this.registerEvent();
            $('select').select2();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#clue_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/trace/traceList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                	var dataList = data.list;
                	data.passState = $('#state').val();
                	if(data.passState == 0){
	            		$('.clueMatch').css("display","none");
	            	}else{
	            		$('.clueMatch').css("display","");
	            	}
	            	if(data.list.isArrange == 0){
	            		data.list.isArrange == "公开任务库";
	            	}else if(data.list.isArrange == 1){
	            		data.list.isArrange == "已分配";
	            	}
	            	if(data.isRead == 0){
	            		
	            	}else if(data.isRead == 1){
	            		
	            	}
                    return jh.utils.template('clue-manage-template', data);
                }
            });
            page.init();
        };
        this.initTaskTotalCount = function() {
            jh.utils.ajax.send({
                url: '/trace/count',
                done: function(returnData) {
                	console.log(returnData)
                    var olBox = $('#taskState');
                    for (var item in returnData.data) {
                        var sup = $('<sup></sup>');
                        sup.text(returnData.data[item]);
                        olBox.find('[data-state="' + item + '"]').append(sup);
                    }
                    var sup = $('<sup></sup>');
                }
            });
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