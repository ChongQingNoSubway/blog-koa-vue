<template>
    <div id="register">
        <div class="register-panel">
            <div class="reg-title">
                <h1>register</h1>
                <p>Do you have an account?<a href="#/login">login</a></p>
            </div>
            <div class="reg-input">
                <at-input v-model="username" placeholder="user name" size="large"></at-input>
                <at-input v-model="email" placeholder="email" size="large"></at-input>
                <at-input v-model="password" type="password" placeholder="length:6~12" size="large" 
                    :maxlength="12" :minlength="6"></at-input>
                <at-input v-model="checkPass" type="password" placeholder="Please confirm the password" size="large" 
                    :maxlength="12" :minlength="6" @keyup.enter.native="register"></at-input>
            </div>
            <div class="reg-btn">
                <at-button type="primary" size="large" @click="register">register</at-button>
            </div>
        </div>
    </div>
</template>

<script lang="typescript">
import { Input, Button } from 'at-ui';

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            checkPass: ''
        }
    },
    components: {
        'at-input': Input,
        'at-button': Button
    },
    methods: {
        register() {
            if(this.username !== '' && this.email !== '' && this.password !== '' && this.checkPass !== '') {
                let emailReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org|edu)$/;
                if(!emailReg.test(this.email)) {
                    this.$Message.error('Email format is not correct!');
                    return false;
                }
                if(this.password !== this.checkPass) {
                    this.$Message.error('The two passwords do not match!');
                    return false;
                }
                if(this.password.length < 6 || this.password.length > 12) {
                    this.$Message.error('The password length exceeds the specified range!');
                    return false;
                }
                this.axios.post('/users/register', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                }).then(res => {
                    if(res.data.success) {
                        this.$router.push({ name: 'login' });
                        this.$Message.success('register was successful!');
                    } else {
                        this.$Message.warning(res.data.msg);
                    }
                }, err => {
                    console.error(err);
                })
            } else {
                this.$Message.error('Incomplete input information!');
            }
        }
    }
}
</script>

<style lang="stylus">
    #register
        background-color #f4f5f5;
        width 100%;
        height 96vh;
        display flex;
        align-items center;
        justify-content center;
        .register-panel
            background-color #fff;
            width 400px;
            height 400px;
            padding 40px 40px 0 40px;
            .reg-title
                display flex;
                h1
                    flex 1;
                    justify-content flex-start;
                p
                    flex 1;
                    display flex;
                    align-items center;
                    justify-content flex-end;
            .reg-input
                input
                    margin 20px 0;
            .reg-btn
                button
                    width 100%;
</style>