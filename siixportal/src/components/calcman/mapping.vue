<template>
    <div class="vue-component" >
        <div class="div-content">
            <div class="form-row  pb-1" >
                <div class="col-3">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="输入品番或型号" id="input-condition" aria-describedby="button-addon-qry">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" id="button-addon-qry" @click='query'>查询</button>
                        </div>
                    </div>
                </div>
                <div class="col-3 form-check form-check-inline m-0 pl-4">
                    <input class="form-check-input mt-1" type="checkbox" id="check_productive" @click="getData()">
                    <label class="form-check-label">未维护生产性</label>
                </div>
                <div class="col-4 offset-1 d-flex flex-row" >
                    <div class="custom-file  ml-2 ">
                        <input type="file" class="custom-file-input" name="myfile" id="myfile" @change="judgefile()" required>
                        <label class="custom-file-label" >Choose file...</label>                    
                    </div>
                    <button class="btn btn-primary ml-2" @click="uploadfile" :disabled="getPermission.permission.substr(1,1)==0">上传</button>
                    <button class="btn btn-warning ml-1" @click="downloadFormat">格式下载</button>
                </div>
            </div>
        
            <div class="div-table">
                <table class="table table-sm table-bordered table-hover mb-1" >
                    <thead><tr><th>六位码</th><th>种类</th><th>型号</th><th>工程</th><th>建立人</th><th>建立时间</th><th>更新人</th><th>更新时间</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for='(item,idx) in mappingData' :key="idx" v-if="idx < pageSize">
                            <td>{{item.part_no}}</td>
                            <td v-if="item.part_class==3">材料</td>
                            <td v-else-if="item.part_class==2">中间品</td>
                            <td v-else>成品</td>
                            <td>{{item.model_name}}</td>
                            <td>{{item.eng_name}}</td>
                            <td>{{item.creator}}</td>
                            <td>{{item.created_time}}</td>
                            <td>{{item.updator}}</td>
                            <td>{{item.updated_time}}</td>
                            <td class="text-center">
                                <!-- <button class="btn btn-success td-btn" @click="edit(idx)">修改</button> -->
                                <button class="btn btn-sm btn-danger td-btn" @click="del(item.id)"
                                :disabled="getPermisson.permission.substr(3,1)==0">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <paging class="paging" :class="{'d-none':dataCount<pageSize}"
            :page-index="currentPage" :total="dataCount" :page-size="pageSize" @change="pageChange"></paging>
        </div>
    

        <div class="modal fade" id="div-edit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title" id="exampleModalLabel">品番工程对应</h5>
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
                        
                        <div  class="form-row feedback text-red"></div>                 
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
    name:'mapping',
    data(){
        return{
            pageSize:9,
            currentPage:1,
            dataCount:0,
            mappingData:[],
            engs:null,
            importMsg:[],
        }
    },
    computed:{
        ...mapGetters([
            'userinfo','getPermission','downloadUrl'
        ])
    },

    created:function(){
        var _this = this;
        this.$emit('childtitle', '品番工程对应');
        this.getData(0);
        this.$store.dispatch('getEngs',{'cb':(res)=>{_this.engs = res.data}});
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
            var data = 'page='+this.currentPage+'&size='+this.pageSize + '&userno='+this.userinfo.emp_no;
            if(con != 0){
                var inputCon=$('#input-condition').val();
 
                if(inputCon != undefined && inputCon.length > 0 && inputCon != '%'){
                    data +='&con='+inputCon;
                }
            }
            
            if($('#check_productive').is(':checked')){
                data += '&chkprd=1';
            }
            this.$store.dispatch('getPartEngMapping',{'data':data,'cb':(res)=>{
                if(res.errcode == 1){_this.$toast(res.errmsg)}
                _this.mappingData = res.data;
                _this.dataCount = res.count;
                }});
        } ,

        query(){
            this.getData();
        },
        add:function(){
            $('#div-edit').modal('show');
        },
        edit :function(index){
            var item = this.mappingData.filter(function(item,idx){return idx == index});
            item  = item[0];
            $('#partno').val(item.part_no).attr('readonly',true);
            set_select_checked('engname',item.eng_name);
            $('#productive').val(item.productive);
            $('#standardmen').val(item.standard_men);
            $('#remark').val(item.remark);
            $('.feedback').html('');
            $('#div-edit').modal('show');
        },
        del(id){
          var _this = this;
          var data = 'id='+id;
          this.$store.dispatch('delPartEngMapping',{'data':data,'cb':(res)=>{
              _this.$toast(res.errmsg);
              if(res.errcode == 0){
                  _this.getData();
              }
          }}) 
        },
        save :function(){
            var _this = this;
            $('.feedback').html('');
            if($('#partno').val().length==0){
                $('.feedback').html('品番不能为空');
                return false;
            }
            var data = $('#form-edit').serialize();
            data += '&userno='+this.userinfo.emp_no;
            this.$store.dispatch('savePartEngMapping',{'data':data,'cb':(res)=>{
                if(res.errcode == 0){
                    _this.$toast('保存成功');
                    _this.getData();
                    $('#div-edit').modal('hide');
                }else{
                    $('.feedback').html(res.errmsg);
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
                this.$toast({'message':'请选择上传文件','mtype':2})
                return false;
            }
            var _this = this;
            var fd = new FormData();
            fd.append('myfile', $("#myfile")[0].files[0]);
            fd.append('uptype',5);
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
        } ,

        downloadFormat(){
            window.location.href = this.downloadUrl+'/download/品番对应工程上传格式.xlsx';
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
    #myfile{
        width:auto;
    }
</style>
