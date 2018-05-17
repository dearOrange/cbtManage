/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function ClueManage() {
    var _this = this;
    _this.form = $('#clue-manage-form');
    this.init = function() {
      this.initContent();
      this.initTaskTotalCount();
      this.registerEvent();
      $('.icon-issue').mouseover(function() {
        $('.activity-content').css('display', 'block');
      });
      $('.icon-issue').mouseout(function() {
        $('.activity-content').css('display', '');
      })
    };

    this.initContent = function(isSearch) {
      var page = new jh.ui.page({
        data_container: $('#clue_manage_container'),
        page_container: $('#page_container'),
        form_container: _this.form,
        method: 'post',
        url: '/trace/traceList',
        contentType: 'application/json',
        data: jh.utils.formToJson(_this.form),
        isSearch: isSearch,
        callback: function(data) {
          data.passState = $('#state').val();
          data.viewImgRoot = jh.config.viewImgRoot;
          data.getPositionByImage = jh.utils.getPositionByImage;

          if (data.passState == 0) {
            $('.clueMatch').css("display", "none");
          } else {
            $('.clueMatch').css("display", "");
          };
          return jh.utils.template('clue-manage-template', data);
        }
      });
      page.init();
    };

    this.initTaskTotalCount = function() {
      jh.utils.ajax.send({
        url: '/trace/count',
        done: function(returnData) {
          var olBox = $('#taskState');
          for (var item in returnData.data) {
            var sup = $('<sup></sup>');
            sup.text(returnData.data[item]);
            olBox.find('[data-state="' + item + '"]').append(sup);
          }
          var sup = $('<sup></sup>');
        }
      });

      jh.utils.ajax.send({
        url: '/activity/current',
        done: function(returnData) {
          var dataInfo = returnData.data;
          if (dataInfo.isActivity === false) {
            $('.activity-content').html('暂无活动');
          } else {
            if(dataInfo.kind === '0') {
              $('.fix_content').removeClass('hide');
              $('.float_content').addClass('hide');
            }else {
              $('.fix_content').addClass('hide');
              $('.float_content').removeClass('hide');
            }
            var parentObj = $('#activity-content');
            parentObj.find('.title').html(dataInfo.title);
            parentObj.find('.activity').html(dataInfo.activity);
            parentObj.find('.reactivity').html(dataInfo.referrerTrace);
            parentObj.find('.endAt').html(dataInfo.endAt);
            parentObj.find('.startAt').html(dataInfo.startAt);
            parentObj.find('.newMoney').html(dataInfo.firstTrace);
            parentObj.find('.firstMoney').html(dataInfo.referrerFirstTrace);
          }
        }
      });

    };

    this.traceOperator = function(ids, state) {
      var contentStr = '';
      if (!ids) {
        jh.utils.confirm({
          content: '请选择线索后操作！'
        });
        return false;
      }
      var tip = state === 1 ? '通过' : '拒绝';
      jh.utils.ajax.send({
        url: '/trace/getRewardLevel',
        data: {
          traceIds: ids
        },
        done: function(returnData) {
          /**
           * 如果固定奖励金则直接进行提示信息并通过
           * 如果是浮动奖励金则选择档位
           */
          var result = returnData.data;
          if (result.kind === '0' || state != '1') {
            contentStr = '确定' + tip + '吗？';
            if(state == '2') {
              contentStr = '<div class="text-center"><span style="font-size:18px;">确定' + tip + '吗？</span><br/><br/>';
              contentStr += '<label style="color:#ccc;">请选择拒绝原因：</label><select class="rejectReason" style="width:210px;">';
              var optionArr = ['线索模糊不清','照片拍摄时间或位置信息缺失','照片拍摄位置与GPS定位不符','GPS定位信息缺失','线索重复上传','此线索已先有其他线人上传','其他'];
              for(var j=0;j<optionArr.length;j++){
                var optionItem = optionArr[j];
                contentStr += '<option value="'+optionItem+'">'+optionItem+'</option>';
              }
              contentStr += '</select></div>';
            }
          } else {
            contentStr = '<div class="text-center"><span>确定' + tip + '吗？</span><br/>';
            contentStr += '';
            result.bounty = JSON.parse(result.bounty);
            for (var i = 0, num = result.bounty.length; i < num; i++) {
              var item = result.bounty[i];
              var jsonStr = JSON.stringify(item);
              contentStr += '<a href="javascript:void(0)" class="button white_btn mr10 activityItem" data-name="' + item.name + '" data-min="' + item.min + '" data-max="' + item.max + '">' + item.name + '</a>';
            }
            contentStr += '</div>';
          }

          jh.utils.alert({
            content: contentStr,
            ok: function() {
              var selectItem = $('.activityItem').filter('.active'),
                activityJson = '';
              if (result.kind === "1") {
                if (selectItem.length === 0) {
                  if(state == '1' ) {
                    jh.utils.alert({
                      content: '请选择相应奖励档位',
                      ok: true
                    });
                    return false;
                  }
                }
                var jsons = {
                  name: selectItem.data('name'),
                  min: selectItem.data('min'),
                  max: selectItem.data('max')
                };
                activityJson = JSON.stringify(jsons);
              }
              jh.utils.ajax.send({
                url: '/trace/check',
                method: 'post',
                data: {
                  traceIds: ids,
                  validState: state,
                  kind: result.kind,
                  activityJson: activityJson,
                  reason: $('.rejectReason').val()
                },
                done: function(returnData) {
                  jh.utils.alert({
                    content: '操作成功',
                    ok: true,
                    cancel: true
                  });
                  _this.initContent();
                }
              });
            },
            cancel: true
          });
        }
      });
    };

    this.registerEvent = function() {

      $('select').select2({
        minimumResultsForSearch: Infinity
      });

      // 搜索
      jh.utils.validator.init({
        id: 'clue-manage-form',
        submitHandler: function(form) {
          _this.initContent(true);
          return false;
        }
      });

      //选择额度
      $('body').off('click', '.activityItem').on('click', '.activityItem', function(event, param) {
        var me = $(this);
        me.addClass('active').siblings().removeClass('active');
      })

      //查看任务详情
      $('.dataShow').off('click', '.clueManage-detail').on('click', '.clueManage-detail', function() {
        var id = $(this).data('id');
        var state = $(this).data('state');
        jh.utils.load("/src/modules/xinxiyuan/clue/clue-manage-detail", {
          id: id,
          state: state
        })
      });

      //切换状态
      $('body').off('click', '.clueState').on('click', '.clueState', function(event, param) {
        $(this).addClass("active").siblings().removeClass("active");
        $('select').select2();
        $('#state').val($(this).data('value'));
        if (param && param === 'autoClick') {

        } else {
          _this.initContent('tab');
        }
      })

      //批量通过
      $('body').off('click', '#batchPass').on('click', '#batchPass', function() {
        var me = $(this);
        var ids = jh.utils.getCheckboxValue('clue_manage_container');
        _this.traceOperator(ids, 1);
      })

      //批量拒绝
      $('body').off('click', '#batchRefuse').on('click', '#batchRefuse', function() {
        var me = $(this);
        var ids = jh.utils.getCheckboxValue('clue_manage_container');
        _this.traceOperator(ids, 2);
      })

      //通过
      $('body').off('click', '.agreement').on('click', '.agreement', function() {
        var traceIds = $(this).data('id');
        _this.traceOperator(traceIds, 1);
      })
      //拒绝
      $('body').off('click', '.pass').on('click', '.pass', function() {
        var traceIds = $(this).data('id');
        _this.traceOperator(traceIds, 2);
      })
    };
  }
  module.exports = ClueManage;
});