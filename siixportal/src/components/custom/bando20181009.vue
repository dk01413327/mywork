<template>
    <div class="vue-component" >
        <div class="div-content">
            <div class="form-row  pb-1" >
                <div class="col-2">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="输入成品品番" id="input-condition">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon-qry" @click='query'>查询</button>
                        </div>      
                    </div>                    
                </div>
                <div class="col-4 offset-6 d-flex flex-row">
                    <div class="custom-file  ml-2 ">
                        <input type="file" class="custom-file-input" name="myfile" id="myfile" @change="judgefile()" required>
                        <label class="custom-file-label" >Choose file...</label>                    
                    </div>
                    <button class="btn btn-primary ml-2" @click="uploadfile">上传</button>
                    <button class="btn btn-primary ml-1" @click="exportdata">导出</button>
                </div>
            </div>
        
            <div class="div-table">
                <table class="table table-bordered table-hover mb-1" style="font-size:12px" >
                    <thead><tr><th>成品品番</th><th>成品单重</th><th>贸易方式</th><th>材料品番</th>
                    <th >PartNo</th><th >客户品番</th><th >品名</th>
                    <th>一张胶片重量KG</th><th>单条净重G</th><th>制造切割条数</th>
                    <th>切割条数</th><th>铁片毛重KG</th>
                    <th>报关王单重</th><th>凭证</th><th>合同名称</th><th>BOM版本</th>
                    <th>海关备案单耗</th><th>合同备案单耗</th><th width='110'>操作</th></tr></thead>
                    <tbody>
                        <tr v-for='(item,idx) in datas' :key="idx">
                            <td>{{item.fg_part}}</td>
                            <td>{{item.fg_weight}}</td>
                            <td>{{item.trade_method}}</td>
                            <td>{{item.item_pn}}</td>
                            <td class="long-text">{{item.comm_part_no}}</td>
                            <td class="long-text">{{item.cust_part_name}}</td>
                            <td class="long-text">{{item.part_name}}</td>
                            <td>{{item.pn_weight}}</td>
                            <td>{{item.item_net_weight}}</td>

                            <td>{{item.mfg_cut_qty}}</td>
                            <td>{{item.cut_qty}}</td>
                            <td>{{item.item_gross_weight}}</td>
                            <td>{{item.item_cust_weight}}</td>
                            <td>{{item.certificate_no}}</td>
                            <td class="long-text">{{item.contract_name}}</td>
                            <td>{{item.bom_ver}}</td>
                            <td>{{item.cust_reg_loss}}</td>
                            <td>{{item.contract_reg_loss}}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success td-btn" @click="edit(idx)">修改</button>
                                <button class="btn btn-sm btn-danger td-btn" @click="del(idx)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <paging class="paging" :class="{'d-none':dataCount<pageSize}"
            :page-index="currentPage" :total="dataCount" :page-size="pageSize" @change="pageChange"></paging>
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
                            <label class="col-2 col-form-label">报关王单重</label>
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
            pageSize:6,
            currentPage:1,
            datas:null,
            dataCount:0,
            importMsg:null,
        }
    },
    computed:{
        ...mapGetters(['userinfo','downloadUrl'])
    },
    created(){
        this.$emit('childtitle', 'BANDO合同用量表');
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
            var data = '&page='+this.currentPage+'&size='+this.pageSize;
            data += (con ? con : '') + '&userno='+this.userinfo.emp_no;
            if(con != 0){
                var inputCon = $('#input-condition').val();
                if(inputCon != undefined && inputCon.length > 0){
                    data += '&partno=' + inputCon;
                }
            }
            
            this.$store.dispatch('getBando',{'data':data,'cb':(res)=>{
                if(res.errcode == 1){_this.$toast(res.errmsg)}
                _this.datas = res.data;
                _this.dataCount = res.count;
                }
            }); 
        },
        query(){
            var partNo = $('#input-condition').val();
            if(partNo.length==0){
                this.$toast('请输入成品品番');
                return false;
            }
            this.getData();
        },
        del(idx){
            var data = this.datas[idx]
            data = 'id='+data.id;
            var _this = this;
            this.$store.dispatch('delBandoBom',{'data':data,'cb':res=>{
                this.$toast(res.errmsg);
                if(res.errcode==0){
                    this.getData();
                }
            }})
        },
        edit(idx){
            $('.feedback').html('');
            var data = this.datas[idx]
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
            var ext = name.substr(name.lastIndexOf('.'));            
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
                _this.showMessage(res);
                }
            });       
        },
        showMessage(msg){
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
            window.location.href = this.downloadUrl+'export_bando_bom';
        }
    }
}
</script>
<style scoped lang="scss">
    .long-text{
        font-size: 10px;
    }
</style>
