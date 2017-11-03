'use strict';
define(function(require, exports, module) {
    function UpstreamsList() {
        var _this = this;
        _this.form = $('#upstreams-list-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            Mock.mock('/upstreams/list',{
                code: 'SUCCESS',
                msg: '请求成功',
                data: {
                    total: 65,
                    'list|10': [{
                        'id|+1': 1,
                        'companyName': Mock.Random.cname(),
                        'userName': Mock.Random.cname(),
                        'legalPerson': Mock.Random.cname(),
                        'email': Mock.Random.email(),
                        'address': Mock.Random.county(true),
                        'contactPhone': /1[34578]\d{9}/,
                        'createAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
                        'amount': /\d{3}\.\d{2}/,
                        'alipay': /1[34578]\d{9}/,
                        'businessLicense': Mock.Random.dataImage(),
                        'bankName': /(中国银行|农业银行|招商银行)/,
                        'bankCard': /\d{19}/
                    }]
                }
            });

            var page = new jh.ui.page({
                data_container: $('#order_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                ident: 'news',
                url: '/upstreams/list',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    var contentHtml = jh.utils.template('upstreamsList_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
        };
        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'upstreams-list-form',
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
    module.exports = UpstreamsList;
});