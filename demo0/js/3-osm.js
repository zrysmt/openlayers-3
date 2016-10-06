var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    target: 'map',
    view: new ol.View({
        center: [-8730000, 5930000] ,
        // rotation: Math.PI / 5,
        zoom: 2
    })
});


