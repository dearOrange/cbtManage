/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorManageDetail() {
        var _this = this;
        _this.form = $('#restoration-detail-form');
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initContent();
        };
        this.initValidator = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'restoration-detail-form',
                submitHandler: function(form) {
                    form = $(form);
                    var datas = jh.utils.formToJson(form);
                    var submit = form.find('input[type="submit"]');
                    if (submit.hasClass('priceStorage')) {
                        jh.utils.ajax.send({
                            url: '/task/estimate',
                            data: datas,
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '价格预估完毕',
                                    ok: true
                                });
                                window.location.reload();
                            }
                        });
                    } else {
                        jh.utils.ajax.send({
                            url: '/task/fixPrice',
                            data: datas,
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '价格确认完毕',
                                    ok: true
                                });
                                window.location.reload();
                            }
                        });
                    }
                    return false;
                }
            });
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.taskId = args.id;
                    var creditorStr = jh.utils.template('restoration_detail_template', returnData);
                    $('.restorationContent').html(creditorStr);
                    _this.initValidator();
                    $('#taskId').val(args.id);
                    var picArr = ['carPhoto', 'carNumberPhoto'];
                    for (var i = 0; i < 2; i++) {
                        jh.utils.uploader.init({
                            isAppend: false,
                            pick: {
                                id: '#' + picArr[i]
                            }
                        });
                    }
                }
            });
        };
    }
    module.exports = CreditorManageDetail;
});