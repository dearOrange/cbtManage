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
        var barCharts = null;
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
        _this.trendName = [];
        _this.countEach = [];
        _this.entrust = '';
        _this.dates = '';
        
        this.init = function() {
            $('#infoTimeInput,#carRecoveryInput,#entrustTimeInput').val(now.year + '-' + now.month);
            this.initHead();
            this.initSection();
            this.sectionTableBar();
            this.headTable('all', '20180403');
            window.initContent('2018-01', true);
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
                  _this.sectionTableBar();
                }
            });
            
        }
        this.headTable = function(entrust, dates) {
//          车辆省份分配比
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/task/province',
                contentType: 'application/json',
                data: {
                  entrust: entrust,
                  date: dates
                },
                done: function(returnData) {
                  var provinceData = returnData.data;
                  for (var i = 0; i < provinceData.length; i++) {
                    var proObj = {};
                    _this.trendName.push(traceAll[i].name);
                    proObj.value = traceAll[i].countEach;
                    proObj.name = traceAll[i].name;
                    _this.countEach.push(proObj);
                  }
                  _this.sectionTablePie();
                }
            });
        }
//      任务统计
        this.sectionTableBar = function() {
            var mainInformate = echarts.init(document.getElementById('mainInformate'));
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

            barCharts = mainInformate;
        };
//      省份分配比
        this.sectionTablePie = function() {
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
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
                  data:_this.trendName
              },
              
              calculable : true,
              series : [
                  {
                      name:'访问来源',
                      type:'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:_this.countEach
                  }
              ]
            });
        }

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

        this.registerEvent = function() {
            
            barCharts.on('click', function(p) {
//            console.log(p);//p为点击的地图对象，p.data为传入地图的data数据
              if(p.seriesName === '只找车') {
                _this.entrust = 'trace';
              }else if(p.seriesName === '只拖车') {
                _this.entrust = 'recycle';
              }else {
                _this.entrust = 'all';
              }
              _this.dates = p.name;
              _this.headTable(_this.entrust, _this.dates);
            });
            
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

    module.exports = TaskStatistic;
});