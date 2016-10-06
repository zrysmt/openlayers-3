/*初始化地图*/
var map = new ol.Map({
    target: 'map', //document.getElementById("map")
   
    layers:[
        new ol.layer.Tile({
            title: "Global Imagery",
            source: new ol.source.TileWMS({
                url: 'http://demo.boundlessgeo.com/geoserver/wms',
                params: {
                    'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
                }
            })
        })
    ],
    view: new ol.View({
        projection: 'EPSG:4326', //WGS 84
        center: [0, 0],
        zoom: 2,
        maxResolution: 0.703125
    }),

});
