<template>
    <div class="vue-component" >
        <el-form inline>
            <el-form-item>
                <el-input placeholder="输入品番或型号" v-model="inputValue">
                    <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <div class="custom-file  ml-2 ">
                    <input type="file" class="custom-file-input" name="myfile" id="myfile" @change="judgefile()" required>
                    <label class="custom-file-label" >Choose file...</label>                    
                </div>
            </el-form-item>
            <el-button type="primary" @click="uploadfile" :disabled="getPermission.permission.substr(1,1)==0">上传</el-button>
            <el-dropdown @command="handleDropdown">
                <el-button type="warning">导出<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item command="1">格式下载</el-dropdown-item>
                    <el-dropdown-item command="2">导出数据</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-form>
        <div class="div-content">
            <div class="spliter"></div>
            <el-table :data="productive">
                <el-table-column label="六位码" prop="part_no"></el-table-column>
                <el-table-column label="种类" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.part_class==3">材料</span>
                        <span v-else-if="scope.row.part_class==2">中间品</span>
                        <span v-else>成品</span>
                    </template>
                </el-table-column>
                <el-table-column label="型号" min-width="200">
                    <template slot-scope="scope">
                         <el-popover trigger="hover" placement="right">
                            <p>{{ scope.row.model_name }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.model_name.substr(0,30) }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="工程" prop="eng_name"></el-table-column>
                <el-table-column label="生产性" prop="productive"></el-table-column>
                <el-table-column label="标准人力" prop="standard_men"></el-table-column>
                <el-table-column label="修改人" prop="emp_name"></el-table-column>
                <el-table-column label="修改时间" prop="updated_time" min-width="120"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="edit(scope.row)"
                            :disabled="getPermission.permission.substr(2,1)==0">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <paging class="paging" :class="{'d-none':dataCount<getPageSize}"
            :page-index="currentPage" :total="dataCount" :page-size="getPageSize" @change="pageChange"></paging>
        </div>   

        <div class="modal fade" id="div-edit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="exampleModalLabel">生产性维护</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form" id="form-edit" onsubmit="return false;" >
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">品番</label>
                            <div class="col-9">
                                <input class="form-control" name="partno" id="partno" placeholder="品番">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for='capacity' class="col-3 col-form-label">工程</label>
                            <div class="col-9">
                                <select class="form-control" name="engname" id="engname" >
                                    <option v-for='(item,idx) in engs' :key="idx" name='engname' :value='item.eng_name'>{{item.eng_name}}</option>
                                </select>
                            </div>
                        </div>     
                        
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">生产性</label>
                            <div class="col-9">
                                <input class="form-control" name="productive" type='number' id="productive" placeholder="生产性">
                            </div>
                        </div>    
                        <div class="form-group row">
                            <label  class="col-3 col-form-label">标准人力</label>
                            <div class="col-9">
                                <input class="form-control" type='number' name="standardmen" id="standardmen" placeholder="标准人力">
                            </div>
                        </div>  
                        <div class="form-group row ">
                            <label class="col-3 col-form-label">备注</label>
                            <div class="col-9">
                                <input class="form-control" name="remark" id="remark" placeholder="备注">
                            </div>
                        </div>                              
                        
                        <div  class="form-row feedback"></div>                 
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" @click="save">保存</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>                    
                </div>
                </div>
            </div>
        </div>
        <uploadmsg class="uploadmsg d-none"  :import-msg ="importMsg"></uploadmsg>
    </div>
