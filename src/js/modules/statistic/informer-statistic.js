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
      this.mapNumber();
      this.areaTable(_this.data);
      window.initContent('2018-01', true);
      window.initClear('2018-01', true);
      window.initEntrustSort('2018-01', true);
      this.registerEvent();
      setTimeout(function(){
        jh.utils.changeText($('#breadCrumb'),'首页>业务统计>线人统计');
      },0)
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
          var informer = returnData.data.informer;
          for(var i = 0; i < informer.length; i++) {
            _this.informerMonths.push(informer[i].days);
            _this.informerCount.push(informer[i].count);
          }
          _this.sectionTable();
        }
      });
      jh.utils.ajax.send({
        method: 'post',
        url: '/statistics/general/total',
        contentType: 'application/json',
        data: {
          type: 'informer',
          yearMonth: obj.y + '-' + obj.M
        },
        isSearch: isSearch,
        done: function(returnData) {
          $('.informer_sum').html(returnData.data.informer)
        }
      });
    };

    //      发展线人对应渠道
    window.initEntrustSort = function(obj, isSearch) {
      _this.sectorName = [];
      _this.sectorCount = [];
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
          role: 'type_A',
          date: obj.y + '-' + obj.M + '-' + obj.d
        },
        done: function(returnData) {
          var informerSector = returnData.data;
          for(var j = 0; j < informerSector.length; j++) {
            var sectorObj = {};
            _this.sectorName.push(informerSector[j].name);
            sectorObj.value = informerSector[j].countEach;
            sectorObj.name = informerSector[j].name;
            _this.sectorCount.push(sectorObj);
            if (sectorObj.value == 0) {
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
            role: 'type_A',
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
        legend: {
          selectedMode: false,
          data:['线索数量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: _this.informerMonths,
          //axisLabel: {
          //  rotate: 60
          //},
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.1]
        }],
        series: [{
          name: '线索数量',
          type: 'bar',
          barWidth: '60%',
          data: _this.informerCount
        }]
      });
      mainBarNum.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
//        x: 'right',
          selectedMode: false,
//        data: []
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
          name: '线人数量',
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
          selectedMode: 'single',
          data: _this.sectorName
        },
        calculable: true,
        series: [{
          name: '发展线人数',
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
      infoChart = mainBarNum;

    };
    //      活跃线人统计
    window.initContent = function(obj, isSearch) {
      obj = typeof obj !== 'object' ? {
        y: now.year,
        M: now.month
      } : obj; //是否为第一次查询
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
        //console.log(p);//p为点击的地图对象，p.data为传入地图的data数据
        $('.informerArea').text('市级');
        _this.data = p.data.name + '%';
        $('.infoHun_name').text(p.data.name);
        _this.areaTable(_this.data);
      });

      $('select').select2({
        minimumResultsForSearch: Infinity
      });
      $('#informerWorld').click(function(){
        _this.areaTable();
        $('.informerArea').text('地区');
      })

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