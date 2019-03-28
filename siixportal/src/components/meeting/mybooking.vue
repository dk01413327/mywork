<template>
    <div class='vue-component' >
        <div class="div-content">
            <div class="div-table">
                <table class="table table-bordered table-hover table-striped" >
                    <thead>
                    <tr><th>日期</th><th>会议主旨</th><th>开始时间</th><th>结束时间</th><th>时长(分钟)</th><th>状态</th><th>申请人</th><th>申请时间</th></tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,idx) in pageData ? pageData : mybooking" :key="idx" v-if="idx < getPageSize">                               
                        <td>{{ item.booking_date }}</td>
                        <td>{{ item.meeting_subject }}</td>
                        <td>{{ item.start_time }}</td>
                        <td>{{ item.end_time }}</td>
                        <td>{{ item.times}}</td>
                        <td>{{ item.mstatus}}</td>
                        <td>{{ item.emp_name }}</td>
                        <td>{{ item.apply_time }}</td> 
                    </tr>
                    </tbody>
                </table>            
            </div>  
            <paging :page-index="currentPage" :total="mybooking.lenght" :page-size="pageSize" @change="pageChange"></paging>    
        </div>      
    </div>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'

export default {
    data(){
        return {
            currentPage :1,
            pageSize : 10,
            pageData :null,
            mybooking:[]
        }
    },
    computed:{
        ...mapGetters([
            'userinfo','getPageSize'
            ])
    },
    created(){
        var _this=this;
        var param = {'data':'no='+this.userinfo.emp_no,'cb':(res)=>{if(res.errcode==0){_this.mybooking=res.data}}}
        this.$store.dispatch('get_my_booking',param);
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
            var size = this.getPageSize
            var end = page*size
            var start = (page-1)*size-1

            var arr = this.mybooking
            this.emps = arr.filter(function(item,idx){
                return idx > start && idx < end;
            })
        },
    }
}
</script>
<style scoped>

</style>
