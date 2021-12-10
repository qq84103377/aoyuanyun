<template>
  <web-view :src="url"></web-view>
</template>

<script>
export default {
    data() {
    return {
      url: "",
    };
  },
    mounted() {
        this.url = this.$client.getParam().url; //接外面的参数
        console.log(this.url);
    },
}
</script>

<style>

</style>