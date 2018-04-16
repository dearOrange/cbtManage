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
        
        var infoChart = null;
        _this.data = '';

        this.init = function() {
            $('#infoTimeInput,#carRecoveryInput').val(now.year + '-' + now.month);
            $('#entrustTimeInput').val(now.year + '-' + now.month + '-' + now.day);
            this.initHead();
            this.sectionTable();
            this.areaTable(_this.data);
            window.initContent('2018-01', true);
            window.initClear('2018-01', true);
            window.initEntrustSort('2018-01', true);
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
//      新增线人统计
        window.initClear = function(obj, isSearch) {
          _this.informerMonths = [];
          _this.informerCount = [];
          obj = typeof obj !== 'object' ? { y: now.year, M: now.month } : obj; //是否为第一次查询
          obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
          jh.utils.ajax.send({
            method: 'post',
            url: '/statistics/downstream/trend',
            contentType: 'application/json',
            data: {
                type: 'downstream',
                yearMonth: obj.y + '-' + obj.M
            },
            done: function(returnData) {
                var informer = returnData.data.informer;
                for (var i = 0; i < informer.length; i++) {
                    _this.informerMonths.push(informer[i].days);
                    _this.informerCount.push(informer[i].count);
                }
                _this.sectionTable();
            }
          });
        };
        
//      发展线人对应渠道
        window.initEntrustSort = function(obj, isSearch) {
          _this.sectorName = [];
          _this.sectorCount = [];
          obj = typeof obj !== 'object' ? { y: now.year, M: now.month, d: now.day } : obj; //是否为第一次查询
          obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
          obj.d = obj.d.toString().length === 1 ? '0' + obj.d : obj.d; //月份两位数
          jh.utils.ajax.send({
            method: 'post',
            url: '/statistics/downstream/sourceRatio',
            contentType: 'application/json',
            data: {
                role: 'type_A',
                date: obj.y + '-' + obj.M + '-' + obj.d
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
        };
        this.areaTable = function(province) {
          if(province == '') {
            $('.infoHun_name').text('全国');
          }
//          分布地区
          var page = new jh.ui.page({
            data_container: $('#informer_ranking_container'),
            page_container: $('#page_clear_container'),
            method: 'post',
            url: '/statistics/downstream/distribution',
            contentType: 'application/json',
            jump: false,
            show_page_number: 3,
            showPageTotal: false,
            isSearch: true,
            data: {
                role: 'type_A',
                province: province
            },
            callback: function(data) {
              return jh.utils.template('informer_ranking_template', data);
            }
          });
          page.init();
          
          jh.utils.ajax.send({
            method: 'post',
            url: '/statistics/downstream/distributionTotal',
            contentType: 'application/json',
            data: {
                role: 'type_A',
                province: province
            },
            done: function(returnData) {
                $('infoHun_sum').html(returnData.data.rangeTotal);
            }
          });
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
//                      axisLabel: {
//                        rotate: 60
//                      },
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
                    data:[_this.dataName]
                },
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    max: 10000,
                    text:['High','Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['lightskyblue','yellow', 'orangered']
                    }
                },
                series : [
                    {
                        name: '线人数量',
                        type: 'map',
                        mapType: 'china',
                        selectedMode : 'single',
                        itemStyle:{
                            normal:{
                              label:{show:true},
                              areaColor: '#ffeeff'
                            },
                            emphasis:{label:{show:true}}
                        },
                        data:[
                          {name:'西藏', value:60},
                          {name:'青海', value:167},
                          {name:'宁夏', value:210},
                          {name:'海南', value:252},
                          {name:'甘肃', value:502},
                          {name:'贵州', value:570},
                          {name:'新疆', value:661},
                          {name:'云南', value:889},
                          {name:'重庆', value:1001},
                          {name:'吉林', value:1056},
                          {name:'山西', value:1123},
                          {name:'天津', value:1130},
                          {name:'江西', value:1170},
                          {name:'广西', value:1172},
                          {name:'陕西', value:1251},
                          {name:'黑龙江', value:1258},
                          {name:'内蒙古', value:1435},
                          {name:'安徽', value:1530},
                          {name:'北京', value:1625},
                          {name:'福建', value:1756},
                          {name:'上海', value:1919},
                          {name:'湖北', value:1963},
                          {name:'湖南', value:1966},
                          {name:'四川', value:2102},
                          {name:'辽宁', value:2222},
                          {name:'河北', value:2451},
                          {name:'河南', value:2693},
                          {name:'浙江', value:3231},
                          {name:'山东', value:4536},
                          {name:'江苏', value:4911},
                          {name:'广东', value:5321}
                        ]
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
                  data:_this.sectorName
              },
              
              calculable : true,
              series : [
                  {
                      name:'访问来源',
                      type:'pie',
                      radius : '55%',
                      center: ['50%', '60%'],
                      data:_this.sectorCount
                  }
              ]
          });
          infoChart = mainBarNum;

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
        
        this.registerEvent = function() {
          infoChart.on('click', function(p) {
//          console.log(p);//p为点击的地图对象，p.data为传入地图的data数据
            _this.data = p.data.name + '%';
            $('.infoHun_name').text(p.data.name);
            _this.areaTable(_this.data);
          });
          
            $('select').select2({
                minimumResultsForSearch: Infinity
            });

        };
    }
    /**
     * 活跃线人统计begin
     */
    window.statisticTraceMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj, true);
    };
    window.statisticTraceMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initContent(obj, true);
    };
    /**
     * 活跃线人统计end
     */

    /**
     * 发展线人对应渠道begin
     */
    window.statisticEntrustDaying = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj, true);
    };
    window.statisticEntrustMonthing = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj, true);
    };
    window.statisticEntrustYearing = function() {
        var obj = $dp.cal.newdate;
        window.initEntrustSort(obj, true);
    };
    /**
     * 发展线人对应渠道end
     */

    /**
     * 线人统计begin
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
     * 线人统计end
     */

    module.exports = InformerStatistic;
});