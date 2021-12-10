<template>
  <div class="message">
    <div class="message-content">
      <!-- 　信息tabe切换处　 -->
      <div class="message-box">
        <div @tap="change(0)" :class="{ btna: btnnum == 0 }">活动优惠</div>
        　
        <div @tap="change(1)" :class="{ btna: btnnum == 1 }">系统通知</div>
      </div>
      <!-- 信息内容区 -->
      <div class="end-cont" :class="{ dis: btnnum == 0 }">
        <!-- 活动优惠的列表 -->
         <div class="eventoffer-list">
           <div class="eventoffer-time">2021-06-03 19:39</div>
           <div class="eventoffer-content">
             <div class="eventoffer-img"  :style="{ 'background-image': `url(${tmpImg})` }"></div>
             <div class="eventoffer-litle">萌娃齐齐撑广州！奥园《萌动新声》抖音城市打歌计划即将上演</div>
           </div>


         </div>
           <div class="eventoffer-list">
           <div class="eventoffer-time">2021-06-03 19:39</div>
           <div class="eventoffer-content">
             <div class="eventoffer-img"  :style="{ 'background-image': `url(${tmpImg})` }"></div>
             <div class="eventoffer-litle">萌娃齐齐撑广州！奥园《萌动新声》抖音城市打歌计划即将上演</div>
           </div>


         </div>
      </div>
      <div class="end-cont" :class="{ dis: btnnum == 1 }">
        <!-- 系统通知的列表 -->
          <div class="message-list">
          <div class="message-time">2021-06-03 19:39</div>
          <div class="message-items">
            <div class="message-top">
              <div class="notice"><span>公告</span></div>
              <div class="notice-title">三旧改造产品系列上线啦！</div>
            </div>
            <div class="message-bottom">
              媒体看奥园|奥园学院三旧改造产品系列正式推出
            </div>
          </div>
        </div>
         <div class="message-list">
          <div class="message-time">2021-06-03 19:39</div>
          <div class="message-items">
            <div class="message-top">
              <div class="notice"><span>公告</span></div>
              <div class="notice-title">三旧改造产品系列上线啦！</div>
            </div>
            <div class="message-bottom">
              媒体看奥园|奥园学院三旧改造产品系列正式推出
            </div>
          </div>
        </div>
      </div>
      　　
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      btnnum: 0, //默认Tab
        tmpImg: "http://img.asset/index/bae.png",
    };
  },
  methods: {
    change(e) {
      this.btnnum = e;
      // console.log(this.btnnum);
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  min-height: calc(100vh - 43px);
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


  // 系统通知的样式
  .end-cont {
    display: none;
    background: #f8f8f8;
    .message-list {
      margin: 15px;
      .message-time {
        text-align: center;
        color: #D3D3D3;
        font-size: 10px;
      }
      .message-items {
        padding: 10px;
        background-color: #ffffff;
        border-radius: 10px;
        margin-top: 10px;
        .message-top {
          display: flex;
          .notice {
            width: 40px;
            height: 17px;
            background-color:rgba(240, 193, 123,0.19);
            border-radius: 9px 0px 9px 0px;
            font-size: 10px;
            text-align: center;
            line-height: 17px;
            min-width: 40px;
            span{
                 color: #F0C17B;
                 opacity: 1;
            }
          }
          .notice-title{
            margin-left: 10px;
            font-size: 14px;
            font-weight:Medium;
            font-size: 14px;
            color: #333333;
            font-weight: 600;
          }
        }
        .message-bottom{
          font-size: 12px;
          color: #999999;
          margin-top: 5px;

        }
      }
    }
  }
  // 活动优惠的样式
  .end-cont{
    .eventoffer-list{
      padding: 15px  15px 0 15px;
      .eventoffer-time{
          text-align: center;
        color: #D3D3D3;
        font-size: 10px;
        margin-top: 10px;

      }
      .eventoffer-content{
        margin-top: 10px;
        background-color: #ffffff;
        padding:10px;
        .eventoffer-img{
          background-size: 100% ;
          background-repeat: no-repeat;
          height: 138px;
        }
        .eventoffer-litle{
          margin-top: 10px;
          font-size: 14px;
          color: #333333;
          font-weight: 600;
        }

      }

    }
  }
  .btna {
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      height: 4px;
      width: 20px;
      bottom: -4px;
      left: 50%;
      transform: translate(-50%);
      background-color: #f0c17b;
      border-radius: 2px;
    }
  }
  .dis {
    display: block;
  }
}
</style>
