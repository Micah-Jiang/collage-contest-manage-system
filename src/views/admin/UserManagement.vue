<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.username" placeholder="账号名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.roleName" placeholder="用户角色" class="handle-input mr10"></el-input>
                <el-input v-model="query.major" placeholder="所属专业" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleInsert()">添加用户</el-button>
            </div>
            <el-table
                    :data="userList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="账户"></el-table-column>
                <el-table-column prop="nickName" label="昵称" align="center"></el-table-column>
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="roleName" label="用户类别"></el-table-column>
                <el-table-column prop="phone" label="联系电话"></el-table-column>
                <el-table-column prop="major" label="所属专业"></el-table-column>
                <el-table-column prop="insertTime" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template v-slot="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-size="limit"
                        :current-page="current"
                        :total="total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑用户" v-model="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                用户角色&nbsp;&nbsp;&nbsp;<el-select v-model="form.role" placeholder="请选择" @change="handleRoleMenuChange(form.role)">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <br>
                <br>
                <el-form-item label="用户昵称">
                    <el-input v-model="form.nickName"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 新增用户 -->
        <el-dialog title="新增用户" v-model="insertVisible" width="30%">
            <el-form ref="insertUser" :model="insertUser" label-width="70px">
                <el-form-item label="账户名称">
                    <el-input v-model="insertUser.username"></el-input>
                </el-form-item>
                <el-form-item label="账户密码">
                    <el-input v-model="insertUser.password"></el-input>
                </el-form-item>
                <el-form-item label="性    别">
                    <el-input v-model="insertUser.gender"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="insertUser.phone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="insertUser.email"></el-input>
                </el-form-item>
                <el-form-item label="专业名称">
                    <el-input v-model="insertUser.major"></el-input>
                </el-form-item>
                用户角色&nbsp;&nbsp;&nbsp;<el-select v-model="insertUser.role" placeholder="请选择" @change="handleUserRoleChanged(insertUser.role)">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="insertVisible = false">取 消</el-button>
                    <el-button type="primary" @click="insertUserToDb()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import service from "../../utils/request";
    export default {
        name: "basetable",
        data() {
            return {
                options: [],
                insertVisible: false,
                insertUser:{
                    nickName: '',
                    username: '',
                    password: '',
                    email: '',
                    phone: '',
                    role: 0,
                    userRole: '',
                    major: '',
                    gender: ''
                },
                form:{
                    id: 0,
                    nickName: '',
                    email: '',
                    phone: '',
                    roleName: '',
                    role: 0,
                },
                query: {
                    username: '',
                    major: '',
                    roleName: '',
                },

                userList: [],
                editVisible: false,
                //总记录数
                total: 0,
                //页码
                current: 1,
                //每页记录数
                limit: 5,
                //总页码数
                pages: '8',
            };
        },
        created() {
            this.initData();
        },
        methods: {
            initData(current) {
                const that = this;
                // 获取数据
                const token = localStorage.getItem('user_token');

                service.request({
                    url:'/api/user/list',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        pn: current,
                    },
                    data: {
                        "username": that.query.username,
                        "major": that.query.major,
                        "roleName": that.query.roleName
                    }
                }).then((response) => {
                    if (response.code === "200") {
                        that.userList = response.result.records
                        that.total = response.result.total;
                        that.pages = response.result.pages;
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });

                service.request({
                    url:'/api/role/menu',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                }).then((response) => {
                    if (response.code === "200") {
                        that.options = response.result
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });

            },

            // 触发搜索按钮
            handleSearch() {
                this.current = 1
                this.initData(this.current)
            },
            // 删除操作
            handleDelete(row) {
                let index = this.userList.indexOf(row);
                // 获取数据
                const token = localStorage.getItem('user_token');

                // 二次确认删除
                this.$confirm("确定要删除吗？", "提示", {
                    type: "warning"
                })
                    .then(() => {

                        service.request({
                            url:'/api/user/delete',
                            method: 'get',
                            headers: {
                                'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                            },
                            params: {
                                id: row.id,
                            },
                        }).then((response) => {
                            if (response.code === "200" && index > -1) {
                                this.$message.success("删除成功");
                                this.userList.splice(index, 1);
                                location.reload();
                            }else{
                                alert("数据获取失败！！");
                            }
                        }).catch(error => {
                            console.log(error)
                        });
                    })
                    .catch(() => {});
            },

            // 编辑操作
            handleEdit(row) {
                const that = this;
                that.form.id = row.id;
                that.form.role = row.role;
                that.form.roleName = row.roleName;
                that.form.nickName = row.nickName;
                that.form.email = row.email;
                that.form.phone = row.phone;
                that.editVisible = true
                return that.editVisible;
            },
            // 保存编辑
            saveEdit() {
                const token = localStorage.getItem('user_token');
                const id = this.form.id;
                const nickName = this.form.nickName;
                const email = this.form.email;
                const phone = this.form.phone;
                const userRole = this.form.roleName;
                const role = this.form.role;

                console.log(email+phone+nickName+role+userRole)

                service.request({
                    url: "/api/user/update",
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    data: {
                        "id": id,
                        "nickname": nickName,
                        "email": email,
                        "phone": phone,
                        "userRole": userRole,
                        "role": role,
                    }
                }).then(response =>{
                    if (response.code === "200"){
                        console.log("-----------successful");
                        alert('提交成功！')
                        location.reload();
                    }else{
                        alert('提交失败！')
                    }
                }).catch(error => {
                    console.log("-----------successful" + error);
                    this.$message.error(error);
                });
            },
            //改变页面的显示条数
            handleSizeChange: function (val) {
                const that = this;
                that.limit = val;
                that.initData(that.current);
            },
            //改变当前页
            handleCurrentChange: function (val) {
                const that = this;
                that.current = val;
                that.initData(that.current);
            },
            handleRoleMenuChange(val) {
                var obj = {}
                obj = this.options.find(function(item){
                    return item.value === val
                })
                this.form.roleName = obj.label;
            },
            handleInsert(){
                const that = this;
                that.insertVisible = true;
            },
            handleUserRoleChanged(val){
                var obj = {}
                obj = this.options.find(function(item){
                    return item.value === val
                })
                this.insertUser.userRole = obj.label;
            },
            insertUserToDb(){
                const token = localStorage.getItem('user_token');
                const username = this.insertUser.username;
                const password = this.insertUser.password;
                const nickName = this.insertUser.nickName;
                const email = this.insertUser.email;
                const phone = this.insertUser.phone;
                const userRole = this.insertUser.roleName;
                const role = this.insertUser.role;
                const major = this.insertUser.major;

                console.log(email+phone+nickName+role+userRole)

                service.request({
                    url: "/api/user/insert",
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    data: {
                        "username": username,
                        "password": password,
                        "nickname": nickName,
                        "email": email,
                        "phone": phone,
                        "userRole": userRole,
                        "role": role,
                        "major": major,
                        "gender": this.insertUser.gender,
                    }
                }).then(response =>{
                    if (response.code === "200"){
                        alert('提交成功！');
                        location.reload();
                    }else{
                        alert('提交失败！');
                    }
                }).catch(error => {
                    alert(error);
                });
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
</style>
