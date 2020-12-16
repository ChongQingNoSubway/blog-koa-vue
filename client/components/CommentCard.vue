<template>
    <div id="comment-card">
        <div class="comment-box">
            <div class="user-img" @click="seeUser">
                <img :src="comment.user.avatar" v-if="comment.user.avatar">
                <img src="../../static/defaultAvatar.png" v-else>
            </div>
            <div class="comment-detail">
                <h3 @click="seeUser">{{ comment.user.username }}</h3>
                <p>{{ comment.comment }}</p>
                <p>
                    <span>{{ comment.createdAt | dateFormat('YYYY-MM-DD HH:mm') }}</span>
                    <span @click="isShow = !isShow" :class="'reply-btn' + comment.comment_id">reply</span>
                </p>
            </div>
        </div>
        <!-- 回复 -->
        <div class="comment-area" v-if="isShow">
            <div class="user-comment">
                <at-textarea v-model="inputComment" :maxlength="200" 
                    placeholder="To Saying something..."
                    resize="none" min-rows="1" max-rows="4"></at-textarea>
            </div>
            <div class="comment-btns">
                <at-button type="primary" @click="doReply">reply</at-button>
            </div>
        </div>
    </div>
</template>

<script lang="typescript">
export default {
    data() {
        return {
            message:false,
            inputComment: '',
            isShow: false,
            deavater: 'https://wx1.sinaimg.cn/large/006CHHsBly1ghiiufy3qbj31kw1kwwly.jpg'
        }
    },
    props: {
        comment: Object
    },
    mounted() {
        document.addEventListener('click', this.setIsShow);
    },
    destroyed() {
        document.removeEventListener('click', this.setIsShow, true);
    },
    methods: {
        seeUser() {
            this.$router.push({ 
                name: 'author', 
                query: { email: this.$Base64.encode(this.comment.email) } 
            });
        },
        doReply() {

        },
        setIsShow(e) {
            if(e.target.className !== 'reply-btn' + this.comment.comment_id
                && e.target.className !== 'comment-area')
                this.isShow = false;
        }
    }
}
</script>

<style lang="stylus">
    #comment-card
        .comment-box
            padding 10px 0;
            display flex;
            align-items center;
            justify-content center;
            border-top 2px solid #f1f4f5;
            .user-img
                flex 1;
                text-align center;
                align-self start;
                cursor pointer;
                img
                    width 40px;
                    height 40px;
                    border-radius 50%;
            .comment-detail
                flex 9;
                p
                    margin 5px 0;
                h3
                    cursor pointer;
                p:last-child
                    color #8a9aa9;
                    display flex;
                    span
                        display inline-block;
                    span:first-child
                        flex 11;
                    span:last-child
                        flex 1;
                        text-align center;
                        cursor pointer;
        .comment-area
            display flex;
            height 100px;
            justify-content center;
            align-items center;
            background-color #f1f1f1;
            padding 10px 0;
            width 1000px;
            margin-left 110px;
            .user-comment
                flex 8;
                text-align center;
                padding 0 20px;
                .at-textarea__original
                    max-width 1000px;
                    overflow-y hidden;
            .comment-btns
                flex 1;
                text-align center;
</style>