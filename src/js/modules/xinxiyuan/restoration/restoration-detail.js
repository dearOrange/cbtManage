/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function RestorationDetail() {
    var _this = this;
    _this.baileePrice = 0;
    _this.assetPrice = 0;
    _this.numPlus = 0;
    _this.num = 0;
    _this.form = $('#restoration-detail-form');
    var args = jh.utils.getURLValue().args;

    this.init = function() {
      this.initContent();
      this.allType();
      this.registerEvent();
    };
    this.registerEvent = function() {
        //费用类型
        $('body').off('change', '#unconfirmedType').on('change', '#unconfirmedType', function() {
          var me = $(this);
          var type = me.val(), thirdpartyPrice = $('#thirdpartyPrice'), assetPrice = $('#assetPrice');
          $('#finalPrice').val('');
          $('#baileePrice').val('');
          if(type === 'all' || type === 'recycle'){
            thirdpartyPrice.addClass('required').parent().removeClass('hide');
            thirdpartyPrice.val('');
            if(_this.assetPrice === '') {
              assetPrice.val('');
            }
            _this.allType();
          }else{
            thirdpartyPrice.removeClass('required').parent().addClass('hide');
            thirdpartyPrice.val(0);
            if(_this.assetPrice === '') {
              assetPrice.val('');
            }
            _this.traceType();
          }
        });
      
    };
    this.allType = function() {
      $('body').off('change', '#finalPrice').on('change', '#finalPrice', function() {
        var me = $(this), baileePrice = $('#baileePrice');
        _this.num = parseFloat($.trim(me.val()));//总处置费
        if (isNaN(_this.num)) {
          return false;
        }
        if (!_this.num) {
          baileePrice.val('');
          return false;
        } else {
          baileePrice.val((_this.num * 0.1).toFixed(2));//如果本身已经填写过费用，则不再重新计算，以填写的为准
        }
        _this.numPlus = _this.num - baileePrice.val();
        var assetPrice = _this.numPlus - $('#assetPrice').val();
        assetPrice = assetPrice < 0 ? 0 : assetPrice;
        if(_this.assetPrice === '') {
          $('#assetPrice').change(function() {
            $('#thirdpartyPrice').val(assetPrice);
          })
        } else {
          $('#thirdpartyPrice').val(assetPrice);
        }
      });
    };
    this.traceType = function() {
      $('body').off('change', '#finalPrice').on('change', '#finalPrice', function() {
        var me = $(this), baileePrice = $('#baileePrice');
        _this.num = parseFloat($.trim(me.val()));//总处置费
        if (isNaN(_this.num)) {
          return false;
        }
        if (!_this.num) {
          baileePrice.val('');
          return false;
        } else {
          if(_this.assetPrice === '') {
            baileePrice.val((_this.num * 0.1).toFixed(2));//如果本身已经填写过费用，则不再重新计算，以填写的为准
            _this.numPlus = _this.num - baileePrice.val();
            $('#assetPrice').val(_this.numPlus);
          } else {
            _this.numPlus = _this.num - $('#assetPrice').val();
            baileePrice.val(_this.numPlus);
          }
        }
        
      });
    };
    this.initValidator = function() {
      // 表单绑定
      jh.utils.validator.init({
        id: 'restoration-detail-form',
        submitHandler: function(form) {
          form = $(form);
          var datas = jh.utils.formToJson(form);
          var submit = form.find('input[type="submit"]');
          var arr = submit.hasClass('priceStorage') ? '/task/estimate,价格预估完毕' : '/task/fixPrice,价格确认完毕';
          arr = arr.split(',');
          jh.utils.ajax.send({
            url: arr[0],
            data: datas,
            done: function(returnData) {
              jh.utils.alert({
                content: arr[1],
                ok: function() {
                  jh.utils.load('/src/modules/xinxiyuan/restoration/restoration-list');
                }
              });
            }
          });
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
          _this.returnData = returnData.data;
          returnData.menuState = jh.utils.menuState;
          returnData.viewImgRoot = jh.config.viewImgRoot;
          returnData.taskId = args.id;
          returnData.baileePrice = (parseFloat(returnData.data.finalPrice) * 0.1).toFixed(2);
          var creditorStr = jh.utils.template('restoration_detail_template', returnData);
          $('.restorationContent').html(creditorStr);
          if(_this.returnData.entrust === 'trace') {
            $('.thirdpartyPrice_box').addClass('hide');
          } else {
            $('.thirdpartyPrice_box').removeClass('hide');
          }
          _this.baileePrice = returnData.baileePrice;
          _this.assetPrice = returnData.data.assetPrice;
          _this.num = parseFloat($.trim($('#finalPrice').val()));
          _this.numPlus = _this.num - $('#baileePrice').val();

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
  module.exports = RestorationDetail;
});