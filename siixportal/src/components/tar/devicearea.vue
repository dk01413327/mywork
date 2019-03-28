<template>
    <div>
        <el-button type="primary" @click="add">新增</el-button>
        <div class="spliter"></div>
        <el-table :data="area">
            <el-table-column label="位置代码" prop="area_code"></el-table-column>
            <el-table-column label="位置名称" prop="area_name"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled==0">禁用</span>
                    <span v-else>启用</span>
                </template>
            </el-table-column>
            <el-table-column label="负责维修组" prop="group_name"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.row)">修改</el-button>
                    <el-button size="small" type="danger" v-if="scope.row.enabled==1" @click="enable(0,scope.row.id)">禁用</el-button>
                    <el-button size="small" type="primary" v-else  @click="enable(1,scope.row.id)">启用</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :visible.sync="dialogVisible" title="位置维护">
            <el-form :model="formData" :rules="rules" inline-message label-width="100px">               
                  
                <el-form-item label="位置代码" prop="area_code">
                    <el-input v-model="formData.area_code" placeholder="请输入位置代码"></el-input>
                </el-form-item>
    
        
                <el-form-item label="位置名称" prop="area_name">
                    <el-input v-model="formData.area_name" placeholder="请输入位置名称"></el-input>
                </el-form-item>

                <el-form-item label="负责维修组" prop="group_id">
                    <el-select v-model="formData.group_id" style="width:100%">
                        <el-option v-for="item in repairGroup" :label="item.group_name" :value="item.id" :key="item.id">
                            <span style="float:left">{{item.group_name}}</span>
                            <span style="float:right;color: #8492a6;">{{item.group_name}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return{
            permisson:null,
            dialogVisible:false,
            area:null,
            repairGroup:null,
            formData:{
                optype:'',
                opuser:'',
                rid:0,
                area_code:'',
                area_name:'',
                group_id:'',
            },
            rules:{
                area_code:{required:true,message:'请输入位置代码',trigger:'blur'},
                group_id:{required:true,message:'请选择负责维修组',trigger:'blur'},
                area_name:{required:true,message:'请输入位置名称',trigger:'blur'},
            }
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPermission','errTitle','callback'])
    },
    created(){
        this.formData.opuser = this.userinfo.emp_no;
        this.permisson = this.getPermission;
        this.getData();
        this.getRepairGroup();
    },
    methods:{
        getData(){
            this.$store.dispatch('getRepairArea',{data:'opuser='+this.userinfo.emp_no,cb:res=>{
                if(res.errcode==0){
                    this.area = res.data;                    
                }
            }})
        },
        getRepairGroup(){
            this.$store.dispatch('getRepairGroup',{data:'opuser='+this.userinfo.emp_no,cb:res=>{
                if(res.errcode==0){
                    this.repairGroup = res.data[0];
                }
            }})
        },
        initData(item){
            this.formData.optype = item ? 'edit' : 'new';
            this.formData.rid = item ? item.id : 0;
            this.formData.area_code = item ? item.area_code : '';
            this.formData.area_name = item ? item.area_name : '';
            this.formData.group_id = item ? item.group_id : '';
            this.dialogVisible = true;
        },
        add(){
            this.initData();
        },
        edit(item){
            this.initData(item);
        },
        save(){
            this.$store.dispatch('saveRepairArea',{data:this.formData,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:res.errmsg,type:'success'});
                    this.dialogVisible = false;
                    this.getData();
                }else{
                    this.$alert(res.errmsg,this.errTitle,{type:'error'});
                }
            }})
        },
        enable(value,id){
            this.$store.dispatch('enableRepairArea',{data:'value='+value+'&id='+id,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:res.errmsg,type:'success'});                    
                    this.getData();
                }else{
                    this.$alert(res.errmsg,this.errTitle,{type:'error'});
                }
            }})
        }
    }
}
</script>
<style scoped>

</style>