</template>
<script>
import {set_select_checked,checkNumber} from '../../../static/js/public.js'
import {mapGetters, mpaActions} from 'vuex'
export default {
    name:'productive',
    data(){
        return{
            pageSize:9,
            currentPage:1,            
            productive:[],
            dataCount:0,
            engs:null,
            importMsg:[],
            inputValue:'',
        }
    },
    computed:{
        ...mapGetters([
            'userinfo','getPermission','downloadUrl','getPageSize'
        ])
    },

    created:function(){
        var _this = this;
        this.$emit('childtitle', '品番生产性');        
        this.$store.dispatch('getEngs',{'cb':(res)=>{_this.engs = res.data}});
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
            var data = 'userno='+this.userinfo.emp_no + '&page='+this.currentPage+'&size='+this.getPageSize;
            if(con != 0){
                if(this.inputValue.length > 0 && this.inputValue != '%'){
                    data += '&con=' + inputCon;
                }
            }
            
            this.$store.dispatch('getProductive',{'data':data,'cb':(res)=>{
                if(res.errcode == 1){this.$alert(res.errmsg,{type:'error'});return false;}
                _this.productive = res.data;
                _this.dataCount = res.count;
                }});
        } ,
        showPage(page){
            this.getData('page='+page+'&size='+this.pageSize)
        },
        query(){            
            if(this.inputValue.length==0){
                this.$alert('请输入查询条件','出错啦',{type:'error'});
                return false;
            }
            this.getData();
        },
        add:function(){
            $('#div-edit').modal('show');
        },
        edit(item){
            $('#partno').val(item.part_no).attr('readonly',true);
            
            set_select_checked('engname',item.eng_name);
            $('#engname').attr('disabled',true);
            $('#productive').val(item.productive);
            $('#standardmen').val(item.standard_men);
            $('#remark').val(item.remark);
            $('.feedback').html('');
            $('#div-edit').modal('show');
        },

        save :function(){
            var _this = this;
            $('.feedback').html('');
            if($('#partno').val().length==0){
                $('.feedback').html('品番不能为空');
                return false;
            }
            
            if(!checkNumber($('#productive').val(),true)){
                $('.feedback').html('生产性输入不合法');
                return false;
            }
            if(!checkNumber($('#standardmen').val())){
                $('.feedback').html('标准人力输入不合法');
                return false;
            }
             $('#engname').removeAttr('disabled');
            var data = $('#form-edit').serialize();
            data += '&userno='+this.userinfo.emp_no;
            this.$store.dispatch('saveProductive',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    _this.$toast('保存成功');
                    _this.getData();
                    $('#div-edit').modal('hide');
                }else{
                    $('#engname').attr('disabled',true);
                    $('.feedback').html(res.errmsg);
                }
            }})
        },
        judgefile(){
            var name = $('#myfile').val();
            var ext = name.substr(name.lastIndexOf('.')).toLowerCase();    
            if(ext != '.xls' && ext != '.xlsx'){
                this.$alert('请上传excel文件','出错啦',{type:'error'});
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
            fd.append('uptype',3);
            fd.append('empno',_this.userinfo.emp_no);
            var toast = this.$toast({'message':'正在导入,请稍候...','mtype':3});
            this.$store.dispatch('uploadfile',{'data':fd,'cb':(res)=>{
                toast.close();
                var jsonObj = JSON.parse(res);
                if(jsonObj.errcode == 2){
                    _this.$alert(jsonObj.errmsg,'出错啦',{type:'error'})
                }else{
                    _this.showMessage(res);
                } 
                this.getData();
            }});            
        },
        showMessage(msg){
            //console.log(msg)
            var jsonObj = JSON.parse(msg);
            if(jsonObj.errcode==0){                
                this.$toast(jsonObj.errmsg);
            }else{
                this.importMsg = jsonObj.errmsg;
                $('.uploadmsg').css('display','block').removeClass('d-none');
            }
        },
        handleDropdown(cmd){
            if(cmd==1){
                window.location.href = this.downloadUrl+'/download/生产性上传格式.xlsx';
            }else{
                window.location.href = this.downloadUrl+'/index/humanres/export_part_productive?userno='+this.userinfo.emp_no; 
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
        >.div-table{
            padding:10px,5px;
        } 
    }
    .feedback{
        color:red;
    }
    #myfile{
        width:auto;
    }
</style>
