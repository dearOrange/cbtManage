/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueBackDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };

        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/task/business/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.officerState = jh.utils.officerState;
                    returnData.getPositionByImage = jh.utils.getPositionByImage;
                    var clueStr = jh.utils.template('clueBack_detail_template', returnData);
                    $('.clueBack-detail').html(clueStr);

                    _this.initLinkList();
                }
            });
        };

        this.initLinkList = function() {
            var page = new jh.ui.page({
                data_container: $('#moneytotal_container'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/record/bargainList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('addMoneytotal_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            //添加议价小计
            $('body').off('click', '.addMoneytotal').on('click', '.addMoneytotal', function() {
                var addStr = jh.utils.template('clue_addSubtotal_template', {});
                jh.utils.alert({
                    content: addStr,
                    ok: function() {
                        $('#clueBack_detail_form').submit();
                        return false;
                    }
                });
                
                jh.utils.validator.init({
                    id: 'clueBack_detail_form',
                    submitHandler: function(form) {
                        var dataForm = jh.utils.formToJson(form);
                        if(!dataForm.contacts){
                          jh.utils.alert({
                            content: '请输入联系对象',
                            ok: true
                          })
                          return false;
                        }
                        if(!dataForm.content){
                          jh.utils.alert({
                            content: '联系内容',
                            ok: true
                          })
                          return false;
                        }
                        dataForm.taskId = args.id;
                        jh.utils.ajax.send({
                            url: '/record/addBargain',
                            data: dataForm,
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '添加议价小计成功！',
                                    ok:function(){
                                        _this.initLinkList();
                                        jh.utils.closeArt();
                                    },
                                    cancel:false
                                });
                                
                            }
                        });
                        return false;
                    }
                });
            });
        };
    }
    module.exports = ClueBackDetail;
});