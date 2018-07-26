/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ShopManage() {
        var _this = this;
        _this.form = $('#shopManage-list-form');
        this.init = function() {
            this.initContent();
            this.registerEvent();
        };
        this.initContent = function(isSearch) {
            var page = new jh.ui.page({
                data_container: $('#shop_manage_container'),
                page_container: $('#page_container'),
                form_container: _this.form,
                url: '/goods/getGoodsList',
                method: 'post',
                data: jh.utils.formToJson(_this.form),
                isSearch: isSearch,
                contentType: 'application/json',
                callback: function(data) {
                    data.viewImgRoot = jh.config.viewImgRoot;
                    data.stateToString = function(state){
                        var str = '';
                        switch(state){
                            case 0:
                                str = '已下架';
                                break;
                            case 1:
                                str = '已上架';
                                break;
                            case 9:
                                str = '待上架';
                                break;
                        }
                        return str;
                    };
                    return jh.utils.template('shop-manage-template', data);
                }
            });
            page.init();
        };
        this.showBanner = function(obj) {
            var conName = '';
            if(!obj){
                obj = {};
                conName = '新增';
                _this.url = '/goods/addGoods';
            }else{
                obj.showImgUrl = jh.config.viewImgRoot + obj.goodsImg;
                conName = '编辑';
                _this.id = obj.id;
                _this.url = '/goods/updateGoods'
            }
            var str = jh.utils.template('shop_manage_addGoodsTemplate', obj);
            jh.utils.alert({
                title: conName + '商品',
                content: str,
                ok: function() {
                    $('#shop_manage_addGoodsForm').submit();
                    return false;
                },
                cancel: true
            });
            jh.utils.validator.init({
                id: 'shop_manage_addGoodsForm',
                submitHandler: function(form) {
                    var datas = jh.utils.formToJson(form);
                    if (!datas.goodsImg) {
                        jh.utils.confirm({
                            content: '请上传商品图片！'
                        });
                        return false;
                    }
                    if(conName === '编辑'){
                      datas.id = _this.id;
                    };
                    
                    jh.utils.ajax.send({
                        url: _this.url,
                        data: datas,
                        done: function(returnData) {
                            jh.utils.alert({
                                content: '海报'+conName+'成功！',
                                ok: function() {
                                    window.location.reload();
                                    jh.utils.closeArt();
                                }
                            });
                        }
                    });
                    return false;
                }
            });

            jh.utils.uploader.init({
                pick: {
                    id: '#goodsImg'
                }
            });
        };
        
        this.upgrounding = function(ids, status){
          var name = status == '1' ? '上架' : '下架';
          if(!ids){
            jh.utils.alert({
              content: '请先选择商品！',
              ok: true
            })
            return false;
          }
          jh.utils.confirm({
            content: '确定将选中的商品'+name+'吗？',
            ok: function() {
              jh.utils.ajax.send({
                url: '/goods/updateGoodsState',
                data: {
                  goodsIds: ids,
                  status: status
                },
                done: function() {
                  jh.utils.alert({
                    content: '商品成功'+name+'！',
                    ok: function(){
                      _this.initContent();
                    },
                    cancel: false
                  });
                }
              });
            },
            cancel: true
          });
        };
        this.registerEvent = function() {
          $('select').select2({
              minimumResultsForSearch: Infinity
          });

          // 搜索
          jh.utils.validator.init({
              id: 'shopManage-list-form',
              submitHandler: function(form) {
                  _this.initContent(true);
                  return false;
              }
          });
          //编辑商品
          $('body').off('click', '.shopEdit').on('click', '.shopEdit', function() {
              var me = $(this);
              var info = me.data('info');
              _this.showBanner(info);
          });
          //新增商品
          $('body').off('click', '#newcreated-goods').on('click', '#newcreated-goods', function() {
              var me = $(this);
              _this.showBanner();
          });
          
          //上架
          $('body').off('click', '.shop-grounding').on('click', '.shop-grounding', function() {
              var me = $(this);
              if(me.hasClass('greyStyle')){
                jh.utils.alert({
                  content: '该商品已上架！',
                  ok: true
                })
                return false;
              }
              var id = me.data('id');
              var status = me.data('status');
              _this.upgrounding(id, status);
          });
          //批量上架
          $('body').off('click', '#allup-goods').on('click', '#allup-goods', function() {
              var me = $(this);
              var status = me.data('status');
              var id = jh.utils.getCheckboxValue('shop_manage_container');
              _this.upgrounding(id, status);
          });
          //下架
          $('body').off('click', '.shop-undercarriage').on('click', '.shop-undercarriage', function() {
              var me = $(this);
              if(me.hasClass('greyStyle')){
                jh.utils.alert({
                  content: '该商品已下架！',
                  ok: true
                })
                return false;
              }
              var id = me.data('id');
              var status = me.data('status');
              _this.upgrounding(id, status);
          });
          //批量下架
          $('body').off('click', '#alldown-goods').on('click', '#alldown-goods', function() {
              var me = $(this);
              var status = me.data('status');
              var id = jh.utils.getCheckboxValue('shop_manage_container');
              _this.upgrounding(id, status);
          });
        };
    }
    module.exports = ShopManage;
});
