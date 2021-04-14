import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/layout/Home.vue";
import service from "../utils/request";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import (
                "../views/main/DashBoard.vue")
            }, {
                path: "/mecenter",
                name: "mecenter",
                meta: {
                    title: '我的资料'
                },
                component: () => import (
                    "../views/me/MeCenter.vue")
            }, {
                path: "/release_contest",
                name: "release_contest",
                meta: {
                    title: '发布竞赛'
                },
                component: () => import (
                "../views/contest/ReleaseContest.vue")
            }, {
                path: "/contest_info",
                name: "contest_info",
                meta: {
                    title: '竞赛资讯'
                },
                component: () => import (
                "../views/contest/ContestInfo.vue")
            }, {
                path: "/article",
                name: "article",
                meta: {
                    title: '竞赛论坛'
                },
                component: () => import (
                    "../views/forum/MainForm.vue")
            },{
                path: "/insert_article",
                name: "insert_article",
                meta: {
                    title: '发布帖子'
                },
                component: () => import (
                    "../views/forum/ReleaseArticle.vue")
            },{
                path: '/form_details',
                name: 'form_details',
                meta: {
                    title: '帖子详情'
                },
                component: () => import ('../views/forum/FormDetails')
            },{
                path: "/permission",
                name: "permission",
                meta: {
                    title: '成绩与证书',
                    permission: true
                },
                component: () => import (
                "../views/admin/Permission.vue")
            }, {
                path: "/grades",
                name: "grades",
                meta: {
                    title: '我的成绩'
                },
                component: () => import (
                "../views/grades/Grades.vue")
            }, {
                path: "/insert",
                name: "insert",
                meta: {
                    title: '录入成绩'
                },
                component: () => import (
                "../views/grades/InsertGrades.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '系统管理'
                },
                component: () => import (
                "../views/Icon.vue")
            }, {
                path: '/user_management',
                name: 'user_management',
                meta: {
                    title: '用户管理'
                },
                component: () => import (
                '../views/admin/UserManagement.vue')
            }, {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限配置'
                },
                component: () => import (
                '../views/admin/Permission')
            },{
                path: '/contest_details',
                name: 'contest_details',
                meta: {
                    title: '竞赛详情'
                },
                component: () => import ('../views/contest/ContestDetails')
            },{
                path: '/about',
                name: 'about',
                meta: {
                    title: '关于本站'
                },
                component: () => import ('../views/about/About')
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
        /* webpackChunkName: "login" */
        "../views/account/Login.vue")
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    let token = localStorage.getItem('user_token').replace("\"","").replace("\"","");
    let role = JSON.parse(localStorage.getItem("user_info")).role;
    let isAllowed;
    let isTokenValid;
    console.log(to.path.substr(1)+"------"+role+'--------'+token);

    service.request({
        url:'/api/auth/is_allowed',
        method: 'get',

        params: {
            token: token,
            to: to.path.substr(1),
            roleId: role,
        },
    }).then((response) => {
        console.log(response.result);
        if (response.code === "200") {
            isAllowed = response.result.isAllowed;
            isTokenValid = response.result.isTokenValid;
        }else{
            this.$message.error("发生了异常！");
        }
    }).catch(error => {
        console.log(error)
    });


    // 身份和Token验证
    if (isTokenValid === "false") {
        next('/login');
    } else if (isAllowed === 'false') {
        // 如果是管理员权限则可进入
        next('/403');
    } else {
        next();
    }
});

export default router;
