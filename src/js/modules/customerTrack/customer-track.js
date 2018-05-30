/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function CustomerTrack() {
        var _this = this;
        _this.form = $('#customer-track-form');
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#customer_track_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                method: 'post',
                url: '/record/trackeList',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('customer-track-template', data);
                }
            });
            page.init();
        };
        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            // 搜索
            jh.utils.validator.init({
                id: 'customer-track-form',
                submitHandler: function(form) {
                    _this.initContent(true);
                    return false;
                }
            });

            //添加
            $('body').off('click', '#increate-customer-track').on('click', '#increate-customer-track', function() {
                var increateTrack = jh.utils.template('increate-track-template', {});
                jh.utils.alert({
                  title:'添加跟踪记录',
                  content:increateTrack,
                  okValue:'保存',
                  ok:function(){
                    $('#increate-track-form').submit();
                    return false;
                  },
                  cancel: true
                })
                jh.utils.validator.init({
                  id: 'increate-track-form',
                  submitHandler: function(form) {
                    var increateForm = jh.utils.formToJson(form);
<<<<<<< HEAD
                    console.log(increateForm);
=======
>>>>>>> 3aa14f72a7ec0b71af6d90cc9258b7fab98c48e8
                    if(!increateForm.upstreamName){
                      jh.utils.alert({
                        content: '请输入债权方名称',
                        ok: true
                      })
                      return false;
                    }
                    if(!increateForm.contacts){
                      jh.utils.alert({
                        content: '请输入联系人',
                        ok: true
                      })
                      return false;
                    }
                    if(!increateForm.contactPhone){
                      jh.utils.alert({
                        content: '请输入联系方式',
                        ok: true
                      })
                      return false;
                    }
                    if(!increateForm.traceAt){
                      jh.utils.alert({
                        content: '请输入跟进时间',
                        ok: true
                      })
                      return false;
                    }
                    if(!increateForm.content){
                      jh.utils.alert({
                        content: '请输入跟进内容',
                        ok: true
                      })
                      return false;
                    }
                    jh.utils.ajax.send({
                      method:'post',
                      url: '/record/addTracke',
                      data: increateForm,
                      done: function(returnData){
                        jh.utils.alert({
                          content:'添加成功！',
                          ok:function(){
                            _this.initContent();
                            jh.utils.closeArt();
                          }
                        })
                      }
                    });
                  }
                });
            });

        };
    }
    module.exports = CustomerTrack;
});