<template>
  <div class="container" :style="{height: wh+'px'}">
    <div class="header" :class="'animate__animated ' + animate.img"><img src="../assets/back.svg" alt="返回" @click="back()"></div>
    <div class="logo" :class="'animate__animated ' + animate.img"><img src="../assets/logo2.png" alt="社团管理"></div>
    <h2 v-show="greeting !== ''" :class="'animate__animated ' + animate.h2_first">Hello! {{greeting}}</h2>
    <h2 v-show="greeting !== ''" :class="'animate__animated ' + animate.h2_second">Welcome Here!</h2>
    <van-form :style="{top: wh*0.38+'px'}">
      <van-field
        v-model="form.Uname"
        placeholder="请输入姓名"
        clearable
        :class="'animate__animated ' + animate.img"
      />
      <van-field
        v-model="form.phonenumber"
        placeholder="请输入手机号"
        maxlength="11"
        type="number"
        clearable
        :class="'animate__animated ' + animate.img"
      />
      <van-field
        v-model="form.code"
        type="number"
        maxlength="6"
        center
        clearable
        :class="'animate__animated ' + animate.img"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button plain size="small" type="primary" color="#ea5e4b" @click="sendSms()" :loading="smsLoading" loading-text="发送中..." :disabled="smsDisabled">{{smsMessage}}</van-button>
        </template>
      </van-field>
      <van-field
        v-model="form.pwd"
        type="password"
        placeholder="请输入密码"
        clearable
        :class="'animate__animated ' + animate.img"
      />
      <div style="margin: 16px;" :class="'animate__animated ' + animate.button">
        <van-button class="submit" plain block type="info" @click="onSubmit()" color="#ea5e4b">立即注册</van-button>
      </div>
    </van-form>
    <div class="footer" :style="{top: wh*0.38 + 400 +'px'}" :class="'animate__animated ' + animate.button">
      <span>已经有账号了? <span class="logIn" @click="$emit('getRouter', 'LogIn')">去登录</span></span>
    </div>
  </div>
</template>

<script>
//引入md5
import md5 from 'js-md5';
export default {
  name: 'Register',
  data() {
    return {
      animate: {//动画样式
        img: "animate__zoomIn",
        h2_first: "animate__fadeInDown",
        h2_second: "animate__fadeInUp",
        button: "animate__fadeInUp",
      },
      form: {//表单数据
        Uname: "",
        phonenumber: "",
        pwd: "",
        code: ""
      },
      code: "",//后端传来的验证码md5
      smsMessage: "发送验证码",//发送验证码按钮文字
      smsLoading: false,//发送验证码按钮加载
      smsDisabled: false,//发送验证码按钮禁用
    }
  },
  props: ["wh", "greeting"],//父组件传来的屏幕高度
  methods: {
    //返回homepage
    back() {
      this.animate = {
        img: "animate__zoomOut",
        h2_first: "animate__fadeOutUp",
        h2_second: "animate__fadeOutDown",
        button: "animate__fadeOutDown",
      }
      setTimeout(() => {
        this.$emit("getRouter", "Homepage");
      }, 600)
    },
    //获取验证码
    sendSms() {
      if(this.form.phonenumber.trim() === "") {
        this.$toast.fail('请先填写手机号哦~');
        return
      } else if(this.form.phonenumber.trim().length !== 11){
          this.$toast.fail('请填写正确的手机号码哦~');
          return
      }
      this.smsLoading = true; //按钮加载
      this.axios({
        method: "post",
        url: "http://192.168.240.130/code",
        data: {
          phonenumber: this.form.phonenumber
        }
      })
        .then((response) => {
          this.code = response.data.data.code;
          this.smsLoading = false;
          this.smsMessage = "60秒后重发";//开启按钮禁用倒计时
          this.smsDisabled = true;
          var count = 59
          var timer = setInterval(() => {
            this.smsMessage = count + "秒后重发";
            count --
            if(count === -1) {
              clearInterval(timer);
              this.smsDisabled = false;
              this.smsDisabled = false;
              this.smsMessage = "发送验证码";
            }
          }, 1000)
        })
        .catch(() => {
          this.$dialog.alert({
            title: 'Oops!',
            message: '获取验证码出错了~， 看来程序猿要加班了＞︿＜',
          })
          this.smsLoading = false;
        });
    },
    //提交注册
    onSubmit() {
      //校验四个输入是否有空
      if(this.form.Uname.trim() === "" || this.form.phonenumber.trim() === "" || this.form.pwd.trim() === "" || this.form.code.trim() === "" ) {
        this.$toast.fail('请将表单填写完成哦~');
        return
      } else if(this.form.phonenumber.trim().length !== 11){
        this.$toast.fail('请填写正确的手机号码哦~');
        return
      }
      //校验是否获取了验证码
      if(this.code === "") {
        this.$toast.fail('请先获取验证码哦~');
        return
      }
      //校验验证码是否正确
      if(md5(this.form.code) !== this.code) {
        this.$toast.fail('验证码错误哦,请检查后再试试吧~');
        return
      }
      //加载提示
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '给小主快马加鞭注册中~',
      });
      this.axios({
        method: "post",
        url: "http://192.168.240.130/register",
        data: {
          phonenumber: this.form.phonenumber,
          pwd: this.form.pwd,
          Uname: this.form.Uname
        }
      })
        .then((response) => {
          toast.clear();//清除加载toast
          this.$dialog.confirm({
            title: '芜湖~',
            message: '注册成功啦！快去登录吧~',
            confirmButtonText: "冲冲冲！",
            cancelButtonText: "先不急"
          })
            .then(() => {
              this.$emit("getInfo", {//向父组件传手机号和密码
                phonenumber: Number(this.form.phonenumber),
                pwd: this.form.pwd
              })
              setTimeout(() => {
                this.$emit("getRouter", "LogIn");//重定向到登录
              }, 200)
            })
            .catch(() => {
              this.form = {//清空表单
                Uname: "",
                phonenumber: "",
                pwd: "",
                code: ""
              };
            });
        })
        .catch(() => {
          toast.clear();
          this.$dialog.alert({
            title: 'Oops!',
            message: '注册出错了~， 看来程序猿要加班了＞︿＜',
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
      cursor: pointer;
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
      .logIn {
        color: #ea5e4b;
        cursor: pointer;
      }
    }
  }
}
</style>
