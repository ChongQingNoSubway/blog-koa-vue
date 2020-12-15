<template>
    <div id="user-center">
        <h1>personal information</h1>
        <div class="avatar">
            <div class="img-wrapper">
                <img :src="avatar" v-if="avatar">
                <img src="../../static/defaultAvatar.png" v-else>
            </div>
            <div class="img-modify">
                <label for="input-img">
                    <at-button type="primary">upload</at-button>
                    <span>Only jpg、jpeg and png</span>
                </label>
                <input type="file" name="input-img" @change="fileHandler($event)" 
                    accept="image/jpg, image/png, image/jpeg">
            </div>
            <div class="follow-num">
                <p>followerList</p>
                <p>{{ followerList.length }}</p>
            </div>
            <div class="fan-num">
                <p>fanList</p>
                <p>{{ fanList.length }}</p>
            </div>
        </div>
        <div class="username">
            <div class="uname-lbl">
                <h3>username</h3>
            </div>
            <div class="show-uname">
                <at-input v-model="username" :disabled="!ifModify"></at-input>
            </div>
            <div class="modify-uname">
                <at-button type="primary" @click="ifModify = !ifModify" v-if="!ifModify">modify</at-button>
                <at-button type="primary" @click="toSave" v-else>save</at-button>
            </div>
        </div>
        <div class="list-wrapper">
            <div class="blog-list">
                <div class="blog-item" v-for="blog in blogList" :key="blog.blog_id">
                    <blog-card :blog="blog"></blog-card>
                </div>
            </div>
            <at-tabs type="card">
                <at-tab-pane label="Following" name="name1">
                    <div class="follow-list" v-for="follower in followerList" :key="follower.follow_email">
                        <auth-card :author="follower"></auth-card>
                    </div>
                </at-tab-pane>
                <at-tab-pane label="fans" name="name2">
                    <div class="fan-list" v-for="fan in fanList" :key="fan.user_email">
                        <auth-card :author="fan"></auth-card>
                    </div>
                </at-tab-pane>
            </at-tabs>
        </div>
    </div>
</template>

<script lang="typescript">
import { Button, Input, Tabs, TabPane } from 'at-ui';
import client from '../config/aliOss.ts';

export default {
    data() {
        return {
            ifModify: false,
            username: '',
            followerList: [],  
            fanList: [], 
            blogList: []  
        }
    },
    components: {
        'at-button': Button,
        'at-input': Input,
        'auth-card': () => import('../components/AuthorCard.vue'),
        'at-tabs': Tabs,
        'at-tab-pane': TabPane,
        'blog-card': () => import('../components/Card.vue')
    },
    created() {
        this.getUser();
        this.getFollowers();
        this.getFans();
        this.getOwnBlogs();
    },
    computed: {
        avatar: function() {
            if(this.$store.getters.getUser !== null) {
                return this.$store.getters.getUser.avatar;
            } 
            return null;
        }
    },
    methods: {
        async fileHandler(e) {
            let file = e.target.files[0];
            let name = file.name.substring(0, file.name.indexOf('.'));
            let result = await client.multipartUpload(name, file);
            let avatarUrl;
            let url = result.res.requestUrls[0];
            if(url.indexOf('?') !== -1) {
                let end = url.indexOf('?');
                avatarUrl = url.substring(0, end);
            }else {
                avatarUrl = url;
            }
            this.axios.put('/users/update', {
                email: this.$store.getters.getUser.email,
                avatar: avatarUrl
            }).then(res => {
                this.$Notify({
                    title: 'notation',
                    message: 'Avatar updated',
                    type: 'success'
                });
                this.getUser();
            }, err => {
                console.error(err);
            })
        },
        getUser() {
            this.followerList = this.fanList = [];
            this.axios.get('/users/info/' + this.$store.getters.getUser.email).then(res => {
                let user = res.data[0];
                this.username = user.username;
                this.$store.commit('setUser', { user: user });
            }, err => {
                console.error(err);
            })
        },
        toSave() {
            this.ifModify = !this.ifModify;
            this.axios.put('/users/update', {
                email: this.$store.getters.getUser.email,
                username: this.username
            }).then(res => {
                this.getUser();
            }, err => {
                console.error(err);
            })
        },
        getOwnBlogs() {
            this.axios.get('/blogs/email/' + this.$store.getters.getUser.email).then(res => {
                this.blogList = res.data;
            }, err => {
                console.error(err);
            })
        },
        getFollowers() {
            this.axios.get('/users/follow/' + this.$store.getters.getUser.email).then(res => {
                let followerList = res.data;
                this.getFollowersInfo(followerList);
            }, err => {
                if(err.code === -1) {  // token error
                    this.$Modal.info({
                        content: 'Login expired, please login again!'
                    });
                    this.$store.commit('logout');
                    this.$router.push({ name: 'login' });
                }
            })
        },
        getFollowersInfo(followerList) {
            let promiseAll = followerList.map((item) => {
                return this.axios.get('/users/info/' + item.follow_email);
            });
            this.axios.all(promiseAll).then(resArr => {
                resArr.forEach(res => {
                    this.followerList = this.followerList.concat(res.data);
                });
            }, err => {
                console.error(err);
            });
        },
        getFans() {
            this.axios.get('/users/unfollow/' + this.$store.getters.getUser.email).then(res => {
                let fanList = res.data;
                this.getFansInfo(fanList);
            }, err => {
                if(err.code === -1) {  // token error
                    this.$Modal.info({
                        content: 'Login expired, please login again!'
                    });
                    this.$store.commit('logout');
                    this.$router.push({ name: 'login' });
                }
            })
        },
        getFansInfo(fanList) {
            let promiseAll = fanList.map((item) => {
                return this.axios.get('/users/info/' + item.user_email);
            });
            this.axios.all(promiseAll).then(resArr => {
                resArr.forEach(res => {
                    this.fanList = this.fanList.concat(res.data);
                });
            }, err => {
                console.error(err);
            });
        }
    }
}
</script>

<style lang="stylus">
    #user-center
        padding 18px 24px;
        h1
            height 60px;
            line-height 60px;
            border-bottom 2px solid #f4f5f5;
        .avatar
            display flex;
            align-items center;
            justify-content flex-start;
            margin 10px 0;
            border-bottom 2px solid #f4f5f5;
            .img-wrapper
                flex 1;
                img
                    width 100px;
                    height 100px;
                    border-radius 50%;
            .img-modify
                flex 7;
                label 
                    position absolute;
                input
                    opacity 0;
                    width 82px;
                    height 31.6px;
            .follow-num
                flex 1;
                p
                    text-align center;
                    color #31445b;
                    font-size 16px;
                P:last-child
                    font-weight bold;
            .fan-num
                flex 1;
                p
                    text-align center;
                    color #31445b;
                    font-size 16px;
                 P:last-child
                    font-weight bold;
        .username
            display flex;
            align-items center;
            justify-content center;
            margin 30px 0;
            .uname-lbl
                flex 1;
            .show-uname
                flex 8;
                input
                    border none;
                    background-color #fff;
                    font-size 16px;
            .modify-uname
                flex 1;
        .list-wrapper
            display flex;
            .at-tabs
                flex 2;
                justify-content flex-end;
                .follow-list 
                &.fan-list
                    border 1px solid #f4f5f5;
                    border-left none;
                    border-right none;
            .blog-list
                flex 8;
                align-items center;
                justify-content center;
                max-width 800px;
                margin-right 20px;
</style>