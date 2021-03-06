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
            
            //查看任务详情
            $('.dataShow').off('click', '.customer-track-detail').on('click', '.customer-track-detail', function() {
                var me = $(this);
                var infos = me.data('infos');
                jh.utils.load('/src/modules/customerTrack/customer-track-detail', infos);
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
            
            //单个添加
            $('body').off('click', '.add-customer-track').on('click', '.add-customer-track', function() {
                var info = $(this).data('info');
                var singleIncreateTrack = jh.utils.template('singleIncreate-track-template', info);
                jh.utils.alert({
                  title:'添加跟踪记录',
                  content:singleIncreateTrack,
                  okValue:'保存',
                  ok:function(){
                    var singleIncreateForm = jh.utils.formToJson($('#singleIncreate-track-form'));
                    singleIncreateForm.upstreamName = info.upstreamName;
                    singleIncreateForm.contacts = info.contacts;
                    singleIncreateForm.contactPhone = info.contactPhone;
                    if(!singleIncreateForm.traceAt){
                      jh.utils.alert({
                        content: '请输入跟进时间',
                        ok: true
                      })
                      return false;
                    }
                    if(!singleIncreateForm.content){
                      jh.utils.alert({
                        content: '请输入跟进内容',
                        ok: true
                      })
                      return false;
                    }
                    jh.utils.ajax.send({
                      method:'post',
                      url: '/record/addTracke',
                      data: singleIncreateForm,
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
                  },
                  cancel: true
                })
            });

        };
    }
    module.exports = CustomerTrack;
});