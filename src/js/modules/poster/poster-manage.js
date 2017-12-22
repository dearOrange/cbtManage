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
                method: 'post',
                contentType: 'application/json',
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
            //编辑banner
            $('body').off('click', '.posterEdit').on('click', '.posterEdit', function() {
                var me = $(this);
                var id = me.data('id');
                var str = jh.utils.template('poster_manage_addBannerTemplate', {});
                var traceIds = $(this).data('id');
                jh.utils.alert({
                    content: str,
                    ok: function() {
                        $('#poster_manage_addBannerForm')[0].submit();
                    },
                    cancel: true
                });

                jh.utils.validator.init({
                    id: 'poster_manage_addBannerForm',
                    submitHandler: function(form) {
                        var datas = jh.utils.formToJson(form);
                        console.log(datas);
                        return false;
                    }
                });
            });
            //新增banner
            $('body').off('click', '.poster_addBanner').on('click', '.poster_addBanner', function() {
                var me = $(this);
                var id = me.data('id');
                var str = jh.utils.template('poster_manage_addBannerTemplate', {});
                jh.utils.alert({
                    content: str,
                    ok: function() {
                        $('#poster_manage_addBannerForm').submit();
                        return false;
                    },
                    cancel: true
                });

                jh.utils.validator.init({
                    id: 'poster_manage_addBannerForm',
                    submitHandler: function(form) {
                        var datas = jh.utils.formToJson(form);
                        if(!datas.url){
                            jh.utils.confirm({
                                content: '请上传海报图片！'
                            });
                            return false;
                        }
                        console.log(datas);
                        return false;
                    }
                });

                jh.utils.uploader.init({
                    pick: {
                        id: '#url'
                    }
                }, {
                    uploadAccept: function(file, returnData) {
                        debugger
                    }
                });
            });
            //删除banner
            $('body').off('click', '.removeEdit').on('click', '.removeEdit', function() {
                var me = $(this);
                var id = me.data('id');
                var traceIds = $(this).data('id');
                jh.utils.alert({
                    content: '确定拒绝吗？',
                    ok: function() {
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
                    cancel: true
                })
            })
        };
    }
    module.exports = PosterManage;
});