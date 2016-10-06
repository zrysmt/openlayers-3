var view = new ol.View({
    center: [9101767, 2822912],
    zoom: 6
}); //map.view的变量
/*图层*/
var bglayer = new ol.layer.Tile({
    source: new ol.source.BingMaps({
        // key: 'Your Bing Maps Key from http://www.bingmapsportal.com/here',
        key: 'AgiU9gCjKNfaR2yFSDfLw8e9zUlAYisRvRC2_L-LsGYN2bII5ZUvorfP3QJvxmjn', //自己申请的key
        imagerySet: 'Aerial'
    })
});
var source = new ol.source.Vector({ wrapX: false });
//绘图绘在此矢量图层
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({ //修改绘制的样式
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.FullScreen(), //全屏控件
        new ol.control.ScaleLine(), //比例尺
        new ol.control.OverviewMap(), //鹰眼控件
        // new ol.control.Zoom(),
    ]),
    layers: [bglayer, vector], //添加两个图层
    target: 'map', //div#id='map'
    view: view,
    // interaction:
});


/**上面的部分就可以初始化地图**/
/****************************************************/
/**
 * Marker标注
 */
var pos = ol.proj.fromLonLat([121.3725, 31.008889]); //经纬度坐标转换
// Vienna marker
var marker = new ol.Overlay({
    position: pos,
    positioning: 'center-center',
    element: document.getElementById('marker'),
    stopEvent: false
});
map.addOverlay(marker);
// Shanghai label
var Shanghai = new ol.Overlay({
    position: pos,
    element: document.getElementById('Shanghai')
});
map.addOverlay(Shanghai); //标签 a
/**
 * Popup查询坐标弹出框
 */
// Popup showing the position the user clicked
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(popup);
//关闭popup
closer.onclick = function() {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

$('.search-position').click(function(event) {
    map.removeInteraction(draw); //点击选择时候  取消上次结果

    //在地图上点击
    map.on('click', function(evt) {
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));

        content.innerHTML = '<p>点击的坐标是:</p><code>' + hdms +
            '</code>';
        popup.setPosition(coordinate);
    });

});

/* 自定义工具 */
var draw, select, modify;
$('.toolsets button').click(function(event) {
    console.log($(this).text());
    var geometryFunction, shapeName, maxPoints;
    map.removeInteraction(draw); //点击选择时候  取消绘图交互
    map.removeInteraction(select); //点击选择时候  取消选择
    map.removeInteraction(modify); //点击选择时候  取消修改
    switch ($(this).text()) {
        case "点":
            shapeName = 'Point';
            break;
        case "线":
            shapeName = 'LineString';
            break;
        case "多边形":
            shapeName = 'Polygon';
            break;
        case "圆形":
            shapeName = 'Circle';
            break;
        case "菱形":
            shapeName = 'Circle';
            geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
            break;
        case "矩形":
            shapeName = 'LineString';
            maxPoints = 2;
            geometryFunction = function(coordinates, geometry) {
                if (!geometry) {
                    geometry = new ol.geom.Polygon(null);
                }
                var start = coordinates[0];
                var end = coordinates[1];
                geometry.setCoordinates([
                    [start, [start[0], end[1]], end, [end[0], start[1]], start]
                ]);

                return geometry;
            };
            break;
        case "修改形状":
            reshape.init();
            break;
        case "打印地图":
            printMap.init();
            break;
    }

    draw = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ (shapeName),
        geometryFunction: geometryFunction,
        maxPoints: maxPoints
    });
    map.addInteraction(draw); //增加的交互
});
/*修改地图*/
var reshape = {
    init: function() {
        // select选择形状
        // modify修改形状
        var select = new ol.interaction.Select({
            wrapX: false
        });

        var modify = new ol.interaction.Modify({
            features: select.getFeatures()
        });
        // var selectModify = new ol.interaction.defaults().extend([select, modify]);
        map.addInteraction(select);
        map.addInteraction(modify);
        //interactions: ol.interaction.defaults().extend([select, modify]),
    }
};
/*打印地图*/
var printMap = {
    init: function() {
        map.removeInteraction(draw); //点击选择时候  取消绘制
        var dims = {
            a0: [1189, 841],
            a1: [841, 594],
            a2: [594, 420],
            a3: [420, 297],
            a4: [297, 210],
            a5: [210, 148]
        };
        var loading = 0;
        var loaded = 0;
        // var exportButton = document.getElementById('export-pdf');
        // exportButton.disabled = true;
        document.body.style.cursor = 'progress';

        var format = document.getElementById('format').value;
        var resolution = document.getElementById('resolution').value;
        var dim = dims[format];
        var width = Math.round(dim[0] * resolution / 25.4);
        var height = Math.round(dim[1] * resolution / 25.4);
        var size = /** @type {ol.Size} */ (map.getSize());
        var extent = map.getView().calculateExtent(size);

        var source = bglayer.getSource();
        var tileLoadStart = function() {
            ++loading;
        };

        var tileLoadEnd = function() {
            ++loaded;
            if (loading === loaded) {
                var canvas = this;
                window.setTimeout(function() {
                    loading = 0;
                    loaded = 0;
                    var data = canvas.toDataURL('image/png'); //canvas
                    var pdf = new jsPDF('landscape', undefined, format);
                    pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
                    pdf.save('map.pdf');
                    source.un('tileloadstart', tileLoadStart);
                    source.un('tileloadend', tileLoadEnd, canvas);
                    source.un('tileloaderror', tileLoadEnd, canvas);
                    map.setSize(size);
                    map.getView().fit(extent, size);
                    map.renderSync();
                    // exportButton.disabled = false;
                    document.body.style.cursor = 'auto';
                }, 100);
            }
        };

        map.once('postcompose', function(event) {
            source.on('tileloadstart', tileLoadStart);
            source.on('tileloadend', tileLoadEnd, event.context.canvas);
            source.on('tileloaderror', tileLoadEnd, event.context.canvas);
        });

        map.setSize([width, height]);
        map.getView().fit(extent, /** @type {ol.Size} */ (map.getSize()));
        map.renderSync();
    }

};
