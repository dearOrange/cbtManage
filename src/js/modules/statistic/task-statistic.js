/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function TaskStatistic() {
        var _this = this;
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
        
//      任务统计
        _this.trendDaysAll = [];
        _this.trendCountAll = [];
        _this.trendCountTrace = [];
        _this.trendCountRecycle = [];
//      车牌比
        _this.trendNameAll = [];
        _this.countEachAll = [];
        _this.countRateAll = [];
        
        _this.trendNameAll = [];
        _this.trendNameAll = [];
        _this.trendNameAll = [];
        
        
        
        _this.traceMonths = [];
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
            jh.utils.ajax.send({
                url: '/statistics/task/general',
                done: function(returnData) {
                    var dataFirst = jh.utils.template('statistic_first_template', returnData.data);
                    $('#clue-echarts-list').html(dataFirst);
                }
            });
        };
        this.initSection = function() {
            var taskOne = jh.utils.formToJson($('#task-information-form'));
//          任务统计
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/task/trend',
                contentType: 'application/json',
                data: taskOne,
                done: function(returnData) {
                  var traceAll = returnData.data.all;//找加拖
                  var traceTrace = returnData.data.trace;//只找
                  var traceRecycle = returnData.data.recycle;//只拖
                  for (var a = 0; a < traceAll.length; a++) {
                      _this.trendDaysAll.push(traceAll[a].days);
                      _this.trendCountAll.push(traceAll[a].count);
                  }
                  for (var b = 0; b < traceTrace.length; b++) {
                      _this.trendCountTrace.push(traceTrace[b].count);
                  }
                  for (var c = 0; c < traceRecycle.length; c++) {
                      _this.trendCountRecycle.push(traceRecycle[c].count);
                  }
                  _this.sectionTable();
                }
            });
            
//          车辆省份分配比
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/task/province',
                contentType: 'application/json',
                data: {
                  entrust: 'trace',
                  date: '2018-04-11'
                },
                done: function(returnData) {
//                var traceAll = returnData.data.all;//找加拖
//                var traceTrace = returnData.data.trace;//只找
//                var traceRecycle = returnData.data.recycle;//只拖
//                for (var a = 0; a < traceAll.length; a++) {
//                    _this.trendDaysAll.push(traceAll[a].days);
//                    _this.trendCountAll.push(traceAll[a].count);
//                }
//                for (var b = 0; b < traceTrace.length; b++) {
//                    _this.trendCountTrace.push(traceTrace[b].count);
//                }
//                for (var c = 0; c < traceRecycle.length; c++) {
//                    _this.trendCountRecycle.push(traceRecycle[c].count);
//                }
                  _this.sectionTable();
                }
            });
        }
        this.sectionTable = function() {
            var mainInformate = echarts.init(document.getElementById('mainInformate'));
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            mainInformate.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['只找车','只拖车', '找车加拖车']
                },
                calculable: true,
                xAxis: [
                    {
                        type : 'category',
                        data : _this.trendDaysAll
                    }
                ],
                yAxis: [
                    {
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name:'只找车',
                        type:'bar',
                        data:_this.trendCountTrace
                    },
                    {
                        name:'只拖车',
                        type:'bar',
                        data:_this.trendCountRecycle
                    },
                    {
                        name:'找车加拖车',
                        type:'bar',
                        data:_this.trendCountAll
                    }
                ]
            });

            mainCarNum.setOption({
              title : {
                  text: '任务车牌省份分配比',
                  x:'center'
              },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                  orient : 'vertical',
                  x : 'left',
                  data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
              },
              
              calculable : true,
              series : [
                  {
                      name:'访问来源',
                      type:'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:[
                          {value:335, name:'直接访问'},
                          {value:310, name:'邮件营销'},
                          {value:234, name:'联盟广告'},
                          {value:135, name:'视频广告'},
                          {value:1548, name:'搜索引擎'}
                      ]
                  }
              ]
            });


        };

        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#task_statistic_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/statistics/traceSort',
                showPageTotal: false,
                jump: false,
                show_page_number: 2,
                contentType: 'application/json',
                data: {
                    type: 'trace',
                    pageSize: 5,
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('task_statistic_content_template', data);
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
                showPageTotal: false,
                jump: false,
                show_page_number: 3,
                callback: function(data) {
                    return jh.utils.template('clear_content_template', data);
                }
            });
            page.init();
        };


        this.headTable = function() {
            var mainBar = echarts.init(document.getElementById('mainBar'));
            var mainLine = echarts.init(document.getElementById('mainLine'));
            var mainArea = echarts.init(document.getElementById('mainArea'));

            mainBar.setOption({
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: '3%',
                    left: 0,
                    right: 0,
                    bottom: '2%'
                },
                xAxis: [{
                    show: false,
                    type: 'category',
                    data: _this.downstreamTrendMonths
                }],
                yAxis: [{
                    show: false,
                    type: 'value'
                }],
                series: [{
                    name: '月度新增',
                    type: 'bar',
                    barWidth: '50%',
                    data: _this.downstreamTrendCount
                }]
            });

            mainLine.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '3%',
                    left: 0,
                    right: 0,
                    bottom: '2%'
                },
                xAxis: {
                    show: false,
                    type: 'category',
                    boundaryGap: false,
                    data: _this.upstreamTrendMonths
                },
                yAxis: {
                    show: false,
                    type: 'value'
                },
                series: [{
                    name: '月度增长量',
                    type: 'line',
                    data: _this.upstreamTrendCount,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    }
                }]
            });

            mainArea.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '3%',
                    left: 0,
                    right: 0,
                    bottom: '2%'
                },
                xAxis: {
                    show: false,
                    type: 'category',
                    boundaryGap: false,
                    data: _this.traceTrendMonths
                },
                yAxis: {
                    show: false,
                    type: 'value'
                },
                series: [{
                    name: '情报数',
                    type: 'line',
                    data: _this.traceTrendCount,
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    }
                }]
            });
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
//                  for (var k = 0; k < entrust.length; k++) {
//                      _this.countRate = entrust[k].countRate;
//                      _this.pieContent(k, _this.countRate);
//                  }
//
//              }
//          });
//      };

        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });

        };
        this.pieContent = function(k, countRate) {
          radialIndicator('#pie' + k, {
          showPercentage : false, // option
          barColor: '#87CEEB',
            barWidth: 10,
            initValue: countRate,
            roundCorner : true,
            percentage: true
      });
      var aa = $('.channelDistance').width() * (k+1);
      $('.channelInner').width(aa);
      var cc = $('.channelInfo').width();
      if(aa > cc) {
            $('body').off('click', '.preBtn').on('click', '.preBtn', function() {
              $('.channelInner').animate({marginLeft:"0px"}, 500, function() {
                $(".channelInner dl").eq(k).prependTo($(".channelInner"));
                $('.channelInner').css('marginLeft','-240px');
              });
            });
            $('body').off('click', '.nextBtn').on('click', '.nextBtn', function() {
              $('.channelInner').animate({marginLeft:"-240px"},500, function(){
                $(".channelInner dl").eq(0).appendTo($(".channelInner"));
                $('.channelInner').css('marginLeft','0px');
              })
            })
          }
        };
    }
    /**
     * 情报begin
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
     * 情报end
     */

    /**
     * 渠道委托begin
     */
    window.statisticEntrustMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj, true);
    };
    window.statisticEntrustYearing = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj, true);
    };
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

    module.exports = TaskStatistic;
});