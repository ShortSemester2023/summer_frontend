<template>
  <StylishModal :show="show" width="500px" height="350px" padding="25px">
    <div class="login-title-container">
      <div></div>
      <div class="login-title">登录</div>
      <div class="close-icon" @click="handleClose">
        <CloseIcon size="30" />
      </div>
    </div>
    <div class="login-inputs">
      <StylishInput type="text" v-model:value="username" placeholder="用户名" spacing="30px" clearable autofocus/>
      <StylishInput type="password" v-model:value="password" placeholder="密码" spacing="35px" clearable>
        <template #hint>
          <!-- <span class="input-hint" @click="changeToFindPassword">找回密码</span> -->
        </template>
      </StylishInput>
    </div>
    <div class="login-buttons">
      <button @click="changeToRegister">注册</button>
      <button @click="login">登录</button>
    </div>
  </StylishModal>
</template>

<script>
import StylishModal from '../Stylish/StylishModal.vue'
import StylishInput from '../Stylish/StylishInput.vue'
import CloseIcon from '../Svg/CloseIcon.vue'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  components: { StylishModal, StylishInput, CloseIcon },
  emits: ['close', 'changeToRegister', 'changeToFindPassword'],
  props: {
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    ...mapMutations(['setIsLoggedIn']),
    handleClose() {
      this.$emit('close')
    },
    changeToRegister() {
      this.$emit('changeToRegister')
    },
    changeToFindPassword() {
      this.$emit('changeToFindPassword')
    },
    login() {
      if (this.username.length < 1 || this.username.length > 150) {
        this.$bus.emit('message', { title: '用户名长度不符合要求', content: '', time: 1500 })
        // alert('用户名长度不符合要求')
        return
      }
      if (/^[\w]+$/.test(this.username) === false) {
        this.$bus.emit('message', { title: '用户名格式不符合要求', content: '', time: 1500 })
        // alert('用户名格式不符合要求')
        return
      }
      if (this.password.length < 8 || this.password.length > 20) {
        this.$bus.emit('message', { title: '密码长度不符合要求', content: '', time: 1500 })
        // alert('密码长度不符合要求')
        return
      }
      let postData = {
        username: this.username,
        password: this.password
      }
      this.$http.post('/api/accounts/login/', postData).then((response) => {
        // alert('登陆成功')
        // console.log(response.data)
        // this.$cookies.set('user_id', )
        // this.$emit('flushUserData')
        this.setIsLoggedIn(true)
        this.$emit('close')
        this.$router.push('/main')
        console.log('cookie', this.$cookies.get('user_id'))
      }, (error) => {
        let errStr = error.response.data.username
        if (errStr === undefined) {
          errStr=error.response.data.password
        }
        if (errStr !== undefined) {
          alert(errStr)
        }
        else {
          this.$bus.emit('message', { title: '登录失败', content: '', time: 1500 })
          // alert('登录失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}

.login-title {
  font-size: 30px;
  font-weight: bold;
  padding-left: 30px;
  color: rgba(199,29,35, 1);
}

.close-icon {
  vertical-align: middle;
  cursor: pointer;
}

.login-inputs {
  margin-top: 30px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.login-buttons {
  display: flex;
  justify-content: space-evenly;
}

.login-buttons>button {
  width: 80px;
  height: 40px;
  border-radius: 5px;
  background-color: rgba(199,29,35, 1);
  color: white;
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;
  font-size: 16px;
}

.login-buttons>button:hover {
  background-color: rgba(199,29,35, 0.8);
}

.input-hint {
  font-style: 14px;
  color: rgba(199,29,35, 0.8);
  cursor: pointer;
}

.input-hint:hover {
  color: rgba(199,29,35, 1);
  text-decoration: underline;
}
</style>