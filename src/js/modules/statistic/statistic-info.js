/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function StatisticInfo() {
        var _this = this;
        _this.form = $('#information-form');
        _this.clearform = $('#clear-info-form');
        _this.entrustform = $('#entrust-form');
        _this.traceMonths = [];
        _this.traceCount = [];
        _this.carRecoveryMonths = [];
        _this.carRecoveryCount = [];

//      var date = new Date();
//      var constYear = {
//          nowYear: date.getFullYear().toString()
//      };

        this.init = function() {
            this.initHead();
            this.sectionTable();
            this.initContent();
            this.initClear();
            this.registerEvent();
        };

        //开头数据
        this.initHead = function() {
            jh.utils.ajax.send({
                url: '/statistics/general',
                done: function(returnData) {
                    var dataFirst = jh.utils.template('statistic_first_template', returnData.data);
                    $('.echarts-list').html(dataFirst);
                    _this.headTable();
                }
            });
        };

        this.sectionTable = function() {
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/traceTrend',
                contentType: 'application/json',
                data: {
                    tabName: 'trace',
                    monthLimit: 12
                },
                done: function(returnData) {
                    var trace = returnData.data.trace;
                    for (var i = 0; i < trace.length; i++) {
                        _this.traceMonths.push(trace[i].months);
                        _this.traceCount.push(trace[i].count);
                    }
                    mainInformate.setOption({
                        xAxis: {
                            data: _this.traceMonths
                        },
                        series: [{
                            // 根据名字对应到相应的系列
                            name: '情报数',
                            data: _this.traceCount
                        }]
                    });

                }
            });
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/recoveryTrend',
                contentType: 'application/json',
                data: {
                    tabName: 'task',
                    monthLimit: 12
                },
                done: function(returnData) {
                    var carRecovery = returnData.data.task;
                    for (var j = 0; j < carRecovery.length; j++) {
                        _this.carRecoveryMonths.push(carRecovery[j].months);
                        _this.carRecoveryCount.push(carRecovery[j].count);
                    }
                    mainCarNum.setOption({
                        xAxis: {
                            data: _this.carRecoveryMonths
                        },
                        series: [{
                            // 根据名字对应到相应的系列
                            name: '车辆清收数',
                            data: _this.carRecoveryCount
                        }]
                    });

                }
            });


            var mainInformate = echarts.init(document.getElementById('mainInformate'));
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            mainInformate.setOption({
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                title: {
                    left: 'left',
                    text: '情报数趋势',
                },
                grid: {
                    left: '6%',
                    right: '5%',
                    bottom: '10%'
                },
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '情报数',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }]
            });

            mainCarNum.setOption({
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                title: {
                    left: 'left',
                    text: '车辆清收趋势',
                },
                grid: {
                    left: '6%',
                    right: '5%',
                    bottom: '10%'
                },
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '车辆清收数',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }]
            });


        };

        this.initContent = function() {
            var page = new jh.ui.page({
                data_container: $('#statistic_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/statistics/sort',
                showPageTotal: false,
                jump: false,
                show_page_number: 3,
                contentType: 'application/json',
                data: {
                    type: 'trace',
                    pageSize:5,
                    yearMonth: $('#infoTimeInput').val()
                },
                callback: function(data) {
                    return jh.utils.template('statistic_content_template', data);
                }
            });
            page.init();
        };

        this.initClear = function() {
            var page = new jh.ui.page({
                data_container: $('#clear_info_container'),
                page_container: $('#page_clear_container'),
                method: 'post',
                url: '/statistics/sort',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.clearform),
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
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }],
                yAxis: [{
                    show: false,
                    type: 'value'
                }],
                series: [{
                    name: '月度新增',
                    type: 'bar',
                    barWidth: '40%',
                    data: [10, 52, 200, 334, 390, 330, 220]
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
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    show: false,
                    type: 'value'
                },
                series: [{
                    name: '月度增长量',
                    type: 'line',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
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
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    show: false,
                    type: 'value'
                },
                series: [{
                    name: '情报数',
                    type: 'line',
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
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
        
        this.registerEvent = function() {

            $('select').select2({
                minimumResultsForSearch: Infinity
            });

            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/entrust',
                contentType: 'application/json',
                data: jh.utils.formToJson(_this.entrustform),
                done: function(returnData) {
                    var entrust = returnData.data;
                    var objSucceed = {},
                        objFailed = {};
                    var entrustContent = jh.utils.template('entrust_content_template', returnData);
                    $('.channelInfo').html(entrustContent);
                    for (var k = 0; k < entrust.length; k++) {
                        objSucceed.value = entrust[k].countSucceed;
                        objSucceed.name = '委托成功数';
                        objFailed.value = entrust[k].countFailed;
                        objFailed.name = '委托失败数';
                        _this.pieContent(k, objSucceed, objFailed);
                    }

                }
            });



        };
        this.pieContent = function(k, objSucceed, objFailed) {
            //图表
            var pieOne = echarts.init(document.getElementById('pie' + k));
            pieOne.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [{
                    name: '渠道委托',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [objSucceed, objFailed]
                }]
            });
        }
    }
    module.exports = StatisticInfo;
});