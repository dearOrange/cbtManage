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
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    now.month = now.month.toString().length === 1 ? '0' + now.month : now.month; //月份两位数
    now.day = now.day.toString().length === 1 ? '0' + now.day : now.day; //日期两位数

    var hunterChart = null;
    _this.data = '';
    this.init = function() {
      $('#infoTimeInput').val(now.year + '-' + now.month);
      $('#entrustTimeInput').val(now.year + '-' + now.month + '-' + now.day);
      this.initHead();
      this.mapNumber();
      this.sectionTable();
      this.areaTable(_this.data);
      window.initClear('2018-01', true);
      window.initContent('2018-01', true);
      this.registerEvent();
      setTimeout(function(){
        jh.utils.changeText($('#breadCrumb'),'首页>业务统计>捕头统计');
      },0)
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
    //  新增捕头统计
    window.initClear = function(obj, isSearch) {
      _this.hunterMonths = [];
      _this.hunterCount = [];
      obj = typeof obj !== 'object' ? {
        y: now.year,
        M: now.month
      } : obj; //是否为第一次查询
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
          var hunter = returnData.data.hunter;
          for(var i = 0; i < hunter.length; i++) {
            _this.hunterMonths.push(hunter[i].days);
            _this.hunterCount.push(hunter[i].count);
          }
          _this.sectionTable();
        }
      });
      jh.utils.ajax.send({
        method: 'post',
        url: '/statistics/general/total',
        contentType: 'application/json',
        data: {
          type: 'hunter',
          yearMonth: obj.y + '-' + obj.M
        },
        isSearch: isSearch,
        done: function(returnData) {
          $('.hunter_sum').html(returnData.data.hunter)
        }
      });
    };
    //  发展捕头对应渠道
    window.initContent = function(obj, isSearch) {
      _this.sectorName = [];
      _this.sectorCount = [];
      _this.flag = true;
      obj = typeof obj !== 'object' ? {
        y: now.year,
        M: now.month,
        d: now.day
      } : obj; //是否为第一次查询
      obj.M = obj.M.toString().length === 1 ? '0' + obj.M : obj.M; //月份两位数
      obj.d = obj.d.toString().length === 1 ? '0' + obj.d : obj.d; //月份两位数
      jh.utils.ajax.send({
        method: 'post',
        url: '/statistics/downstream/sourceRatio',
        contentType: 'application/json',
        data: {
          role: 'type_B',
          date: obj.y + '-' + obj.M + '-' + obj.d
        },
        done: function(returnData) {
          var hunterSector = returnData.data;
          for(var j = 0; j < hunterSector.length; j++) {
            var sectorObj = {};
            _this.sectorName.push(hunterSector[j].name);
            sectorObj.value = hunterSector[j].countEach;
            sectorObj.name = hunterSector[j].name;
            _this.sectorCount.push(sectorObj);
            
            if (hunterSector.length == 1 && sectorObj.value == 0) {
              _this.flag = false;
            }else {
              _this.flag = true;
            }
          }
          _this.sectionTable();
        }
      });
    };
    this.mapNumber = function() {
      jh.utils.ajax.send({
        method: 'post',
        url: '/statistics/downstream/distribution',
        contentType: 'application/json',
        data: {
          pageNum: 1,
          pageSize: 50,
          params:{
            role: 'type_B',
            province: ''
          }
        },
        done: function(data) {
          var data = data.data.list;
          _this.mapData = [];
          for(var k = 0;k<data.length;k++) {
            var mapObj = {};
            mapObj.name = data[k].area.replace(/(省|市|自治区|回族自治区|壮族自治区|维吾尔自治区|特别行政区)$/g, '');
            mapObj.value = data[k].count;
            _this.mapData.push(mapObj);
          }
        }
      });
    }
    this.areaTable = function(province) {
      if(province == '') {
        $('.infoHun_name').text('全国');
      }
      //      分布地区
      var page = new jh.ui.page({
        data_container: $('#ranking_info_container'),
        page_container: $('#page_clear_container'),
        method: 'post',
        url: '/statistics/downstream/distribution',
        contentType: 'application/json',
        jump: false,
        show_page_number: 3,
        showPageTotal: false,
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

      jh.utils.ajax.send({
        method: 'post',
        url: '/statistics/downstream/distributionTotal',
        contentType: 'application/json',
        data: {
          role: 'type_B',
          province: province
        },
        done: function(returnData) {
          $('.infoHun_sum').html(returnData.data.rangeTotal);
        }
      });
    }

    this.sectionTable = function() {
      var mainInformate = echarts.init(document.getElementById('mainInformate'));
      var mainCarNum = echarts.init(document.getElementById('mainCarNum'));
      var mainBarNum = echarts.init(document.getElementById('mainBarNum'));
      mainInformate.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: _this.hunterMonths,
//        axisLabel: {
//          rotate: 60
//        },
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
          axisLabel : {
            formatter :  '{value}'
          },
          boundaryGap: [0, 0.1]
        }],
        series: [{
          name: '线索数量',
          type: 'bar',
          barWidth: '60%',
          data: _this.hunterCount
        }]
      });
      mainBarNum.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
//        x: 'right',
          selectedMode: false,
//        data:[]
        },
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 100,
          text: ['高', '低'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [{
          name: '捕头数量',
          type: 'map',
          mapType: 'china',
          selectedMode: 'single',
          itemStyle: {
            normal: {
              label: {
                show: true
              },
              areaColor: '#ffeeff'
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          data: _this.mapData
        }],
        animation: false
      }, true);
      mainCarNum.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          selectedMode: false,
          data: _this.sectorName
        },
        axis: {
          
        },
        calculable: true,
        series: [{
          name: '发展捕头数',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          itemStyle : {
            normal : {
              label : {
                  show : _this.flag
              },
              labelLine : {
                  show : _this.flag
              }
            }
          },
          stillShowZeroSum: _this.flag,
          data: _this.sectorCount
        }]
      });
      hunterChart = mainBarNum;
    };

    this.registerEvent = function() {

      hunterChart.on('click', function(p) {
        //console.log(p.data.name);//p为点击的地图对象，p.data为传入地图的data数据
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
   * 情报begin
   */
  window.statisticTraceDaying = function() {
    var obj = $dp.cal.newdate;
    window.initContent(obj, true);
  };
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
  window.statisticRecoveryYearing = function() {
    var obj = $dp.cal.newdate;
    window.initClear(obj, true);
  };
  window.statisticRecoveryMonthing = function() {
    var obj = $dp.cal.newdate;
    window.initClear(obj, true);
  };
  /**
   * 车辆清收end
   */

  module.exports = HunterStatistic;
});