<template>
    <div>
        <el-button type="primary" @click="addType">新增设备类型</el-button>
        <el-button type="primary" @click="add">新增设备</el-button>
        <div class="spliter"></div>
        <el-table :data="devicetypes">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-table :data="deviceData ? deviceData.filter(item=>{return item.type_id==scope.row.id}) : deviceData">
                        <el-table-column label="设备代码" prop="device_no"></el-table-column>
                        <el-table-column label="设备名称" prop="device_name"></el-table-column>
                        <el-table-column label="规格型号" prop="device_spec"></el-table-column>
                        <el-table-column label="设备类型" prop="device_type"></el-table-column>
                        <el-table-column label="所在位置" prop="device_loc"></el-table-column>
                        <el-table-column label="设备状态">
                            <template slot-scope="scope">
                                <span v-if="scope.row.enabled==0">禁用</span>
                                <span v-else>启用</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="edit(1,scope.row)">修改</el-button>
                                <el-button size="small" type="danger" v-if="scope.row.enabled==1" @click="enable(0,scope.row.id)">禁用</el-button>
                                <el-button size="small" type="primary" v-else  @click="enable(1,scope.row.id)">启用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="类型代码" prop="type_code"></el-table-column>
            <el-table-column label="类型名称" prop="type_name"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.enabled==1">启用</span>
                    <span v-else>禁用</span>
                </template>
            </el-table-column>
            <el-table-column label="维修组" prop="group_name"></el-table-column>
            <el-table-column label="更新人" prop="emp_name"></el-table-column>
            <el-table-column label="更新时间" prop="updated_time"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit(0,scope.row)">修改</el-button>
                    <el-button size="small" type="danger" v-if="scope.row.enabled==1">禁用</el-button>
                    <el-button size="small" type="primary" v-else>启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dlgTypeVisible" title="设备类型维护">
            <el-form :model="typeData" :rules="rulesType" ref="typeForm" inline-message label-width="120px">
                <el-form-item label="设备类型代码" prop="type_code">
                    <el-input v-model="typeData.type_code" placeholder="请输入设备类型代码" :readonly="typeData.optype=='edit'"></el-input>
                </el-form-item>
                <el-form-item label="设备类型名称" prop="type_name">
                    <el-input v-model="typeData.type_name" placeholder="请输入设备类型名称"></el-input>
                </el-form-item>
                <el-form-item label="负责维修组" prop="group_id">
                    <el-select v-model="typeData.group_id" style="width:100%">
                        <el-option v-for="item in repairGroup" :label="item.group_name" :value="item.id" :key="item.id">
                            <span style="float:left">{{item.group_name}}</span>
                            <span style="float:right;color: #8492a6;">{{item.group_name}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dlgTypeVisible = false">取消</el-button>
                <el-button type="primary" @click="saveType">保存</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogVisible" title="设备维护">
            <el-form :model="formData" ref="deviceForm" label-width="80px" :rules="rules" inline-message>
                <el-form-item label="设备代码" prop="device_no"><el-input placeholder="请输入设备代码" v-model="formData.device_no" :readonly="formData.optype=='edit'"></el-input></el-form-item>
                <el-form-item label="设备名称" prop="device_name"><el-input placeholder="请输入设备名称" v-model="formData.device_name"></el-input></el-form-item>
                <el-form-item label="规格型号" prop="device_spec"><el-input placeholder="请输入规格型号" v-model="formData.device_spec"></el-input></el-form-item>
                <el-form-item label="设备类型" prop="type_id">
                    <el-select placeholder="请选择" v-model="formData.type_id" style="width:100%" >
                        <el-option v-for="item in devicetypes" :label="item.type_name" :value="item.id" :key="item.id">
                            <span style="float:left">{{item.type_code}}</span>
                            <span style="float:right;color: #8492a6;">{{item.type_name}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在位置" prop="area_id">
                    <el-select placeholder="请选择" v-model="formData.area_id" style="width:100%">
                        <el-option v-for="item in devicearea" :label="item.area_name" :value="item.id" :key="item.id">
                            <span style="float:left">{{item.area_code}} {{item.area_name}}</span>
                            <span style="float:right;color: #8492a6;">{{item.area_name}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveDevice">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return{
            dlgTypeVisible : false,
            dialogVisible:false,
            deviceData:null,
            devicetypes:null,
            devicearea:null,
            repairGroup:null,
            formData:{
                optype:'new',
                opuser:'',
                rid:0,
                device_no:'',
                device_name:'',
                device_spec:'',
                type_id:'',
                area_id:'',
            },
            typeData:{
                optype:'new',
                opuser:'',
                rid:0,
                type_code:'',
                type_name:'',
                group_id:'',
            },
            rules:{
                device_no:{required:true,message:'请输入设备代码',trigger:'blur'},
                device_name:{required:true,message:'请输入设备名称',trigger:'blur'},
                device_spec:{required:true,message:'请输入规格型号',trigger:'blur'},
                type_id:{ required: true, message: '请选择设备类型', trigger: 'blur' },
                area_id:{ required: true, message: '请选择设备所在位置', trigger: 'blur' },
            },
            rulesType:{
                type_code:{required:true,message:'请输入设备类型代码',trigger:'blur'},
                type_name:{required:true,message:'请输入设备类型名称',trigger:'blur'},
                group_id:{ required: true, message: '请选择设备类型', trigger: 'blur' },
            }
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPermission','errTitle'])
    },
    created(){
        this.getData();
    },
    methods:{        
        getData(){
            this.dialogVisible = false;
            this.dlgTypeVisible = false
            this.$store.dispatch('getDeviceData',{data:'opuser='+this.userinfo.emp_no,cb:res=>{
                if(res.errcode == 0){
                    this.deviceData = res.data[0];
                    this.devicetypes = res.data[1];
                    this.devicearea = res.data[2];
                    this.repairGroup =  res.data[3];
                }
            }})
        },
        initData(type,item){
            if(type==1){
                this.formData.rid = item ? item.id : 0;
                this.formData.device_no = item ? item.device_no : '';
                this.formData.device_name = item ? item.device_name : '';
                this.formData.device_spec = item ? item.device_spec : '';
                this.formData.type_id = item ? item.type_id : '';
                this.formData.area_id = item ? item.area_id : '';
                this.formData.optype = item ? 'edit' : 'new';
                this.formData.opuser = this.userinfo.emp_no;
                this.dialogVisible = true;
            }else{
                this.typeData.rid = item ? item.id : 0;
                this.typeData.optype = item ? 'edit' : 'new';
                this.typeData.opuser = this.userinfo.emp_no;
                this.typeData.type_code = item ? item.type_code : '';
                this.typeData.type_name = item ? item.type_name : '';
                this.typeData.group_id = item ? item.group_id  : '';
                this.dlgTypeVisible = true;
            }            
        },
        addType(){
            this.initData(0)
        },
        add(){
            this.initData(1);
        },
        edit(type,item){
            this.initData(type,item);
        },
        saveDevice(){
            var chkok = true;
            this.$refs['deviceForm'].validate((valid)=>{   
                chkok = valid;
            })
            if(!chkok){return false;}
            this.$store.dispatch('saveDeviceData',{data:this.formData,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:res.errmsg,type:'success'});                    
                    this.getData()
                }else{
                    this.$alert(res.errmsg,this.errTitle,{type:'error'});
                }
            }})
        },
        saveType(){
            var chkok = true;
            this.$refs['typeForm'].validate((valid)=>{   
                chkok = valid;
            })
            if(!chkok){return false;}
            this.$store.dispatch('saveTypeData',{data:this.typeData,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:res.errmsg,type:'success'});                    
                    this.getData()
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

