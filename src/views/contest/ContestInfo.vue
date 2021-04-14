<template>
    <div style="overflow-y: auto;">
        <h1>竞赛资讯</h1>
        <br>
        <div class="container gap" v-for="item in contests" :key="item.id">
            <router-link :to="{path: '/contest_details', query: {author:item.nickname, id: item.id }}">
                <el-row>
                    <span class="item_title">{{item.title}}</span><br>
                </el-row>
                <el-row>
                    <h4 style="color: #20a0ff">发布者：</h4>&nbsp;<span class="item_author">{{item.nickname}}</span>
                </el-row>
            </router-link>
            <el-row>
                <el-col :span="22">
                    <span class="item_content">{{item.content.substring(0,100)}}</span><br>
                </el-col>
                <el-col :span="2">
                    <el-button @click="toSignUp(item.id)" style="right: 5px;" type="primary" :disabled="item.isSigned == '已报名' ?true:false">{{item.isSigned}}</el-button>
                </el-col>
            </el-row>
            <el-row>
                <span class="item_dates">{{item.dates}}</span>
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
        name: "ContestInfo",
        data(){
            return {
                background: "#ffffff",
                //列表
                contests: [],
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
                const that = this;
                // 获取数据
                const token = localStorage.getItem('user_token');
                const userJson = JSON.parse(localStorage.getItem("user_info"));
                console.log("current----------" + current);

                service.request({
                    url:'/api/contest/items',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        pn: current,
                        userId: userJson.id,
                    },
                }).then((response) => {
                    if (response.code === "200") {
                        that.contests = response.result.records
                        that.total = response.result.total;
                        that.pages = response.result.pages;
                        console.log(that.total + "total----" + that.pages )
                        console.log(that.contests)
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            //报名
            toSignUp(id){
                // 获取数据
                const token = localStorage.getItem('user_token');
                const userJson = JSON.parse(localStorage.getItem("user_info"));

                service.request({
                    url:'/api/signup/insert',
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    data: {
                        userId: userJson.id,
                        contestId: id,
                    },
                }).then((response) => {
                    console.log("contest_id" + response.result);
                    if (response.code === "200") {
                        alert("报名成功");
                        location.reload();
                    }else{
                        alert("报名失败！");
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
