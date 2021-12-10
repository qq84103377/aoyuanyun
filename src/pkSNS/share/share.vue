<!--
 * @Description: 
 * @version: 
 * @Author: gonghonglin
 * @Date: 2021-08-03 19:31:22
 * @LastEditors: gonghonglin
 * @LastEditTime: 2021-08-05 11:16:55
-->
<template>
  <div class="page">
    <div class="card">
      <div class="card-title">我的邀请战绩</div>
      <div class="card-content">
        <div class="card">
          <div>？</div>
          <div>{{oneHandCount}}人</div>
          <div>直接邀请人数</div>
        </div>
        <div class="card">
          <div>？</div>
          <div>{{secondHandCount}}人</div>
          <div>直接邀请人数</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      oneHandCount: 0,
      secondHandCount: 0,
      invites:[],
      pager:{
        page: 1,
        pageSize: 10
      }
    }
  },
  async onLoad() {
    this.getMainList()
  },
  methods:{
    async getMainList(){
      let counter = await this.$client.rpc(this.$api.INVITE_COUNT)
      this.oneHandCount = counter.data.data.oneHandCount
      this.secondHandCount = counter.data.data.secondHandCount

      this.$client.rpc(this.$api.INVITE_DETAIL,{
        ...this.pager
      })
    }
  }
}
</script>

<style lang="scss">
.page{
  background-color: #E0B981;
  .card{
    background-color: #fff;
    border-radius: 10px;
    margin: 15px;
  }
}
</style>
