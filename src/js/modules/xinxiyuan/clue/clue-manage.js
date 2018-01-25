/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueManage() {
        var _this = this;
        _this.form = $('#clue-manage-form');

        this.init = function() {
        	this.initGeo();
            this.initContent();
            this.initTaskTotalCount();
            this.registerEvent();
            $('select').select2({
                minimumResultsForSearch: Infinity
            });
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
                data_container: $('#clue_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/trace/traceList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    data.passState = $('#state').val();
                    data.viewImgRoot = jh.config.viewImgRoot;
                    console.log(data);
                    data.getImgInfo = function(key) {
                        var http = new XMLHttpRequest();
                        http.open("GET", jh.config.viewImgRoot + key, true);
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
                                image.src = jh.config.viewImgRoot + key;
                            };
                        };
                        http.send();
                    };
                    if (data.passState == 0) {
                        $('.clueMatch').css("display", "none");
                    } else {
                        $('.clueMatch').css("display", "");
                    };
                    return jh.utils.template('clue-manage-template', data);

                }
            });
            page.init();
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
        
        this.initTaskTotalCount = function() {
            jh.utils.ajax.send({
                url: '/trace/count',
                done: function(returnData) {
                    var olBox = $('#taskState');
                    for (var item in returnData.data) {
                        var sup = $('<sup></sup>');
                        sup.text(returnData.data[item]);
                        olBox.find('[data-state="' + item + '"]').append(sup);
                    }
                    var sup = $('<sup></sup>');
                }
            });
        };

        this.traceOperator = function(ids, state) {
            if (!ids) {
                jh.utils.confirm({
                    content: '请选择线索后操作！'
                });
                return false;
            }
            var tip = state === 1 ? '通过' : '拒绝';
            jh.utils.alert({
                content: '确定' + tip + '吗？',
                ok: function() {
                    jh.utils.ajax.send({
                        url: '/trace/check',
                        data: {
                            traceIds: ids,
                            validState: state
                        },
                        done: function(returnData) {
                            _this.initContent();
                        }
                    });
                },
                cancel: true
            });
        };

        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'clue-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //查看任务详情
            $('.dataShow').off('click', '.clueManage-detail').on('click', '.clueManage-detail', function() {
                var id = $(this).data('id');
                var state = $(this).data('state');
                jh.utils.load("/src/modules/xinxiyuan/clue/clue-manage-detail", {
                    id: id,
                    state: state
                })
            });

            //切换状态
            $('body').off('click', '.taskState').on('click', '.taskState', function() {
                $(this).addClass("active").siblings().removeClass("active");
                _this.form[0].reset();
                $('select').select2();
                $('#state').val($(this).data('value'))
                _this.initContent();
            })

            //批量通过
            $('body').off('click', '#batchPass').on('click', '#batchPass', function() {
                var me = $(this);
                var ids = jh.utils.getCheckboxValue('clue_manage_container');
                _this.traceOperator(ids, 1);
            })

            //批量拒绝
            $('body').off('click', '#batchRefuse').on('click', '#batchRefuse', function() {
                var me = $(this);
                var ids = jh.utils.getCheckboxValue('clue_manage_container');
                _this.traceOperator(ids, 2);
            })

            //通过
            $('body').off('click', '.agreement').on('click', '.agreement', function() {
                var traceIds = $(this).data('id');
                _this.traceOperator(traceIds, 1);
            })
            //拒绝
            $('body').off('click', '.pass').on('click', '.pass', function() {
                var traceIds = $(this).data('id');
                _this.traceOperator(traceIds, 2);
            })
        };
    }
    module.exports = ClueManage;
});