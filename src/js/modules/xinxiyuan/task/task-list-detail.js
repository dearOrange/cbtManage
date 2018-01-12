/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskListDetail() {
        var _this = this;
        _this.form = $("#task_adopt_form");
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.officerState = jh.utils.officerState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var html = jh.utils.template('task_detail_template', returnData);
                    $('.taskListContent').html(html);
                    _this.searchIllegalInfo();
                    _this.initSheriff();


                }
            });
        };
        //查询违章信息列表
        this.searchIllegalInfo = function(obj) {
            var page = new jh.ui.page({
                data_container: $('#task_detail_wzInfoList'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/clue/illegalList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('task_detail_wzInfoTemplate', data);
                },
                onload: function() {
                    if (obj) {
                        window.setTimeout(function() {
                            $('#taskList-illegalList').removeClass('disabled');
                            $('#taskList-illegalList').siblings().remove();
                        }, 1000);
                    }
                }
            });
            page.init();
        };
        this.initSheriff = function() {
            jh.utils.ajax.send({
                url: '/operator/getAllChannel',
                done: function(returnData) {
                    var strTemplate = jh.utils.template('xx_task_list', returnData);
                    $('.task-content').html(strTemplate);
                    $('body').off('click', '.checkId').on('click', '.checkId', function() {
                        var checks = jh.utils.getURLValue().args;
                    })
                }
            });
        };

        this.registerEvent = function() {
            //审核
            $('body').off('click', '.auditClue').on('click', '.auditClue', function() {
                jh.utils.alert({
                    content: '确定审核吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/trace/adopt',
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '已审核！',
                                    ok: function() {
                                        window.location.reload();
                                    }
                                })
                            }

                        });
                    },
                    cancel: true
                })
            });

            //情报全部拒绝
            $('body').off('click', '.rejectClue').on('click', '.rejectClue', function() {
                jh.utils.alert({
                    content: '确定全部不通过吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/task/refuseAll',
                            data: {
                                taskId: args.id
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '已全部拒绝！',
                                    ok: function() {
                                        window.location.reload();
                                    }
                                })
                            }

                        });
                    },
                    cancel: true
                })
            });


            //采纳情报
            $('body').off('click', '.adopteInfo').on('click', '.adopteInfo', function() {
                var managerId = $(".managerId").filter(":checked");
                var checkId = $.trim($(".checkId").filter(":checked").val());
                var carPrice = $.trim($("#salvage").val());
                var estimatedMinPrice = $.trim($("#minMoney").val());
                var estimatedMaxPrice = $.trim($("#maxMoney").val());
                if (!checkId) {
                    jh.utils.confirm({
                        content: '请选择具体线索！'
                    });
                    return false;
                }
                if (!managerId || !$.trim(managerId.val())) {
                    jh.utils.confirm({
                        content: '请选择相应渠道经理！'
                    });
                    return false;
                }
                if (!carPrice || !estimatedMinPrice || !estimatedMaxPrice) {
                    jh.utils.confirm({
                        content: '请预估费用！'
                    });
                    return false;
                }

                jh.utils.alert({
                    content: '确定采纳吗？',
                    ok: function() {
                        var adoptData = {
                            taskId: args.id,
                            traceId: checkId,
                            carPrice: carPrice,
                            estimatedMinPrice: estimatedMinPrice,
                            estimatedMaxPrice: estimatedMaxPrice,
                            channelManagerId: managerId.val(),
                            channelManagerName: managerId.data('name')
                        };
                        jh.utils.ajax.send({
                            url: '/task/adopt',
                            data: adoptData,
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '已采纳！',
                                    ok: function() {
                                        window.location.reload();
                                    }
                                })
                            }

                        });
                    },
                    cancel: true
                })
            });
            
            //信息修复
            $('body').off('click', '#taskList-illegalList').on('click', '#taskList-illegalList', function() {
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
                        }, 10000);
                    }
                });


            });
            
            //分配渠道
            $('body').off('click', '.clueInfo').on('click', '.clueInfo', function() {
                var me = $(this);
                var ids = '', opt;

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
                                window.location.reload();
                            },
                            cancel: false
                        });
                        me.removeClass('disabled');
                    },
                    fail: function() {
                        me.removeClass('disabled');
                    }
                };
                var radio = $('#qd-distribution-tab0').find(':checked');
                opt.data.type = 1;
                opt.data.channelManagerId = radio.val();
                opt.data.channelManagerName = radio.data('name');
                jh.utils.ajax.send(opt);
            });
        };
    }
    module.exports = TaskListDetail;
});