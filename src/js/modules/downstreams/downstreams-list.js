'use strict';
define(function(require, exports, module) {
    function DownstreamsList() {
        var _this = this;
        _this.form = $('#downstreams-list-form');

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
                url: '/downstreams/list',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    data.RoleToString = jh.utils.RoleToString;
                    data.isCaptain = function(code){
                        return code ? '是' : '否';
                    };
                    var contentHtml = jh.utils.template('downStreamsList_content_template', data);
                    return contentHtml;
                }
            });
            page.init();
            _this.form.find('select').select2();
        };
        this.registerEvent = function() {

            // 搜索
            jh.utils.validator.init({
                id: 'downstreams-list-form',
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

            //推荐人查询
            $('.dataShow').off('click','.blue_recommendCode').on('click', '.blue_recommendCode', function() {
                var me = $(this);
                var id = me.data('id');
                var name = me.data('name');
                _this.form.find('[name=referrer]').val(id).siblings('input').val(name);
                _this.initContent();
            });

            //推荐人查询
            _this.form.off('click','#clearReferrer').on('click', '#clearReferrer', function() {
                _this.form.find('[name=referrer]').val('').siblings('input').val('');
                _this.initContent();
            });

        };
    }
    module.exports = DownstreamsList;
});