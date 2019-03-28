<template>
    <div>
        <el-button type="primary" @click="add">新增</el-button>
        <div class="spliter"></div>
        <el-table :data="reqdata" bordered>
            <el-table-column label="申请编号" prop="apply_no">
                <template slot-scope="scope">
                    <span class="clickable" @click="query(scope.row)">{{scope.row.apply_no}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">  
                    <span class="clickable" v-if="scope.row.status==1"  @click="getCheckRecord(scope.row.apply_no)">已关闭</span>
                    <span class="clickable" v-else-if="scope.row.checked==1" @click="getCheckRecord(scope.row.apply_no)">审核完成</span>
                    <span class="clickable" v-else-if="scope.row.post_level>0" @click="getCheckRecord(scope.row.apply_no)">已提交</span>
                    <span class="clickable" v-else  @click="getCheckRecord(scope.row.apply_no)">未提交</span>
                </template>
            </el-table-column>
            <el-table-column label="存放物品" prop="store_goods"></el-table-column>
            <el-table-column label="物品状态" prop="goods_status"></el-table-column>
            <el-table-column label="存放位置" prop="loc_code"></el-table-column>
            <el-table-column label="存放数量" prop="qty"></el-table-column>
            <el-table-column label="开始日期" prop="start_time"></el-table-column>
            <el-table-column label="结束日期" prop="end_time"></el-table-column>
            <el-table-column label="责任人" prop="duty_by"></el-table-column>
            <el-table-column label="存放原因" prop="store_reason"></el-table-column>
            <el-table-column label="申请时间" prop="apply_time"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="submit(scope.row)" type="text" size="small">提交</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog  title="物品存放申请" width="50%" >
            <el-form id="wfRequestForm" :model="formData" :rules="rules" ref="wfRequestForm" :inline-message='true' label-width="80px">
                <el-row >
                    <el-col :span="12">
                        <el-form-item label="存放物品" prop="storegoods" >
                            <el-input placeholder="请输入存放物品" class="input-with-select" v-model="formData.storegoods" name="storegoods">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="存放位置" prop="locid">
                            <el-select v-model="formData.locid" placeholder="存放位置" style="width:100%">
                                <el-option v-for="item in locations" :label="item.loc_code" :value="item.id" :key="item.id">
                                    <span style="float:left">{{item.loc_code}} {{item.loc_desc}}</span>
                                    <span style="float:right;color: #8492a6;">{{item.loc_code}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="12">
                        <el-form-item label="开始日期" prop="sdate">
                            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="formData.sdate" name="sdate" style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束日期" prop="edate">
                            <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="formData.edate" name="edate" style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>       
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="存放数量" prop="qty">
                            <el-input v-model="formData.qty" name="qty"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="责任人" prop="dutyer">
                            <el-input v-model="formData.dutyer" name="dutyer"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="物品状态" prop="goodsstatus" >
                            <el-input v-model="formData.goodsstatus" name="goodsstatus"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="存放原因" prop="reason">
                            <el-input v-model="formData.reason" name="reason"></el-input>
                        </el-form-item>
                    </el-col>                    
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="formData.remark" name="remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                    
                    <el-col :span="24">
                        <el-form-item label="物品写真" >
                            <div v-if="formData.optype!='query'">
                                <input type="file"  id="myfile1">
                                <input type="file"  id="myfile2">
                            </div>
                            <span class="clickable"  @click="preview" v-else-if="fileList.length>0">点击查看</span>
                            
                        </el-form-item>
                    </el-col>
                </el-row>           
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveData" :disabled="formData.optype=='query'">确 定</el-button>
            </span>
            <el-dialog title="物品写真" :visible.sync="dialogImage" append-to-body top="5vh">
                <el-carousel trigger="click" height="500px">
                    <el-carousel-item  v-for="(item,index) in fileList" :key="index" class="text-center">
                        <img :src="item">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
        </el-dialog>
        <el-dialog title="审核记录" :visible.sync="chkDialogVisible">
            <el-table :data='checkrecord'>
                <el-table-column label="审核人" prop="emp_name"></el-table-column>
                <el-table-column label="审核意见" prop="chk_memo"></el-table-column>
                <el-table-column label="审核时间" prop="chk_time"></el-table-column>
            </el-table>
        </el-dialog>

        <wfrequestedt :edit-data='editData' :edit-visible="dialogVisible" :approve="false" @setValue="changeValue" @refresh="getData"></wfrequestedt>
    </div>
</template>
<script>
import {Getters,Actions, mapGetters} from 'vuex';
export default {
    data(){
        return{
            menuRight:'',
            editData:'',
            chkDialogVisible:false,
            checkrecord:[],
            dialogVisible:false,
            dialogImage: false,
            reqdata:[],
            locations:[],
            fileList:[],
            formData:{
                rid:0,            
                storegoods:'',
                locid:'',
                sdate:'',
                edate:'',
                qty:0,
                dutyer:'',
                reason:'',
                remark:'',
                goodsstatus:'',
                file0:'',
                file1:'',
                opuser:'',
                optype:'new',
            },
            rules:{
                storegoods:{required:true,message:'请输入存放物品',trigger:'blur'},
                locid:[{required:true,message:'请选择位置',trigger:'change'}],
                sdate:{required:true,message:'请输入存放开始日期',trigger:'blur'},
                edate:{required:true,message:'请输入存放结束日期',trigger:'blur'},
                qty:{required:true,message:'请输入存放数量',trigger:'blur'},
                dutyer:{required:true,message:'请输入责任人',trigger:'blur'},
                reason:{required:true,message:'请输入存放原因',trigger:'blur'},
                goodsstatus:{required:true,message:'请输入物品状态',trigger:'blur'}
            }
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPermission','imageUrl'])
    },
    created(){
        this.formData.opuser = this.userinfo.emp_no;
        this.menuRight = this.getPermission;
        this.$store.dispatch('getLocations',{cb:res=>{
            this.locations = res.data[1];
        }});
        this.getData();
    },
    methods:{ 
        changeValue(value){
            this.dialogVisible = value;
        },
        getData(){
            this.$store.dispatch('getWFRequestData',{data:'opuser='+this.userinfo.emp_no,cb:res=>{
                this.reqdata = res.data;
            }});
            this.dialogVisible = false;
        },
        add(){
            this.editData = '';
            this.initFormvalue();
            this.formData.optype = 'new';
            this.dialogVisible = true;
        },
        initFormvalue(item){
            this.rid = item ? item.id : 0;
            this.formData.storegoods = item ? item.store_goods : '';
            this.formData.locid = item ? item.loc_id : '';
            this.formData.sdate = item ? item.start_time : '';
            this.formData.edate = item ? item.end_time : '';
            this.formData.qty = item ? item.qty : '0';
            this.formData.dutyer = item ? item.duty_by : '';
            this.formData.reason = item ? item.store_reason : '';
            this.formData.remark = item ? item.remark : '';
            this.formData.goodsstatus = item ? item.goods_status : '';
            this.fileList = [];
            if(item){
                if(item.pic1){
                    this.fileList.push(this.imageUrl+'/'+item.pic1);
                }
                if(item.pic2){
                    this.fileList.push(this.imageUrl+'/'+item.pic2);
                }
            }
            
        },
        edit(item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            item.optype = 'edit';
            this.editData = JSON.stringify(item);
            this.dialogVisible = true;
            this.initFormvalue(item);            
            this.formData.optype = 'edit';
        },
        del(item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            this.$confirm('确认删除此单?','提示',{confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'}).then(()=>{
                this.$store.dispatch('delWFRequestData',{data:'id='+item.id,cb:res=>{
                    if(res.errcode == 0){
                        this.$message({message:res.errmsg,type:'success'});
                        this.getData()
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        query(item){
            item.optype = 'query'
            this.editData = JSON.stringify(item);
            this.dialogVisible = true;

            this.initFormvalue(item);            
            this.formData.optype = 'query';
        },
        submit(item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            this.$confirm('提交后不能修改,确认提交码?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                var data = 'applyno='+item.apply_no+'&chkuser='+this.userinfo.emp_no+'&menuid='+this.menuRight.menuid+'&chktype=0&chklevel=0'
                this.$store.dispatch('approveRequest',{data:data,cb:res=>{
                    if(res.errcode==0){
                        this.$message({message:'提交成功',type:'success'});
                        this.getData();
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'})
                    }                    
                }});
            })
        },
        saveData(){
            //var file = $("#myfile1")[0].files[0];
            //this.checkUploadPic(file);
            //console.log(file);
            //return false;

            var file1 = $("#myfile1")[0].files[0];
            var file2 = $("#myfile2")[0].files[0];
            if(this.formData.optype=='new'){
                if(!file1 && !file2){
                    this.$alert('请选择上传文件','出错啦',{type:'error'})
                    return false;
                }
            }

            var chkok = true;
            this.$refs['wfRequestForm'].validate((valid)=>{   
                chkok = valid;
            })
            if(!chkok){return false;}
            if(this.formData.sdate == this.formData.edate || this.formData.sdate > this.formData.edate){
                this.$alert('开始日期不大于等于结束日期','出错啦',{type:'error'});
                return false;
            }
            if(file1 || file2){
                var fd = new FormData();
                if(file1){
                    if(!this.checkUploadPic(file1)){
                        return false;
                    }
                    fd.append('myfile1', file1);
                }
                if(file2){
                    if(!this.checkUploadPic(file2)){
                        return false;
                    }
                    fd.append('myfile2', file2);
                }
                fd.append('uptype','99');
                fd.append('fun','wfsystem');
                fd.append('empno',this.userinfo.emp_no);
                this.$store.dispatch('uploadfile',{'data':fd,'cb':(res)=>{
                    var jsonObj = JSON.parse(res);
                    if(jsonObj.errcode==1){
                        this.$alert(jsonObj.errmsg,'出错啦',{ype:'error'});
                    }else{
                        this.saveDataEx(jsonObj);
                    }
                }});
            }else{
                this.saveDataEx();
            }
        },
        saveDataEx(file){
            //var data =  $('#wfRequestForm').serialize();
            //data += '&opuser='+this.userinfo.emp_no+'&optype='+this.optype+'&locid='+this.formData.locid+'&rid='+this.rid;
            if(file){
                for(var i=0;i<file.files.length;i++){
                    //data +='&file'+i+'='+file.files[i];
                    if(i==0) 
                        this.formData.file0 = file.files[i];
                    if(i==1){
                        this.formData.file1 = file.files[i];
                    }
                }
            } 
            var data = this.formData;
            this.$store.dispatch('saveWfRequestData',{data:data,cb:res=>{
                if(res.errcode == 0){
                    this.$message({message:res.errmsg,type:'success'});
                    this.getData();
                    this.$refs['wfRequestForm'].resetFields();
                    
                    this.dialogVisible = false;
                }else{
                    this.$alert(res.errmsg,'出错啦',{ype:'error'});
                }
            }})
        },
        preview(){
            this.dialogImage = this.fileList.length>0
        },
        getCheckRecord(applyno){
            var data ='applyno='+applyno+'&menuid='+this.getPermission.menuid;
            this.$store.dispatch('getCheckRecord',{data:data,cb:res=>{
                if(res.errcode==0){
                    this.checkrecord= res.data;
                    this.chkDialogVisible = true;
                }
            }})
        },
        checkUploadPic(file){
            if(!file){
                return false;
            }
            
            if(file.type != 'image/png' && file.type != 'image/jpeg'){
                this.$alert('请上传JPG或PNG图片文件','出错啦',{type:'error'});
                return false;
            }
            if(file.size/1024/1024>2){
                this.$alert('文件太大，请上传小于2M图片文件','出错啦',{type:'error'});
                return false;
            }
            return true;
        }
    }
}
</script>
<style scoped>
    
    .el-form-item{
        margin-bottom: 2px;
    }
    img{  
        width: auto;  
        height: auto;  
        max-width: 100%;  
        max-height: 100%;     
    }

</style>
