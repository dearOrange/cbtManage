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
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数

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
            window.initContent('2018-01');
            window.initClear('2018-01');
            window.initEntrustSort('2018-01');
            this.registerEvent();
        };

        //开头数据
        this.initHead = function() {
            jh.utils.ajax.send({
                url: '/statistics/general',
                done: function(returnData) {
                    var upstreamTrendList = returnData.data.upstream.trendList;
                    var traceTrendList = returnData.data.trace.trendList;
                    var downstreamTrendList = returnData.data.downstream.trendList;
                    for (var a = 0; a < upstreamTrendList.length; a++) {
                        _this.upstreamTrendMonths.push(upstreamTrendList[a].months);
                        _this.upstreamTrendCount.push(upstreamTrendList[a].count);
                    }
                    for (var b = 0; b < traceTrendList.length; b++) {
                        _this.traceTrendMonths.push(traceTrendList[b].months);
                        _this.traceTrendCount.push(traceTrendList[b].count);
                    }
                    for (var c = 0; c < downstreamTrendList.length; c++) {
                        _this.downstreamTrendMonths.push(downstreamTrendList[c].months);
                        _this.downstreamTrendCount.push(downstreamTrendList[c].count);
                    }
                    var dataFirst = jh.utils.template('statistic_first_template', returnData.data);
                    $('.echarts-list').html(dataFirst);
                    _this.headTable();
                }
            });
        };
        this.initSection = function() {
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/traceTrend',
                contentType: 'application/json',
                data: {
                    tabName: 'trace',
                    limit: '12'
                },
                done: function(returnData) {
                    var trace = returnData.data.trace;
                    for (var i = 0; i < trace.length; i++) {
                        _this.traceMonths.push(trace[i].months);
                        _this.traceCount.push(trace[i].count);
                    }
                    _this.sectionTable();
                }
            });
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/recoveryTrend',
                contentType: 'application/json',
                data: {
                    tabName: 'task',
                    limit: '12'
                },
                done: function(returnData) {
                    var carRecovery = returnData.data.task;
                    for (var j = 0; j < carRecovery.length; j++) {
                        _this.carRecoveryMonths.push(carRecovery[j].months);
                        _this.carRecoveryCount.push(carRecovery[j].count);
                    }
                    _this.sectionTable();
                }
            });
        }
        this.sectionTable = function() {
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
                    data: _this.traceMonths
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '情报数',
                    type: 'bar',
                    barWidth: '60%',
                    data: _this.traceCount
                }],
                noDataLoadingOption: {
                    text: '暂无数据',
                    effect: 'bubble',
                    effectOption: {
                        effect: {
                            n: 0
                        }
                    }
                }
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
                    data: _this.carRecoveryMonths
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '车辆清收数',
                    type: 'bar',
                    barWidth: '60%',
                    data: _this.carRecoveryCount
                }]
            });


        };

        window.initContent = function(obj) {

            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

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
                    pageSize: 5,
                    yearMonth: obj.y + '-' + obj.M
                },
                callback: function(data) {
                    return jh.utils.template('statistic_content_template', data);
                }
            });
            page.init();
        };

        window.initClear = function(obj) {

            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#clear_info_container'),
                page_container: $('#page_clear_container'),
                method: 'post',
                url: '/statistics/sort',
                contentType: 'application/json',
                data: {
                    type: 'carRecovery',
                    yearMonth: obj.y + '-' + obj.M
                },
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

        window.initEntrustSort = function(obj) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/entrust',
                contentType: 'application/json',
                data: {
                    yearMonth: obj.y + '-' + obj.M
                },
                done: function(returnData) {
                    var entrust = returnData.data;
                    var noResultBox = $('#entrustNoResultBox');
                    if (!entrust.length) {
                        noResultBox.removeClass('hide');
                        noResultBox.prev().addClass('hide');
                        return false;
                    } else {
                        noResultBox.addClass('hide');
                        noResultBox.prev().removeClass('hide');
                    }
                    var entrustContent = jh.utils.template('entrust_content_template', returnData);
                    $('#entrustResultBox').html(entrustContent);
                    for (var k = 0; k < entrust.length; k++) {
                        _this.countRate = entrust[k].countRate;
                        _this.pieContent(k, _this.countRate);
                    }

                }
            });
        };

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
	        		$('.channelInner').css('marginLeft','-240px');
	        		$(".channelInner dl").eq(k).prependTo($(".channelInner"));
	        		$('.channelInner').animate({marginLeft:"0px"}, 1000);
	        	});
	        	$('body').off('click', '.nextBtn').on('click', '.nextBtn', function() {
	        		$('.channelInner').animate({marginLeft:"-240px"},1000, function(){
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
    window.statisticTraceMonthChanged = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj);
    };
    window.statisticTraceYearChanged = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj);
    };
    /**
     * 情报end
     */

    /**
     * 渠道委托begin
     */
    window.statisticEntrustMonthChanged = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj);
    };
    window.statisticEntrustYearChanged = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj);
    };
    /**
     * 渠道委托end
     */

    /**
     * 车辆清收begin
     */
    window.statisticRecoveryMonthChanged = function() {
        var obj = $dp.cal.newdate;
        window.initClear(obj);
    };
    window.statisticRecoveryYearChanged = function() {
        var obj = $dp.cal.newdate;
        window.initClear(obj);
    };
    /**
     * 车辆清收end
     */

    module.exports = StatisticInfo;
});