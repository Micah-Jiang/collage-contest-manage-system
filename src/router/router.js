/* router/router.js */
export default [
    // 部署管理
    {
        path: '/deploy-manage',
        name: 'deploy-manage',
        component: () => import('@/views/sys-admin/deploy-manage/deploy-manage.vue'),
        meta: {
            permitName: 'deploy-manage',
        }
    },
];
