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
        _this.fillColor = '#0089FF';
        this.init = function() {
            this.initContent();
            this.registerEvent();
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
            overView = new AMap.OverView({
              visible: true
            }),
            map = new AMap.Map('map_container', {
              resizeEnable: true,
              zoom:5
            });
            map.addControl(scale);
            map.addControl(toolBar);
            map.addControl(overView);
                 
//          AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
//            
//            var marker = new AMap.Marker({
//              map: map,
//              zIndex: 9999999,
//              position: map.getCenter()
//            });
//            marker.content = '<ul class="position_info"><li><span>姓名：</span><span>哈哈哈</span></li><li><span>类型：</span><span>哈哈哈</span></li><li><span>联系方式：</span><span>哈哈哈</span></li><li><span>位置：</span><span>哈哈哈</span></li></ul>';
//            var infoWindow = new AMap.InfoWindow({
//              //基点指向marker的头部位置
//              offset: new AMap.Pixel(0, -31)
//            });
//    
//            function openInfoWin() {
//              infoWindow.setContent(marker.content);
//              infoWindow.open(map, marker.getPosition());
//            }
//    
//            //marker 点击时打开
//            AMap.event.addListener(marker, 'click', function() {
//                openInfoWin();
//            });
//          });

      var createMarker = function(data,hide) {
        var marker = new AMap.Marker({
          position: data.center.split(','),
          title: data.name,
          map: map,
          offset: new AMap.Pixel(0, 0),
          content: '<div class="area_color"><p>内蒙古</p><p><span style="font-size:16px;">1432</span><span>人</span></p><p><span style="font-size:16px;">532</span><span>车</span></p></div>',
        });
        marker.subMarkers = [];
//      if(data.name==='北京市'||data.name==='河南省'){
          marker.setLabel({content:'&larr;请点击',offset:new AMap.Pixel(45,0)})
          map.setCenter(marker.getPosition());
//      }
        if(!hide){
          marker.setMap(map)
        }
        if(data.subDistricts&&data.subDistricts.length){
          for(var i = 0 ; i<data.subDistricts.length;i+=1){
            marker.subMarkers.push(createMarker(data.subDistricts[i],true));
          }
        }
        return marker;
      }
      var _onZoomEnd = function(e) {
        if (map.getZoom() < 6) {
          for (var i = 0; i < markers.length; i += 1) {
            map.remove(markers[i].subMarkers)
          }
          map.add(markers);
        }
      }
      var _onClick = function(e) {
        if(e.target.subMarkers.length){
          map.add(e.target.subMarkers);
          map.setFitView(e.target.subMarkers);
          map.remove(markers)
        }
      }
      var markers = []; //province见Demo引用的JS文件
      for (var i = 0; i < provinces.length; i += 1) {
        var marker = createMarker(provinces[i]);
        markers.push(marker);
        AMap.event.addListener(marker, 'click', _onClick);
      }
//    
//    var markers = [];
//        for (var i = 0; i < provinces.length; i += 1) {
//          var marker = new AMap.Marker({
//            position: provinces[i].center.split(','),
//            title: provinces[i].name,
//            map: map,
//            offset: new AMap.Pixel(0, 0),
//            content: '<div class="area_color"><p>内蒙古</p><p><span style="font-size:16px;">1432</span><span>人</span></p><p><span style="font-size:16px;">532</span><span>车</span></p></div>',
//          });
//          markers.push(marker);
//        }
//    
      //map.setFitView();
      AMap.event.addListener(map, 'zoomend', _onZoomEnd);
      
        };
        this.registerEvent = function() {

        };
    }
    module.exports = MapList;
});