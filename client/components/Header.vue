<template>
    <div id="header">
        <ul class="link-wrapper">
            <router-link :to="{ name: 'home' }"><i class="icon icon-grid"></i>Home</router-link>
            <router-link :to="{ name: 'focus' }"><i class="icon icon-heart-on"></i>Following list</router-link>
        </ul>
        <div class="write">
            <at-button type="primary" @click="toWrite">Blog</at-button>
        </div>
        <div class="user-center">
            <div v-if="user !== null">
                <img :src="avatar" @click="toUserCenter" v-if="avatar">
                <img src="../../static/defaultAvatar.png" alt="404" @click="toUserCenter" v-else>
                <a @click="logout">sign out</a>
            </div>
            <div v-else class="user-register">
                <at-button class="clickbox" type="success" ><router-link :to="{ name: 'login' }" class="login">login</router-link></at-button>
                <at-button class="clickbox" type="error" ><router-link :to="{ name: 'register' }" class="register">register</router-link></at-button>
            </div>
        </div>
    </div>
</template>

<script lang="typescript">
import { Input, Button } from 'at-ui';

export default {
    data() {
        return {
            searchValue: ''
        }
    },
    computed: {
        avatar: function() {
            if(this.$store.getters.getUser !== null) {
                return this.$store.getters.getUser.avatar;
            } 
            return null;
        },
        user: function() {
            if(this.$store.getters.getUser !== null) {
                return this.$store.getters.getUser;
            } 
            return null;
        }
    },
    components: {
        'at-input': Input,
        'at-button': Button
    },
    methods: {
        logout() {
            if(confirm('Are you sure you want to quit?')) this.$store.commit('logout');
            this.$router.push({ name: 'home' });
        },
        toWrite() {
            this.$router.push({ name: 'write' });
        },
        toUserCenter() {
            this.$router.push({ name: 'userCenter' });
        },
        toSearch() {
            if(this.searchValue.length) {
                this.$router.push({ 
                    name: 'search', 
                    query: { keyword: this.$Base64.encode(this.searchValue) } 
                });
                this.searchValue = '';
            }
        }
    }
}
</script>

<style lang="stylus">
    #header
        height 88px;
        background-color #fff;
        display flex;
        .link-wrapper
            flex 10;
            >a
                list-style-type none;
                display inline-block;
                text-decoration none;
                height 88px;
                line-height 88px;
                padding 0 50px;
                color #71777c;
            .click-active
                color blue !important;
        .write
            flex 1;
            display flex;
            align-items center;
            justify-content center;
        .user-center
            flex 3;
            display flex;
            align-items center; 
            justify-content flex-end;
            margin-right 10px;
            div
                display flex;
                align-items center;  
                justify-content flex-end;
                position relative;
                a
                    margin 0 10px;
                img
                    width 30px;
                    height 30px;
                    border-radius 50%;
                    cursor pointer;
        .user-register
                .register
                    color white;
                .login
                    color white;
                .clickbox
                    margin 0px 5px;

</style>