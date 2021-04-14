<template>
    <div style="overflow-y: auto;">
        <h1>竞赛论坛</h1>
        <br>
        <div class="container gap" v-for="item in articles" :key="item.id">
            <router-link :to="{path: '/form_details', query: {author:item.authorName, id: item.id }}">
                <el-row>
                    <span class="item_title">{{item.articleTitle}}</span><br>
                </el-row>
                <el-row>
                    <h4 style="color: #20a0ff">发布者：</h4>&nbsp;<span class="item_author">{{item.authorName}}</span>
                </el-row>
            </router-link>
            <el-row>
                <span class="item_content">{{item.articleContent.substring(0,100)}}</span><br>
            </el-row>
            <el-row>
                <span class="item_dates">{{item.insertTime}}</span>
            </el-row>
        </div>
        <br>
        <el-pagination
                style="float: right; margin-bottom: 50px"
                background
                layout="prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="limit"
                :current-page="current"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import service from "../../utils/request";

    export default {
        name: "MainForm",
        data(){
            return {
                background: "#ffffff",
                //列表
                articles: [],
                //总记录数
                total: 0,
                //页码
                current: 1,
                //每页记录数
                limit: 5,
                //总页码数
                pages: '8'
            }
        },
        created() {
            this.initContest();
        },
        methods:{
            //改变页面的显示条数
            handleSizeChange: function (val) {
                const that = this;
                that.limit = val;
                that.initContest(that.current);
            },
            //改变当前页
            handleCurrentChange: function (val) {
                const that = this;
                that.current = val;
                that.initContest(that.current);
            },
            //获取竞赛数据
            initContest(current){
                // 获取数据
                const token = localStorage.getItem('user_token');

                service.request({
                    url:'/api/article/list',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        pn: current
                    },
                }).then((response) => {
                    if (response.code === "200") {
                        this.articles = response.result
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
        }
    }
</script>

<style scoped>
    .gap{
        padding: 10px;
        margin-bottom: 5px;
    }
    .item_title{
        font-size: 18px;
        font-weight: bold;
        color: #303133;
    }
    .item_content{
        padding-top: 10px;
        font-size: 15px;
        color: #606266;
    }
    .item_dates{
        padding-top: 15px;
        color: #777777;
    }
</style>
