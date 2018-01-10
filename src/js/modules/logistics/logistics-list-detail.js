/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function LogisticsListDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.registerEvent = function() {
            //拒绝接单
            $('body').off('click', '.refuseBill').on('click', '.refuseBill', function() {
                jh.utils.alert({
                    content: "确定拒绝吗？",
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/logistics/verify',
                            data: {
                            	id: args.id,
                            	validState: 2
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '已拒绝',
                                    ok: function(){
                                    	window.location.reload();
                                    }
                                })
                            }

                        });
                    },
                    cancel: true
                })
            });

            //接单
            $('body').off('click', '.acceptBill').on('click', '.acceptBill', function() {
                jh.utils.alert({
                    content: "确定接单吗？",
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/logistics/verify',
                            data: {
                            	id: args.id,
                            	validState: 1
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '接单成功',
                                    ok: function(){
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

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/withdraw/detail',
                data: {
                    drawId: args.id
                },
                done: function(returnData) {
                    var html = jh.utils.template('logistics_detail_template', returnData);
                    $('.logisticsListDetail').html(html);
                }
            });
        };

    }
    module.exports = LogisticsListDetail;
});