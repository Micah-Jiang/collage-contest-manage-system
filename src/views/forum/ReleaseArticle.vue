<template>
    <el-card shadow="always">
        <el-input style="width:85%; margin-right: 50px" v-model="articleTitle" placeholder="请输入标题"/>
        <el-button style="float: right;" type="primary" @click="insertArticle()">发布帖子</el-button>
    </el-card>

    <v-md-editor
            style="margin-top: 15px"
            v-model="articleContent"
            height="800px"
    />
</template>


<script>
    import service from "../../utils/request";

    export default {

        data() {
            return {
                articleTitle: '',
                articleContent: ''
            };
        },
        methods: {
            insertArticle(){
                const token = localStorage.getItem('user_token');
                const userJson = JSON.parse(localStorage.getItem("user_info"));

                service.request({
                    url:'/api/article/insert',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    data: {
                        articleTitle: this.articleTitle,
                        articleContent: this.articleContent,
                        author: userJson.id,
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
