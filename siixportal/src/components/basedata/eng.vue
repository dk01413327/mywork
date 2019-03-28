<template>
    <div class="vue-component" >
        <div class="div-content">
            <el-button type="primary"  @click="add" :disabled="getPermission.permission.substr(1,1)==0">新增</el-button>
            
            <div class="div-table">
                <el-table :data="engs">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-table  :data="showman.filter(item=>{return item.eng_name==scope.row.eng_name})">                                
                                <el-table-column label="月份" prop="yearmonth" ></el-table-column>
                                <el-table-column label="工程名称" prop="eng_name" ></el-table-column>                     
                                <el-table-column label="直接人力" prop="dl_man" ></el-table-column>
                                <el-table-column label="IDL人力" prop="idl_man" ></el-table-column>  
                                <el-table-column label="总人力" prop="dl_man+idl_man" ></el-table-column>  
                                <el-table-column label="更新人" prop="emp_name" ></el-table-column> 
                                <el-table-column label="更新时间" prop="updated_time" min-width="120px" ></el-table-column>           
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column label="工程名称" prop="eng_name"></el-table-column>
                    <el-table-column label="顺序" prop="seq"></el-table-column>
                    <el-table-column label="状态" prop="enabled"></el-table-column>
                    <el-table-column label="备注" prop="remark"></el-table-column>
                    <el-table-column label="建立人" prop="creator"></el-table-column>
                    <el-table-column label="建立时间" prop="created_time" min-width='120px'></el-table-column>
                    <el-table-column label="更新人" prop="updator"></el-table-column>
                    <el-table-column label="更新时间" prop="updated_time" min-width='120px'></el-table-column>
                    <el-table-column label="操作" min-width='120px'>
                        <template slot-scope="eng">
                            <el-button size="mini" type="primary" @click="edit(eng.$index, eng.row)" :disabled="getPermission.permission.substr(2,1)==0">修改</el-button>
                            <el-button size="mini" type="danger" @click="editman(eng.$index, eng.row)" :disabled="getPermission.permission.substr(2,1)==0">人力</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                
            </div>
            <paging class="paging" :class="{'d-none':engs.length<pageSize}"
                :page-index="currentPage" :total="engs.length" :page-size="pageSize" @change="pageChange" ></paging>
        </div>

        <div class="modal fade" id="div-edit" >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">工程维护</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form" id="form-edit" >                       
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">工程名称</label>
                            <div class="col-9">
                                <input class="form-control" name="engname" id="engname" placeholder="工程名称">
                            </div>
                        </div>        
                        
                        <div class="form-group row" style="display:none">
                            <label for='subject' class="col-3 col-form-label">标准人力</label>
                            <div class="col-9">
                                <input class="form-control" name="standardmen" id="standardmen" placeholder="标准人力">
                            </div>
                        </div>  

                        <div class="form-group row" style="display:none">
                            <label for='subject' class="col-3 col-form-label">实际人力</label>
                            <div class="col-9">
                                <input class="form-control" name="actualmen" id="actualmen" placeholder="实际人力">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">顺序</label>
                            <div class="col-9">
                                <input class="form-control" name="seq" id="seq" placeholder="顺序">
                            </div>
                        </div>

                        <div class="form-group form-row">
                            <label for='endtime' class="col-3 col-form-label">是否启用</label>
                            <div class="col-9" style="line-height: 40px" >
                                <div class="form-check form-check-inline ">
                                    <input class="form-check-input" type="radio" name="enabled" id="enabled-check1" value="1" checked>
                                    <label class="form-check-label" for="inlineRadio1">启用</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="enabled" id="enabled-check2" value="0">
                                    <label class="form-check-label" for="inlineRadio2">禁用</label>
                                </div>
                            </div>
                        </div>   
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">备注</label>
                            <div class="col-9">
                                <input class="form-control" name="remark" id="remark" placeholder="备注">
                            </div>
                        </div>                             
                        <div class="form-row feedback" ></div>                 
                    </form> 
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="save">保存</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>                    
                </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="div-man" >
            <div class="modal-dialog" role="document" style="min-width:800px">
                <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="exampleModalLabel">工程实际人力维护</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form" id="form-man" >                       
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">工程名称</label>
                            <div class="col-9">
                                <input class="form-control" name="engname" id="eng-name" placeholder="工程名称">
                            </div>
                        </div> 
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">年份</label>
                            <div class="col-9">
                                <select class="form-control" name="year" id="year" @change="getengman()">
                                    <option v-for="(item,index) in 2 " :key="index" >{{new Date().getFullYear()+index}}</option>
                                </select>
                                
                            </div>
                        </div>

                        <div class="form-group row" v-for="(item,index) in 4" :key="index">
                            <label for='subject' class="col-3 col-form-label">{{item*3-2}}~{{item*3}}月人力</label>
                            <div class="col-3">
                                <div class="input-group mb-1">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" >直接</span>
                                    </div>
                                    <input class="form-control man" name="dl[]" :id="'man'+(item*3-2)" :placeholder="(item*3-2)+'月'">
                                </div>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" >间接</span>
                                    </div>
                                    <input class="form-control man" name="idl[]" :id="'idl'+(item*3-2)" :placeholder="(item*3-2)+'月'">
                                </div>
                                
                            </div>
                            <div class="col-3">
                                <div class="input-group mb-1">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" >直接</span>
                                    </div>
                                    <input class="form-control man" name="dl[]" :id="'man'+(item*3-1)" :placeholder="(item*3-1)+'月'">
                                </div>
                                
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" >间接</span>
                                    </div>
                                    <input class="form-control man" name="idl[]" :id="'idl'+(item*3-1)" :placeholder="(item*3-1)+'月'">
                                </div>
                                
                            </div>
                            <div class="col-3">
                                <div class="input-group mb-1">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" >直接</span>
                                    </div>
                                    <input class="form-control man" name="dl[]" :id="'man'+(item*3)" :placeholder="(item*3)+'月'">
                                </div>
                                
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" >间接</span>
                                    </div>
                                    <input class="form-control man" name="idl[]" :id="'idl'+(item*3)" :placeholder="(item*3)+'月'">
                                </div>
                                
                            </div>
                        </div>
                           
                        <div class="form-row feedback" ></div>                 
                    </form> 
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="saveman">保存</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>                    
                </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import {mapGetters} from 'vuex'
