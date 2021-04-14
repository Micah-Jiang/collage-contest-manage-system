<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">大学生科技竞赛管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="请输入用户名">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="请输入密码"
                            v-model="param.password"
                            @keyup.enter="submitForm()"
                    >
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">温馨提示 : 欢迎访问系统，祝你每天开心！</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import service from "../../utils/request";

    export default {
        data() {
            return {
                param: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: "请输入用户名", trigger: "blur" }
                    ],
                    password: [
                        { required: true, message: "请输入密码", trigger: "blur" }
                    ]
                }
            };
        },
        created() {
            this.$store.commit("clearTags");
        },

        methods: {
            submitForm() {
                service.request({
                    url:'/api/user/permissions',
                    method: 'get',
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    params: {
                        id: 1,
                    },
                }).then((response) => {
                    console.debug(response.result)
                    if (response.code === "200") {
                        console.log(response.toString())
                    }else{
                        this.$message.error("发生了异常！");
                    }
                }).catch(error => {
                    console.log(error)
                });

                this.$refs.login.validate(valid => {
                    if (valid) {
                        const username = this.param.username;
                        const password = this.param.password;
                        console.log("username --------- "+username);
                        service.request({
                            url:'/api/login',
                            method: 'post',
                            data: {
                                username: username,
                                password: password,
                            },
                        }).then((response) => {
                            console.debug(response.result)
                            if (response.code === "200") {
                                this.$message.success("登录成功");
                                localStorage.setItem("user_token", JSON.stringify(response.result));
                                this.$router.push("/");
                            }else{
                                this.$message.error("用户名或者密码错误！");
                            }
                        }).catch(error => {
                            console.log(error)
                        });
                    } else {
                        this.$message.error("请输入账号和密码");
                        return false;
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }
    .ms-content {
        padding: 30px 30px;
    }
    .login-btn {
        text-align: center;
    }
    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }
    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
