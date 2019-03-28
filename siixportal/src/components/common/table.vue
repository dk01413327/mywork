<template>
  <div style="position:relative">
    <div class="table-body">
        <table id="tabhead" class="table table-sm table-hover table-bordered table-light" 
            style="position: absolute;top:0;left:0;">
            <thead class="text-center"><slot name="fixths"></slot></thead>
        </table>
        <table id="tabdata" class="table table-sm table-hover table-bordered table-light  mb-0" >
                <thead class="text-center" ><slot name="ths"></slot> </thead>          
                <tbody>
                    <slot name="item"
                        v-for="(item,idx) in items"
                        :item="item"
                        :idx="idx">
                    </slot>
                </tbody>
        </table>
    </div>
    <div class="table-footer pt-1">
        <paging class="paging" 
            :class="{'d-none':paginate.dataCount<paginate.pageSize}"
            :page-index="paginate.currentPage" :total="paginate.dataCount" 
            :page-size="paginate.pageSize" @change="pageChange"></paging>
    </div>
  </div>
</template>

<script>
  //import Pagination from '@/components/common/paging'
  import {mapActions} from 'vuex';
  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      pathParams: {
        type: Object,
        default: () => {}
      },
      options: {
        type: Object,
        default: function () { return {params: {}} }
      },
      reloadData: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        items: [],
        paginate: {
            pageSize:10,
            currentPage:1,
            dataCount:0,
        }
      }
    },
    created () {
      this.fetchData()
    },
    watch: {
      reloadData () {
        if (this.reloadData) {
          this.fetchData()
        }
      },
      pathParams () {
        this.fetchData()
      },
      options () {
        this.fetchData()
      }
    },
    mounted(){
      window.onresize=function(){changeWidth()}
      changeWidth();
    },
    updated(){
        changeWidth();
    },
    methods: {
      fetchData(page) {
        if(this.pathParams == null){return false;}
        var data = this.pathParams.data;
        if(page==undefined){
          this.paginate.currentPage = 1;
        }
        data +='&page='+this.paginate.currentPage+'&size='+this.paginate.pageSize;
        var toast = this.$toast({'message':'正在拼命加载,请稍候...','mtype':3});
        this.$store.dispatch(this.url,{'data':data,'cb':(res)=>{
            if(res.errcode == 1){this.$toast(res.errmsg)}
            this.items = res.data;
            this.paginate.dataCount = res.count;            
            this.$emit('afterFetchData', res.data);
            toast.close();
        }});
      },
      pageChange(page) {
          this.paginate.currentPage = page;
          this.fetchData(1)
      },
    }
  }
  function changeWidth(){
    //$('#div-tabdata').css('height',document.body.clientHeight-140);
    //console.log('changeWidth');
    $('.table-body').css('height',window.innerHeight-260);
    
    $('#tabhead').css('width',$('#tabdata').width()+2);
    $('#tabhead th').each(function(idx){
        $(this).css('width',$('#tabdata tr th:eq('+idx+')').outerWidth());
    })
    
}

</script>
<style lang="scss" scoped>
    .table-body{
        overflow: hidden;
        overflow-y: scroll;
        border-bottom: 1px solid #eee;
    }
</style>
