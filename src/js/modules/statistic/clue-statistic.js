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
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
        now.day = now.day.toString().length === 1 ? '0' + now.day : now.day; //日期两位数
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

        this.init = function() {
            $('#infoTimeInput,#carRecoveryInput,#entrustTimeInput,#traceInput,#recoveryInput').val(now.year + '-' + now.month);
            this.initHead();
            this.sectionTable();
            window.initContent('2018-01', true);
            window.initClear('2018-01', true);
            window.initEntrustSort('2018-01', true);
            window.initClueSort('2018-01', true);
            window.initPassSort('2018-01', true);
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
        
//      线索统计
        window.initEntrustSort = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/trace/trend',
                contentType: 'application/json',
                data: {
                  type: 'traceTotal',
                  yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                done: function(returnData) {
                  var traceOne = returnData.data.traceTotal;
                  for (var a = 0; a < traceOne.length; a++) {
                      _this.trendDaysOne.push(traceOne[a].days);
                      _this.trendCountOne.push(traceOne[a].count);
                  }
                  _this.sectionTable();
                }
            });
        };
//      线索匹配统计
        window.initClueSort = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/trace/trend',
                contentType: 'application/json',
                data: {
                  type: 'traceMatch',
                  yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                done: function(returnData) {
                  var carOne = returnData.data.traceMatch;
                  var carTwo = returnData.data.traceWhole;
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
        };        
//      线索合规统计
        window.initPassSort = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/trace/trend',
                contentType: 'application/json',
                data: {
                  type: 'tracePass',
                  yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                done: function(returnData) {
                  var downOne = returnData.data.passed;
                  var downTwo = returnData.data.rejected;
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
        };  
        
        this.sectionTable = function() {
            var mainInformate = echarts.init(document.getElementById('mainInformate'));
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            var mainBarNum = echarts.init(document.getElementById('mainBarNum'));
            mainInformate.setOption({
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['线索']
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
                        name:'线索',
                        type:'bar',
                        barWidth: '80%',
                        data:_this.trendCountOne
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
//      上传线索
        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month, d: now.day } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
            obj.d = obj.d.toString().length === 1 ? '0' + obj.d : obj.d; //日期两位数
            
            jh.utils.ajax.send({
              method: 'post',
              url: '/statistics/downstream/upTraceSort',
              contentType: 'application/json',
              data: {
                aim: 'traceSort',
                yearMonth: obj.y + '-' + obj.M
              },
              isSearch: isSearch,
              done: function(returnData) {
                var upclueStr = jh.utils.template('upclue_content_template', returnData.data);
                $('#upclue_statistic_container').html(upclueStr);
              }
            });
        };
//      发展下线
        window.initClear = function(obj, isSearch) {
          obj = typeof obj !== 'object' ? { y: now.year, M: now.month, d: now.day } : obj; //是否为第一次查询
          obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
          obj.d = obj.d.toString().length === 1 ? '0' + obj.d : obj.d; //日期两位数
          
          jh.utils.ajax.send({
              method: 'post',
              url: '/statistics/downstream/downlineSort',
              contentType: 'application/json',
              data: {
                aim: 'downlineSort',
                yearMonth: obj.y + '-' + obj.M
              },
              isSearch: isSearch,
              done: function(returnData) {
                var downline = jh.utils.template('offline_content_template', returnData.data);
                $('#offline_info_container').html(downline);
              }
          });
        };
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
    
    /**
     * 线索统计begin
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
     * 线索统计end
     */
     
    /**
     * 线索匹配统计begin
     */
    window.statisticClueMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initClueSort(obj, true);
    };
    window.statisticClueYearing = function() {
        var obj = $dp.cal.newdate;
        window.initClueSort(obj, true);
    };
    /**
     * 线索匹配统计end
     */
     
    /**
     * 线索合规统计begin
     */
    window.statisticPassMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initPassSort(obj, true);
    };
    window.statisticPassYearing = function() {
        var obj = $dp.cal.newdate;
        window.initPassSort(obj, true);
    };
    /**
     * 线索合规统计end
     */
    module.exports = ClueStatistic;
});