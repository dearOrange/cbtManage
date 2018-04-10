/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ChannelStatistic() {
        var _this = this;
        _this.role = 'type_A';
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDay()
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
//      线人扇形
        _this.channelInformerName = [];
        _this.channelInformerCount = [];
//      捕头扇形        
        _this.channelHunterName = [];
        _this.channelHunterCount = [];
        
        _this.traceCount = [];
        _this.carRecoveryMonths = [];
        _this.carRecoveryCount = [];
        _this.upstreamTrendMonths = [];
        _this.traceTrendMonths = [];
        _this.downstreamTrendMonths = [];
        _this.upstreamTrendCount = [];
        _this.traceTrendCount = [];
        _this.downstreamTrendCount = [];
        _this.countRate = 0;

        this.init = function() {
            $('#infoTimeInput,#carRecoveryInput,#entrustTimeInput').val(now.year + '-' + now.month);
            this.initHead();
            this.sectionTable();
            this.initSection();
            window.initContent('2018-01', true);
            window.initClear('2018-01', true);
//          window.initEntrustSort('2018-01', true);
            this.registerEvent();
        };

        //开头数据
        this.initHead = function() {
            var channelOne = jh.utils.formToJson($('#channel-list-form'));
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/channel/recommendRatio',
                contentType: 'application/json',
                data: channelOne,
                done: function(returnData) {
                  var channelOne = returnData.data;
                  for (var a = 0; a < channelOne.length; a++) {
                    var channelobj = {};
                    _this.channelInformerName.push(channelOne[a].name);
                    channelobj.value = channelOne[a].countEach;
                    channelobj.name = channelOne[a].name;
                    _this.channelInformerCount.push(channelobj);
                  }
                  _this.sectionTable();
                }
            });
        };
        
//      清收统计
        this.initSection = function(isSearch) {
          var channelTwo = jh.utils.formToJson($('#channel-info-form'));
          var page = new jh.ui.page({
            data_container: $('#channel_statistic_container'),
            page_container: $('#page_container1'),
            method: 'post',
            url: '/statistics/channel/recoveryList',
            contentType: 'application/json',
            data: channelTwo,
            isSearch: isSearch,
            callback: function(data) {
              return jh.utils.template('channel_content_template', data);
            }
          });
          page.init();
        }
        this.sectionTable = function() {
            
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            mainCarNum.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x : 'left',
                    data:_this.channelInformerName
                },
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : ['50%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '30',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:_this.channelInformerCount
                    }
                ]
            });

        };
        
//      月度排名
        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#rank_statistic_container'),
                page_container: $('#page_container2'),
                method: 'post',
                url: '/statistics/channel/recommendSort',
//              jump: false,
//              show_page_number: 3,
                contentType: 'application/json',
                data: {
                    role: _this.role,
                    pageSize: 5,
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('rank_content_template', data);
                }
            });
            page.init();
        };

        window.initClear = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#clear_info_container'),
                page_container: $('#page_clear_container'),
                method: 'post',
                url: '/statistics/recoverySort',
                contentType: 'application/json',
                data: {
                  pageSize: 5,
                    type: 'carRecovery',
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                show_page_number: 3,
                callback: function(data) {
                    return jh.utils.template('clear_content_template', data);
                }
            });
            page.init();
        };

//      window.initEntrustSort = function(obj, isSearch) {
//          obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
//          obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
//          jh.utils.ajax.send({
//              method: 'post',
//              url: '/statistics/entrust',
//              contentType: 'application/json',
//              data: {
//                  yearMonth: obj.y + '-' + obj.M
//              },
//              isSearch: isSearch,
//              done: function(returnData) {
//                  var entrust = returnData.data;
//                  var noResultBox = $('#entrustNoResultBox');
//                  if (!entrust.length) {
//                      noResultBox.removeClass('hide');
//                      noResultBox.prev().addClass('hide');
//                      return false;
//                  } else {
//                      noResultBox.addClass('hide');
//                      noResultBox.prev().removeClass('hide');
//                  }
//                  var entrustContent = jh.utils.template('entrust_content_template', returnData);
//                  $('#entrustResultBox').html(entrustContent);
//                  
//
//              }
//          });
//      };

        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });
            //切换状态
            $('body').off('click', '.taskState').on('click', '.taskState', function(event, param) {
              $(this).addClass("active").siblings().removeClass("active");
              $('#state').val($(this).data('value'));
              $('#stateInput').val($(this).data('value'));
              _this.role = $(this).data('value');
              if (param && param === 'autoClick') {
      
              } else {
                _this.initHead('tab');
                window.initContent('2018-01', true);
              }
            })
            
            // 搜索
            jh.utils.validator.init({
                id: 'channel-info-form',
                submitHandler: function(form) {
                    _this.initSection(true);
                    return false;
                }
            });
        };
    }
    /**
     * 排名begin
     */
    window.statisticTraceMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj, true);
    };
    window.statisticTraceYearing = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj, true);
    };
    /**
     * 排名end
     */

    /**
     * 渠道委托begin
     */
//  window.statisticEntrustMonthing = function() {
//      var obj = $dp.cal.newdate;
//      window.initEntrustSort(obj, true);
//  };
//  window.statisticEntrustYearing = function() {
//      var obj = $dp.cal.newdate;
//      window.initEntrustSort(obj, true);
//  };
    /**
     * 渠道委托end
     */

    /**
     * 车辆清收begin
     */
    window.statisticRecoveryMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initClear(obj, true);
    };
    window.statisticRecoveryYearing = function() {
        var obj = $dp.cal.newdate;
        window.initClear(obj, true);
    };
    /**
     * 车辆清收end
     */

    module.exports = ChannelStatistic;
});