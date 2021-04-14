<template>
    <el-card shadow="hover" class="mgb20" style="height:200px;">
            <div class="user-info">
                <img src="../../assets/img/img.jpg" class="user-avator" alt />
                <div class="user-info-cont">
                    <div class="user-info-name">{{ name }}</div>
                    <div>{{ userRole }}</div>
                </div>
                <el-button class="modify_btn" @click="isModify()" round>修改资料</el-button>
            </div>
        </el-card>
    <br>
    <el-card v-if="info" shadow="hover" class="mgb20" style="height:300px;">
            <template #header>
                <div class="clearfix">
                    <h3>基本信息</h3>
                </div>
            </template>

            <el-row class="me_item">性&nbsp; &nbsp; &nbsp; &nbsp; 别：<span class="item_text">{{gender}}</span></el-row>
            <el-row class="me_item">电子邮箱：<span class="item_text">{{email}}</span></el-row>
            <el-row class="me_item">联系电话：<span class="item_text">{{phone}}</span></el-row>
            <el-row class="me_item">所在专业：<span class="item_text">{{major}}</span></el-row>
            <el-row class="me_item">联系地址：<p class="item_text">{{address}}</p></el-row>
            <el-row class="me_item">自我介绍：<p class="item_text">{{introduce}}</p></el-row>
    </el-card>
    <el-card v-if="modify" id="modify" shadow="hover" style="height:200px; margin-bottom: 10px; " >
        <h3 style="margin-left: 15px">修改资料</h3>
        <div style="margin-top: 20px"></div>
        <el-form :label-position="labelPosition" ref="modify_user" label-width="80px" :model="userInfo">
            <el-form-item label="我的昵称">
                <el-input v-model="userInfo.nickname"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱">
                <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="userInfo.phone"></el-input>
            </el-form-item>
            <el-form-item label="联系地址">
                <el-input v-model="userInfo.address"></el-input>
            </el-form-item>
            <el-form-item label="自我介绍">
                <el-input v-model="userInfo.introduce"></el-input>
            </el-form-item>
            <el-form-item align="center">
                <el-button type="primary" @click="modifyInfo('modify_user')">立即创建</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import service from "../../utils/request";
    let isModify = false;
export default {
    name: "maincenter",
    data() {
        let userJson = JSON.parse(localStorage.getItem("user_info"));
        return {
            info: true,
            modify: false,
            name: userJson.nickname,
            userRole: userJson.userRole,
            gender: userJson.gender,
            email: userJson.email,
            phone: userJson.phone,
            major: userJson.major,
            address: userJson.address,
            introduce: userJson.introduce,
            labelPosition: top,
            userInfo:{
                email: userJson.email,
                phone: userJson.phone,
                address: userJson.address,
                introduce: userJson.introduce,
                nickname: userJson.nickname,
            }
        }
    },
    components: {

    },
    computed: {

    },

    methods: {
        isModify() {
            if (isModify === false){
                this.info = false;
                this.modify = true;
                isModify = true;
            }else{
                this.info = true;
                this.modify = false;
                isModify = false;
            }
        },

        modifyInfo(formName){
            const token = localStorage.getItem('user_token');
            let userJson = JSON.parse(localStorage.getItem("user_info"));
            const id = userJson.id;
            const nickname = userJson.nickname;
            const email = this.userInfo.email;
            const phone = this.userInfo.phone;
            const address = this.userInfo.address;
            const introduce = this.userInfo.introduce;

            this.$refs[formName].validate(valid => {
                console.log("-----------enter");
                if(valid) {
                    service.request({
                        url: "/api/user/update",
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                        },
                        data: {
                            "id": id,
                            "nickname": nickname,
                            "email": email,
                            "phone": phone,
                            "address": address,
                            "introduce": introduce,
                        }
                    }).then(response =>{
                        if (response.code === "200"){
                            console.log("-----------successful");
                            alert('提交成功！')
                            localStorage.setItem("user_info", JSON.stringify(response.result));
                            this.isModify();
                            location.reload();
                        }else{
                            alert('提交失败！')
                        }
                    }).catch(error => {
                        console.log("-----------successful" + error);
                        this.$message.error(error);
                    });
                } else {
                    console.log("error submit！")
                    return false
                }
            })
        }
    }
};
</script>

<style scoped>
    .me_item{
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        font-size: initial;
        color: #303133;
        height: 30px;
    }

    .item_text{
        font-size: medium;
        color: #909399;
        padding-left: 80px;
    }

    .modify_btn{
        float: right;
        width: 100px;
    }

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 5px;
}
</style>
