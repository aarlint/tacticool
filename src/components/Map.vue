<template>

    <div class="row">
      <div class="col-md-10">
        <div id="map" class="map"></div>
      </div>
      <div class="col-md-2">
      <input class="form-control" type="text" id="name" name="name" v-model="setName" placeholder="Type a short name"
       minlength="2" maxlength="8" size="10"> 
       <button :disabled="name" type="button" @click="name = setName" class="btn btn-dark btn-lg btn-block">Set Name</button>
      </div>
    </div>

</template>

<script>
import Leaflet from 'leaflet';
export default {
  name: "Map",
  data: function() {
    return {
      name: null,
      map: null,
      setName: null,
      myLocation: {
        lat: null,
        lng: null
      },
      tileLayer: null,
      players: {
      }
    };
  },  
  watch: {
    players(newPlayers,oldPlayers) {
      console.log(newPlayers,oldPlayers);
    }
    },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    location(players) {
      console.log(players)
      for (let player in players) {
        if (player in this.players) {
          let latlng = Leaflet.latLng(players[player].coords)
          this.players[player].leafletObject.setLatLng(latlng)
        }
        else {
          this.players[player] = players[player]
          this.players[player]["leafletObject"] = Leaflet.marker(this.players[player]["coords"]).bindPopup(
            player
          );
          this.players[player].leafletObject.addTo(this.map);
        }
      }
    }
  },
  mounted() {
    this.initMap();
    this.map.on('locationfound', this.onLocationFound);
    this.map.on('locationerror', this.onLocationError);
    
  },
  methods: {
    onLocationFound(e) {
      if ((this.myLocation.lat != e.latitude || this.myLocation.lng != e.longitude) && this.name){
      console.log(e)
      this.myLocation = e.latlng
      this.$socket.client.emit("updatePlayerLocation",{ "name": this.name, "lat": e.latitude, "lon": e.longitude})
      }
      },
    onLocationError(e) {
    alert(e.message);
    },
    clearRaspiPlayers() {
      this.$socket.client.emit("clearPlayers", {})
    },
    initMap() {
      // this.map = Leaflet.map("map").setView([52.428128, 14.355294], 17);
      this.map = Leaflet.map("map").setView([52.3915219576082, 13.273095614284891], 17);
      this.map.locate({ watch: true, maxZoom: 20});
      this.tileLayer = Leaflet.tileLayer(
        "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
        {
          maxZoom: 20,
          minZoom: 13
        }
      );
      this.tileLayer.addTo(this.map);
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
