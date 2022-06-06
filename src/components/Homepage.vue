<template>
  <div class="hello" :style="{height: wh+'px'}">
    <img src="../assets/logo.png" alt="社团管理" :style="{ top: 0.44*wh + 'px'}" :class="'animate__animated animate__' + animate.img">
    <h2 :style="{ top: 0.62*wh + 'px'}" :class="'animate__animated animate__' + animate.h2_first">Easier Way To</h2>
    <h2 :style="{ top: 0.62*wh + 45 + 'px'}" :class="'animate__animated animate__' + animate.h2_second">Be Linked</h2>
    <van-button :style="{ top: 0.82*wh + 45 + 'px'}" color="#ea5e4b" plain type="primary" :class="'animate__animated animate__' + animate.button_first" @click="switchRoute(1)">注册</van-button>
    <van-button :style="{ top: 0.82*wh + 45 + 'px'}" color="#ea5e4b" type="primary" :class="'animate__animated animate__' + animate.button_second" @click="switchRoute(2)">登录</van-button>
  </div>
</template>

<script>
export default {
  name: 'Homepage',
  data() {
    return {
      button: true,
      animate: {
        img: "zoomIn",
        h2_first: "fadeInDown",
        h2_second: "fadeInUp",
        button_first: "fadeInLeft",
        button_second: "fadeInRight"
      }
    }
  },
  props: ["wh"],
  methods: {
    switchRoute(id) {
      this.$emit("getBg", 0)
      this.animate = {
        img: "zoomOut",
        h2_first: "fadeOutUp",
        h2_second: "fadeOutDown",
        button_first: "fadeOutLeft",
        button_second: "fadeOutRight"
      }
      setTimeout(() => {
        this.$emit("getRouter", id === 1?"Register":"LogIn");
      }, 500)
    }
  },
  mounted() {
    setTimeout(() => {
      this.$emit("getBg", 370)
    }, 100)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.hello {
  overflow: hidden;
  position: relative;
  img {
    position: absolute;
    width: 300px;
  }
  h2 {
    width: 100%;
    position: absolute;
    padding: 0 40px;
    box-sizing: border-box;
    font-family: Arial,Helvetica,sans-serif;
    font-weight: 400;
    letter-spacing: 2px;
  }
  .van-button {
    left: calc(15% - 10px);
    width: 35%;
    border-radius: 10px;
    margin-right: 10px;
  }
  span {
    position: absolute;
  }
}
</style>
