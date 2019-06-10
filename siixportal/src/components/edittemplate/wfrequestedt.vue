<template>
    <div>
        <div class="el-dialog__wrapper cust-modal" style="z-index:2000" :class="dialogVisible ? 'd-block':'d-none'">
            <el-card class="cust-dialog">
            <div slot="header">
                <span>物品外置申请表</span>
            </div>
        
            <el-form :model="formData" :rules="rules" ref="wfRequestForm" :inline-message='true' label-width="80px">
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
                            <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="formData.sdate" name="sdate" style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束日期" prop="edate">
                            <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="formData.edate" name="edate" style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>       
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="存放数量" prop="qty">
                            <el-input type="number" v-model="formData.qty" name="qty"></el-input>
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
                            <div v-if="formData.optype!='query' && approve == false">
                                <input type="file"  id="myfile1">
                                <input type="file"  id="myfile2">
                            </div>
                            <span class="clickable"  @click="preview" v-else-if="fileList.length>0">点击查看</span>
                            
                        </el-form-item>
                    </el-col>
                </el-row>           
            </el-form>
            

            <el-dialog title="物品写真" :visible.sync="dialogImage" append-to-body top="5vh">
                <el-carousel trigger="click" height="500px">
                    <el-carousel-item  v-for="(item,index) in fileList" :key="index" class="text-center">
                        <img :src="item">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
            <el-row style="text-align:right">
                <el-col :span="24">
                    <el-button @click="setFalse">取消</el-button>
                    <el-button type="primary" @click="saveData" :class="(approve || formData.optype=='query') ? 'd-none':'d-inline-block'" >保存</el-button>
                    <el-button type="danger"  @click="backRequest" :class="approve ? 'd-inline-block':'d-none'">退单</el-button>
                    <el-button type="primary" @click="approveRequest" :class="approve ? 'd-inline-block':'d-none'">批准</el-button>
                </el-col>
            </el-row>
        </el-card>
        </div>
        
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    props:{
        editData:{
            type:String,
            default:[]
        },
        editVisible:{
            type:Boolean,
            default:false,
        },
        approve:{
            type:Boolean,
            default:false,
        },
        menuid:{
            type: String,
            default: ''
        }
    },
    watch:{
        editData(data){
            var  item = {};
            if(data){
                var item = JSON.parse(data);
            }
            this.formData.rid = item.id ? item.id : 0;
            this.formData.storegoods = item.store_goods ? item.store_goods : '';
            this.formData.locid = item.loc_id ? item.loc_id : '';
            this.formData.sdate = item.start_time ? item.start_time : '';
            this.formData.edate = item.end_time ? item.end_time : '';
            this.formData.qty = item.qty ? item.qty : '0';
            this.formData.dutyer = item.duty_by ? item.duty_by : '';
            this.formData.reason = item.store_reason ? item.store_reason : '';
            this.formData.remark = item.remark ? item.remark : '';
            this.formData.goodsstatus = item.goods_status ? item.goods_status : '';
            this.fileList = [];
            if(item){
                if(item.pic1){
                    this.fileList.push(this.imageUrl+'/'+item.pic1);
                }
                if(item.pic2){
                    this.fileList.push(this.imageUrl+'/'+item.pic2);
                }
            }
            this.formData.optype =  item.optype ? item.optype : 'new';
            this.formData.chk_level = item.chk_level ? item.chk_level : 0;
            this.formData.apply_no = item.apply_no ? item.apply_no : '';
            this.formData.apply_no = item.apply_user ? item.apply_user : '';            
        },
        editVisible(value){
            this.dialogVisible = value;
        }
    },
    data(){
        var numValidator=(rule,value,callback)=>{
            if(value <= 0){
                callback(new Error('请输入大于0的数字'))
            }
        };
        return{
            dialogVisible:false,
            dialogImage:false,
            fileList:[],
            locations:[],
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
                chk_level:0,
                apply_no:'',
                apply_user:'',
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
        ...mapGetters(['userinfo','imageUrl'])
    },
    created(){
        this.formData.opuser = this.userinfo.emp_no;
        this.$store.dispatch('getLocations',{cb:res=>{
            this.locations = res.data[1];
        }});
    },
    methods:{
        setFalse(){
            this.$emit('setValue',false);
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
                        this.$alert(jsonObj.errmsg,'出错啦',{type:'error'});
                    }else{
                        this.saveDataEx(jsonObj);
                    }
                }});
            }else{
                this.saveDataEx();
            }
        },
        saveDataEx(file){
            if(file){
                for(var i=0;i<file.files.length;i++){
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
                    this.$emit('refresh');
                    this.$refs['wfRequestForm'].resetFields();
                }else{
                    this.$alert(res.errmsg,'出错啦',{ype:'error'});
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
        },
        preview(){
            this.dialogImage = this.fileList.length>0
        },
        approveRequest(){
            var _this = this;
            this.$confirm('确定批准此单?','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(({value})=>{
                var post = 'applyno='+this.formData.apply_no
                          +'&chkuser='+_this.formData.opuser+'&chktype=1&memo='+value
                          +'&menuid='+this.menuid+'&chklevel='+this.formData.chk_level+'&applyuser='+this.formData.apply_user;
                this.$store.dispatch('approveRequest',{data:post,cb:(res)=>{
                    if(res.errcode==0){
                        this.$message({message:'审核成功',type:'success'});
                        _this.$emit('refresh')
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        backRequest(){
            var _this = this;
            this.$prompt('请输入退单原因:','提示',{confirmButtonText:'确定',cancelButtonText:'取消'}).then(({value})=>{
                var post = 'applyno='+this.formData.apply_no
                          +'&chkuser='+_this.userinfo.emp_no+'&chktype=2&memo='+value
                          +'&menuid='+this.menuid+'&chklevel='+this.formData.chk_level+'&applyuser='+this.formData.apply_user;
                this.$store.dispatch('approveRequest',{data:post,cb:(res)=>{
                    if(res.errcode==0){
                        this.$message({message:'退单成功',type:'success'});
                        _this.$emit('refresh') 
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        }
    }
}
</script>

<style>
</style>
