<template>
    <div class="vue-component">
        <div class="div-content">
            <form class="mb-2" onsubmit="return false;">
                <div class="form-row">
                    <div class="custom-file col-2 ml-2">
                        <input type="file" class="custom-file-input" name="myfile" id="myfile" @change="judgefile()" required>
                        <label class="custom-file-label" for="validatedCustomFile">Choose file...</label>
                    </div>
                    <div><button class="btn btn-primary ml-2" @click="uploadfile">上传</button></div>

                    <div class="form-check form-check-inline ml-4">
                        <input class="form-check-input" type="radio" name="partclass" id="inlineRadio1" @click="showData(0)">
                        <label class="form-check-label" for="inlineRadio1">材料</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="partclass" id="inlineRadio2" @click="showData(1)">
                        <label class="form-check-label" for="inlineRadio2">半成品</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="partclass" id="inlineRadio3" @click="showData(2)">
                        <label class="form-check-label" for="inlineRadio3">成品</label>
                    </div>
                    
                </div>
            </form>
            <div class="div-table">
                <table class="table table-sm table-bordered table-hover table-striped" >
                    <thead class="text-center">
                    <tr><th>六位码</th><th>种类</th><th>品名</th><th>中文品名</th><th>型号</th><th>PartNo</th><th>客户品名</th><th>单位</th><th>重量</th><th>状态</th></tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>            
            </div>
            <paging class="paging" :class="{'d-none':dataCount<pageSize}"
                :page-index="currentPage" :total="dataCount" :page-size="pageSize" @change="pageChange"></paging>
        </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    name:'bom',
    data(){
        return{
            pageSize:10,
            currentPage:1,
            parts:[],
            dataCount:0,
            filterdata:[],
            pagedata:null,
        }
    },
    computed:{
        ...mapGetters(['userinfo'])
    },
    created(){
        this.$emit('childtitle', 'BOM资料');
        var _this = this;
        //this.$store.dispatch('getParts',{'cb':(res)=>{_this.parts = res.data;_this.filterdata = res.data}})
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
            var arr = this.filterdata

            this.pagedata = arr.filter(function(item,idx){
                return idx > start && idx < end;
            })
        },
        judgefile(){
            var name = $('#myfile').val();
            var ext = name.substr(name.lastIndexOf('.'));            
            if(ext != '.xls' && ext != '.xlsx'){
                this.$toast('请上传excel文件');
                $('#myfile').val('');
                $('#filename').html('');
            }else{
                $('#filename').html(name);
            }
            
        },
        uploadfile(){
            var _this = this;
            var url ='http://localhost/app/public/index/index/uploadfile';
            var fd = new FormData();
            fd.append('myfile', $("#myfile")[0].files[0]);
            fd.append('uptype',0);
            fd.append('empno',_this.userinfo.emp_no);
            this.$store.dispatch('uploadfile',{'data':fd,'cb':(res)=>{_this.$toast(res)}});
            
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
