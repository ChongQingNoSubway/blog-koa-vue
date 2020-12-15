<template>
    <div id="header">
        <ul class="link-wrapper">
            <router-link :to="{ name: 'home' }"><i class="icon icon-home"></i>Home page</router-link>
            <router-link :to="{ name: 'focus' }"><i class="icon icon-layers"></i>Follow list</router-link>
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
            <div v-else>
                <router-link :to="{ name: 'login' }">login</router-link>
                <router-link :to="{ name: 'register' }">register</router-link>
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
        height 45px;
        background-color #fff;
        display flex;
        .link-wrapper
            flex 20;
            >a
                list-style-type none;
                display inline-block;
                text-decoration none;
                height 45px;
                line-height 45px;
                padding 0 15px;
                color #71777c;
            .click-active
                color blue !important;
        .search
            flex 6;
            display flex;
            align-items center;
            justify-content center;
            max-width 200px;
            border: 1px solid hsla(0,0%,59.2%,.2);
            height 30px;
            margin-top 7px;
            border-radius 5%;
            input
                border none;
            button
                background-color #fff;
                border none;
            .icon-search
                color blue;
        .write
            flex 2;
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
</style>