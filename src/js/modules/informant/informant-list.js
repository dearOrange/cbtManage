'use strict';
define(function(require, exports, module) {
    function InformantList() {
        var _this = this;
        _this.form = $('#informant-list-form');

        this.init = function() {
            this.initGeo();
            this.initContent();
            this.registerEvent();
        };
        this.initGeo = function() {
            AMap.service('AMap.Geocoder', function() { //回调函数
                //实例化Geocoder
                _this.geocoder = new AMap.Geocoder({
                    city: "010"//城市，默认：“全国”
                });
            })
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
                    data.getImgInfo = function(key) {
                        var http = new XMLHttpRequest();
                        http.open("GET", jh.arguments.viewImgRoot + key, true);
                        http.responseType = "blob";
                        http.onload = function(e) {
                            if (this.status === 200) {
                                var image = new Image();
                                image.onload = function() {

                                    EXIF.getData(this, function() {
                                        var src = this.src;
                                        var lastPath = src.lastIndexOf('/');
                                        src = src.substring(lastPath + 1);
                                        var id;
                                        if(src.indexOf('.')!=-1){
                                            id = src.substring(0,src.indexOf('.'));
                                        }else{
                                            id = src;
                                        }
                                        var jsons = jh.utils.getImageInfo(EXIF.getAllTags(this));
                                        var imgObj = $('[id^='+id+']').parent().siblings('.photoGps');
                                        var gps = $.trim(imgObj.prev().text());
                                        if(gps){
                                            gps = gps.split(',');
                                            _this.getAddressInfo(gps,imgObj.prev());
                                        }
                                        if (jsons.success) {
                                            var arr = jsons.lnglatXY;
                                            _this.getAddressInfo(arr,imgObj);
                                        } else {
                                            imgObj.find('.photoAddress').text(jsons.lnglatXY);
                                        }

                                        imgObj.find('.photoAddress').siblings('p').text(jsons.time);
                                    });
                                };
                                image.src = jh.arguments.viewImgRoot + key;
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
        this.getAddressInfo = function(arr,obj){
            _this.geocoder.getAddress(arr, function(status, result) {
                if(obj.find('.photoAddress').length===0){
                    obj = obj;
                }else{
                    obj = obj.find('.photoAddress');
                }
                if (status === 'complete' && result.info === 'OK') {
                    obj.text(result.regeocode.formattedAddress);
                    //获得了有效的地址信息:
                    //即，result.regeocode.formattedAddress
                } else {
                    obj.text('未获取成功');
                }
            });
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
            $('.dataShow').off('click', '.agreement').on('click', '.agreement', function() {
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
            $('.dataShow').off('click', '.pass').on('click', '.pass', function() {
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
            $('.dataShow').off('click', '.throwAway').on('click', '.throwAway', function() {
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