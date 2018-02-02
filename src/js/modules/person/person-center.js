/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function PersonCenter() {
        var _this = this;
        _this.roleType = sessionStorage.getItem('admin-roleType');
        _this.resData = '';
        _this.key = '';
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/operator/info',
                done: function(returnData) {
                	returnData.password = sessionStorage.getItem("admin-password");
                    $(".personUser").html(returnData.data.userName);
                    $(".personPhone").html(returnData.password);
                    $('#name').val(returnData.data.name);
                    $('#mobile').val(returnData.data.mobile);
                    $('#wechat').val(returnData.data.wechat);
                    $('#email').val(returnData.data.email);
                    _this.resData = returnData.data.operatorProvinceVoList;
                    if(_this.roleType === 'channel') {
			        	$('.channelArea').removeClass('hide');
			        	for(var i=0;i<_this.resData.length;i++){
	                    	$('.personArea').append(_this.resData[i].provinceName);
	                    }
			        }else {
			        	$('.channelArea').addClass('hide');
			        }
                    
                    //修改密码
                    $('body').off('click', '.changePassword').on('click', '.changePassword', function() {
	                    var alertStr = jh.utils.template('task_changePassword_template', returnData);
		                jh.utils.alert({
		                    content: alertStr,
		                	ok:function(){
		                		var newpwd = $.trim($('.find-newpwd').val());
		                		var repnewpwd = $.trim($('.find-repnewpwd').val());
		                		var datachange = {
			                    	password: $.trim($('.find-oldpwd').val()),
			                    	newPassword: newpwd
			                   	};
			                   	if(newpwd !== repnewpwd) {
			                   		jh.utils.alert({
			                   			content: '新密码请保持一致！',
			                   			ok: true
			                   		})
			                   		return false;
			                   	}
		                		jh.utils.ajax.send({
				                    url: '/operator/updatePassword',
				                    method: 'post',
				                    data: datachange,
				                    done: function(returnData){
				                    	sessionStorage.removeItem('admin-X-Token');
		                                sessionStorage.removeItem('admin-uploadToken');
		                                sessionStorage.removeItem('admin-username');
				                    	window.location.href = jh.config.pageLogin;
				                    }
				                });
		                	},
		                	cancel: true
		                });
            		});
            		
                }
	        })
        };
        this.registerEvent = function() {
			jh.utils.validator.init({
               id: 'person-list-form',
               submitHandler: function(form) {
                   var datas = jh.utils.formToJson(form); //表单数据
            		jh.utils.ajax.send({
                       url: '/operator/editInfo',
                       data: datas,
                       done: function(returnData) {
                           window.location.reload();
                       }
                   });
                   return false;
               }
           });
           
            //取消编辑
            $(".clearEdit").click(function() {
                jh.utils.load("/src/modules/person/person-file");
            })
            

        };
    }
    module.exports = PersonCenter;
});