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
          data.viewImgRoot = jh.config.viewImgRoot;
          data.dataVal = $('#tabType').val();
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
        var url = REQUESTROOT + '/exchange/export' + '?' + datas + '&token=' + XToken;
        window.location.href = url;
      });

      //切换状态
      $('body').off('click', '.taskState').on('click', '.taskState', function(event, param) {
        var mine = $(this);
        var val = mine.data('value');
        $(this).addClass("active").siblings().removeClass("active");
        $('#tabType').val(val);
        if (param && param === 'autoClick') {

        } else {
          _this.initContent('tab');
        }
        if(val==2){
           $('.charge_title').addClass('hide');
           $('.charge_titles').removeClass('hide');
           $('.labelTime').addClass('hide');
           $('.labelTimes').removeClass('hide');
        }else{  
            $('.charge_title').removeClass('hide');
            $('.charge_titles').addClass('hide');
            $('.labelTime').removeClass('hide');
            $('.labelTimes').addClass('hide');
           
        }
      })

      //充值
      var selectVal=1;
      $('body').off('click', '.changer').on('click', '.changer', function() {
        var me = $(this);
        var data = me.data('infos');
        console.log(data);
        data.viewImgRoot = jh.config.viewImgRoot;
        var id = $(this).data('id');
        
      
        var alertContent = jh.utils.template('leaderboard_charge_template', data);
        jh.utils.alert({
              content:alertContent,
              ok: function() {
                 jh.utils.ajax.send({
                    url: '/exchange/sure',
                    data:{exchangeId:id},
                    done:function(res){
                       jh.utils.alert({
                        content: '充值成功',
                        ok: function() {
                          _this.initContent();
                        }
                      })
                    }
                 })
              },
              cancel: true
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
      // 充值作废
      $('body').off('click','.abate').on('click','.abate',function(){
        var me=$(this);
        var data = me.data('infos');
        var id = $(this).data('id');
        console.log(id);
        var alertContent=jh.utils.template('leaderboard_abate_template',data)
           jh.utils.alert({
             content:alertContent,
             ok:function(){
              var reason=$('.abate_input').val()?$('.abate_input').val():'';
              console.log(reason);
                jh.utils.ajax.send({
                   url:'/exchange/cancel',
                   data:{exchangeId:id,reason:reason},
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
      
      
    }
  }
  module.exports = Leaderboard;
});