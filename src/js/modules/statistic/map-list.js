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
              zoom:5,
//            center: [116.397428, 39.90923]
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
            
//           AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {
//            var lngLats = getGridLngLats(map.getCenter(), 4, 4);
//            if (!SvgMarker.supportSvg) {
//                //当前环境并不支持SVG，此时SvgMarker会回退到父类，即SimpleMarker
//                 alert('当前环境不支持SVG');
//            }
//            var shap = new SvgMarker.Shape.WaterDrop({
//                height: 100, //高度
//                fillColor: _this.fillColor
//            });
//            //另外一个SvgMarker
//            var svgMarker = new SvgMarker(shap, {
//                iconLabel: '<div class="area_color"><p>内蒙古</p><p><span style="font-size:16px;">1432</span><span>人</span></p><p><span style="font-size:16px;">532</span><span>车</span></p></div>',
//                zIndex: 110,
//                map: map,
//                position: map.getCenter(),
//                showPositionPoint: true
//            });
//            svgMarker.on('click', function(e){
////              var fillColor = e.target.opts.svgShape.opts.fillColor;
////              _this.fillColor = '#FF9100';
//            });
//        });
   
    var cluster, markers = [];
    
    for(var i=0;i<points.length;i+=1){
        markers.push(new AMap.Marker({
          position:points[i]['lnglat'],
          content: '<div></div>',
          offset: new AMap.Pixel(-15,-15)
        }))
    }
    var count  = markers.length;
    var _renderCluserMarker = function (context) {
        var factor = Math.pow(context.count/count,1/18)
        var div = document.createElement('div');
        var Hue = 180 - factor* 180;
        var bgColor = 'hsla('+Hue+',100%,50%,0.7)';
        var fontColor = 'hsla('+Hue+',100%,20%,1)';
        var borderColor = 'hsla('+Hue+',100%,40%,1)';
        var shadowColor = 'hsla('+Hue+',100%,50%,1)';
        div.style.backgroundColor = bgColor
        var size = Math.round(30 + Math.pow(context.count/count,1/5) * 20);
        div.style.width = div.style.height = size+'px';
        div.style.border = 'solid 1px '+ borderColor;
        div.style.borderRadius = size/2 + 'px';
        div.style.boxShadow = '0 0 1px '+ shadowColor;
        div.innerHTML = context.count;
        div.style.lineHeight = size+'px';
        div.style.color = fontColor;
        div.style.fontSize = '14px';
        div.style.textAlign = 'center';
        context.marker.setOffset(new AMap.Pixel(-size/2,-size/2));
        context.marker.setContent(div)
     }
    addCluster(1);

    function addCluster(tag) {
        if (cluster) {
            cluster.setMap(null);
        }
        if (tag == 2) {//完全自定义
            cluster = new AMap.MarkerClusterer(map,markers,{
                gridSize:80,
                renderCluserMarker:_renderCluserMarker
            });
        } else if (tag == 1) {//自定义图标
            cluster = new AMap.MarkerClusterer(map, markers, {
                styles: {
                  url: "/src/img/blue.png",
                  size: new AMap.Size(70, 76),
                  offset: new AMap.Pixel(0, -31)
                },
                gridSize:80
            });
        } else {//默认样式
            cluster = new AMap.MarkerClusterer(map, markers,{gridSize:80});
        }
    }
        };
        this.registerEvent = function() {

        };
    }
    module.exports = MapList;
});