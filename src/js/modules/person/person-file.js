/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function PersonFile() {
        var _this = this;
        _this.userId = '';
        _this.roleType = sessionStorage.getItem('admin-roleType');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/operator/info',
                done: function(returnData) {
                    _this.userId = returnData.data.id;
                    returnData.password = sessionStorage.getItem("admin-password");
                    var getStr = jh.utils.template('task_getAuditInfo_template', returnData);
                    $('.modelData').html(getStr);

                    if(_this.roleType === 'channel') {
                        $('.channelArea').removeClass('hide');
                    } else {
                        $('.channelArea').addClass('hide');
                    };

                    if(_this.roleType === 'business' || _this.roleType === 'businessmanager') {
                        $('.upErweima').removeClass('hide');
                    } else {
                        $('.upErweima').addClass('hide');
                    }
                }
            });
        };
        this.registerEvent = function() {

            //修改密码
            $('body').off('click', '.changePassword').on('click', '.changePassword', function() {
                var alertStr = jh.utils.template('task_changePassword_template', {});
                jh.utils.alert({
                    content: alertStr,
                    ok: function() {
                        var newpwd = $.trim($('.find-newpwd').val());
                        var repnewpwd = $.trim($('.find-repnewpwd').val());
                        var datachange = {
                            password: $.trim($('.find-oldpwd').val()),
                            newPassword: newpwd
                        };
                        if(newpwd !== repnewpwd) {
                            jh.utils.alert({
                                content: '新密码请保持一致！',
                                ok: true
                            })
                            return false;
                        }
                        jh.utils.ajax.send({
                            url: '/operator/updatePassword',
                            method: 'post',
                            data: datachange,
                            done: function(returnData) {
                                sessionStorage.removeItem('admin-X-Token');
                                sessionStorage.removeItem('admin-uploadToken');
                                sessionStorage.removeItem('admin-username');
                                window.location.href = jh.config.pageLogin;
                            }
                        });
                    },
                    cancel: true
                });
            });

            //重新编辑
            $('body').off('click', '.editFile').on('click', '.editFile', function() {
                jh.utils.load("/src/modules/person/person-center");
            })

            //下载二维码
            $('body').off('click', '.upErweima').on('click', '.upErweima', function() {
                
                var erweimaStr = jh.utils.template('up_erweima_template', {
                    REQUESTROOT: REQUESTROOT,
                    id: _this.userId
                });
                jh.utils.alert({
                    content: erweimaStr,
                    ok: true,
                    cancel: true
                });

            })
        };
    }
    module.exports = PersonFile;
});