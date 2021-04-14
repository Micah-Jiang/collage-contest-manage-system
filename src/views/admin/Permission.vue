<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 权限管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.roleName" placeholder="角色名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
                <el-button type="primary" icon="el-icon-add" @click="insertRoles">新增角色</el-button>
            </div>
            <el-table
                    :data="roleList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                <el-table-column prop="insertTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
        <el-dialog title="角色编辑" v-model="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="form.roleName" :disabled="true"></el-input>
                </el-form-item>
                <br>
                权限配置
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="form.permissions" @change="handleCheckedMenuChange">
                    <el-checkbox v-for="item in options" :key="item"
                                 :label="item">{{item}}
                    </el-checkbox>
                </el-checkbox-group>
                <br>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 新建用户角色弹出框 -->
        <el-dialog title="新增用户角色" v-model="insertVisible" width="30%">
            <el-form ref="insertRole" :model="insertRole" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="insertRole.roleName"></el-input>
                </el-form-item>
                <br>
                权限配置
                <el-checkbox :indeterminate="insertRole.isIndeterminate" v-model="checkInsertAll" @change="insertCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="insertRole.permissions" @change="insertCheckedMenuChange">
                    <el-checkbox v-for="item in options" :key="item"
                                 :label="item">{{item}}
                    </el-checkbox>
                </el-checkbox-group>
                <br>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="insertVisible= false">取 消</el-button>
                    <el-button type="primary" @click="saveInsert()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import service from "../../utils/request";
    let menuList = [];
    export default {
        name: "permission",
        data() {
            return {
                options: menuList,

                insertRole:{
                    roleName: '',
                    permissions: [],
                    isIndeterminate: true,
                    checkInsertAll: false,
                },

                checkAll: false,
                isIndeterminate: true,
                form:{
                    id: 0,
                    roleName: '',
                    permissions: [],
                },
                query: {
                    roleName: '',
                },

                roleList: [],
                editVisible: false,
                insertVisible: false,
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
            this.initData(this.current);
        },
        methods: {
            initData(current) {
                const that = this;
                // 获取数据
                const token = localStorage.getItem('user_token');

                service.request({
                    url:'/api/role/list',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        pn: current,
                        roleName: that.query.roleName
                    },
                }).then((response) => {
                    if (response.code === "200") {
                        that.roleList = response.result.records
                        that.total = response.result.total;
                        that.pages = response.result.pages;
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });

                service.request({
                    url:'/api/permission/list',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                }).then((response) => {
                    if (response.code === "200") {
                        menuList = response.result;
                        this.options = menuList;
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

            // 新增
            insertRoles(){
                const that = this;
                that.insertVisible = true;
            },

            // 保存新增
            saveInsert(){
                const token = localStorage.getItem('user_token');
                service.request({
                    url:'/api/role/insert',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        roleName: this.insertRole.roleName,
                    },
                    data: this.insertRole.permissions
                }).then((response) => {
                    if (response.code === "200") {
                        alert("插入成功！");
                        location.reload()
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });
            },

            // 删除操作
            handleDelete(row) {
                let index = this.roleList.indexOf(row);
                // 获取数据
                const token = localStorage.getItem('user_token');

                // 二次确认删除
                this.$confirm("确定要删除吗？", "提示", {
                    type: "warning"
                })
                    .then(() => {

                        service.request({
                            url:'/api/role/delete',
                            method: 'delete',
                            headers: {
                                'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                            },
                            params: {
                                id: row.id,
                            },
                        }).then((response) => {
                            if (response.code === "200" && index > -1) {
                                this.$message.success("删除成功");
                                this.roleList.splice(index, 1);
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
                // 获取数据
                const token = localStorage.getItem('user_token');
                const that = this;
                that.form.id = row.id;
                that.form.roleName = row.roleName;
                that.editVisible = true;
                //当前用户所对应的权限
                service.request({
                    url:'/api/permission/user',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        id: row.id,
                    }
                }).then((response) => {
                    if (response.code === "200") {
                        that.form.permissions = response.result;
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
                });
            },
            // 保存编辑
            saveEdit() {
                const token = localStorage.getItem('user_token');
                service.request({
                    url:'/api/permission/update',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                    },
                    params: {
                        id: this.form.id,
                    },
                    data: this.form.permissions
                }).then((response) => {
                    if (response.code === "200") {
                        alert("更新成功！");
                        location.reload()
                    }else{
                        alert("数据获取失败！！");
                    }
                }).catch(error => {
                    console.log(error)
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
            // 编辑部分权限Menu
            handleCheckAllChange(val) {
                this.form.permissions = val ? menuList : [];
                this.isIndeterminate = false;
            },
            handleCheckedMenuChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === (this.options).length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < (this.options).length;
            },
            // insert部分Menu
            insertCheckAllChange(val) {
                this.insertRole.permissions = val ? menuList : [];
                this.insertRole.isIndeterminate = false;
            },
            insertCheckedMenuChange(value) {
                let checkedCount = value.length;
                this.insertRole.checkInsertAll = checkedCount === (this.options).length;
                this.insertRoles.isIndeterminate = checkedCount > 0 && checkedCount < (this.options).length;
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
