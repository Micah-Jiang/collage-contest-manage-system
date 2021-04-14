<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem, i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import service from "../utils/request";
export default {

    data() {
        return {
            items: []
        }
    },

    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        },
        collapse(){
            return this.$store.state.collapse
        },
    },

    mounted() {

    },

    methods:{
        initData(){
            const token = localStorage.getItem('user_token');
            const userJson = JSON.parse(localStorage.getItem("user_info"));

            service.request({
                url:'/api/user/permissions',
                method: 'get',
                headers: {
                    'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                },
                params: {
                    id: userJson.id,
                },
            }).then((response) => {
                if (response.code === "200") {
                    console.log("result ===== " + response.result)
                    this.items = response.result
                }else{
                    this.$message.error("发生了异常！");
                }
            }).catch(error => {
                console.log(error)
            });
            return this.items;
        }
    },

    created() {
        this.initData()
    },
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
