/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InformantAward() {
        var _this = this;
        _this.form = $('#informant-award-form');
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#informant_award_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/activity/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('informant-award-template', data);
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
                id: 'informant-award-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //新建活动
            $('body').off('click', '#increate-award').on('click', '#increate-award', function() {
                var newAward = jh.utils.template('new-increate-award-template', {});
                jh.utils.alert({
                	title: '新建线人奖励活动',
                	content: newAward,
                	ok: function() {
                		var award1 = $.trim($('.activity').val());
                		var award2 = $.trim($('.referrerTrace').val());
                		var award3 = $.trim($('.firstTrace').val());
                        var award4 = $.trim($('.referrerFirstTrace').val());
                        var regaward1 = /^[1-9]\d*|0$/.test(award1);
                        var regaward2 = /^[1-9]\d*|0$/.test(award2);
                        var regaward3 = /^[1-9]\d*|0$/.test(award3);
                        var regaward4 = /^[1-9]\d*|0$/.test(award4);
                        if(award1 && award2 && award3 && award4 && regaward1 && regaward2 && regaward3 && regaward4) {
                    		var newData = jh.utils.formToJson($('#new-increate-award-form'));
                    		newData.type = 1;
                    		jh.utils.ajax.send({
                                method: 'post',
                                url: '/activity/create',
                                data: newData,
                                done: function(returnData) {
                                    jh.utils.alert({
                                        content: '新增活动成功',
                                        ok: function(){
                                            _this.initContent();
                                        }
                                    })
                                }
                            });
                            return false;
                        } else {
                            jh.utils.alert({
                                content: '请填写正确的金额',
                                ok: true
                            })
                            return false;
                        }
                	},
                	okValue: '新建',
                	cancel: true
                })
            })
            
            //新建活动
            $('body').off('click', '#increate-creditor-award').on('click', '#increate-creditor-award', function() {
                var creditorAward = jh.utils.template('increate-creditor-award-template', {});
                jh.utils.alert({
                    title: '新建线人奖励活动',
                    content: creditorAward,
                    ok: function() {
                        var award1 = $.trim($('.activity').val());
                        var award2 = $.trim($('.referrerTrace').val());
                        var regaward1 = /^[1-9]\d*|0$/.test(award1);
                        var regaward2 = /^[1-9]\d*|0$/.test(award2);
                        if(award1 && award2 && regaward1 && regaward2) {
                            var creditorData = jh.utils.formToJson($('#increate-creditor-award-form'));
                            creditorData.type = 2;
                            jh.utils.ajax.send({
                                method: 'post',
                                url: '/activity/create',
                                data: creditorData,
                                done: function(returnData) {
                                    jh.utils.alert({
                                        content: '新增活动成功',
                                        ok: function(){
                                            _this.initContent();
                                        }
                                    })
                                }
                            });
                            return false;
                        } else {
                            jh.utils.alert({
                                content: '请填写正确的金额',
                                ok: true
                            })
                            return false;
                        }
                    },
                    okValue: '新建',
                    cancel: true
                })
            })

            
            //停止活动
            $('body').off('click', '.stopAward').on('click', '.stopAward', function() {
                var awardsId = $(this).data('id');
                var stopAward = jh.utils.template('stop-award-template', {});
                jh.utils.alert({
                	title: '停止活动',
                	content: stopAward,
                	ok: function() {
                		jh.utils.ajax.send({
                            method: 'get',
                            url: '/activity/close',
                            data: {
                            	activityId: awardsId
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '活动已停止',
                                    ok: function(){
                                        _this.initContent();
                                    }
                                })
                            }

                        });
                	},
                	cancel: true
                })
            })
        };
    }
    module.exports = InformantAward;
});