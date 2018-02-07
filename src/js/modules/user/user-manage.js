/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function UserManage() {
        var _this = this;
        _this.form = $('#user-manage-form');

        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#user_manage_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/operator/list',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('userManage_content_template', data);
                }
            });
            page.init();
        };

        this.registerEvent = function() {
            // 搜索
            jh.utils.validator.init({
                id: 'user-manage-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            $('body').off('change', '#select-person').on('change', '#select-person', function() {
                _this.selectValue = $('#select-person').val();
                if (_this.selectValue === 'channel') {
                    $('.address-select').css('display', 'block');
                } else {
                    $('.address-select').css('display', '');
                }
            })

            //新建
            $('.addUser').click(function() {
                var arr = [];
                $.each(jh.config.citylist, function(index, item) {
                    arr.push({
                        provinceCode: item.pid,
                        provinceName: item.p
                    });
                });
                var newTemplate = jh.utils.template('new-increate-template', { list: arr });
                jh.utils.alert({
                    title: '新建用户',
                    content: newTemplate,
                    okValue: '下一步',
                    ok: function() {
                        if ($('.next-content').is(':visible')) {
                            if (!$('#usernameTxt').val() && !$('#nameTxt').val()) {
                                jh.utils.alert({
                                    content: '请填写用户信息',
                                    ok: true
                                })
                                return false;
                            }

                            var formData = jh.utils.formToJson($('#newincreate-form'));
                            var arrs = [];
                            var valueArr = formData.operatorProvinceDtoList;
                            if (_this.selectValue === 'channel') {
                                if (!valueArr) {
                                    jh.utils.alert({
                                        content: '请选择省份',
                                        ok: true
                                    })
                                    return false;
                                }
                            }
                            valueArr = jh.utils.isArray(valueArr) ? valueArr : [valueArr];
                            var ids = jh.utils.getCheckboxValue('newincreate-form', 'value');
                            for (var a = 0; a < valueArr.length; a++) {
                                var provinceType = valueArr[a].split('-');
                                arrs.push({
                                    provinceCode: provinceType[0],
                                    provinceName: provinceType[1]
                                })
                            }
                            formData.operatorProvinceDtoList = arrs;
                            jh.utils.ajax.send({
                                method: 'post',
                                url: '/operator/create',
                                contentType: 'application/json',
                                data: formData,
                                done: function(data) {
                                    jh.utils.alert({
                                        content: '添加成功',
                                        ok: function() {
                                            window.location.reload();
                                        }
                                    })
                                }
                            })
                        }
                        $('.next-content').css('display', 'block');
                        $('.new-increate').css('display', 'none');

                        //获取省code
                        jh.utils.ajax.send({
                            url: '/operator/getOperatorProvince',
                            done: function(data) {
                                var areaCode = data.data;
                                for (var i = 0; i < arr.length; i++) {
                                    var provinceCodeArr = arr[i].provinceCode;
                                    for (var j = 0; j < areaCode.length; j++) {
                                        var provinceAreaCode = areaCode[j].provinceCode;
                                        if (provinceCodeArr === provinceAreaCode) {
                                            $('#checkArea' + i).attr('disabled', true);
                                        }
                                    }
                                }
                            }
                        })

                        return false;
                    }
                });
            });

            //编辑
            $('.dataAudit').off('click', '.edit-user').on('click', '.edit-user', function() {
                var id = $(this).data('id');
                var arrEdit = [];
                $.each(jh.config.citylist, function(index, item) {
                    arrEdit.push({
                        provinceCode: item.pid,
                        provinceName: item.p
                    });
                });
                //获取省code
                jh.utils.ajax.send({
                    url: '/operator/getOperatorProvince',
                    data: {
                        channelId: id
                    },
                    done: function(data) {
                        var editCode = data.data;
                        for (var i = 0; i < arrEdit.length; i++) {
                            var provinceCodeEdit = arrEdit[i].provinceCode;
                            for (var j = 0; j < editCode.length; j++) {
                                var provinceEditCode = editCode[j].provinceCode;
                                if (provinceCodeEdit === provinceEditCode && editCode[j].isSelected === 0) {
                                    $('#editArea' + i).attr('disabled', true);
                                }
                                if (provinceCodeEdit === provinceEditCode && editCode[j].isSelected === 1) {
                                    $('#editArea' + i).attr('checked', true);
                                }
                            }
                        }
                    }
                });
                var infos = $(this).data('infos');
                var editTemplate = jh.utils.template('edit_usermanage_template', { data: infos, list: arrEdit });
                jh.utils.alert({
                    content: editTemplate,
                    ok: function() {
                        var editData = jh.utils.formToJson($('#edit-user-form'));
                        var editarr = [];
                        if (infos.type === "channel") {
                            var valueEdit = editData.operatorProvinceDtoList;
                            if (!valueEdit) {
                                jh.utils.alert({
                                    content: '请选择省份',
                                    ok: true
                                })
                                return false;
                            }
                            valueEdit = jh.utils.isArray(valueEdit) ? valueEdit : [valueEdit];
                            for (var b = 0; b < valueEdit.length; b++) {
                                var provinceEdit = valueEdit[b].split('-');
                                editarr.push({
                                    provinceCode: provinceEdit[0],
                                    provinceName: provinceEdit[1]
                                })
                            }
                        };
                        editData.operatorProvinceDtoList = editarr;
                        editData.operatorId = infos.id;
                        jh.utils.ajax.send({
                            method: 'post',
                            url: '/operator/edit',
                            data: editData,
                            contentType: 'application/json',
                            done: function(data) {
                                jh.utils.alert({
                                    content: '编辑成功',
                                    ok: function() {
                                        _this.initContent();
                                    }
                                })
                            }
                        })
                    },
                    cancel: true
                });
            });

            //开启状态
            $('body').off('click', '.btn-status').on('click', '.btn-status', function() {
                var statusId = $(this).data("id");
                var className = $('.btn-father').find('.openStatus');
                var statusNum = className.length == 1 ? 0 : 1;
                jh.utils.ajax.send({
                    url: '/operator/status',
                    data: {
                        operatorId: statusId,
                        status: statusNum
                    },
                    done: function(data) {
                        if (statusNum == 0) {
                            $('.btn-status').addClass('closeStatus').removeClass('openStatus');
                        } else {
                            $('.btn-status').removeClass('closeStatus').addClass('openStatus');
                        }
                    }
                })
            });
        };
    }
    module.exports = UserManage;
});