<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-03 14:14:32
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-08-04 15:22:46
-->
<template>
  <div class="Inviteregister">
    <div
      class="Inviteregister-img"
      :style="{ 'background-image': `url(${tmpImg})` }"
    >
    </div>
  </div>
</template>

<script>
export default {
     data() {
    return {
      tmpImg: "http://img.asset/poster/poster.png",

    };
  },
};
</script>

<style lang="scss" scoped>
.Inviteregister {
    height: 718px;
    .Inviteregister-img{
        background-size: 100% 718px;
        
    }
}
</style>
