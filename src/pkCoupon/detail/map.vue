<template>
  <div class="map-wrap">
    <map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude" :markers="markers">
    </map>
  </div>
</template>

<script>
  export default {
    name: 'map',
    data(){
      return {
        latitude: 0,
        longitude: 0,
        markers: [{
          latitude: 0,
          longitude: 0,
        }]
      }
    },
    onLoad(opt){
      this.latitude = opt.latitude
      this.longitude = opt.longitude
      this.markers[0].latitude = opt.latitude
      this.markers[0].longitude = opt.longitude
    },
    methods: {

    }
  };
</script>

<style lang="scss" scoped>
  .map-wrap{
    height: 100vh;
  }
</style>
