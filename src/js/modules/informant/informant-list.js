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
            Mock.mock('/trace/list',{
                code: 'SUCCESS',
                msg: '请求成功',
                data: {
                    total: 65,
                    'list|10': [{
                        'id|+1': 1,
                        'carNumber': /[浙川沪][A-Z][a-zA-Z0-9]{5}/,
                        'carPhoto': Mock.Random.dataImage(),
                        'city': Mock.Random.city(),
                        'downstreamName': Mock.Random.cname(),
                        'downstreamPhone': /1[3|4|5|7|8]\d{9}/,
                        'createAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
                        'fingerprint': Mock.Random.county(true),
                        'ipCity': Mock.Random.county(true),
                        'lastUpdateAt': Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
                        'location': Mock.Random.city()
                    }]
                }
            });

            var page = new jh.ui.page({
                data_container: $('#order_list_container'),
                page_container: $('#page_container'),
                method: 'post',
                ident: 'news',
                url: '/trace/list',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    var contentHtml = jh.utils.template('informantList_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
            $('#area').select2();
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

            // 发布
            $('.dataShow').on('click', '.publish', function() {
                var _that = $(this);
                if (_that.hasClass('disabled_btn')) {
                    return false;
                }
                var dataRow = _that.parents('.trData');
                var id = parseInt(_that.data('id'));
                jh.utils.alert({
                    content: '是否确认以上操作？',
                    ok: function() {
                        jh.utils.ajax.send({
                            method: 'post',
                            url: '/admin/news/publish',
                            data: {
                                id: id
                            },
                            done: function(data, status, xhr) {
                                jh.utils.alert({
                                    content: '消息已发布'
                                });
                                _that.html('已发布');
                                btnEditable(dataRow);
                                dataRow.removeClass('highLightTR');
                                dataRow.find('.titleTip').removeClass('showTitalTip');
                            },
                            fail: function(xhr, errorType, error) {
                                jh.utils.alert({
                                    content: '消息发布失败，请再次发布'
                                });
                                dataRow.addClass('highLightTR');
                                dataRow.find('.titleTip').addClass('showTitalTip');
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