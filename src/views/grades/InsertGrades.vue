<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>成绩上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    accept=".xlsx"
                    drag action='http://localhost:8085/api/signup/upload'
                    :limit="1"
                    :file-list="excelFile"
                    :auto-upload="true"
                    :multiple='false'
                    :headers="setHeaders"
                    :on-error="uploadError"
            :on-success="uploadSuccess">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <el-button size="small" type="primary">点击上传</el-button>
                </div>
                <template #tip>
                    <div class="el-upload__tip">只能上传 excel 文件，且不超过 500kb</div>
                </template>
            </el-upload>
        </div>
    </div>
</template>

<script>
    import "cropperjs/dist/cropper.css";
    export default {
        name: "upload",
        data() {
            return {
                defaultSrc: require("../../assets/img/img.jpg"),
                excelFile: []
            };
        },
        components: {

        },
        methods: {
            uploadSuccess(){
                alert("上传成功！")
                location.reload();
            },
            uploadError(){
                alert("上传失败！请联系管理员。")
            }
        },
        created() {
            this.cropImg = this.defaultSrc;
        },
        computed:{
            setHeaders(){
                const token = localStorage.getItem('user_token');
                return{
                    'Authorization': 'Bearer ' + token.replace("\"","").replace("\"","")
                }
            }
        }
    };
</script>

<style scoped>
</style>
