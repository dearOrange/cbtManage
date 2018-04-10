/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
  function HunterStatistic() {
    var _this = this;
    var date = new Date();
    var now = {
      year: date.getFullYear(),
      month: date.getMonth() + 1
    };
    now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数

    var emChart = null;
    _this.data = '';
    _this.dataName = [];
//  新增捕头统计
    _this.hunterMonths = [];
    _this.hunterCount = [];
//  扇形
    _this.sectorName = [];
    _this.sectorCount = [];
    
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
      this.areaTable(_this.data);
      window.initContent('2018-01', true);
      window.initClear('2018-01', true);
      this.registerEvent();
    };

    //开头数据
    this.initHead = function() {
      jh.utils.ajax.send({
        url: '/statistics/downstream/general',
        done: function(returnData) {
          var dataFirst = jh.utils.template('statistic_hunter_template', returnData.data);
          $('#clue-echarts-list').html(dataFirst);

        }
      });
    };
    this.initSection = function() {
      var hunterOne = jh.utils.formToJson($('#hunterOne-form'));
      
      jh.utils.ajax.send({
        method: 'post',
        url: '/statistics/downstream/trend',
        contentType: 'application/json',
        data: hunterOne,
        done: function(returnData) {
          var hunter = returnData.data.hunter;
          for (var i = 0; i < hunter.length; i++) {
            _this.hunterMonths.push(hunter[i].days);
            _this.hunterCount.push(hunter[i].count);
          }
          _this.sectionTable();
        }
      });
//    扇形
      jh.utils.ajax.send({
          method: 'post',
          url: '/statistics/downstream/sourceRatio',
          contentType: 'application/json',
          data: {
              role: 'type_B',
              date: '2018-04-01'
          },
          done: function(returnData) {
              var hunterSector = returnData.data;
              for (var j = 0; j < hunterSector.length; j++) {
                  var sectorObj = {};
                  _this.sectorName.push(hunterSector[j].name);
                  sectorObj.value = hunterSector[j].countEach;
                  sectorObj.name = hunterSector[j].name;
                  _this.sectorCount.push(sectorObj);
              
              }
              _this.sectionTable();
          }
      });
    }
    
    this.areaTable = function(province) {
//      分布地区
        _this.sectionTable();
        var page = new jh.ui.page({
            data_container: $('#ranking_info_container'),
            page_container: $('#page_clear_container'),
            method: 'post',
            url: '/statistics/downstream/distribution',
            contentType: 'application/json',
            data: {
                role: 'type_B',
                province: province
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
                data : _this.hunterMonths,
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
                data:_this.hunterCount
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
              data:[]
          },
          series : [
              {
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
                  data:[
                      {name:'西藏'},
                      {name:'青海'},
                      {name:'宁夏'},
                      {name:'海南'},
                      {name:'甘肃'},
                      {name:'贵州'},
                      {name:'新疆'},
                      {name:'云南'},
                      {name:'重庆'},
                      {name:'吉林'},
                      {name:'山西'},
                      {name:'天津'},
                      {name:'江西'},
                      {name:'广西'},
                      {name:'陕西'},
                      {name:'黑龙江'},
                      {name:'内蒙古'},
                      {name:'安徽'},
                      {name:'北京'},
                      {name:'福建'},
                      {name:'上海'},
                      {name:'湖北'},
                      {name:'湖南'},
                      {name:'四川'},
                      {name:'辽宁'},
                      {name:'河北'},
                      {name:'河南'},
                      {name:'浙江'},
                      {name:'山东'},
                      {name:'江苏'},
                      {name:'广东'}
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
      emChart = mainBarNum;
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
//        return jh.utils.template('statistic_content_template', data);
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
//        return jh.utils.template('clear_content_template', data);
        }
      });
      page.init();
    };


    this.registerEvent = function() {

      emChart.on('click', function(p) {
        console.log(p.data.name);//p为点击的地图对象，p.data为传入地图的data数据
        _this.dataName = p.data.name;
        _this.data = p.data.name + '%';
        _this.areaTable(_this.data);
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

  module.exports = HunterStatistic;
});