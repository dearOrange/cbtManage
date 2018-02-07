/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueBack() {
        var _this = this;
        _this.form = $('#clue-back-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
            $('select').select2({
            	minimumResultsForSearch:Infinity
            });
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#clue_back_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/task/feedbackList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('clueBack_content_template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'clue-back-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.clueBackDetail').on('click', '.clueBackDetail', function() {
                var id = $(this).data('id');
                jh.utils.load("/src/modules/yunying/clue/clue-back-detail", {
                    id: id
                })
            });

            //添加议价小计
            $('body').off('click', '.addSub').on('click', '.addSub', function() {
                var me = $(this);
                var id = me.data('id');
                var addStr = jh.utils.template('clue_addSubtotal_template', {});
                jh.utils.alert({
                    content: addStr,
                    ok: function() {
                    	var dataForm = jh.utils.formToJson($('#sub-customer-list-form'));
                    	dataForm.taskId = id;
                    	var mobile1 = /^1[3|4|5|6|7|8][0-9]{9}$/;
				        var mobile2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
				        var mobile3 = /^400-[0-9]{3}-[0-9]{4}$/;
				        if(mobile1.test(dataForm.contactPhone) || mobile2.test(dataForm.contactPhone) || mobile3.test(dataForm.contactPhone)) {
	                        jh.utils.ajax.send({
	                            url: '/record/addBargain',
	                            data: dataForm,
	                            done: function(returnData) {
	                                jh.utils.alert({
	                                    content: '议价小计添加成功',
	                                    ok: true,
	                                    cancel: false
	                                });
	                            }
	                        });
	                    }else {
                    		jh.utils.alert({
                        		content: '请填写正确的联系方式',
                        		ok:true
                        	});
                        	return false;
                    	}
                    }
                });
            })
        };
    }
    module.exports = ClueBack;
});