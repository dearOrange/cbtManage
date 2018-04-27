/**
 * OpenList
 * @authors Your Name (you@example.org)
 * @date    2017-05-24 14:32:26
 * @version 1.0
 */
'use strict';
define(function(require, exports, module) {
    function MapList() {
        var _this = this;
        this.init = function() {
          this.initContent();
          setTimeout(function() {
            jh.utils.changeText($('#breadCrumb'), '首页>业务统计>雷达显示');
          }, 0)
        };
        this.initContent = function() {
          var scale = new AMap.Scale({
            visible: true
          }),
          toolBar = new AMap.ToolBar({
            visible: true
          }),
          map = new AMap.Map('map_container', {
            resizeEnable: true,
            zoom:5
          });
          map.addControl(scale);
          map.addControl(toolBar);
            
          var createMarker = function(data,hide) {
            var marker = new AMap.Marker({
              position: data.center.split(','),
              title: data.name,
              map: map,
              offset: new AMap.Pixel(-36, -76),
              content: '<div class="area_color"><p>'+data.name+'</p><p><span style="font-size:16px;">'+data.pcount+'</span><span>人</span></p><p><span style="font-size:16px;">'+data.tcount+'</span><span>车</span></p></div>',
            });
            return marker;
          }
//        二级
          var createCityMarker = function(data,hide) {
            var markerCity = new AMap.Marker({
              position: data.center.split(','),
              title: data.name,
              map: map,
              offset: new AMap.Pixel(-36, -76),
              content: '<div class="area_color"><p>'+data.name+'</p><p><span style="font-size:16px;">'+data.pcount+'</span><span>人</span></p><p><span style="font-size:16px;">'+data.tcount+'</span><span>车</span></p></div>',
            });

            markerCity.subMarkers = []; //添加市
            map.setCenter(markerCity.getPosition());
            if(!hide){
              markerCity.setMap(map)
            }
            if(data&&data.length){
              for(var i = 0 ; i<data.length;i+=1){
                markerCity.subMarkers.push(createCityMarker(data[i],true));
              }
            }
            return markerCity;
          }
//        三级
          var createFingerMarker = function(data,hide) {
            var content = data.type == 0 ? '<div class="area_img task_car_img"></div>' : '<div class="area_img yellow_car_img"></div>';
            var markerFinger = new AMap.Marker({
              position: data.fingerprint.split(','),
              map: map,
              offset: new AMap.Pixel(-36, -76),
              content: content
            });

            markerFinger.subMarkers = []; //添加市
            map.setCenter(markerFinger.getPosition());
            if(!hide){
              markerFinger.setMap(map)
            }
            if(data&&data.length){
              for(var i = 0 ; i<data.length;i+=1){
                markerFinger.subMarkers.push(createFingerMarker(data[i],true));
              }
            }
            
            var geocoder = new AMap.Geocoder({
                city: "010" //城市，默认：“全国”
            });
            geocoder.getAddress(data.fingerprint.split(','), function(status, result) {
              geocoder_CallBack(result);
                if (status === 'complete' && result.info === 'OK') {
                    geocoder_CallBack(result);
                }
            });
            
            function geocoder_CallBack(res) {
                data.address = res.regeocode.formattedAddress; //返回地址描述
//              
                var infoWindow = new AMap.InfoWindow({
                //基点指向marker的头部位置
                content: '<ul class="position_info"><li><span>车牌号：</span><span>'+data.carNumber+'</span></li><li><span>颜色：</span><span>'+data.carColor+'</span></li><li><span>车型车系：</span><span>'+data.carBrand+'-'+data.carSeries+'-'+data.carModel+'</span></li><li><span>时间：</span><span>'+data.occurAt+'</span></li><li><span>位置：</span><span>'+data.address+'</span></li></ul>',
                offset: new AMap.Pixel(0, -31)
              });
              
              //marker 点击时打开
              AMap.event.addListener(markerFinger, 'click', function() {
                infoWindow.open(map, markerFinger.getPosition());
              });
            }
            
            return markerFinger;
          }
          
          var createPersonMarker = function(data,hide) {
            var content, role;
            if(data.role === 'type_A') {
              content = '<div class="area_img informers_img"></div>';
              role = '线人';
            }else if (data.role === 'type_B') {
              content = '<div class="area_img hunters_img"></div>';
              role = '捕头';
            }else {
              content = '<div class="area_img workers_img"></div>';
              role = '工作人员';
            }
            var markerPerson = new AMap.Marker({
              position: data.fingerprint.split(','),
              map: map,
              offset: new AMap.Pixel(-36, -76),
              content: content
            });

            markerPerson.subMarkers = []; //添加市
            map.setCenter(markerPerson.getPosition());
            if(!hide){
              markerPerson.setMap(map)
            }
            if(data&&data.length){
              for(var i = 0 ; i<data.length;i+=1){
                markerPerson.subMarkers.push(createPersonMarker(data[i],true));
              }
            }
            var geocoder = new AMap.Geocoder({
                city: "010" //城市，默认：“全国”
            });
            geocoder.getAddress(data.fingerprint.split(','), function(status, result) {
              geocoder_CallBack(result);
                if (status === 'complete' && result.info === 'OK') {
                    geocoder_CallBack(result);
                }
            });
            
            function geocoder_CallBack(res) {
                data.address = res.regeocode.formattedAddress; //返回地址描述
                var infoWindow = new AMap.InfoWindow({
                //基点指向marker的头部位置
                content: '<ul class="position_info"><li><span>姓名：</span><span>'+data.name+'</span></li><li><span>类型：</span><span>'+role+'</span></li><li><span>联系方式：</span><span>'+data.phone+'</span></li><li><span>时间：</span><span>'+data.occurAt+'</span></li><li><span>位置：</span><span>'+data.address+'</span></li></ul>',
                offset: new AMap.Pixel(0, -31)
              });
              
              //marker 点击时打开
              AMap.event.addListener(markerPerson, 'click', function() {
                infoWindow.open(map, markerPerson.getPosition());
              });
            }
            
            return markerPerson;
          }
          
//        三级
          var _onZoomEnd = function(e) {
            if (map.getZoom() < 8) {
              map.remove(_this.markersFiger);
              map.remove(_this.markersPerson);
              map.add(_this.markersCity);
              map.remove(_this.markers);
              if (map.getZoom() < 6) {
                map.remove(_this.markersCity);
                map.add(_this.markers);
              }
            }else if (map.getZoom() > 8) {
              map.add(_this.markersFiger);
              map.add(_this.markersPerson);
              map.remove(_this.markersCity);
            }
          }
          var _onZoomOne = function(e) {
            if (map.getZoom() < 6) {
              map.remove(_this.markersCity);
              map.add(_this.markers);
            }
          }
//        三级
          var _fingerClick = function(e) {
            console.log(e)
            var fingerprint = e.target.F.position.lng +','+ e.target.F.position.lat;
            _this.markersFiger=[];
            _this.markersPerson=[];
            jh.utils.ajax.send({
              url: '/location/getNear',
              data:{
                fingerprint: fingerprint
              },
              done: function(returnData) {
                var subTaskFiger = returnData.data.nearTaskList;
                var subPerson = returnData.data.nearPersonList;
                for (var j = 0; j < subTaskFiger.length; j += 1) {
                  var markerFiger = createFingerMarker(subTaskFiger[j], true);
                  _this.markersFiger.push(markerFiger);
                }
                for (var j = 0; j < subPerson.length; j += 1) {
                  var markerPerFiger = createPersonMarker(subPerson[j], true);
                  _this.markersPerson.push(markerPerFiger);
                }
                if(_this.markersFiger.length){
                  map.add(_this.markersFiger);
                  map.setFitView(_this.markersFiger);
                  map.remove(_this.markersCity);
                 
                }
                if(_this.markersPerson.length){
                  map.add(_this.markersPerson);
                  map.setFitView(_this.markersPerson);
                  map.remove(_this.markersCity);
                }
              }
            })
            AMap.event.addListener(map, 'zoomend', _onZoomEnd);
          } 
//        二级
          var _onClick = function(e) {
            _this.markersCity=[];
            jh.utils.ajax.send({
              url: '/location/getProvince',
              data:{
                province: e.target.Pg.title
              },
              done: function(returnData) {
                var subProvince = returnData.data.list;
                for (var j = 0; j < subProvince.length; j += 1) {
                  var markerCity = createCityMarker(subProvince[j], true);
                  _this.markersCity.push(markerCity);
                  AMap.event.addListener(markerCity, 'click', _fingerClick);
                }
                if(_this.markersCity.length){
                  map.add(_this.markersCity);
                  map.setFitView(_this.markersCity);
                  map.remove(_this.markers)
                }
              }
            })
            AMap.event.addListener(map, 'zoomend', _onZoomOne);
          } 
//        一级
          _this.markers = [];
          jh.utils.ajax.send({
            url: '/location/getNationwide',
            done: function(returnData) {
              _this.taskList = returnData.data.list;
              for (var i = 0; i < _this.taskList.length; i += 1) {
                var marker = createMarker(_this.taskList[i]);
                _this.markers.push(marker);
                AMap.event.addListener(marker, 'click', _onClick);
              }
            }
          })
        };
    }
    module.exports = MapList;
});