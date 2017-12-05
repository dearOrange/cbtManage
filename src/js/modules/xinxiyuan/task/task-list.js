/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskList() {
        var _this = this;
        _this.form = $('#task-list-form');
        $('select').select2();

        this.init = function() {
        	this.initContent();
        	this.initTaskTotalCount();
            this.registerEvent();
        };
		this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#task_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/task/taskList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                	data.passState = $('#state').val();
                    return jh.utils.template('taskList_content_template', data);
                }
            });
            page.init();
        };
        this.initTaskTotalCount = function() {
            jh.utils.ajax.send({
                url: '/task/count',
                done: function(returnData) {
                    var olBox = $('#taskState');

                    for (var item in returnData.data) {
                        var sup = $('<sup></sup>');
                        sup.text(returnData.data[item]);
                        olBox.find('[data-value="' + item + '"]').append(sup);
                    }
                    var sup = $('<sup></sup>');
                    sup.text(returnData.data.all);
                    olBox.find('li').last().append(sup);
                }
            });
        };
        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'task-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.taskList-detail').on('click', '.taskList-detail', function() {
            	var id = $(this).data('id');
                jh.utils.load("/src/modules/xinxiyuan/task/task-list-detail",{
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
			
			
			//一键修复
            $('body').off('click', '.allrepair').on('click', '.allrepair', function() {
            	var checkId = jh.utils.getCheckboxValue('task_list_container',"value");
                jh.utils.alert({
                    content: "确定修复吗",
                    ok:function(){
                    	jh.utils.ajax.send({
                    		url: '/clue/bondRepair',
                    		data: {
                    			taskIds: checkId
                    		},
                    		done: function(data){
                    			console.log(data)
                    		}
                    	})
                    },
                    cancel:true
                });
            })

        };
    }
    module.exports = TaskList;
});