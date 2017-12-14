/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function RoleManage() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#role_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/operator/list',
                contentType: 'application/json',
                data: {},
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('roleManage_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
//          jh.utils.validator.init({
//              id: 'user-manage-form',
//              submitHandler: function(form) {
//                  _this.initContent(true);
//                  return false;
//              }
//          });

            //编辑
            $('.dataAudit').off('click', '.edit-power').on('click', '.edit-power', function() {
                var id = $(this).data('id');
                var editTemplate = jh.utils.template('edit_rolemanage_template', {});
				jh.utils.alert({
                    content: editTemplate,
                    ok:function(){
                    	
//                  	jh.utils.ajax.send({
//                  		url: '/operator/edit',
//                  		data: id,
//                  		done: function(data){
//                  			jh.utils.load('/src/modules/user/user-manage');
//                  		}
//                  	})
                    },
                    cancel:true
                });
            });
            
            //删除
            $('body').off('click', '.delete-power').on('click', '.delete-power', function() {
                var dataId = $(this).data('id');
                jh.utils.alert({
                    content: '确定删除用户吗？',
                    ok:function(){
//                  	jh.utils.ajax.send({
//                  		url: '/task/verify',
//                  		data: {
//                  			taskIds: dataId
//                  		},
//                  		done: function(data){
//                  			console.log(data)
//                  		}
//                  	})
                    },
                    cancel:true
                });
            });
            
        };
    }
    module.exports = RoleManage;
});