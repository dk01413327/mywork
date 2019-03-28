<template>
    <div class="vue-component" >        
        <el-form inline>
            <el-form-item label="年月">                        
                <el-date-picker value-format="yyyyMM" format="yyyyMM" v-model="ym" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="品番">
                <el-input v-model="partno" placeholder="请输入品番"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" class="pr-3">未维护生产性</el-checkbox>
            <el-button class="btn btn-primary" @click="getData">查询</el-button>
            <el-button class="btn btn-warning" @click="exportData">导出</el-button>
            <el-form-item class="d-none">
                <div class="custom-file  ml-2 ">
                    <input type="file" class="custom-file-input" name="myfile" id="myfile" @change="judgefile()" required>
                    <label class="custom-file-label" >Choose file...</label>                    
                </div>                      
            </el-form-item>
            <el-button class="d-none" type="primary" @click="uploadfile" :disabled="getPermission.permission.substr(1,1)==0">上传</el-button>
        </el-form>
        
        <div class="div-content">
            <div class="spliter"></div>
            <el-table :data="shippingplan">
                <el-table-column label="年月" prop="yearmonth"></el-table-column>
                <el-table-column label="品番" prop="part_no"></el-table-column>
                <el-table-column label="型号" min-width="200px">
                    <template slot-scope="scope">
                         <el-popover trigger="hover" placement="right">
                            <p>{{ scope.row.model_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.model_name.substr(0,30) }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="计划数量" prop="qty"></el-table-column>
                <el-table-column label="工程" prop="eng_name"></el-table-column>
                <el-table-column label="生产性" prop="productive"></el-table-column>
                <el-table-column label="月工时数" prop="month_hours"></el-table-column>
                <el-table-column label="需求人力" prop="reqmen"></el-table-column>
            </el-table>
            <paging class="paging" :class="{'d-none':dataCount<getPageSize}"
            :page-index="currentPage" :total="dataCount" :page-size="getPageSize" @change="pageChange"></paging>
            
        </div>
                
        <uploadmsg class="uploadmsg d-none"  :import-msg ="importMsg"></uploadmsg>
    </div>
</template>
<script>
import {mapGetters, mpaActions} from 'vuex'
import { showDate } from '../../../static/js/public';
export default {
    name:'productive',
    data(){
        return{
            currentPage:1,
            dataCount:0,
            shippingplan:[],
            importMsg:null,
            ym:'',
            partno:'',
            checked:false,
        }
    },
    computed:{
        ...mapGetters([
            'userinfo','getPermission','downloadUrl','getPageSize'
        ])
    },

    created:function(){
        var _this = this;
        this.$emit('childtitle', '出货计划');
        this.getData(0);
    },
    updated(){
        this.$store.dispatch('clickMenu');
    },
    methods:{
        pageChange(page){
            this.currentPage = page
            this.getData();
        },   
        getData(con){
            var _this = this;
            var data = 'page='+ this.currentPage +'&size='+this.getPageSize+'&userno='+this.userinfo.emp_no;
            if(con != 0){
                data += '&ym=' + this.ym;
                data += '&part=' + this.partno;
                if(this.checked){
                    data += '&chkprod=1';
                }
                if(con == 2){
                    data += '&export=1'
                }
            }
            this.$store.dispatch('getDeliveryPlan',{'data':data,'cb':(res)=>{
                if(res.errcode == 1){_this.$toast(res.errmsg)}
                _this.shippingplan = res.data;
                _this.dataCount = res.count;
                }});
        },
        exportData(){
            var data = 'userno='+this.userinfo.emp_no+'&export=1';
            if(this.ym.length > 0){
                data += '&ym=' + this.ym.length ;
            }else{
                this.$alert('请指定年月','出错了',{'type':'error'});
                return false;
            }
            if( this.partno.length > 0){
                data += '&part=' + this.partno;
            }
            if(this.checked){
                data += '&chkprod=1';
            }
            //window.location.href = this.downloadUrl+'/index/humanres/get_delivery_plan?'+data;
            this.$store.dispatch('getDeliveryPlan',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    window.open(this.downloadUrl+'/index/humanres/get_delivery_plan?'+data);
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'error'})
                }
            }});
            
        },
        judgefile(){
            var name = $('#myfile').val();
            var ext = name.substr(name.lastIndexOf('.')).toLowerCase();            
            if(ext != '.xls' && ext != '.xlsx'){
                this.$toast('请上传excel文件');
                $('#myfile').val('');
                $('.custom-file-label').html('Choose file...');
            }else{
                $('.custom-file-label').html(name);
            }
            
        },
        uploadfile(){
            if( $('#myfile').val().length==0){
                this.$toast('请选择上传文件')
                return false;
            }
            var _this = this;
            var fd = new FormData();
            fd.append('myfile', $("#myfile")[0].files[0]);
            fd.append('uptype',4);
            fd.append('empno',_this.userinfo.emp_no);
            this.$store.dispatch('uploadfile',{'data':fd,'cb':(res)=>{_this.showMessage(res)}});            
        },
        showMessage(msg){
            var jsonObj = JSON.parse(msg);
            if(jsonObj.errcode==0){
                this.$toast(jsonObj.errmsg);
            }else{
                this.importMsg = jsonObj.errmsg;
                $('.uploadmsg').css('display','block').removeClass('d-none');
            }
        }        
        
    }   
}
    
            
</script>
<style lang="scss" scoped>
    .vue-component{
        >.btn-add{
            margin-top:10px;
            margin-left:20px;
        }
        >.div-data{
            padding: 10px 20px 5px 20px;
            >.div-table{
                overflow: hidden;                
            }
        }
    }
    .tb-condition td{
        text-align: center;
        padding: 0 !important;
    }
    .feedback{
        color:red;
    }
</style>
