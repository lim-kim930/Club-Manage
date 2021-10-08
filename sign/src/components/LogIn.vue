<template>
  <div class="container" :style="{height: wh+'px'}">
    <div class="header" :class="'animate__animated ' + animate.img"><img src="../assets/back.svg" alt="返回" @click="back()"></div>
    <div class="logo" :class="'animate__animated ' + animate.img"><img src="../assets/logo2.png" alt="社团管理"></div>
    <h2 v-show="greeting !== ''" :class="'animate__animated ' + animate.h2_first">Hello! {{greeting}}</h2>
    <h2 v-show="greeting !== ''" :class="'animate__animated ' + animate.h2_second">Welcome Back!</h2>
    <van-form :style="{top: wh*0.43+'px'}">
      <van-field
        v-model="form.phonember"
        placeholder="请输入手机号"
        maxlength="11"
        type="number"
        clearable
        :class="'animate__animated ' + animate.img"
      />
      <van-field
        v-model="form.pwd"
        type="password"
        placeholder="请输入密码"
        clearable
        :class="'animate__animated ' + animate.img"
      />
      <div class="forgot" :class="'animate__animated ' + animate.forgot">
        <span>不小心忘了密码</span>
      </div>
      <div style="margin: 16px;" :class="'animate__animated ' + animate.button">
        <van-button class="submit" block type="info" @click="onSubmit()" color="#ea5e4b">立即登录</van-button>
      </div>
    </van-form>
    <div class="footer" :style="{top: wh*0.38 + 400 +'px'}" :class="'animate__animated ' + animate.button">
      <span>还没有账号? <span class="register" @click="$emit('getRouter', 'Register')">去注册</span></span>
    </div>
  </div>
</template>

<script>
//引入md5
import md5 from 'js-md5';
//引入eventbus
import bus from './eventBus'
export default {
  name: 'LogIn',
  data() {
    return {
      animate: {//动画样式
        img: "animate__zoomIn",
        h2_first: "animate__fadeInDown",
        h2_second: "animate__fadeInUp",
        forgot: "animate__fadeInRight",
        button: "animate__fadeInUp",
      },
      animate_second: {
        img: "animate__zoomOut",
        h2_first: "animate__fadeOutUp",
        h2_second: "animate__fadeOutDown",
        forgot: "animate__fadeOutRight",
        button: "animate__fadeOutDown",
      },
      form: {//表单数据
        phonember: "",
        pwd: "",
      },
    }
  },
  props: ["wh", "greeting"],//父组件传来的屏幕高度
  methods: {
    //返回homepage
    back() {
      this.animate = this.animate_second;
      setTimeout(() => {
        this.$emit("getRouter", "Homepage");
      }, 600)
    },
    //提交登录
    onSubmit() {
      //校验四个输入是否有空
      if(this.form.phonember.trim() === "" || this.form.pwd.trim() === "") {
        this.$toast.fail('请将表单填写完成哦~');
        return
      }
      //加载提示
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '正在验证小主身份~',
      });
      this.axios({
        method: "post",
        url: "http://192.168.240.130/login",
        data: {
          phonember: this.form.phonember,
          pwd: md5(this.form.pwd),
        }
      })
        .then((response) => {
          toast.clear();//清除加载toast
          const success = this.$toast.success('登录成功啦!');
          success.clear();
          this.animate = this.animate_second;
          setTimeout(() => {
            this.$emit("getRouter", "Homepage");//重定向到登录
          }, 600)
        })
        .catch(() => {
          toast.clear();
          this.$dialog.alert({
            title: 'Oops!',
            message: '登录出错了~， 看来程序猿要加班了＞︿＜',
          })
        });
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  position: relative;
  background-color: #fff;
  .header {
    padding: 30px 15px;
    img {
      width: 32px;
    }
  }
  .logo {
    padding: 20px 40px;
    img {
      width: 150px;
    }
  }
  h2 {
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
    font-family: Arial,Helvetica,sans-serif;
    font-weight: 400;
    letter-spacing: 2px;
  }
  .van-form {
    position: absolute;
    width: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    .van-field {
      height: 50px;
      margin: 20px 0;
      font-size: 15px;
      &::after {
        border-bottom: 2px solid #ebedf0;
      }
    }
    .forgot {
      margin: 30px 0 30px calc(100% - 110px);
      font-size: 12px;
      letter-spacing: 2px;
      color: #ea5e4b;
    }
    .submit {
      border-radius: 10px;
    }
  }
  .footer {
    position: absolute;
    padding-left: 40px;
    span {
      font-size: 13px;
      color: #b7b7b7;
      letter-spacing: 2px;
      .register {
        color: #ea5e4b;
      }
    }
  }
}
</style>
