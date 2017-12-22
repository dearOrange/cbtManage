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
        this.removeBanner = function(id) {
            jh.utils.confirm({
                content: '确定删除吗？',
                ok: function() {
                    jh.utils.ajax.send({
                        url: '/content/deletbanner',
                        data: {
                            bannerId: id
                        },
                        method: 'post',
                        done: function() {
                            jh.utils.alert({
                                content: '海报删除成功！',
                                ok: function(){
                                    _this.initContent();
                                },
                                cancel: false
                            });
                        }
                    });
                },
                cancel: true
            });

        };
        this.showBanner = function(obj) {
            if(!obj){
                obj = {};
            }else{
                obj.showImgUrl = jh.config.viewImgRoot + obj.url;
            }
            var str = jh.utils.template('poster_manage_addBannerTemplate', obj);
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
                    datas.type = '2';
                    if (!datas.url) {
                        jh.utils.confirm({
                            content: '请上传海报图片！'
                        });
                        return false;
                    }
                    console.log(datas);
                    jh.utils.ajax.send({
                        url: '/content/addbanner',
                        data: datas,
                        method: 'post',
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '海报新增成功！',
                                ok: function() {
                                    _this.initContent();
                                    jh.utils.closeArt();
                                }
                            });
                        }
                    });
                    return false;
                }
            });

            jh.utils.uploader.init({
                pick: {
                    id: '#url'
                }
            }, {
                uploadAccept: function(file, returnData) {
                    $('#bannerImageUrl').val(returnData.key);
                    var imgStr = '<img class="preview-img" src="' + jh.config.viewImgRoot + returnData.key + '" width="608" height="304"/>';
                    $('.img-preview-content').html(imgStr);
                }
            });
        };
        this.registerEvent = function() {
            //编辑banner
            $('body').off('click', '.posterEdit').on('click', '.posterEdit', function() {
                var me = $(this);
                var info = me.data('info');
                _this.showBanner(info);
            });
            //新增banner
            $('body').off('click', '.poster_addBanner').on('click', '.poster_addBanner', function() {
                var me = $(this);
                var id = me.data('id');
                _this.showBanner();
            });
            //删除banner
            $('body').off('click', '.removeEdit').on('click', '.removeEdit', function() {
                var me = $(this);
                var id = me.data('id');
                _this.removeBanner(id);
            });
            //批量删除banner
            $('body').off('click', '.poster_removeBanner').on('click', '.poster_removeBanner', function() {
                var me = $(this);
                var id = jh.utils.getCheckboxValue('poster_manage_container');
                _this.removeBanner(id);
            });
        };
    }
    module.exports = PosterManage;
});