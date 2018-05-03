/**
 * OpenList
 * @authors jiaguisshan
 * @date    2017-11-28 16:22:12
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CreditorEdit() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        _this.selectData = '';
        this.init = function() {
            this.registerEvent();
            $('select').select2({
                minimumResultsForSearch: Infinity
            });
        };
        
        this.registerEvent = function() {
          jh.utils.ajax.send({
              url: '/task/business/detail',
              data: {
                  taskId: args.id
              },
              done: function(returnData) {
                _this.selectData = returnData.data;
                  returnData.menuState = jh.utils.menuState;
                  returnData.viewImgRoot = jh.config.viewImgRoot;
                  var str = jh.utils.template('customer-editTask-template', returnData);
                  $('#customer-editTask-form').html(str);
                  
                  //初始化新增任务时上传附件按钮
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
                            var selectStr = _this.selectData.carBrand === item.name ? 'selected' : '';
                            str += '<option value="' + item.name + '" ' + selectStr + ' data-id="' + item.id + '">' + item.sort + "&nbsp;&nbsp;&nbsp;" + item.name + '</option>';
                          });
                          $('#customer-editTask-carBrand').html(str);
                          if(_this.selectData.carBrand !== '未知') {
                            $('#customer-editTask-carBrand').trigger('change', 'autoClick');
                          }
                      }
                  });

              }
          });
          
          //品牌更改 初始化车系
          $('body').off('change', '#customer-editTask-carBrand').on('change', '#customer-editTask-carBrand', function(event, type) {
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
                        var selectCarSeries = _this.selectData.carSeries === item.name ? 'selected' : '';
                        if(type === 'autoClick') {
                          selectCarSeries = _this.selectData.carSeries === item.name ? 'selected' : '';
                        }else {
                          selectCarSeries = '';
                        }
                        str += '<option value="' + item.name + '" ' + selectCarSeries + ' data-id="' + item.id + '">' + item.name + '</option>';
                      });
                      $('#customer-editTask-carSeries').html(str);
                      if(_this.selectData.carSeries !== '未知' && type === 'autoClick') {
                        $('#customer-editTask-carSeries').trigger('change');
                      } else {
                        $('#customer-editTask-carModel').html('<option value="" data-id="">请选择车型</option>');
                      }
                  }
              });
              $('#carBrandIds').val(id);
          });
          //车系更改 初始化车型
          $('body').off('change', '#customer-editTask-carSeries').on('change', '#customer-editTask-carSeries', function(event, type) {
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
                        var selectCarModel = _this.selectData.carModel === item.name ? 'selected' : '';
                        str += '<option value="' + item.name + '" ' + selectCarModel + ' data-id="' + item.id + '">' + item.name + '</option>';
                      });
                      $('#customer-editTask-carModel').html(str);
                      $('#customer-editTask-carModel').trigger('change');
                  }
              });
              $('#carSeriesIds').val(id);
          });
          //车型更改
          $('body').off('change', '#customer-editTask-carModel').on('change', '#customer-editTask-carModel', function() {
              var me = $(this);
              var id = me.find('option:selected').data('id');
              $('#carModelIds').val(id);
          });
          
          
          
          jh.utils.validator.init({
              id: 'customer-editTask-form',
              submitHandler: function(form) {
                  //禁止重复提交
                  if ($(form).hasClass('disabled')) {
                      return false;
                  }
                  $(form).addClass('disabled');

                  //数据处理
                  var datas = jh.utils.formToJson(form);
                  
                  if( !datas.courtDecision){
                      datas.courtDecision = [];
                  }
                  
                  if( !datas.attachment){
                      datas.attachment = [];
                  }

                  datas.attachment = jh.utils.isArray(datas.attachment) ? datas.attachment : [datas.attachment];
                  datas.courtDecision = jh.utils.isArray(datas.courtDecision) ? datas.courtDecision : [datas.courtDecision];
                  datas.taskId = args.id;
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
                      url: '/task/helpEdit',
                      method: 'post',
                      contentType: 'application/json',
                      data: datas,
                      done: function() {
                          jh.utils.alert({
                              content: '任务编辑成功！',
                              ok: function() {
                                window.history.go(-1);
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

            
        };
    }
    module.exports = CreditorEdit;
});