<template>
    <div id="author">
        <div class="info-box">
            <div class="auth-img">
                <img :src="avatar" v-if="avatar">
                <img src="../../static/defaultAvatar.png" v-else>
            </div>
            <div class="auth-info">
                <h1>{{ author.username }}</h1>
                 <div class="follow" v-if="!isSelf">
                    <at-button type="primary" v-if="isFollow" @click="cancelFollow">Following</at-button>
                    <at-button v-else @click="toFollow">Follow</at-button>
                </div>
            </div>
            <div class="join-time">
                Joining time:{{ author.createdAt | dateFormat('YYYY-MM-DD') }}
            </div>
        </div>
        <div v-for="blog in blogList" :key="blog.blog_id" class="blog-list">
            <article-card :blog="blog" class="blog-item"></article-card>
        </div>
    </div>
</template>

<script lang="typescript">
import { Button } from 'at-ui';

export default {
    data() {
        return {
            email: '',
            author: {},
            avatar: '',
            blogList: [],
            isFollow: false,  
            isSelf: false   
        }
    },
    components: {
        'at-button': Button,
        'article-card': () => import('../components/Card.vue')
    },
    created() {
        this.email = this.$Base64.decode(this.$route.query.email);
        if(this.$store.getters.getUser !== null) {
            if(this.email === this.$store.getters.getUser.email) this.isSelf = true;
        }
        this.getAuthor();
    },
    methods: {
        getAuthor() {
            this.axios.get('/users/info/' + this.email).then(res => {
                this.author = res.data[0];
                this.avatar = this.author.avatar;
                this.getAuthorBlogs();
                this.isFollowTheAuthor();
            }, err => {
                if(err.code === -1) {  // token
                    this.$Modal.info({
                        content: 'Login expired, please login again!'
                    });
                    this.$store.commit('logout');
                    this.$router.push({ name: 'login' });
                }
            })
        },
        getAuthorBlogs() {
            this.axios.get('/blogs/email/' + this.email).then(res => {
                this.blogList = res.data;
            }, err => {
                console.error(err);
            })
        },
        isFollowTheAuthor() {
            this.axios.post('/users/isFollow', {
                user_email: this.$store.getters.getUser.email,
                follow_email: this.email
            }).then(res => {
                this.isFollow = res.data.isFollow;
            }, err => {
                if(err.code === -1) { 
                    this.$Modal.info({
                        content: "Login expired, please login again!"
                    });
                    this.$store.commit('logout');
                    this.$router.push({ name: 'login' });
                }
            })
        },
        toFollow() {
            this.axios.post('/users/follow', {
                user_email: this.$store.getters.getUser.email,
                follow_email: this.email
            }).then(res => {
                this.isFollowTheAuthor();
            }, err => {
                console.error(err);
            })
        },
        cancelFollow() {
            this.axios.post('/users/unfollow', {
                user_email: this.$store.getters.getUser.email,
                follow_email: this.email
            }).then(res => {
                this.isFollowTheAuthor();
            }, err => {
                console.error(err);
            })
        }
    }
}
</script>

<style lang="stylus">
    #author
        padding 18px 24px;
        .info-box
            height 100px;
            display flex;
            align-items center;
            justify-content center;
            .auth-img
                flex 1;
                img
                    width 80px;
                    height 80px;
                    border-radius 50%;
            .auth-info
                flex 8;
                .follow
                    margin-top 10px;
            .join-time
                flex 2;
</style>