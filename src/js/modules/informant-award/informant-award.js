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
                		var newData = jh.utils.formToJson($('#new-increate-award-form'));
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