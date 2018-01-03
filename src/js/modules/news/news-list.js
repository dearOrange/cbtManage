/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function NewsList() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#news_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/content/getNotice',
                contentType: 'application/json',
                callback: function(returnData) {
                    return jh.utils.template('news-list-template', returnData);
                    
                }
            });
            page.init();
        };
        
        this.registerEvent = function() {
            
            //编辑
            $('.admin-addNews').click(function(){
            	var newstr = jh.utils.template('addnews-template',{});
            	jh.utils.alert({
            		title: '新增公告',
                	content: newstr,
                	ok:function(){
                		var newsData = jh.utils.formToJson($('#addNews-form'));
                		jh.utils.ajax.send({
                			method: 'post',
			                url: '/content/addnotice',
			                data: newsData,
			                done: function(returnData) {
			                     _this.initContent();
			                }
                
            			});
                	},
                	cancel:true
                })
            })
            //删除
            $('body').off('click','.removeNews').on('click','.removeNews',function(){
            	var newsIds = $(this).data('id');
            	jh.utils.alert({
                	content:'确定删除吗？',
                	ok:function(){
                		jh.utils.ajax.send({
                			method: 'post',
			                url: '/content/deletNotice',
			                data: {
			                	noticeId: newsIds
			                },
			                done: function(returnData) {
			                    _this.initContent();
			                }
                
            			});
                	},
                	cancel:true
                })
            })
        };
    }
    module.exports = NewsList;
});