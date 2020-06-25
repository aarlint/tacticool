<template>
  <div class="container">
    <div class="row">
      <div class="col-md-9">
        <div id="map" class="map"></div>
      </div>
      <div class="col-md-3">
        <div class="form-check" v-for="layer in layers" :key="layer.id">
          <label class="form-check-label">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="layer.active"
              @change="layerChanged(layer.id, layer.active)"
            />
            {{ layer.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Map",
  data: function() {
    return {
      map: null,
      tileLayer: null,
      layers: [
        {
          id: 0,
          name: "Players",
          active: false,
          features: [
            {
              id: 0,
              name: "Austin",
              type: "marker",
              coords: [52.428064, 14.35187]
            },
            {
              id: 1,
              name: "Moe",
              type: "marker",
              coords: [52.428064, 14.354187]
            }
          ]
        },
        {
          id: 1,
          name: "Boundaries",
          active: false,
          features: [
            {
              id: 1,
              name: "Boundry",
              type: "polygon",
              coords: [
                [52.427224, 14.350388],
                [52.426645, 14.358552],
                [52.428806, 14.358797],
                [52.429152, 14.354924],
                [52.428419, 14.354214],
                [52.428865, 14.352132],
                [52.427224, 14.350388]
              ]
            }
          ]
        }
      ]
    };
  },
  sockets: function() {return {
    connect: function() {
      console.log("socket connected");
    },
    customEmit: function(data) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    }
  }},
  mounted() {
    this.initMap();
    this.initLayers();
  },
  methods: {
    initMap() {
      this.map = L.map("map").setView([52.428128, 14.355294], 17);
      this.tileLayer = L.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 20,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
        }
      );
      this.tileLayer.addTo(this.map);
    },
    initLayers() {
      this.layers.forEach(layer => {
        const markerFeatures = layer.features.filter(
          feature => feature.type === "marker"
        );
        const polygonFeatures = layer.features.filter(
          feature => feature.type === "polygon"
        );
        markerFeatures.forEach(feature => {
          feature.leafletObject = L.marker(feature.coords).bindPopup(
            feature.name
          );
        });

        polygonFeatures.forEach(feature => {
          feature.leafletObject = L.polygon(feature.coords).bindPopup(
            feature.name
          );
        });
      });
    },
    layerChanged(layerId, active) {
      const layer = this.layers.find(layer => layer.id === layerId);
      layer.features.forEach(feature => {
        if (active) {
          feature.leafletObject.addTo(this.map);
        } else {
          feature.leafletObject.removeFrom(this.map);
        }
        /* Show or hide the feature depending on the active argument */
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  height: 600px;
}
</style>
