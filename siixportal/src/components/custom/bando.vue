<template>
    <div>
        <el-form inline>
            <el-row>
                <el-col :span="12">
                    <el-form-item>
                        <div class="custom-file  ml-2  text-left">
                            <input type="file" class="custom-file-input " name="myfile" id="myfile" @change="judgefile()" required>
                            <label class="custom-file-label" ></label>                    
                        </div>                
                    </el-form-item>
                    <button class="btn btn-primary ml-2" @click="uploadfile" :disabled="getPermission.permission.substr(1,1)==0">上传</button>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="成品品番">
                        <el-input v-model="inputValue"></el-input>
                    </el-form-item>
                    <el-checkbox v-model="checked" class="pr-3" >净重为零</el-checkbox>
                    <el-button type="primary" @click="getData">查询</el-button>            
                    <el-button type="warning" @click="exportdata">导出</el-button>
                </el-col>
            </el-row>
        </el-form>
        <div class="div-content">
            <div class="spliter"></div>
            <el-table :data="datas" >
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form inline class="table-expand" label-suffix=":"  label-width="100px" label-position="right">
                            <el-form-item label="胶片重量KG">
                                <span>{{scope.row.pn_weight}}</span>
                            </el-form-item>
                            <el-form-item label="单条净重G">
                                <span>{{scope.row.item_net_weight}}</span>
                            </el-form-item>
                            <el-form-item label="制造切割条数">
                                <span>{{scope.row.mfg_cut_qty}}</span>
                            </el-form-item>
                            <el-form-item label="切割条数">
                                <span>{{scope.row.cut_qty}}</span>
                            </el-form-item>
                            <el-form-item label="铁片毛重KG">
                                <span>{{scope.row.item_gross_weight}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="成品品番" prop="fg_part" min-width="100px"></el-table-column>
                <el-table-column label="成品单重" prop="fg_weight" min-width="100px"></el-table-column>
                <el-table-column label="贸易方式" prop="trade_method" min-width="100px"></el-table-column>
                <el-table-column label="材料品番" prop="item_pn" min-width="100px"></el-table-column>
                <!-- <el-table-column label="胶片重量KG" prop="pn_weight"></el-table-column>
                <el-table-column label="单条净重G" prop="item_net_weight"></el-table-column>
                <el-table-column label="制造切割条数" prop="mfg_cut_qty"></el-table-column>
                <el-table-column label="切割条数" prop="cut_qty"></el-table-column>
                <el-table-column label="铁片毛重KG" prop="item_gross_weight"></el-table-column>
                <el-table-column label="报关王单重KG" prop="item_cust_weight" min-width="110"></el-table-column> -->
                <el-table-column label="凭证" prop="certificate_no" min-width="110px"></el-table-column>
                <el-table-column label="BOM版本" prop="bom_ver"></el-table-column>
                <el-table-column label="海关备案损耗" prop="cust_reg_loss" min-width="100px"></el-table-column>
                <el-table-column label="合同备案单耗" prop="contract_reg_loss" min-width="100px"></el-table-column>
                <el-table-column label="操作" min-width="100px" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="edit(scope.row)"
                                :disabled="getPermission.permission.substr(2,1)==0">修改</el-button>
                        <el-button type="text" size="mini"  @click="del(scope.row)"
                                :disabled="getPermission.permission.substr(3,1)==0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <paging class="paging" :class="{'d-none':dataCount<getPageSize}"
            :page-index="currentPage" :total="dataCount" :page-size="getPageSize" @change="pageChange"></paging>
        </div>
        <div class="modal fade" id="div-edit">
            <div class="modal-dialog" role="document" style="max-width:60%">
                <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="exampleModalLabel">修改</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form" id="form-edit" onsubmit="return false;" >
                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">成品品番</label>
                            <div class="col-4">
                                <input class="form-control" name="fgpartno" id="fgpartno" readonly placeholder="成品品番">
                            </div>

                            <label for='capacity' class="col-2 col-form-label">成品单重KG</label>
                            <div class="col-4">
                                <input class="form-control" name="fgweight" id="fgweight" placeholder="成品单重">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">贸易方式</label>
                            <div class="col-10">
                                <input class="form-control" name="trademethod" id="trademethod"  placeholder="贸易方式">
                            </div>
                        </div>
                        
                        <div class="form-group row">
                            <label for='subject' class="col-2 col-form-label">材料品番</label>
                            <div class="col-4">
                                <input class="form-control" name="itempn" readonly id="itempn" placeholder="材料品番">
                            </div>
                            <label  class="col-2 col-form-label">材料单重KG</label>
                            <div class="col-4">
                                <input class="form-control" name="itemweight" id="itemweight" placeholder="材料单重">
                            </div>
                        </div>    
  
                        <div class="form-group row ">
                            <label class="col-2 col-form-label">单条净重G</label>
                            <div class="col-4">
                                <input class="form-control" name="netweight" id="netweight" placeholder="单条净重">
                            </div>
                            <label class="col-2 col-form-label">制造切割条数</label>
                            <div class="col-4">
                                <input class="form-control" name="mfgcutqty" id="mfgcutqty" placeholder="制造切割条数">
                            </div>
                        </div>                              

                        <div class="form-group row ">
                            <label class="col-2 col-form-label">切割条数</label>
                            <div class="col-4">
                                <input class="form-control" name="cutqty" id="cutqty" placeholder="切割条数">
                            </div>
                            <label class="col-2 col-form-label">毛重KG</label>
                            <div class="col-4">
                                <input class="form-control" name="grossweight" id="grossweight" placeholder="毛重">
                            </div>
                        </div> 


                        <div class="form-group row ">
                            <label class="col-2 col-form-label">报关王单重KG</label>
                            <div class="col-4">
                                <input class="form-control" name="custweight" id="custweight" placeholder="报关王单重">
                            </div>
                            <label class="col-2 col-form-label">凭证</label>
                            <div class="col-4">
                                <input class="form-control" name="certificateno" id="certificateno" placeholder="凭证">
                            </div>
                        </div>

                        <div class="form-group row ">
                            <label class="col-2 col-form-label">合同名称</label>
                            <div class="col-10">
                                <input class="form-control" name="contractname" id="contractname" placeholder="合同名称">
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
import {checkNumber} from '../../../static/js/public.js'

import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return{
            datas:null,
            importMsg:null,
            pathParams:null,
            currentPage:1,
            dataCount:0,
            inputValue:'',
            checked:false,
        }
    },
    computed:{
        ...mapGetters(['userinfo','downloadUrl','getPermission','getPageSize'])
    },
    created(){
        //this.$emit('childtitle', 'BANDO合同用量表');
        this.getData(0);
    },
    updated(){      
    },
    methods:{
        pageChange(page){
            this.currentPage = page
            this.getData();
        }, 
        getData(con){
            var _this = this;
            var data = '&userno='+this.userinfo.emp_no;
            if(con != 0){
                if( this.inputValue.length > 0){
                    data += '&partno=' + this.inputValue;
                }
                if(this.checked){
                    data += '&chknetw=1';
                }
            }
            data += '&page='+this.currentPage+'&size='+(this.getPageSize);
            this.$store.dispatch('getBando',{'data':data,'cb':(res)=>{
                if(res.errcode == 1){this.$toast(res.errmsg)}
                this.datas = res.data;
                this.dataCount = res.count;
                }
            }); 
        },
        del(item){
            var data = 'id='+item.id;
            this.$confirm('确认删除此记录?','提示',{confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'}).then(()=>{
                this.$store.dispatch('delBandoBom',{data:data,cb:res=>{
                    if(res.errcode == 0){
                        this.$message({message:res.errmsg,type:'success'});
                        this.getData()
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
        },
        edit(item){
            $('.feedback').html('');
            var data = item
            $('#fgpartno').val(data.fg_part);
            $('#fgweight').val(data.fg_weight);
            $('#itempn').val(data.item_pn);
            $('#itemweight').val(data.pn_weight);
            $('#netweight').val(data.item_net_weight);
            $('#mfgcutqty').val(data.mfg_cut_qty);
            $('#cutqty').val(data.cut_qty);

            $('#grossweight').val(data.item_gross_weight);
            $('#custweight').val(data.item_cust_weight);
            $('#certificateno').val(data.certificate_no);
            $('#contractname').val(data.contract_name);
            
            $('#div-edit').modal('show');
        },
        save(){
            if(!checkNumber($('#fgweight').val(),true)){
                $('.feedback').html('成品单重输入不合法');
                return false;
            }

            if(!checkNumber($('#itemweight').val(),true)){
                $('.feedback').html('材料单重输入不合法');
                return false;
            }
            if(!checkNumber($('#netweight').val(),true)){
                $('.feedback').html('单条净重输入不合法');
                return false;
            }
            
            if(!checkNumber($('#mfgcutqty').val(),false)){
                $('.feedback').html('制造切割条数输入不合法');
                return false;
            }
            if(!checkNumber($('#cutqty').val(),false)){
                $('.feedback').html('切割条数输入不合法');
                return false;
            }
            if(!checkNumber($('#grossweight').val(),true)){
                $('.feedback').html('毛重输入不合法');
                return false;
            }
            if(!checkNumber($('#custweight').val(),true)){
                $('.feedback').html('报关王单重输入不合法');
                return false;
            }
            var data = $('#form-edit').serialize();
            data += '&userno='+this.userinfo.emp_no;
            var _this = this;
            this.$store.dispatch('saveBandoBom',{'data':data,'cb':res=>{
                _this.$toast(res.errmsg);
                if(res.errcode==0){
                    _this.getData();
                    $('#div-edit').modal('hide');
                }
            }})
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
            fd.append('uptype',6);
            fd.append('empno',_this.userinfo.emp_no);
            var toast = this.$toast({'message':'正在导入,请稍候...','mtype':3});
            this.$store.dispatch('uploadfile',{'data':fd,'cb':(res)=>{
                    toast.close();
                    var jsonObj = JSON.parse(res);
                    if(jsonObj.errcode == 2){
                         _this.$toast({'message':jsonObj.errmsg,'mtype':2});
                    }else{
                        _this.showMessage(res);
                    }                
                }
            });       
        },
        showMessage(msg){
            $('#myfile').val('');
            var jsonObj = JSON.parse(msg);
            if(jsonObj.errcode==0){
                this.$toast(jsonObj.errmsg);
                this.getData();
            }else{
                this.importMsg = jsonObj.errmsg;
                $('.uploadmsg').css('display','block').removeClass('d-none');
            }
        },
        exportdata(){
            window.location.href = this.downloadUrl+'/index/index/export_bando_bom';
        }
    }
}
</script>
<style >
    .tb-condition td{
        text-align: center;
        padding:0 0 0 0;
    }
    
    #myfile{width:auto;}
    .table-expand .el-form-item{
        margin-right: 0;
        margin-bottom: 0;
        width: 33%;
    }
</style>
