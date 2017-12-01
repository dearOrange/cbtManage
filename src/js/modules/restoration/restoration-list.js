/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function RestorationList() {
        var _this = this;
        _this.form = $('#restoration-list-form');

        this.init = function() {
        	this.initContent();
        	this.searchSelect();
            this.registerEvent();
            $('select').select2();
        };
		this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#restoration_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/offerList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('restoration-list-template', data);
                }
            });
            page.init();
        };
        this.searchSelect = function(){
        	jh.utils.ajax.send({
                url: '/operator/getAllBusiness',
                done: function(returnData){
                	var operateData = returnData.data;
                	var operateStr = "";
                	for(var i=0;i<operateData.length;i++){
                		operateStr += '<option value="'+operateData[i].id+'">'+operateData[i].name+'</option>';
                	}
                	$('#operateManage').append(operateStr);
                }
          	});
        	jh.utils.ajax.send({
                url: '/operator/getAllChannel',
                done: function(returnData){
                	var channelData = returnData.data;
                	var channelStr = "";
                	for(var i=0;i<channelData.length;i++){
                		channelStr += '<option value="'+channelData[i].id+'">'+channelData[i].name+'</option>';
                	}
                	$('#channelManage').append(channelStr);
                }
          	})
        };
        this.registerEvent = function() {
            
            // 搜索
            jh.utils.validator.init({
                id: 'restoration-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.admin-detail').on('click', '.admin-detail', function() {
            	var id = $(this).data('id');
                jh.utils.load("/src/modules/restoration/restoration-detail",{
                	id:id
                })
            });


        };
    }
    module.exports = RestorationList;
});