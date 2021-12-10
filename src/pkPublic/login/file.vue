<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-09-16 09:23:00
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-09-17 11:39:45
-->
<template>
  <div class="file">
    <rich-text :nodes="file.description"></rich-text>
  </div>
</template>

<script>
import apis from "@/apis";
export default {
  data() {
    return {
      file: "",
    };
  },
  mounted() {
    this.getMyfile();
    this.$client.setParam('flag-readfile')
  },
  methods: {
    async getMyfile(i) {
      var obj = this.$client.getParam();
      let { data } = await this.$client.rpc(apis.UPLOAD_FILES, {
        code: obj.code,
      });
      data.rows[0].description = this.$client.setEscape(
        data.rows[0].description
      );
      this.file = data.rows[0];
    //   协议动态标题
      uni.setNavigationBarTitle({
        title: data.rows[0].name,
      });
    },
  },
};
</script>

<style>
.file {
  padding: 15px 15px 30px;
}
</style>