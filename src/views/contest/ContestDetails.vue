<template>

    <div class="main" style="overflow-y: auto; background: white; border-radius: 10px;padding: 10px">
        <h1 style="padding: 15px">{{title}}</h1>
        <span class="details_tips">发布人：{{author}}&nbsp;&nbsp;&nbsp;&nbsp;-------&nbsp;&nbsp;&nbsp;&nbsp;发布时间：{{dates}}</span>
        <v-md-preview class="details_content" :text="content"></v-md-preview>
    </div>

</template>

<script>
    import service from "../../utils/request";

    export default {
        name: "ContestDetails",
        data(){
            return{
                id: 0,
                title: '',
                content: '',
                dates: '',
                author: '',
            }
        },
        created() {
            this.initData()
        },
        methods:{
            initData(){
                const that = this;
                // 获取数据
                const token = localStorage.getItem('user_token');
                console.log("---this.$route.query.id---"+this.$route.query.id);
                that.id = that.$route.query.id;
                that.author = that.$route.query.author;

                service.request({
                    url:'/api/contest/details',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        id: that.id
                    },
                }).then((response) => {
                    console.log(response.result);
                    if (response.code === "200") {
                        that.title = response.result.title;
                        that.content = response.result.content;
                        that.dates = response.result.dates;
                    }else{
                        alert("数据获取失败！");
                    }
                }).catch(error => {
                    console.log(error)
                });
            }
        },
    }
</script>

<style scoped>
.details_content{
    min-height: 700px;
    color: #303133;
}
    .details_tips{
        padding: 15px;
        color: #f02d2d;
    }
</style>
