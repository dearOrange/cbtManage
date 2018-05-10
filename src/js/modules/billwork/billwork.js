/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function BillWork() {
    var _this = this;
    _this.form = $('#billWork-list-form');
    var searchType = 'loaner';
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };
    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#billWork_list_container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/workorder/list',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          return jh.utils.template('billWork-list-template', data);
        }
      });
      page.init();
    };
    this.registerEvent = function() {
      // 搜索
      jh.utils.validator.init({
        id: 'billWork-list-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });

      $('.dataContent').off('click', '#exportSendMoney').on('click', '#exportSendMoney', function() {
        var datas = _this.form.serialize();
        var XToken = encodeURIComponent(sessionStorage.getItem('admin-X-Token'));
        var url = REQUESTROOT + '/withdraw/export' + '?' + datas + '&token=' + XToken;
        window.location.href = url;
      });

      //切换状态
      $('body').off('click', '.taskState').on('click', '.taskState', function(event, param) {
        var mine = $(this);
        var val = mine.data('value');
        $(this).addClass("active").siblings().removeClass("active");
        $('#tabType').val(val)
        if (param && param === 'autoClick') {

        } else {
          _this.initContent('tab');
        }
        if(val === 2){
          $('.bill-state').addClass('hide');
          $('.bills-state').removeClass('hide');
        }else{
          $('.bill-state').removeClass('hide');
          $('.bills-state').addClass('hide');
        }
      })

      //打款
      $('body').off('click', '.sendMoney').on('click', '.sendMoney', function() {
        var me = $(this);
        var data = me.data('infos');
        data.viewImgRoot = jh.config.viewImgRoot;
        var alertContent = jh.utils.template('billWork_sure_template', data);
        var id = $(this).data('id');
        jh.utils.alert({
          content: alertContent,
          ok: function() {
            var datas = jh.utils.formToJson($('#play-money-form'));
            datas.drawId = id;
            jh.utils.ajax.send({
              url: '/withdraw/confirm',
              data: datas,
              done: function(returnData) {
                jh.utils.alert({
                  content: '已打款',
                  ok: function() {
                    _this.initContent();
                  }
                })
              }
            });
          },
          cancel: true
        });
        var picArr = ['voucher1', 'voucher2', 'voucher3'];
        for (var i = 0; i < 3; i++) {
          jh.utils.uploader.init({
            isAppend: false,
            pick: {
              id: '#' + picArr[i]
            }
          });
        };
      });
      $('body').off('click', '#selectPay').on('click', '#selectPay', function() {
        var selectVal = $("#selectPay").val();
        $('.changePaystyle').eq(selectVal - 1).attr("id", "payStyle").siblings().removeAttr("id");
      });
    };
  }
  module.exports = BillWork;
});