/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function InformerStatistic() {
        var _this = this;
        var date = new Date();
        var now = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
        now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
        now.day = now.day.toString().length === 1 ? '0' + now.day : now.day; //日期两位数
//      线人趋势统计
        _this.informerMonths = [];
        _this.informerCount = [];
//      扇形
        _this.sectorName = [];
        _this.sectorCount = [];
        _this.sectorRate = [];
//      省份
        _this.provinceName = [];
        _this.provinceCount = [];
        
        
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
            this.areaTable();
            window.initContent('2018-01', true);
            window.initClear('2018-01', true);
//          window.initEntrustSort('2018-01', true);
            this.registerEvent();
        };

        //开头数据
        this.initHead = function() {
            jh.utils.ajax.send({
                url: '/statistics/downstream/general',
                done: function(returnData) {
                    var dataFirst = jh.utils.template('statistic_informer_template', returnData.data);
                    $('#clue-echarts-list').html(dataFirst);
                }
            });
        };
        this.initSection = function() {
            var informerOne = jh.utils.formToJson($('#informerOne-form'));
//          var informerTwo = jh.utils.formToJson($('#clueTwo-information-form'));
//          var informerThree = jh.utils.formToJson($('#clueThree-information-form'));
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/downstream/trend',
                contentType: 'application/json',
                data: informerOne,
                done: function(returnData) {
                    var informer = returnData.data.informer;
                    for (var i = 0; i < informer.length; i++) {
                        _this.informerMonths.push(informer[i].days);
                        _this.informerCount.push(informer[i].count);
                    }
                    _this.sectionTable();
                }
            });
//          扇形图
//          obj = typeof obj !== 'object' ? { y: now.year, M: now.month, d: now.day } : obj; //是否为第一次查询
//          obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
//          obj.d = obj.d.toString().length === 1 ? '0' + obj.d : obj.d; //日期两位数
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/downstream/sourceRatio',
                contentType: 'application/json',
                data: {
                    role: 'type_A',
                    date: '2018-04-01'
                },
                done: function(returnData) {
                    var informerSector = returnData.data;
                    for (var j = 0; j < informerSector.length; j++) {
                        var sectorObj = {};
                        _this.sectorName.push(informerSector[j].name);
                        sectorObj.value = informerSector[j].countEach;
                        sectorObj.name = informerSector[j].name;
                        _this.sectorCount.push(sectorObj);
                    
                    }
                    _this.sectionTable();
                }
            });
            
        }
        
        this.areaTable = function() {
//          分布地区
            _this.sectionTable();
            var page = new jh.ui.page({
                data_container: $('#ranking_info_container'),
                page_container: $('#page_clear_container'),
                method: 'post',
                url: '/statistics/downstream/distribution',
                contentType: 'application/json',
                data: {
                    role: 'type_A',
                    province: '山东%'
                },
                isSearch: true,
                callback: function(data) {
                    return jh.utils.template('ranking_content_template', data);
                }
            });
            page.init();
        }
        
        this.sectionTable = function() {
            var mainInformate = echarts.init(document.getElementById('mainInformate'));
            var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
            var mainBarNum = echarts.init(document.getElementById('mainBarNum'));
            mainInformate.setOption({
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : _this.informerMonths,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'线索数量',
                        type:'bar',
                        barWidth: '60%',
                        data:_this.informerCount
                    }
                ]
            });
            mainBarNum.setOption({
                tooltip : {
                    trigger: 'item'
                },
                legend: {
                    x:'right',
                    selectedMode:false,
                    data:_this.provinceName
                },
                series : [
                    {
                        name: '2011全国GDP分布',
                        type: 'map',
                        mapType: 'china',
                        mapLocation: {
                            x: 'left'
                        },
                        selectedMode : 'multiple',
                        itemStyle:{
                            normal:{label:{show:true}},
                            emphasis:{label:{show:true}}
                        },
                        data:_this.provinceCount
                    }
                ],
                animation: false
            }, true);
            mainCarNum.setOption({
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                  orient : 'vertical',
                  x : 'left',
                  data:[]
              },
              
              calculable : true,
              series : [
                  {
                      name:'访问来源',
                      type:'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:[]
                  }
              ]
          });

        };
//      活跃线人统计
        window.initContent = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#downstream_statistic_container'),
                page_container: $('#page_container'),
                method: 'post',
                url: '/statistics/downstream/activeSort',
                contentType: 'application/json',
                data: {
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
                callback: function(data) {
                    return jh.utils.template('downstream_content_template', data);
                }
            });
            page.init();
        };
        
//      排名
        window.initClear = function(obj, isSearch) {
//          obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
//          obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数

            var page = new jh.ui.page({
                data_container: $('#ranking_info_container'),
                page_container: $('#page_clear_container'),
                method: 'post',
                url: '/statistics/recoverySort',
                contentType: 'application/json',
//              data: {
//                pageSize: 5,
//                  type: 'carRecovery',
//                  yearMonth: obj.y + '-' + obj.M
//              },
//              isSearch: isSearch,
                show_page_number: 3,
                callback: function(data) {
                    return jh.utils.template('ranking_content_template', data);
                }
            });
            page.init();
        };

        window.initEntrustSort = function(obj, isSearch) {
            obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
            obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
            jh.utils.ajax.send({
                method: 'post',
                url: '/statistics/entrust',
                contentType: 'application/json',
                data: {
                    yearMonth: obj.y + '-' + obj.M
                },
                isSearch: isSearch,
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
//      this.pieContent = function(k, countRate) {
//        radialIndicator('#pie' + k, {
//        showPercentage : false, // option
//        barColor: '#87CEEB',
//          barWidth: 10,
//          initValue: countRate,
//          roundCorner : true,
//          percentage: true
//    });
//    var aa = $('.channelDistance').width() * (k+1);
//    $('.channelInner').width(aa);
//    var cc = $('.channelInfo').width();
//    if(aa > cc) {
//          $('body').off('click', '.preBtn').on('click', '.preBtn', function() {
//            $('.channelInner').animate({marginLeft:"0px"}, 500, function() {
//              $(".channelInner dl").eq(k).prependTo($(".channelInner"));
//              $('.channelInner').css('marginLeft','-240px');
//            });
//          });
//          $('body').off('click', '.nextBtn').on('click', '.nextBtn', function() {
//            $('.channelInner').animate({marginLeft:"-240px"},500, function(){
//              $(".channelInner dl").eq(0).appendTo($(".channelInner"));
//              $('.channelInner').css('marginLeft','0px');
//            })
//          })
//        }
//      };
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

    module.exports = InformerStatistic;
});