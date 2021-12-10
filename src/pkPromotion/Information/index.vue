<template>
  <div class="message">
    <div class="message-content">
      <!-- 信息内容区 -->
      <!-- 活动优惠的列表 -->
      <div
        class="eventoffer-list"
        v-for="(item, index) in enlistpromotionList"
        :key="index"
        @click="viewUrl(item.detail, item)"
      >
        <div class="eventoffer-time">{{ item._expTimes }}</div>
        <div class="eventoffer-content">
          <div
            class="eventoffer-img"
            :style="{ 'background-image': `url(${item.urls})` }"
          ></div>
          <div class="eventoffer-litle">
            {{ item.title }}
          </div>
          <div class="read-likesbox">
            <div class="read">{{ item.readCount }}阅读</div>
            <div class="likes" @click.stop="getlike(item.id)">
              <!-- <img class="like" src="@/static/like.png" /> -->
              <span class="num">{{ item._date }}</span>
            </div>
          </div>
        </div>
      </div>
      　
    </div>
    <div v-if="isUpNoMore" class="upwarp-nodata">真的没有更多啦！</div>
    <div
      class="no-record"
      v-if="!enlistpromotionList.length && !enlistpromotionList.length"
    ></div>
  </div>
</template>

<script>
import apis from '@/apis'
export default {
  data() {
    return {
      isNotData: false,
      isUpNoMore: false,
      isGet: false,
      page: 1,
      enlistpromotionList: [],
      datalike: [],
      datared: []
    }
  },
  onLoad() {},
  onReachBottom() {
    if (this.isGet) {
      // 正在获取数据
      return
    }
    this.getPromotionlist()
  },
  onShow() {
    this.getPromotionlist()
  },

  methods: {
    viewUrl(url, data) {
      this.getred(data.id)
      if (data.informationType == 1) {
        this.$client.pushWindow(
          '/pages/webView/webViewShare',
          { data, url },
          { reLaunch: true }
        )
      } else {
        this.$client.pushWindow('/pages/webView/within', { data })
      }
    },

    // 点赞触发接口
    getlike() {
      this.getlike()
    },
    //  获取资讯列表
    async getPromotionlist() {
      var { page, enlistpromotionList } = this
      this.isGet = true
      let { data } = await this.$client.rpc(apis.COMMUNITY_LIST, {
        page,
        pageSize: 10
      })
      if (data.success) {
        var list = data.rows

        if (list.length > 0) {
          for (const item of list) {
            item._date = this.$tools.str2DateStr(item.createTime, 'YYYY/MM/DD hh:mm')
          }
        } else {
          if (page > 1) {
            this.isUpNoMore = true
          } else {
            this.isNotData = true
          }
        }
        if (page == 1) {
          this.$set(this, 'enlistpromotionList', list)
        } else {
          this.enlistpromotionList = enlistpromotionList.concat(list)
        }
        this.page = page + 1
        this.isGet = false
      }
    },
    // 点赞接口数据
    async getlike(id) {
      let { data } = await this.$client.rpc(apis.COMMUNITY_LIKE, {
        id
      })
      this.datalike = data.data
    },

    async getred(id) {
      let { data } = await this.$client.rpc(apis.COMMUNITY_REND, {
        id
      })
      this.datared = data.data
    },

    // 时间格式的转化---年月日
    date2Str(date, format) {
      return this.$tools.str2DateStr(date, format)
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  min-height: 100vh;
  background-color: #f8f8f8;
  .message-box {
    color: #999999;
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    line-height: 43px;
    margin-top: 12px;
    height: 43px;
    background-color: #ffffff;

    border-bottom: 1px solid #f4f4f4;
  }

  // 活动优惠的样式
  .eventoffer-list {
    padding: 15px 15px 0 15px;
    .eventoffer-time {
      text-align: center;
      color: #d3d3d3;
      font-size: 10px;
      // margin-top: 10px;
    }
    .eventoffer-content {
      margin-top: 10px;
      background-color: #ffffff;
      padding: 10px;
      border-radius: 8px;

      .eventoffer-img {
        background-size: cover;
        background-repeat: no-repeat;
			  background-position: center;
        height: 122px;
      }
      .eventoffer-litle {
        margin-top: 10px;
        font-size: 14px;
        color: #333333;
        font-weight: 600;
      }
    }
    .read-likesbox {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .likes {
        font-size: 10px;
        color: #d3d3d3;
        .like {
          height: 13px;
          width: 13px;
        }
      }
      .read {
        font-size: 10px;
        color: #d3d3d3;
      }
    }
  }
  .no-record {
    height: 400px;
    margin-top: 20px;
    background: no-repeat url('http://img.asset/not_myActivite.png');
    background-size: 80%;
    background-position: top center;
    position: relative;
    .btn {
      position: absolute;
      bottom: 0;
      left: calc(50% - 82.5px);
    }
  }
  .upwarp-nodata {
    padding: 15px;
    text-align: center;
    font-size: 14px;
    color: #999999;
  }
}
</style>
