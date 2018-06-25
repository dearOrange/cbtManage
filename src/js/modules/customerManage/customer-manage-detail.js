/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CustomerManageDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/upstreams/detail',
                data: {
                    upstreamId: args.id
                },
                done: function(returnData) {
                  returnData.menuState = jh.utils.menuState;
                  returnData.viewImgRoot = jh.config.viewImgRoot;
                  returnData.REQUESTROOT = REQUESTROOT;
                  returnData.upstreamId = args.id;
                  returnData.token = sessionStorage.getItem('admin-X-Token');
                  var html = jh.utils.template('task_manage_detail_template', returnData);
                  $('.taskManageContent').html(html);
                  
                  //批量导入
                  jh.utils.uploader.init({
                    server: REQUESTROOT + '/task/import',
                    pick: {
                      id: '#importFile'
                    },
                    accept: {
                      title: 'Applications',
                      extensions: 'xls,xlsx',
                      mimeTypes: 'application/xls,application/xlsx'
                    },
                    formData: {
                      upstreamId: args.id,
                      token: sessionStorage.getItem('admin-X-Token')
                    }
                  }, {
                    uploadAccept: function(file, response) {
                      // alert(response.data);
                    }
                  });
        
                  _this.initLinkList();
                  _this.initTaskList();
                  
                  // 搜索
                  jh.utils.validator.init({
                    id: 'customer-detail-form',
                    submitHandler: function(form) {
                      _this.initTaskList(true);
                      return false;
                    }
                  });
                  
                  $('select').select2({
                    minimumResultsForSearch: Infinity
                  });
                }
            });
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
        
        this.initTaskList = function(isSearch) {
          //任务记录列表
          var taskForm = jh.utils.formToJson($('#customer-detail-form'));
          taskForm.upstreamId = args.id;
          var pageTask = new jh.ui.page({
            data_container: $('#subTask_container'),
            page_container: $('#page_task_container'),
            method: 'post',
            isSearch: isSearch,
            url: '/task/upstreamTask',
            contentType: 'application/json',
            data: taskForm,
            callback: function(data) {
              return jh.utils.template('taskSubtotal_template', data);
            }
          });
          pageTask.init();
        };
        
        this.registerEvent = function() {
          //    任务校验
          $('body').off('click', '#taskCheckout').on('click', '#taskCheckout', function() {
            $('#fileUpload').val('');
            $('#fileUpload').click();
            $('#fileUpload').change(function(){
              $("#uploadimg-form").submit();
              return false;
            })
          })
      
          $('body').off('change', '#taskTypeFlag').on('change', '#taskTypeFlag', function() {
            var me = $(this);
            var val = me.val();
            if (val === 'recycle') {
              $('#dwLocation').removeClass('hide').prev().removeClass('hide');
            } else {
              $('#dwLocation').addClass('hide').prev().addClass('hide');
            }
          });
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
                if(!dataForm.contacts){
                  jh.utils.alert({
                    content: '请输入联系对象',
                    ok: true
                  })
                  return false;
                }
                if(!dataForm.contactPhone){
                  jh.utils.alert({
                    content: '请输入联系方式',
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
                dataForm.upstreamId = args.id;
                jh.utils.ajax.send({
                  url: '/record/addContact',
                  data: dataForm,
                  done: function(returnData) {
                    jh.utils.alert({
                      content: '联系小计添加成功',
                      ok: function() {
                        _this.initContent();
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
    
          //协助任务发布
          $('body').off('click', '.helpTask').on('click', '.helpTask', function() {
            var me = $(this);
            var alertInfo = jh.utils.template('creditor-publishTask-template', {});
            jh.utils.alert({
              content: alertInfo,
              ok: function() {
                $('#creditor-publishTask-form').submit();
                return false;
              },
              cancel: true
            });
            //表单绑定提交事件
            jh.utils.validator.init({
              id: 'creditor-publishTask-form',
              submitHandler: function(form) {
                //禁止重复提交
                if ($(form).hasClass('disabled')) {
                  return false;
                }
                $(form).addClass('disabled');
    
                var datas = jh.utils.formToJson(form);
                datas.carNumber = datas.carNumber_province + datas.add_carNumber;
    
                if (!datas.attachment) {
                  datas.attachment = [];
                }
                if (!datas.courtDecision) {
                  datas.courtDecision = [];
                }
    
                datas.attachment = jh.utils.isArray(datas.attachment) ? datas.attachment : [datas.attachment];
                datas.courtDecision = jh.utils.isArray(datas.courtDecision) ? datas.courtDecision : [datas.courtDecision];
    
    
                datas.upstreamId = args.id;
                delete datas.carNumber_province;
                delete datas.add_carNumber;
                if(datas.debtorIdNumber) {
                  var regex1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
                  var regex2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
                  datas.debtorIdNumber = datas.debtorIdNumber.replace(/\s/g, '');
                  if(!(regex1.test(datas.debtorIdNumber)) && !(regex2.test(datas.debtorIdNumber))){
                    jh.utils.alert({
                      content:'请输入正确的身份证号',
                      ok:true
                    })
                    return false;
                  }
                }
                jh.utils.ajax.send({
                  url: '/task/helpIssue',
                  method: 'post',
                  contentType: 'application/json',
                  data: datas,
                  done: function() {
                    jh.utils.alert({
                      content: '任务发布成功！',
                      ok: function() {
                        _this.initTaskList();
                        jh.utils.closeArt(); //关闭所有弹窗
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
                content: '请选择需要关闭的任务！',
                ok: true,
                cancel: false
              });
              return false;
            }
            jh.utils.alert({
              content: '确定关闭吗？',
              ok: function() {
                jh.utils.ajax.send({
                  url: '/task/helpDel',
                  data: {
                    taskIds: removeId
                  },
                  done: function(returnData) {
                    jh.utils.alert({
                      content: '已关闭',
                      ok: function() {
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
          
    //    任务记录详情
          $('body').off('click', '.record-detail').on('click', '.record-detail', function() {
            var tid = $(this).data('id');
            jh.utils.load("/src/modules/customerManage/creditor-task-detail", {
                id: tid
            })
          });
          //    任务记录编辑
          $('body').off('click', '.record-distribution').delegate('.record-distribution', 'click', function() {
            var eid = $(this).data('id');
    
            jh.utils.load("/src/modules/customerManage/customer-edit", {
                id: eid
            })
          });
        };
    }
    module.exports = CustomerManageDetail;
});