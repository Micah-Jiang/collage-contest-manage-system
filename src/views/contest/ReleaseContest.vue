<template>
    <el-card shadow="always">
        <el-input style="width:85%; margin-right: 50px" v-model="title" placeholder="请输入内容"/>
        <el-button style="float: right;" type="primary" @click="insertContest()">发布竞赛</el-button>
    </el-card>

    <v-md-editor
            style="margin-top: 15px"
            v-model="content"
            height="700px"
    />
</template>


<script>
    import service from "../../utils/request";

    export default {

        data() {
            return {
                content: '',
                title: ''
            };
        },
        methods: {
            insertContest(){
                const token = localStorage.getItem('user_token');
                const userJson = JSON.parse(localStorage.getItem("user_info"));
                const contestTitle = this.title;
                const contestContent = this.content;

                service.request({
                    url:'/api/contest/insert',
                    method: 'post',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    data: {
                        userId: userJson.id,
                        contestTitle: contestTitle,
                        contestContent: contestContent,
                    },
                }).then((response) => {
                    if (response.code === "200") {
                        alert("保存成功！")
                        location.reload();
                    }else{
                        alert("保存失败！");
                    }
                }).catch(error => {
                    console.log(error)
                });
            }
        },
    };
</script>
