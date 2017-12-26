/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function UserManage() {
        var _this = this;
        _this.form = $('#user-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2({
            	minimumResultsForSearch:Infinity
            });
            $('body').off('change', '#select-person').on('change', '#select-person', function() {
            	var selectValue = $('#select-person').val();
            	if(selectValue === 'channel'){
            		$('.address-select').css('display','block');
            	}else{
            		$('.address-select').css('display','');
            	}
            })
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#user_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/operator/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('userManage_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'user-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });
//          获取省code
			var areaCode,operatorProvinceDtoList=[];
			jh.utils.ajax.send({
        		url: '/operator/getOperatorProvince',
        		done: function(data){
        			areaCode = data;
	        		
        		}
        	})   

			
//			新建
			$('.addUser').click(function() {
				var newTemplate = jh.utils.template('new-increate-template', areaCode);
				for(var i=0;i<areaCode.data.length;i++){
					var obj = {};
					obj.provinceCode = areaCode.data[i].provinceCode;
					obj.provinceName = areaCode.data[i].provinceName;
        		operatorProvinceDtoList.push(obj);
    			}
				jh.utils.alert({
					title: '新建用户',
                    content: newTemplate,
                    okValue: '下一步',
                    ok:function(){
                    	$('.next-content').css('display','block');
						$('.new-increate').css('display','none');
	        		console.log(operatorProvinceDtoList)
						console.log(jh.utils.formToJson($('#newincreate-form')))
						return false;
					}
                });
			});
			
            //编辑
            $('.dataAudit').off('click', '.edit-user').on('click', '.edit-user', function() {
                var infos = $(this).data('infos');
                var editTemplate = jh.utils.template('edit_usermanage_template', {data: infos});
				jh.utils.alert({
                    content: editTemplate,
                    ok:function(){
                    	var editData = jh.utils.formToJson($('#edit-user-form'));
                    	editData.operatorId = infos.id;
                    	jh.utils.ajax.send({
                    		method: 'post',
                    		url: '/operator/edit',
                    		data: editData,
                    		contentType: 'application/json',
                    		done: function(data){
                    			jh.utils.load('/src/modules/user/user-manage');
                    		}
                    	})
                    },
                    cancel:true
                });
            });
            
            //开启状态
            $('body').off('click', '.btn-status').on('click', '.btn-status', function() {
                var statusId = $(this).data("id");
                var className = $('.btn-father').find('.openStatus');
                var statusNum = className.length == 1 ? 0 : 1;
                jh.utils.ajax.send({
            		url: '/operator/status',
            		data: {
						operatorId: statusId,
						status: statusNum
            		},
            		done: function(data){
            			if(statusNum == 0){
            				$('.btn-status').addClass('closeStatus').removeClass('openStatus');
            			}else{
            				$('.btn-status').removeClass('closeStatus').addClass('openStatus');
            			}
//          			window.location.reload();
            		}
            	})
            });
            
            
            
        };
    }
    module.exports = UserManage;
});