<template>
    <div id="write">
        <h1>Blog</h1>
        <div class="input-title">
            <at-input v-model="inputTitle" 
                placeholder="Please enter the title of the article..." :maxlength="50" :minlength="5"
                size="large"></at-input>
        </div>
        <div ref="editorElem" class="wt-container"></div>
        <div class="wt-btns">
            <at-button type="primary" @click="publish">publish</at-button>
            <at-button @click="cancel">cancel</at-button>
        </div>
    </div>
</template>

<script lang="typescript">
import E from 'wangeditor';
import { Input, Button, Select, Option } from 'at-ui';

export default {
    data() {
        return {
            editor: null,
            editorContent: '',
            inputTitle: '',
            mode: 'new',
            blog_id: ''
        }
    },
    props: ['cacheData'],
    components: {
        'at-input': Input,
        'at-button': Button,
        'at-select': Select,
        'at-option': Option
    },
    mounted() {
        this.editor = new E(this.$refs.editorElem);
        this.editor.customConfig.onchange = html => {
            this.editorContent = html;
        };
        this.editor.customConfig.menus = [

            'head', 
            'bold',
            'fontSize', 
            'fontName',
            'italic', 
            'underline', 
            'strikeThrough', 
            'foreColor',
            'backColor', 
            'link', 
            'list', 
            'justify', 
            'quote', 
            'emoticon', 
            'image',
            'table', 
            'code', 
            'undo',
            'redo'
        ];
        this.editor.create();
    },
    created() {
        this.getAllSorts();
        if(this.$route.query.blog_id) {
            this.mode = 'edit';
            this.blog_id = this.$Base64.decode(this.$route.query.blog_id);
            this.getUserBlog(this.blog_id);
        }
    },
    methods: {
        getAllSorts() {
            this.axios.get('/blogs/sort').then(res => {
                this.sorts = res.data;
            }, err => {
                console.error(err);
            });
        },
        publish() {
            if(this.inputTitle === '') {
                this.$Message.warning('Please enter the title of the article!');
                return false;
            }
            if(this.editorContent === '') {
                this.$Message.warning('Please enter the content!');
                return false;
            }
            if(this.mode === 'new') { 
                let email = this.$store.getters.getUser.email;
                let blogFrom = {
                    title: this.inputTitle,
                    content: this.editorContent,
                    email: email,
                };
                this.axios.post('/blogs/new', blogFrom).then(res => {
                    let blog_id = res.data.blog_id;
                    this.$router.push({ 
                        name: 'blog', 
                        query: { blog_id: this.$Base64.encode(blog_id) } 
                    });
                    this.$Notify({
                        title: 'notice',
                        message: 'Publish successfully',
                        type: 'success'
                    });
                }, err => {
                    if(err.code === -1) {  // token error
                        this.$Modal.info({
                            content: "Login expired, please login again!"
                        });
                        this.$store.commit('logout');
                        this.$router.push({ name: 'login' });
                    }
                });
            } else {  
                let blogFrom = {
                    title: this.inputTitle,
                    content: this.editorContent,
                    blog_id: this.blog_id,
                };
                this.axios.put('/blogs/update', blogFrom).then(res => {
                    this.$router.push({ 
                        name: 'blog', 
                        query: { blog_id: this.$Base64.encode(this.blog_id) } 
                    });
                    this.$Notify({
                        title: 'notice',
                        message: 'Modification succeeded',
                        type: 'success'
                    });
                }, err => {
                    if(err.code === -1) {  // token err
                        this.$Modal.info({
                            content: 'Login expired, please login again!'
                        });
                        this.$store.commit('logout');
                        this.$router.push({ name: 'login' });
                    }
                });
            }
        },
        cancel() {
            this.$router.push({ name: 'home' });
        },
        getUserBlog(blog_id) {
            this.axios.get('/blogs/id/' + blog_id).then(res => {
                let blog = res.data[0];
                this.inputTitle = blog.title;
                this.editor.txt.html(blog.content);
            }, err => {
                console.error(err);
            })
        }
    }
}
</script>

<style lang="stylus">
    #write
        padding 18px 24px;
        h1
            text-align center;
        .input-title
            margin 10px 0;
        .wt-container
            .w-e-text-container
                height 600px !important;
        .wt-btns
            display flex;
            justify-content flex-end;
            margin-top 10px;
            button:nth-child(2)
                margin-left 10px;
        .wt-sort
            margin 10px 0;
</style>