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
          data.tabVal = $('#tabType').val();
          return jh.utils.template('billWork-list-template', data);
        }
      });
      page.init();
    };
    this.registerEvent = function() {
      // 搜索
      jh.utils.validator.init({
        id: 'billWork-list-form',
        submitHandler: function(form){
          _this.initContent(true);
          return false;
        }
      });

      $('.dataContent').off('click', '#exportSendMoney').on('click', '#exportSendMoney', function() {
        var datas = _this.form.serialize();
        var XToken = encodeURIComponent(sessionStorage.getItem('admin-X-Token'));
        var url = REQUESTROOT + '/workorder/export' + '?' + datas + '&token=' + XToken;
        window.location.href = url;
      });

      //切换状态
      $('body').off('click', '.taskState').on('click', '.taskState', function(event, param) {
        var mine = $(this);
        var val = mine.data('value');
        $(this).addClass("active").siblings().removeClass("active");
        $('#tabType').val(val);
        var str1 = '<option value="">全部</option><option value="wait">未打款</option><option value="completed">已打款</option><option value="rejected">已拒绝</option>';
        var str2 = '<option value="">全部</option><option value="withdrawing">未到账</option><option value="completed">已到账</option>';
        
              
        if (param && param === 'autoClick') {

        } else {
          _this.initContent('tab');
        }
        if(val === 2){
          $('.timeMoney').html('收款时间');
          $('.bill-state').addClass('hide');
          $('.bills-state').removeClass('hide');
          $('#bill-state').html(str2);
        }else{
          $('.timeMoney').html('放款时间');
          $('.bills-state').addClass('hide');
          $('.bill-state').removeClass('hide');
          $('#bill-state').html(str1);
        }
      })

      //打款
      var selectVal;
      $('body').off('click', '.sendMoney').on('click', '.sendMoney', function() {
        var me = $(this);
        var data = me.data('infos');
        data.viewImgRoot = jh.config.viewImgRoot;
        selectVal=1;
        var id = $(this).data('id');
         var val=$('#tabType').val();
        jh.utils.ajax.send({
          url: '/workorder/loanDetail',
          data:{workorderId:id},
          done:function(res){
             var res=res.data;
           
             var alertContent = jh.utils.template('billWork_sure_template', res);
             if(val==1){
                  jh.utils.alert({
                  content: alertContent,
                  ok: function() {
                    var datas = jh.utils.formToJson($('#play-money-form'));
                    datas.drawId = id;
                    jh.utils.ajax.send({
                      url: '/workorder/loan',
                      data:{workorderId:id,payType:selectVal},
                      done: function(returnData) {
                        console.log(returnData);
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
             }else{
                  jh.utils.alert({
                  content:'您所收款项金额为<span style="color:red">'+res.amount+'</span>元',
                  ok: function() {
                    var datas = jh.utils.formToJson($('#play-money-form'));
                    datas.drawId = id;
                    jh.utils.ajax.send({
                      url: '/workorder/loanerMoneySure',
                      data:{workorderId:id},
                      done: function(returnData) {
                        console.log(returnData);
                        jh.utils.alert({
                          content: '已收款',
                          ok: function() {
                            _this.initContent();
                          }
                        })
                      }
                    });
                  },
                  cancel: true
                }); 
             }
           
          }
        })
        
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
      
      
      $('body').off('click', '.pay-type').on('click', '.pay-type', function(event, param) {
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
  module.exports = BillWork;
});