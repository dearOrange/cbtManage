/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskListDetailTrcaing() {
        var _this = this;
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
                    returnData.getPositionByImage = jh.utils.getPositionByImage;
                    var html = jh.utils.template('task_list_detailTrcaing_template', returnData);
                    $('#task_list_detailTrcaing_content').html(html);
                    _this.initSheriff();


                }
            });
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
            //信息修复
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
        };
    }
    module.exports = TaskListDetailTrcaing;
});