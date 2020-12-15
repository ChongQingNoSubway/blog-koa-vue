<template>
    <div id="focus">
        <div v-for="blog in blogList" :key="blog.blog_id">
            <article-card :blog="blog"></article-card>
        </div>
    </div>
</template>

<script lang="typescript">
export default {
    data() {
        return {
            followerList: [],
            blogList: []
        }
    },
    components: {
        'article-card': () => import('../components/Card.vue')
    },
    created() {
        this.getFollowers();
    },
    methods: {
        getFollowers() {
            this.axios.get('/users/follow/' + this.$store.getters.getUser.email).then(res => {
                this.followerList = res.data;
                this.getFollowersBlogs();
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
        getFollowersBlogs() {
            let promiseAll = this.followerList.map((item) => {
                return this.axios.get('/blogs/email/' + item.follow_email);
            });
            this.axios.all(promiseAll).then(resArr => {
                resArr.forEach(res => {
                    this.blogList = this.blogList.concat(res.data);
                });
            }, err => {
                console.error(err);
            });
        }
    }
}
</script>

<style lang="stylus">
    #focus
        padding 18px 24px;
</style>