/**
 * OpenDetail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function XXDistributionDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        //初始化详情
        this.initDetail = function(isSearch) {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.isDetail = jh.utils.isDetail;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    var html = jh.utils.template('admin-xXDistributionDetail-template', returnData);
                    $('#admin-xXDistributionDetail-container').html(html);
                    _this.searchIllegalInfo(); //查询违章信息
                    _this.initSheriff();
                }
            });
        };

        this.initSheriff = function(type) {
            jh.utils.ajax.send({
                url: '/operator/getAllChannel',
                done: function(returnData) {
                    var str = _this.distributionSheriff(returnData.data);
                    $('#xx_task_distribution').html(str);
                }
            });
        };

        this.distributionSheriff = function(arr) {
            var source = jh.utils.getChannelHtml();
            var render = jh.utils.template.compile(source);
            var str = render({ list: arr });
            return str;
        };

        this.distribution = function(ids) {
            var ids = jh.utils.getCheckboxValue('distribution_public_form', 'value');
            var opt = {
                url: '/task/distributeTask',
                data: {
                    taskIds: ids
                },
                done: function(returnData) {
                    jh.utils.alert({
                        content: '任务分配成功！',
                        ok: function() {
                            window.location.reload();
                        },
                        cancel: false
                    });
                }
            };
            jh.utils.ajax.send(opt);
        };

        //查询违章信息列表
        this.searchIllegalInfo = function(obj) {
            var page = new jh.ui.page({
                data_container: $('#distribution-illegalList-container'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/clue/illegalList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('distribution-illegalList-template', data);
                },
                onload: function() {
                    if (obj) {
                        window.setTimeout(function() {
                            $('#distribution-illegalList').removeClass('disabled');
                            $('#distribution-illegalList').siblings().remove();
                        }, 1000);
                    }
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            //信息修复
            $('body').off('click', '#distribution-illegalList').on('click', '#distribution-illegalList', function() {
                var me = $(this);
                if (me.hasClass('disabled')) {
                    return false;
                }
                $('<img src="/src/img/loading.gif" height="29"/>').insertAfter(me);
                me.addClass('disabled');
                jh.utils.ajax.send({
                    url: '/clue/bondRepair',
                    data: {
                        taskIds: args.id
                    },
                    done: function(returnData) {
                        window.setTimeout(function() {
                            _this.searchIllegalInfo(me);
                        }, 500);
                    }
                });


            });

            //信息任务分配
            $('body').off('click', '#xx_task_distribution_save').on('click', '#xx_task_distribution_save', function() {
                var me = $(this);
                var ids = '',
                    tab, opt, qdId, qdName;

                if (me.hasClass('disabled')) {
                    return false;
                }
                me.addClass('disabled');

                opt = {
                    url: '/task/distributeTask',
                    data: {
                        taskIds: args.id
                    },
                    done: function(returnData) {
                        jh.utils.alert({
                            content: '任务分配成功！',
                            ok: function(){
                                window.history.go(-1);
                            },
                            cancel: false
                        });
                        me.removeClass('disabled');
                    },
                    fail: function() {
                        me.removeClass('disabled');
                    }
                };
                tab = $('.qd-distribution-tab li.active').index();
                if (!tab) {
                    var radio = $('#qd-distribution-tab0').find(':checked');
                    opt.data.type = 1;
                    opt.data.channelManagerId = radio.val();
                    opt.data.channelManagerName = radio.data('name');
                } else {
                    opt.data.type = 2;
                }

                jh.utils.ajax.send(opt);
            });


        };
    }
    module.exports = XXDistributionDetail;
});