'use strict';
define(function(require, exports, module) {
    function InformantList() {
        var _this = this;
        _this.form = $('#informant-list-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#order_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                ident: 'news',
                url: '/trace/list',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    data.viewImgRoot = jh.arguments.viewImgRoot;
                    data.getImgInfo = function(key){
                        var http = new XMLHttpRequest();
                        debugger
                        http.open("GET", jh.arguments.viewImgRoot + key + '?imageView2/0/w/100', true);
                        http.responseType = "blob";
                        http.onload = function(e) {
                            if (this.status === 200) {
                                var image = new Image();
                                image.onload = function() {
                                    EXIF.getData(this, function() {
                                        var _dataTxt = EXIF.pretty(this);
                                        var _dataJson = JSON.stringify(EXIF.getAllTags(this));

                                        console.log(_dataTxt)
                                    });
                                };
                                image.src = jh.arguments.viewImgRoot + key + '?imageView2/0/w/100';
                            };
                        };
                        http.send();
                    };
                    var contentHtml = jh.utils.template('informantList_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
            $('#role').select2();
        };
        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'informant-list-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //通过
            $('.dataShow').off('click','.agreement').on('click', '.agreement', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '是否确认通过？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/passed',
                            data: {
                                traceId: id
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(data, status, xhr) {
                                _this.initContent();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            //拒绝
            $('.dataShow').off('click','.pass').on('click', '.pass', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '是否确认拒绝？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/refuse',
                            data: {
                                traceId: id
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(data, status, xhr) {
                                _this.initContent();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

            //垃圾池
            $('.dataShow').off('click','.throwAway').on('click', '.throwAway', function() {
                var me = $(this);
                var id = me.data('id');
                jh.utils.alert({
                    content: '是否扔到垃圾池？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/drop',
                            data: {
                                traceId: id
                            },
                            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                            done: function(data, status, xhr) {
                                _this.initContent();
                            }
                        });
                    },
                    cancel: function() {}
                });
            });

        };
    }
    module.exports = InformantList;
});