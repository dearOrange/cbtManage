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
        var args = jh.utils.getURLValue().args;
		_this.userInfo = null;
        this.init = function() {
            this.initContent();
            this.registerEvent();
            this.getUserinfo();
        };

        this.initLinkList = function() {
            //联系小计列表
            var page = new jh.ui.page({
                data_container: $('#subtotal_container'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/record/contactList',
                contentType: 'application/json',
                data: {
                    upstreamId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('addSubtotal_template', data);
                }
            });
            page.init();
        };

        this.initTaskList = function() {
            //任务记录列表
            var pageTask = new jh.ui.page({
                data_container: $('#subTask_container'),
                page_container: $('#page_task_container'),
                method: 'post',
                isSearch: true,
                url: '/task/upstreamTask',
                contentType: 'application/json',
                data: {
                    upstreamId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('taskSubtotal_template', data);
                }
            });
            pageTask.init();
        };
		this.getUserinfo = function(){
			jh.utils.ajax.send({
                url: '/upstreams/detail',
                data: {
                    upstreamId: args.id
                },
                done: function(returnData) {
                	_this.userInfo = returnData.data;
                }
          	})
		};
        this.initContent = function() {
            jh.utils.ajax.send({
                url: '/upstreams/detail',
                data: {
                    upstreamId: args.id
                },
                done: function(returnData) {
                    returnData.menuState = jh.utils.menuState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    var creditorStr = jh.utils.template('admin_creditorDetail_template', returnData);
                    $('.detail-content').html(creditorStr);

                    //批量导入
                    jh.utils.uploader.init({
                        server: REQUESTROOT + '/task/import',
                        pick: {
                            id: '#importFile'
                        },
                        formData:{
                            upstreamId:  args.id,
                            token: sessionStorage.getItem('admin-X-Token')
                        },
                        accept: {
                            title: 'Applications',
                            extensions: 'xls,xlsx',
                            mimeTypes: 'application/xls,application/xlsx'
                        }
                    }, {
                        uploadAccept: function(file, response) {
                            alert(response.data)
                        }
                    });

                    _this.initLinkList();
                    _this.initTaskList();
                }
            });
        };
        this.registerEvent = function() {
            //添加小计
            $('body').off('click', '.addSubtotal').on('click', '.addSubtotal', function() {
                var addStr = jh.utils.template('creditor_addSubtotal_template', {});
                jh.utils.alert({
                	title: '添加联系小计',
                    content: addStr,
                    ok: function() {
                        $('#sub-customer-form').submit();
                        return false;
                    }
                });
                
                jh.utils.validator.init({
                    id: 'sub-customer-form',
                    submitHandler: function(form) {
                        var dataForm = jh.utils.formToJson($('#sub-customer-form'));
                        dataForm.upstreamId = args.id;
                        jh.utils.ajax.send({
                            url: '/record/addContact',
                            data: dataForm,
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '联系小计添加成功',
                                    ok: function(){
                                        _this.initLinkList();
                                        jh.utils.closeArt();
                                    },
                                    cancel: false
                                });
                            }
                        });
                        return false;
                    }
                });
            })

            //客户标签
            $('body').off('click', '.addstorage').on('click', '.addstorage', function() {
                jh.utils.ajax.send({
                    url: '/upstreams/updateTag',
                    data: {
                        tag: $.trim($('#creditor-managerDetail-label').val()),
                        upstreamId: args.id
                    },
                    done: function(returnData) {
                        jh.utils.alert({
                            content: '客户标签保存成功',
                            ok: true,
                            cancel: false
                        });
                    }
                });
            })

            //协助任务发布
            $('body').off('click', '.helpTask').on('click', '.helpTask', function() {
                var me = $(this);
                var alertInfo = jh.utils.template('creditor-xzPublishTask-template', {});
                jh.utils.alert({
                    content: alertInfo,
                    ok: function() {
                        $('#creditor-xzPublishTask-form').submit();
                        return false;
                    },
                    cancel: true
                });
				if(_this.userInfo.type === 'UPSTREAM_PERSONAL'){
	            	$('.addHide').removeClass('hide');
	            }else{
	            	$('.addHide').addClass('hide');
	            }
                //表单绑定提交事件
                jh.utils.validator.init({
                    id: 'creditor-xzPublishTask-form',
                    submitHandler: function(form) {
                    	
                    	//禁止重复提交
                        if ($(form).hasClass('disabled')) {
                            return false;
                        }
                        $(form).addClass('disabled');
                    	
                        var datas = jh.utils.formToJson(form);
                        datas.carNumber = datas.carNumber_province + datas.add_carNumber;
                        
                        //如果是个人则必须上传法院判决书
                        if( _this.userInfo.type === 'UPSTREAM_PERSONAL' && !datas.courtDecision ){
                            jh.utils.confirm({
                                content: '请上传法院判决书',
                            });
                            $(form).removeClass('disabled');
                            return false;
                        }
                        
                        if( !datas.attachment){
                            datas.attachment = [];
                        }

                        datas.attachment = jh.utils.isArray(datas.attachment) ? datas.attachment : [datas.attachment];
                        if( _this.userInfo.type === 'UPSTREAM_PERSONAL'){
                            datas.courtDecision = jh.utils.isArray(datas.courtDecision) ? datas.courtDecision : [datas.courtDecision];
                        }
                        
                        
                        datas.upstreamId = args.id;
                        delete datas.carNumber_province;
                        delete datas.add_carNumber;
                        jh.utils.ajax.send({
                            url: '/task/helpIssue',
                            method: 'post',
                            contentType: 'application/json',
                            data: datas,
                            done: function() {
                                jh.utils.alert({
                                    content: '任务发布成功！',
                                    ok: function(){
                                    	_this.initTaskList();
                                    	jh.utils.closeArt();//关闭所有弹窗
                                    },
                                    cancel: false
                                });
                            },
                            fail: function() {
                                $(form).removeClass('disabled');
                            }
                        });
                        return false;
                    }
                });

                jh.utils.uploader.init({
                	fileNumLimit: 15,
                    pick: {
                        id: '#attachment'
                    }
                });
                
                jh.utils.uploader.init({
                    fileNumLimit: 10,
                    pick: {
                        id: '#courtDecision'
                    }
                });

                //初始化品牌
                jh.utils.ajax.send({
                    url: '/car/brand',
                    done: function(result) {
                        var str = '<option value="" data-id="">请选择品牌</option>';
                        $.each(result.data, function(index, item) {
                            str += '<option value="' + item.name + '" data-id="' + item.id + '">' + item.name + '</option>';
                        });
                        $('#customer-addTask-carBrand').html(str);
                    }
                });
            });

            //删除
            $('body').off('click', '#removeFile').on('click', '#removeFile', function() {
                var removeId = jh.utils.getCheckboxValue('subTask_container', "value");
                if (!removeId) {
                    jh.utils.alert({
                        content: '请选择需要删除的任务！',
                        ok: true,
                        cancel: false
                    });
                    return false;
                }
                jh.utils.alert({
                    content: '确定删除吗？',
                    ok: function() {
                        jh.utils.ajax.send({
                            url: '/task/helpDel',
                            data: {
                                taskIds: removeId
                            },
                            done: function(returnData) {
                                jh.utils.alert({
                                    content: '已删除',
                                    ok: function(){
                                    	_this.initTaskList();
                                    }
                                })
                            }
                        });
                    },
                    cancel: true
                })
            });

            //品牌更改 初始化车系
            $('body').off('change', '#customer-addTask-carBrand').on('change', '#customer-addTask-carBrand', function() {
                var me = $(this);
                var id = me.find('option:selected').data('id');
                jh.utils.ajax.send({
                    url: '/car/series',
                    data: {
                        brandId: id
                    },
                    done: function(result) {
                        var str = '<option value="" data-id="">请选择车系</option>';
                        $.each(result.data, function(index, item) {
                            str += '<option value="' + item.name + '" data-id="' + item.id + '">' + item.name + '</option>';
                        });
                        $('#customer-addTask-carSeries').html(str);
                    }
                });
                $('#carBrandId').val(id);
            });
            //车系更改 初始化车型
            $('body').off('change', '#customer-addTask-carSeries').on('change', '#customer-addTask-carSeries', function() {
                var me = $(this);
                var id = me.find('option:selected').data('id');
                jh.utils.ajax.send({
                    url: '/car/model',
                    data: {
                        seriesId: id
                    },
                    done: function(result) {
                        var str = '<option value="" data-id="">请选择车型</option>';
                        $.each(result.data, function(index, item) {
                            str += '<option value="' + item.name + '" data-id="' + item.id + '">' + item.name + '</option>';
                        });
                        $('#customer-addTask-carModel').html(str);
                    }
                });
                $('#carSeriesId').val(id);
            });
            //车型更改
            $('body').off('change', '#customer-addTask-carModel').on('change', '#customer-addTask-carModel', function() {
                var me = $(this);
                var id = me.find('option:selected').data('id');
                $('#carModelId').val(id);
            });
        };
    }
    module.exports = CreditorManageDetail;
});