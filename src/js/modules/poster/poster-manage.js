/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function PosterManage() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.initTaskTotalCount();
            this.registerEvent();
        };
        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#poster_manage_container'),
                page_container: $('#page_container'),
                url: '/content/getbanner',
                data: {},
                callback: function(data) {
                	data.viewImgRoot = jh.config.viewImgRoot;
                	
                    return jh.utils.template('poster-manage-template', data);
                    
                }
            });
            page.init();
        };
        this.initTaskTotalCount = function() {
            
        };
        this.registerEvent = function() {
            
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
			                     _this.initContent();
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
			                    _this.initContent();
			                }
                
            			});
                	},
                	cancel:true
                })
            })
        };
    }
    module.exports = PosterManage;
});