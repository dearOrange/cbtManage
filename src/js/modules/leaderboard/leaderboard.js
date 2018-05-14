/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function Leaderboard() {
    var _this = this;
    _this.form = $('#leaderboard-list-form');
    var searchType = 'loaner';
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };
    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#leaderboard_list_container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/exchange/list',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          return jh.utils.template('leaderboard-list-template', data);
        }
      });
      page.init();
    };
    this.registerEvent = function() {
      // 搜索
      jh.utils.validator.init({
        id: 'leaderboard-list-form',
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
        
      })

      //充值
      var selectVal=1;
      $('body').off('click', '.changer').on('click', '.changer', function() {
        var me = $(this);
        var data = me.data('infos');
        data.viewImgRoot = jh.config.viewImgRoot;
        var id = $(this).data('id');
        var 
        // jh.utils.ajax.send({
        //   url: '/workorder/loanDetail',
        //   data:{workorderId:id},
        //   done:function(res){
        //      var res=res.data;
        //      console.log(res);
        //      if(res.role=="type_A"){
        //        res.role='线人';
        //      }else if(res.role=="type_B"){
        //          res.role='捕头';
        //      }else{
        //        res.role='自有线人';
        //      }
        //      var alertContent = jh.utils.template('billWork_sure_template', res);
        //      jh.utils.alert({
        //   content: alertContent,
        //   ok: function() {
        //     var datas = jh.utils.formToJson($('#play-money-form'));
        //     datas.drawId = id;
        //     jh.utils.ajax.send({
        //       url: '/workorder/loan',
        //       data:{workorderId:id,payType:selectVal},
        //       done: function(returnData) {
        //         console.log(returnData);
        //         jh.utils.alert({
        //           content: '已打款',
        //           ok: function() {
        //             _this.initContent();
        //           }
        //         })
        //       }
        //     });
        //   },
        //   cancel: true
        // });
        //   }
        // })
        
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
      // 放款作废
      $('body').off('click','.abate').on('click','.abate',function(){
        var me=$(this);
        var data = me.data('infos');
        var id = $(this).data('id');
        console.log(id);
        var alertContent=jh.utils.template('billWork_abate_template',data)
           jh.utils.alert({
             content:alertContent,
             ok:function(){
              var reason=$('.abate_input').val()?$('.abate_input').val():'';
              console.log(reason);
                jh.utils.ajax.send({
                   url:'/workorder/loanCancel',
                   data:{workorderId:id,reason:reason},
                   done:function(res){
                 jh.utils.alert({
                  content: '此单已作废',
                  ok: function(){
                    _this.initContent();
                  }
                })
                   }
                })
             },
             cancel: true
           })
      })
      $('body').off('click', '.pay-type').on('click', '.pay-type', function() {
        $(this).prop('checked',true).parent().siblings().children().prop('checked',false);
        selectVal = $(this).val();
        if(selectVal==1){
          $('.changePaystyle').eq(selectVal - 1).addClass("payStyle").siblings().removeClass("payStyle");
        }else{
          $('.changePaystyle').eq(selectVal - 1).addClass("payStyle");
          $('.changePaystyle').eq(selectVal).addClass("payStyle");
          $('.changePaystyle').eq(selectVal - 2).removeClass("payStyle");
        }
      });
    };
  }
  module.exports = Leaderboard;
});