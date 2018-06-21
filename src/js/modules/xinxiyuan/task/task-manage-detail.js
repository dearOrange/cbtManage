/**
 * audit-detail
 * @authors jiaguishan
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskManageDetail() {
        var _this = this;
        var args = jh.utils.getURLValue().args;
        this.init = function() {
            this.initDetail();
            this.registerEvent();
        };

        this.initDetail = function() {
            jh.utils.ajax.send({
                url: '/task/info/detail',
                data: {
                    taskId: args.id
                },
                done: function(returnData) {
                    returnData.state = args.state;
                    returnData.menuState = jh.utils.menuState;
                    returnData.officerState = jh.utils.officerState;
                    returnData.viewImgRoot = jh.config.viewImgRoot;
                    returnData.getPositionByImage = jh.utils.getPositionByImage;
                    _this.insurance = returnData.data.insurance;
                    var html = jh.utils.template('task_manage_detail_template', returnData);
                    $('.taskManageContent').html(html);
                    _this.searchIllegalInfo();
                    
                }
            });
        };
        //查询违章信息列表
        this.searchIllegalInfo = function(obj) {
            var page = new jh.ui.page({
                data_container: $('#task_detail_wzInfoList'),
                page_container: $('#page_container'),
                method: 'post',
                isSearch: true,
                url: '/clue/illegalList',
                contentType: 'application/json',
                data: {
                    taskId: args.id
                },
                callback: function(data) {
                    return jh.utils.template('task_detail_wzInfoTemplate', data);
                },
                onload: function() {
                    if (obj) {
                        window.setTimeout(function() {
                            $('#taskList-illegalList').removeClass('disabled');
                            $('#taskList-illegalList').siblings().remove();
                        }, 1000);
                    }
                }
            });
            page.init();
        };
        
        this.registerEvent = function() {
            //信息修复
            $('body').off('click', '#taskList-illegalList').on('click', '#taskList-illegalList', function() {
                var me = $(this);
                if (me.hasClass('disabled')) {
                    return false;
                }
                $('<img src="/src/img/loading.gif" height="29"/>').insertAfter(me);
                me.addClass('disabled');
                jh.utils.ajax.send({
                    url: '/clue/bondRepair',
                    data: {
                        taskIds: args.id
                    },
                    done: function(returnData) {
                        window.setTimeout(function() {
                            _this.searchIllegalInfo(me);
                        }, 10000);
                    }
                });
            });
//    切换城市      
      var largeCity = jh.config.citylist;
      $('body').off('change', '#changeProvince').on('change', '#changeProvince', function() {
        var changeCity = $(this).siblings();
        $(changeCity).empty();
        var val = this.value;
        $.each(largeCity,function(index,item){
          var str = '', itemCity = largeCity[index].city;
          if(val == item.p){
            for(var i = 0;i<itemCity.length;i++){
              if(itemCity[i].c == ''){
                itemCity[i].c = '';
              }
              str += '<option value="' + itemCity[i].c + '">' + itemCity[i].c + '</option>';
            }
            $(changeCity).append(str); 
          }
        })
      })
      //添加违章
      $('body').off('click', '#addPeccancy').on('click', '#addPeccancy', function() {
        args.car = decodeURIComponent(args.car);
        var addIllegal = jh.utils.template('addIllegalInfo-template', {carNumber:args.car, cityList:jh.config.citylist});
        jh.utils.alert({
          title: '添加违章',
          content: addIllegal,
          okValue: '保存',
          ok: function() {
            var peccancyForm = jh.utils.formToJson($('#add_illegalInfo-form'));
            peccancyForm.taskId = args.id;
            peccancyForm.carNumber = args.car;
            jh.utils.ajax.send({
              method: 'post',
              url: '/clue/addClue',
              data: peccancyForm,
              done: function(data) {
                _this.searchIllegalInfo()
              }
            })
          },
          cancel: true
        });
      })
      
      //更新保险
      $('body').off('click', '#updateInsurance').on('click', '#updateInsurance', function() {
        args.car = decodeURIComponent(args.car);
        var updateStr = jh.utils.template('updateInsurance-template', {carNumber:args.car,insurance:_this.insurance});
        jh.utils.alert({
          title: '更新保险',
          content: updateStr,
          okValue: '保存',
          ok: function() {
            var insuranceForm = jh.utils.formToJson($('#update-insurance-form'));
            insuranceForm.taskId = args.id;
            insuranceForm.carNumber = args.car;
            jh.utils.ajax.send({
              method: 'post',
              url: '/clue/updateInsurance',
              data: insuranceForm,
              done: function(data) {
                _this.initDetail();
              }
            })
          },
          cancel: true
        });
      })
      
//    采纳情报
        $('body').off('click', '.adopteInfo').on('click', '.adopteInfo', function() {
          var checkId = $.trim($(".checkId").filter(":checked").val());
          if (!checkId) {
              jh.utils.confirm({
                  content: '请选择具体线索！'
              });
              return false;
          }
          jh.utils.alert({
              content: '确定采纳吗？',
              ok: function() {
                  var adoptData = {
                      taskId: args.id,
                      traceId: checkId
                  };
                  jh.utils.ajax.send({
                      url: '/task/adopt',
                      data: adoptData,
                      done: function(returnData) {
                          jh.utils.alert({
                              content: '已采纳！',
                              ok: function() {
                                  window.location.reload();
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
    module.exports = TaskManageDetail;
});