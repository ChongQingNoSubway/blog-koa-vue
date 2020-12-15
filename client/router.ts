import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    linkExactActiveClass: 'click-active',
    routes: [
        {
            name: 'home',
            path: '/',
            component: () => import('./pages/Home.vue')
        },
        {
            name: 'register',
            path: '/register',
            component: () => import('./pages/Register.vue')
        },
        {
            name: 'login',
            path: '/login',
            component: () => import('./pages/Login.vue')
        },
        {
            name: 'focus',
            path: '/focus',
            component: () => import('./pages/Focus.vue'),
            meta: {
                auth: true
            }
        },
        {
            name: 'write',
            path: '/write',
            component: () => import('./pages/Write.vue'),
            meta: {
                auth: true
            }
        },
        {
            name: 'blog',
            path: '/blog',
            component: () => import('./pages/Blog.vue')
        },
        {
            name: 'userCenter',
            path: '/userCenter',
            component: () => import('./pages/UserCenter.vue'),
            meta: {
                auth: true
            }
        },
        {
            name: 'author',
            path: '/author',
            component: () => import('./pages/Author.vue'),
            meta: {
                auth: true
            }
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});

router.beforeEach((to, from, next) => {
    if(to.meta.auth) {  // token err
        if(JSON.parse(localStorage.getItem('token'))) next();
        else {
            alert('You are not logged in');
            next('/login');
        }
    } else {
        next();
    }
});

// Solve the problem of uncaught promise, and catch the error uniformly
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default router;