import { checkNumber } from '../../../static/js/public';
export default {
    data(){
        return {
            currentPage:1,
            pageSize:12,
            engs:[],
            engmans:[],
            showman:[],
            pagedata:null
        }
    },
    computed:{
        ...mapGetters(['getPermission','userinfo'])
    },
    created(){
        //console.log(this.getPermisson);
        this.$emit('childtitle', '工程资料');
        this.getData();
    },
    updated(){
        this.$store.dispatch('clickMenu');
    },
    methods:{
        pageChange(page){
            this.currentPage = page
            this.showPage(page);
        },
        showPage(page){
            var size = this.pageSize
            var end = page*size
            var start = (page-1)*size-1
            var arr = this.engs
            this.pagedata = arr.filter(function(item,idx){
                return idx > start && idx < end;
            })
        },
        getData(){
            var _this = this;
            this.$store.dispatch('getEngs',{'cb':(res)=>{
                _this.engs = res.data;
            }});
            this.getengman('ALL');
        },
        add(){
            document.getElementById('form-edit').reset();
            $('#engname').attr('readonly',false);
            $('#div-edit').modal('show');
        },
        edit(index){
            document.getElementById('form-edit').reset();
            var data = this.pagedata ? this.pagedata : this.engs
            var item =data.filter(function(item,idx){ return idx==index});
            item = item[0];
            $('#engname').val(item.eng_name).attr('readonly',true)
            $('#standardmen').val(item.standard_men)
            $('#actualmen').val(item.actual_men)
            $('#seq').val(item.seq)
            if(item.enabled == 0){
                $('#enabled-chk1').prop('checked',true)
            }else{
                $('#enabled-chk2').prop('checked',true)
            }
            $('#remark').val(item.remark);
            $('.feedback').html('');
            $('#div-edit').modal('show');
        },
        save(){
            $('.feedback').html('');
            if($('#engname').val().length == 0){
                $('.feedback').html('工程名称不能为空')
                return false;
            }
            
            if(!checkNumber($('#seq').val(),false)){
                $('.feedback').html('顺序输入不合法')
                return false;
            }
            var data = $('#form-edit').serialize();
            if ($('#engname').attr("readonly")=='readonly')
              data += '&optype=edit'+'&userno='+this.userinfo.emp_no
            else
              data += '&optype=new'+'&userno='+this.userinfo.emp_no;
            
            var _this = this;
            this.$store.dispatch('saveEng',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    _this.$toast('保存成功');
                    _this.getData();
                    $('#div-edit').modal('hide');
                }else{
                    $('.feedback').html(res.errmsg);
                }
            }})
        },
        editman(index,row){
            document.getElementById('form-man').reset();
            $('.man').css('border-color','#ced4da');
            $('.feedback').html('');
            var data = this.pagedata ? this.pagedata : this.engs
            var item =data.filter(function(item,idx){ return idx==index});
            item = item[0];
            $('#eng-name').val(item.eng_name).attr('readonly',true);
            this.getengman(item.eng_name);
            $('#div-man').modal('show');
        },
        saveman(){
            for(var i=1; i<13;i++){
                if(!checkNumber($('#man'+i).val(),false)){
                    $('#man'+i).css('border-color','red')
                    $('.feedback').html(i+'月总人力输入不合法')
                    return false;
                }
                if(!checkNumber($('#idl'+i).val(),false)){
                    $('#idl'+i).css('border-color','red')
                    $('.feedback').html(i+'月IDL人力输入不合法')
                    return false;
                }
            }
            
            var data = $('#form-man').serialize()+'&userno='+this.userinfo.emp_no;

            this.$store.dispatch('saveEngMan',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    this.$toast(res.errmsg);
                    $('#div-man').modal('hide');
                }else{
                    this.$toast({'message':res.errmsg,'mtype':2});
                }
                
            }})
        },
        getengman(name){
            var year = $('#year option:selected').text();
            var engname = $('#eng-name').val();
            if(name){
                engname = name;
                year = (new Date()).getFullYear();
            }            
            var data = 'year='+year+'&engname='+engname;
            var _this = this;
            $('.man').val(0);
            this.$store.dispatch('getEngMan',{'data':data,'cb':(res)=>{
                if(res.errcode == 1){return;}
                _this.engmans = res.data;
                if(name){_this.showman = res.data;}
                
                res.data.forEach((element,index) => {
                    $('#man'+(index+1)).val(element.dl_man)
                    $('#idl'+(index+1)).val(element.idl_man)
                });
            }})
        },
    }
    
}
 
</script>
<style lang="scss" scoped>
    .div-table{
        padding-top:10px;
    }
</style>

