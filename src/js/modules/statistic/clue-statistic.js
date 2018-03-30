/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function ClueStatistic() {
        var _this = this;
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
//      线索统计
        _this.trendDaysOne = [];
        _this.trendCountOne = [];
        _this.trendCountTwo = [];
//      线索匹配统计
        _this.carCountOne = [];
        _this.carCountTwo = [];
        _this.carDaysOne = [];
//      线索合规统计
        _this.downCountOne = [];
        _this.downCountTwo = [];
        _this.downDaysOne = [];
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
                url: '/statistics/trace/general',
                done: function(returnData) {
                  var dataFirst = jh.utils.template('statistic_clue_template', returnData.data);
                  $('#clue-echarts-list').html(dataFirst);
                }
            });
        };
        this.initSection = function() {
            var clueOne = jh.utils.formToJson($('#clueOne-information-form'));
            var clueTwo = jh.utils.formToJson($('#clueTwo-information-form'));
            var clueThree = jh.utils.formToJson($('#clueThree-information-form'));
//          one
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/trace/trend',
                contentType: 'application/json',
                data: clueOne,
                done: function(returnData) {
                  var traceOne = returnData.data.traceTrend.leftList;
                  var traceTwo = returnData.data.traceTrend.rightList;
                  for (var a = 0; a < traceOne.length; a++) {
                      _this.trendDaysOne.push(traceOne[a].days);
                      _this.trendCountOne.push(traceOne[a].count);
                  }
                  for (var b = 0; b < traceTwo.length; b++) {
                      _this.trendCountTwo.push(trace[a].count);
                  }
                  _this.sectionTable();
                }
            });
//          two
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/trace/trend',
                contentType: 'application/json',
                data: clueTwo,
                done: function(returnData) {
                    var carOne = returnData.data.traceTrend.leftList;
                    var carTwo = returnData.data.traceTrend.rightList;
                    for (var j = 0; j < carOne.length; j++) {
                        _this.carDaysOne.push(carOne[j].days);
                        _this.carCountOne.push(carOne[j].count);
                    }
                    for (var k = 0; k < carTwo.length; k++) {
                        _this.carCountTwo.push(carTwo[k].count);
                    }
                    _this.sectionTable();
                }
            });
//          three
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/trace/trend',
                contentType: 'application/json',
                data: clueThree,
                done: function(returnData) {
                    var downOne = returnData.data.traceTrend.leftList;
                    var downTwo = returnData.data.traceTrend.rightList;
                    for (var c = 0; c < downOne.length; c++) {
                        _this.downDaysOne.push(downOne[c].days);
                        _this.downCountOne.push(downOne[c].count);
                    }
                    for (var d = 0; d < downTwo.length; d++) {
                        _this.downCountTwo.push(downTwo[d].count);
                    }
                    _this.sectionTable();
                }
            });
        }
        this.sectionTable = function() {
            var mainInformate = echarts.init(document.getElementById('mainInformate'));
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            var mainBarNum = echarts.init(document.getElementById('mainBarNum'));
            mainInformate.setOption({
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['合规线索','不合规线索']
                },
                calculable: true,
                xAxis: [
                    {
                        type : 'category',
                        data : _this.trendDaysOne
                    }
                ],
                yAxis: [
                    {
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name:'合规线索',
                        type:'bar',
                        barWidth: '80%',
                        data:_this.trendCountOne
                    },
                    {
                        name:'不合规线索',
                        type:'bar',
                        barWidth: '80%',
                        data:_this.trendCountTwo
                    }
                ]
            });
            mainBarNum.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['合规线索','不合规线索']
                },
                calculable: true,
                xAxis: [
                    {
                        type : 'category',
                        data : _this.downDaysOne
                    }
                ],
                yAxis: [
                    {
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name:'合规线索',
                        type:'bar',
                        barWidth: '80%',
                        data:_this.downCountOne
                    },
                    {
                        name:'不合规线索',
                        type:'bar',
                        barWidth: '80%',
                        data:_this.downCountTwo
                    }
                ]
            });
            mainCarNum.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    selectedMode:false,
                    data:['匹配成功', '线索总数']
                },
                calculable: true,
                xAxis: [
                    {
                        type : 'category',
                        data : _this.carDaysOne
                    }
                ],
                yAxis: [
                    {
                        type : 'value',
                        boundaryGap: [0, 0.1]
                    }
                ],
                series: [
                    {
                        name:'匹配成功',
                        type:'bar',
                        stack: 'sum',
                        barWidth: '80%',
                        itemStyle: {
                            normal: {
                                color: 'tomato',
                                barBorderColor: 'tomato',
                                label : {
                                    show: true, position: 'insideTop'
                                }
                            }
                        },
                        data:_this.carCountTwo
                    },
                    {
                        name:'线索总数',
                        type:'bar',
                        stack: 'sum',
                        barWidth: '80%',
                        itemStyle: {
                            normal: {
                                color: '#f0f0f0',
                                barBorderColor: 'tomato',
                                label : {
                                    show: true, 
                                    position: 'top',
                                    textStyle: {
                                        color: 'tomato'
                                    }
                                }
                            }
                        },
                        data:_this.carCountOne
                    }
                ]
            });

        };

        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#statistic_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/statistics/traceSort',
                showPageTotal: false,
                jump: false,
                show_page_number: 3,
                contentType: 'application/json',
                data: {
                    type: 'trace',
                    pageSize: 5,
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('statistic_content_template', data);
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

    module.exports = ClueStatistic;
});