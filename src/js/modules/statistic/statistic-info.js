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
		//      _this.form = $('#user-manage-form');
		_this.traceData = [];
		_this.carRecoveryData = [];
		this.init = function() {
			this.initHead();
			this.sectionTable();
			this.initContent();
			this.registerEvent();
			
			$('select').select2({
				minimumResultsForSearch: Infinity
			});
		};
		this.initContent = function() {
			var page = new jh.ui.page({
				data_container: $('#statistic_container'),
				page_container: $('#page_container'),
				method: 'post',
				url: '/task/distributeList',
				contentType: 'application/json',
				data: {},
				callback: function(data) {
					return jh.utils.template('statistic_content_template', data);
				}
			});
			page.init();
		};
//		开头数据
		this.initHead = function(){
			jh.utils.ajax.send({
                url: '/statistics/general',
                done: function(returnData) {
                    var dataFirst = jh.utils.template('statistic_first_template', returnData.data);
                    $('.echarts-list').html(dataFirst);
                    _this.headTable();
                }
            });
		};
		
		this.headTable = function(){
			var mainBar = echarts.init(document.getElementById('mainBar'));
			var mainLine = echarts.init(document.getElementById('mainLine'));
			var mainArea = echarts.init(document.getElementById('mainArea'));
			
			var optionBar = {
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
					name: '直接访问',
					type: 'bar',
					barWidth: '60%',
					data: [10, 52, 200, 334, 390, 330, 220]
				}]
			};

			var optionLine = {
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
					name: '模拟数据',
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
			};
			
			mainLine.setOption(optionLine);
			mainBar.setOption(optionBar);
			mainArea.setOption(optionLine);
			
		};
		this.sectionTable = function() {
			jh.utils.ajax.send({
                url: '/statistics/trend',
                data: {
                	year: '2017'
                },
                done: function(returnData) {
                    _this.trace = returnData.data.trace;
                    var carRecovery = returnData.data.carRecovery;
                    
                }
            });
			
			
			var mainInformate = echarts.init(document.getElementById('mainInformate'));
			var informateBar = {
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
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '直接访问',
					type: 'bar',
					barWidth: '60%',
					data: [10, 52, 200, 334, 390, 330, 220]
				}]
			};
			
			mainInformate.setOption(informateBar);
			
		};
		this.registerEvent = function() {
			// 图表
			var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
			var pieOne = echarts.init(document.getElementById('pieOne'));
			var pieTwo = echarts.init(document.getElementById('pieTwo'));
			var pieThree = echarts.init(document.getElementById('pieThree'));
			var pieFour = echarts.init(document.getElementById('pieFour'));
			var carNumBar = {
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
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '直接访问',
					type: 'bar',
					barWidth: '60%',
					data: [10, 52, 200, 334, 390, 330, 220]
				}]
			};
			
			var mainPie = {
			    tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)"
			    },
			    series: [
			        {
			            name:'访问来源',
			            type:'pie',
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
			            data:[
			                {value:335, name:'直接访问'},
			                {value:310, name:'邮件营销'},
			                {value:234, name:'联盟广告'},
			                {value:135, name:'视频广告'},
			                {value:1548, name:'搜索引擎'}
			            ]
			        }
			    ]
			};
			
			mainCarNum.setOption(carNumBar);
			pieOne.setOption(mainPie);
			pieTwo.setOption(mainPie);
			pieThree.setOption(mainPie);
			pieFour.setOption(mainPie);
		};
	}
	module.exports = StatisticInfo;
});