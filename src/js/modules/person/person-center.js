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
                    $(".personArea").html(returnData.data.mobile);
                    //修改密码
                    $('body').off('click', '.changePassword').on('click', '.changePassword', function() {
	                    var alertStr = jh.utils.template('task_changePassword_template', returnData);
		                jh.utils.alert({
		                    content: alertStr,
		                	ok:function(){
		                		var datachange = {
			                    	password: $.trim($('.find-oldpwd').val()),
			                    	newPassword: $.trim($('.find-newpwd').val())
			                   	};
		                		jh.utils.ajax.send({
				                    url: '/operator/updatePassword',
				                    method: 'post',
				                    data: datachange,
				                    done: function(returnData){
				                    	jh.utils.load("/src/modules/login/login");
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
                           jh.utils.load("/src/modules/person/person-file");
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