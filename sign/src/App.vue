<template>
  <div id="app" :style="{height: height+'px', backgroundSize: bg + 'px'}">
    <component :is="router" :wh="height" :greeting="greeting" @getRouter= "getRouter" @getBg= "getBg"></component>
  </div>
</template>

<script>
import Homepage from './components/Homepage.vue'
import Register from './components/Register.vue'
import LogIn from './components/LogIn.vue'

export default {
  name: 'App',
  data() {
    return {
      height: "",
      bg: 0,
      router: "Homepage",
      greeting: ""
    }
  },
  components: {
    Homepage,
    Register,
    LogIn
  },
  methods: {
    //获取屏幕高度
    windowHeight() {
      var de = document.documentElement;
      return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    },
    //从子组件获得router改变
    getRouter(val) {
      this.router = val
    },
    getBg(val) {
      this.bg = val
    }
  },
  created() {
    this.height = this.windowHeight() <= 710?710:this.windowHeight();
    this.axios({
      method: "get",
      url: "https://api.limkim.xyz/getSysTime",
    })
      .then((response) => {
        switch(+response.data.Systime3.time.split(":")[0]) {
          case 10: case 11:
            this.greeting = "上午好";
            break;
          case 12:
            this.greeting = "中午好";
            break;
          case 13: case 14: case 15: case 16: case 17: case 18:
            this.greeting = "下午好";
            break;
          case 19: case 20: case 21: case 22: case 23:
            this.greeting = "晚上好";
            break;
          default:
            this.greeting = "早上好";
            break;
        }
      })
      .catch(() => {
        this.greeting = " "
        this.$dialog.alert({
          title: '提示',
          message: '获取时间信息出错啦~， 看来程序猿要加班了＞︿＜',
        })
      });
  },
  mounted() {
    // this.bg = 300
  }
}
</script>

<style lang="less">
#app {
  background: url("./assets/bgc.png") no-repeat;
  background-position: right top;
  transition: all 0.8s;
  -moz-transition: all 0.8s; /* Firefox 4 */
  -webkit-transition: all 0.8s; /* Safari 和 Chrome */
  -o-transition: all 0.8s; /* Opera */
}
</style>
