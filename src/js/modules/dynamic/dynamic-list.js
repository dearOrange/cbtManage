/**
 * DynamicList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function DynamicList() {
        var _this = this;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#dynamic_list_container'),
                page_container: $('#page_container'),
                url: '/content/getNewsList',
                method: 'post',
                contentType: 'application/json',
                callback: function(returnData) {
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.imageScale = jh.config.imageScale;
                    return jh.utils.template('dynamic-list-template', returnData);

                }
            });
            page.init();
        };

        this.removeDynamic = function(ids) {
            jh.utils.alert({
                content: '确定删除吗？',
                ok: function() {
                    jh.utils.ajax.send({
                        method: 'post',
                        url: '/content/deleteNews',
                        data: {
                            ids: ids
                        },
                        done: function(returnData) {
                            _this.initContent();
                        }

                    });
                },
                cancel: true
            })
        }

        this.registerEvent = function() {

            //新增
            $('.admin-addDynamic').off('click').on('click',  function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.load('/src/modules/dynamic/dynamic-add');
            })

            //详情
            $('#dynamic_list_container').off('click', '.detail').on('click', '.detail', function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.load('/src/modules/dynamic/dynamic-detail',{
                    id: id
                });
            })

            //编辑
            $('#dynamic_list_container').off('click', '.edit').on('click', '.edit', function() {
                var m = $(this);
                var id = m.data('id');
                jh.utils.load('/src/modules/dynamic/dynamic-edit',{
                    id:id
                });
            })
            //删除
            $('body').off('click', '.remove').on('click', '.remove', function() {
                var m = $(this);
                var ids = '';
                if(m.hasClass('single')){
                    ids = m.data('id');
                }else{
                    ids = jh.utils.getCheckboxValue('dynamic_list_container');
                }
                if(!ids){
                    jh.utils.confirm({
                        content: '请选择动态！'
                    });
                    return false;
                }
                _this.removeDynamic(ids);
            })
        };
    }
    module.exports = DynamicList;
});