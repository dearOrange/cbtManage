/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InformantManage() {
        var _this = this;
        _this.form = $('#informant-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#informant_manage_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/downstreams/channel/informerlist',
                contentType: 'application/json',
                data: jh.utils.formToJson($('#informant-manage-form')),
                callback: function(data) {
                	data.officerClueState = jh.utils.officerClueState;
                    return jh.utils.template('informantManage_content_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            // 搜索
            jh.utils.validator.init({
                id: 'informant-manage-form',
                submitHandler: function(form) {
                    _this.initContent();
                    return false;
                }
            });
            
            //认证
            $('body').off('click', '.changeOfficer').on('click', '.changeOfficer', function() {
                var rejectCon = jh.utils.template('officer_change_template', {});
                jh.utils.alert({
                	title: '确定成为捕头吗？',
                    content: rejectCon,
                    ok: function() {
                        var throughState = $('.through').filter(':checked').val();
                        var btn = $('[i-id="ok"]');
                        $('<img src="/src/img/loading.gif" height="29"/>').insertAfter(btn);
                        jh.utils.ajax.send({
                            method: 'post',
                            url: '/downstreams/channel/approve',
                            data: {
                                downstreamId: args.id,
                                approveStatus: throughState,
                                reason: $('.butouReason').val()
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '操作成功',
                                    ok: function() {
                                        window.location.reload();
                                    }
                                })
                            },
                            always:function(){
                                btn.siblings('img').remove();
                            }

                        });
                        return false;
                    },
                    cancel: true
                })
            });
        };
    }
    module.exports = InformantManage;
});