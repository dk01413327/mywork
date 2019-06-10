<template>
    <div>
        <div class="cust-modal" style="z-index:2000" :class="dialogVisible ? 'd-block':'d-none'">
            <el-card class="cust-dialog" style="margin-top:2vh">
            <div slot="header" class="cust-card-title">
                <span>新增人员申请表</span>
            </div>
        
            <el-form  :model="formData" :rules="rules" ref="manRequestForm" :inline-message='true' label-width="80px">
                <el-row >
                    <el-col :span="12">
                        <el-form-item label="需求职位" prop="position">
                            <el-input name="position" v-model="formData.position"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="需求人数" prop="req_qty">
                            <el-input type="number" v-model="formData.req_qty"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="需求日期" prop="need_date">
                            <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="formData.need_date" name="need_date" style="width:100%"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row >
                    <el-col :span="13">
                        <el-form-item label="需求原因" >
                            <el-radio-group v-model="formData.reason_code">
                                <el-radio :label="0">离职补充</el-radio>
                                <el-radio :label="1">扩大生产</el-radio>
                                <el-radio :label="2">人事调动</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="" prop="reason_desc">
                            <el-input placeholder="请输入需求原因"  v-model="formData.reason_desc"></el-input>
                        </el-form-item>
                    </el-col>                    
                </el-row>                   
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="req_sex">
                            <el-radio-group v-model="formData.req_sex">
                                <el-radio :label="0">男</el-radio>
                                <el-radio :label="1">女</el-radio>
                                <el-radio :label="2">不限</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="婚姻" prop="marital_status">
                            <el-radio-group v-model="formData.marital_status" >
                                <el-radio :label="0">未婚</el-radio>
                                <el-radio :label="1">已婚</el-radio>
                                <el-radio :label="2">不限</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="最小年龄" prop="req_age_min" >
                            <el-input type="number" v-model="formData.req_age_min" name="req_age_min"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最大年龄" prop="req_age_max" >
                            <el-input type="number" v-model="formData.req_age_max" name="req_age_max"></el-input>
                        </el-form-item>
                    </el-col>                    
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="学历" prop="education">
                            <el-radio-group v-model="formData.education">
                                <el-radio :label="0">初中</el-radio>
                                <el-radio :label="1">高中/中专</el-radio>
                                <el-radio :label="2">大学/大专</el-radio>
                                <el-radio :label="3">本科</el-radio>
                                <el-radio :label="4">硕士</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                    
                    <el-col :span="12">
                        <el-form-item label="职称" prop="pro_title">
                            <el-input name="pro_title" v-model="formData.pro_title">   </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="专业" prop="major" >
                            <el-input name="major" v-model="formData.major">   </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="英语" >
                            <el-radio-group v-model="formData.english_level">
                                <el-radio :label="0">精通</el-radio>
                                <el-radio :label="1">熟练</el-radio>
                                <el-radio :label="2">良好</el-radio>
                                <el-radio :label="3">一般</el-radio>
                                <el-radio :label="4">不需要</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="日语" >
                            <el-radio-group v-model="formData.japanese_level" >
                                <el-radio :label="0">精通</el-radio>
                                <el-radio :label="1">熟练</el-radio>
                                <el-radio :label="2">良好</el-radio>
                                <el-radio :label="3">一般</el-radio>
                                <el-radio :label="4">不需要</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="ISO知识">
                            <el-radio-group v-model="formData.iso_level">
                                <el-radio :label="0">精通</el-radio>
                                <el-radio :label="1">熟练</el-radio>
                                <el-radio :label="2">良好</el-radio>
                                <el-radio :label="3">一般</el-radio>
                                <el-radio :label="4">不需要</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row>                    
                    <el-col :span="12">
                        <el-form-item label="经历" prop="experience">
                            <el-input name='experience' v-model="formData.experience">   </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="技能" prop="skill">
                            <el-input name='skill' v-model="formData.skill" >   </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                    
                    <el-col :span="12">
                        <el-form-item label="个性" prop="personality">
                            <el-input  name='personality' v-model="formData.personality" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="补充内容" prop="supplement">
                            <el-input  name='supplement' v-model="formData.supplement" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>     
            </el-form>
            <el-row style="text-align:right;">
                <el-col :span="24">
                    <el-button @click="setFalse">取消</el-button>
                    <span v-if="formData.optype!='query'">
                        <el-button type="primary" @click="saveData" :class="approve ? 'd-none':'d-inline-block'">保存</el-button>
                        <el-button type="danger"  @click="backRequest" :class="approve ? 'd-inline-block':'d-none'">退单</el-button>
                        <el-button type="primary" @click="approveRequest" :class="approve ? 'd-inline-block':'d-none'">批准</el-button>
                    </span>
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
            type:String,
            default:'',
        }
    },
    watch:{
        editData(data){
            var  item = {};
            if(data){
                var item = JSON.parse(data);
            }
            this.formData.rid = item.id ? item.id : 0;
            this.formData.position = item.position ? item.position : '';
            this.formData.reason_code = item.reason_code ? item.reason_code : 0;
            this.formData.reason_desc = item.reason_desc ? item.reason_desc : '';
            this.formData.req_qty = item.req_qty ? item.req_qty : 1;
            this.formData.need_date = item.need_date ? item.need_date : '';
            this.formData.req_sex = item.req_sex ? item.req_sex : 2;
            this.formData.marital_status = item.marital_status ? item.marital_status : 2;
            this.formData.req_age_min = item.req_age_min ? item.req_age_min : 18;
            this.formData.req_age_max = item.req_age_max ? item.req_age_max : 40;
            this.formData.education = item.education ? item.education : 0;
            this.formData.pro_title = item.pro_title ? item.pro_title : '';
            this.formData.major = item.major ? item.major : '';
            this.formData.english_level = item.english_level ? item.english_level : 4;
            this.formData.japanese_level = item.japanese_level ? item.japanese_level : 4;
            this.formData.iso_level = item.iso_level ? item.iso_level : 4;
            this.formData.experience = item.experience ? item.experience : '';
            this.formData.skill = item.skill ? item.skill : '';
            this.formData.personality = item.personality ? item.personality : '';
            this.formData.supplement = item.supplement ? item.supplement : '';
            this.formData.optype =  item.optype ? item.optype : 'new';

            this.formData.chk_level = item.chk_level ?  item.chk_level : 0;
            this.formData.apply_no = item.apply_no ?  item.apply_no : '';
            this.formData.apply_user = item.apply_user ?  item.apply_user : '';            
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
            formData:{
                optype:'new',
                rid:0,
                opuser:'',
                position:'',
                req_qty:1,
                reason_code:0,
                reason_desc:'',
                need_date:'',
                req_sex:2,
                marital_status:2,
                req_age_min:18,
                req_age_max:40,
                education:0,
                pro_title:'',
                major:'',
                english_level:4,
                japanese_level:4,
                iso_level:4,
                experience:'',
                skill:'',
                personality:'',
                supplement:'',

                chk_level:0,
                apply_no:'',
                apply_user:'',
            },
            rules:{
                position:{required:true,message:'请输入需求职位',trigger:'blur'},
                req_qty:[{required:true,message:'请输入需求人数',trigger:'blur'},
                         { validator: numValidator, trigger: 'blur' }],
                need_date:{required:true,message:'请选择需求日期',trigger:'blur'},
                reason_desc:{required:true,message:'请输入需求原因',trigger:'blur'},
                req_age_min:{required:true,message:'请输入最小年龄',trigger:'blur'},
                req_age_max:{required:true,message:'请输入最大年龄',trigger:'blur'},
                pro_title:{required:true,message:'请输入职称',trigger:'blur'},
                major:{required:true,message:'请输入专业',trigger:'blur'},
                experience:{required:true,message:'请输入经历',trigger:'blur'},
                skill:{required:true,message:'请输入技能',trigger:'blur'},
                personality:{required:true,message:'请输入个性',trigger:'blur'},
            }
        }
    },
    computed:{
        ...mapGetters(['userinfo'])
    },
    created(){
        this.formData.opuser = this.userinfo.emp_no;
    },
    methods:{
        setFalse(){
            this.$emit('setValue',false);
        },
        saveData(){
            var chkok = true;
            this.$refs['manRequestForm'].validate((valid)=>{
                chkok = valid;
            })
            if(!chkok){return false;}

            this.$store.dispatch('saveRecruitData',{data:this.formData,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:'保存成功',type:'success'});
                    this.$emit('refresh');
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'error'})
                }
            }})
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
    .el-form-item{
        margin: 0
    }
</style>
