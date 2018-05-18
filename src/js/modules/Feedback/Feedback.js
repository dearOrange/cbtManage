/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function Feedback() {
    var _this = this;
    _this.form = $('#Feedback-list-form');
    var searchType = 'loaner';
    this.init = function() {
      this.initContent();
      this.registerEvent();
    };
    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#Feedback_list_container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/content/getProblemList',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: true,
        callback: function(data) {
          console.log(data);
          data.viewImgRoot = jh.config.viewImgRoot;
          data.status = $('#status').val();
          return jh.utils.template('Feedback-list-template', data);
        }
      });
      page.init();
    };
    this.registerEvent = function() {
      // 切换状态
        $('body').off('click','.taskState').on('click','.taskState',function(event,param){
              var me=$(this);
              var val=me.data('value');
              $('#status').val(val);
              $(this).addClass("active").siblings().removeClass("active");
             if (param && param === 'autoClick') {

              } else {
                _this.initContent('tab');
              }
       })
        // 回复
        $('body').off('click','.reply').on('click','.reply',function(){
            var me=$(this);
            var data = me.data('infos');
            var id = $(this).data('id');
            var alertContent=jh.utils.template('feedback-talk',{});
            jh.utils.alert({
              title: '意见反馈',
              okValue:'提交',
              content:alertContent,
              ok: function() {
                 jh.utils.ajax.send({
                    url: '/content/updateAnswer',
                    data:{id:id,content:$('#talkDatail').val()},
                    done:function(res){
                      console.log(res);
                       jh.utils.alert({
                        content: '上传意见成功',
                        ok: function() {
                          _this.initContent();
                        }
                      })
                    }
                 })
              },
              cancel: true
          })
        })
    };
  }
  module.exports = Feedback;
});