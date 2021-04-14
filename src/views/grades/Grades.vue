<template>
    <section class="main">
        <el-card v-for="item in contests" :key="item.id">
            比赛名称：<span class="grades_item">{{item.title}}</span>&nbsp;&nbsp;
            报名时间：<span class="grades_item">{{item.date}}</span>&nbsp;&nbsp;
            最终成绩：<span class="grades_score">{{(item.score === ''||item.score===null) ? '等待公布':item.score}}</span>
        </el-card>
    </section>
</template>

<script>
    import service from "../../utils/request";

    export default {
        name: "grades",
        data(){
            return{
                contests: []
            }
        },
        created() {
            this.initData();
        },
        methods:{
            initData(){
                // 获取数据
                const token = localStorage.getItem('user_token');
                const userJson = JSON.parse(localStorage.getItem("user_info"));

                service.request({
                    url:'/api/signup/score',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        id: userJson.id,
                    },
                }).then((response) => {
                    if (response.code === "200") {
                        this.contests = response.result
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });
            }
        }
    };
</script>

<style scoped>
    .grades_item{
        color: #00a854;
        font-size: 18px;
    }
    .grades_score{
        color: #f02d2d;
        font-size: 25px;
        font-weight: bold;
        font-style: italic;
    }

</style>
