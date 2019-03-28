<template>
    <div class="vue-component">
        <div class="div-content">
        <form id="form-part" class="mb-1" style="padding:0 5px" onsubmit="return false;">
            <div class="form-row pb-1">
                
                <div class="query col-3" >
                    <div class="form-check form-check-inline ml-4">
                        <input class="form-check-input" type="radio" name="partclass" value="ALL" checked @click="getData(0)">
                        <label class="form-check-label" >ALL</label>
                    </div>
                    <div class="form-check form-check-inline ">
                        <input class="form-check-input" type="radio" name="partclass" value="3"  @click="getData(0)">
                        <label class="form-check-label" >材料</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="partclass" value="2"  @click="getData(0)">
                        <label class="form-check-label" >中间品</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="partclass" value="1"  @click="getData(0)">
                        <label class="form-check-label" >成品</label>
                    </div>
                </div>

                <div class="col-3 offset-6 d-flex flex-row">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" name="myfile" id="myfile" @change="judgefile()" required>
                        <label class="custom-file-label" >Choose file...</label>                    
                    </div>
                    <button class="btn btn-primary ml-2" @click="uploadfile">上传</button>
                </div>
                
            </div>
        </form>
        <div class="spliter"></div>
        <el-table :data="parts">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-form>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="中文品名">
                                    <span>{{scope.row.PART_CNAME}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="PartNo">
                                    <span>{{scope.row.COMM_PART_NO}}</span></el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="客户品名">
                                <span>{{scope.row.CUST_PART_NAME}}</span></el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="六位码" prop="PART_NO"></el-table-column>
            <el-table-column label="种类">
                <template slot-scope="scope">
                    <span v-if="scope.row.PART_CLASS==3">材料</span>
                    <span v-else-if="scope.row.PART_CLASS==2">中间品</span>
                     <span v-else>成品</span>
                </template>
            </el-table-column>
            <el-table-column label="品名" prop="PART_NAME" min-width="120px"></el-table-column>
            <el-table-column label="型号" prop="MODEL_NAME" min-width="120px"></el-table-column>
            <el-table-column label="单位" prop="UNIT"></el-table-column>
            <el-table-column label="重量" prop="WEIGHT"></el-table-column>
            <el-table-column label="状态" prop="PART_CNAME">
                <template slot-scope="scope">
                    <span v-if="scope.row.ENABLED==0" class="p-1 bg-danger text-white">禁用</span>
                    <span v-else class="p-1 bg-success text-white">启用</span>
                </template>
            </el-table-column>
        </el-table>
        
        <paging class="paging" :class="{'d-none':dataCount<getPageSize}"
        :page-index="currentPage" :total="dataCount" :page-size="getPageSize" @change="pageChange"></paging>
        </div>
        <uploadmsg class="uploadmsg d-none"  :import-msg ="importMsg"></uploadmsg>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    name:'part',
    data(){
        return{
            pageSize:10,
            currentPage:1,
            dataCount:0,
            parts:[],
            importMsg:null,
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPageSize'])
    },
    created(){
        this.$emit('childtitle', '品番资料');
        this.getData(10);
    },
    updated(){
        this.$store.dispatch('clickMenu');
    },
    methods:{
        pageChange(page){
            this.currentPage = page
            this.getData()
        },
        getData(con){
            var _this = this;
            if(con == 10){
                var data = 'partclass=ALL';
            }else{
                var data = $('#form-part').serialize();
            }
            
            if(con == 0)
                data += '&page=1&size='+this.getPageSize;
            else
                data += '&page='+this.currentPage+'&size='+this.getPageSize;
            this.$store.dispatch('getParts',{'data':data,'cb':(res)=>{
                if(res.errcode == 1){_this.$toast(res.errmsg)}
                _this.parts = res.data;
                _this.dataCount = res.count;
            }})
        },
        judgefile(){
            if( $('#myfile').val().length==0){
                this.$toast('请选择上传文件')
                return false;
            }
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
            var url ='http://localhost/app/public/index/index/uploadfile';
            var fd = new FormData();
            fd.append('myfile', $("#myfile")[0].files[0]);
            fd.append('uptype',0);
            fd.append('empno',_this.userinfo.emp_no);
            this.$store.dispatch('uploadfile',{'data':fd,'cb':(res)=>{_this.showMessage(res)}});
            
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
        } 
    }
}
</script>
<style lang="scss" scoped>
    .clickable{
        color:blue;
        cursor: pointer;
    }
</style>
