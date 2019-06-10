<template>
    <div style="padding-top:5px">
        <el-pagination
            background
            layout="total,sizes,prev, pager, next"
            :page-sizes="[10, 20, 50]"
            @prev-click="prev"
            @next-click="next"
            @current-change='curChange'
            :total="size">
        </el-pagination>
    </div>
</template>
<script>
export default {
    name:'paging',
    props:{
        perPages:{
            type:Number,
            default:5
        },
        pageIndex:{
            type:Number,
            default:1
        },
        pageSize:{
            type:Number,
            default:10
        },
        total:{
            type:Number,
            default:1
        }
    },
    data(){
        return{
            index : this.pageIndex,
            limit : this.pageSize,
            size : this.total || 1,
            showPrevMore : false,
            showNextMore : false
        }
    },
    watch:{
        pageIndex(val){
            this.index = val || 1
        },
        pageSize(val){
            //console.log('pagesize:'+val);
            this.limit = val || 10
            //console.log(this.limit);
        },
        total(val){
            //console.log('total:'+val)
            this.size = val || 1;
        }
    },
    methods:{
        prev(){
            if(this.index > 1){
                this.goPage(this.index-1)
            }
        },
        next(){
            if(this.index < this.pages){
                this.goPage(this.index+1)
            }
        },
        first(){
            if(this.index != 1){
                this.goPage(1)
            }
        },
        last(){
            if(this.index != this.pages){
                this.goPage(this.pages)
            }
        },
        curChange(e){
            this.goPage(e)
        },
        goPage(page){
            if(this.index !== page){
                this.index = page
                this.$emit('change',this.index)
            }
        }
    },
    computed:{
        pages(){
            return Math.ceil(this.size / this.limit)
        },
        pagers(){            
            const array = []
            const perPages = this.perPages
            const pageCount = this.pages
            let current = this.index
            const _offset = (perPages - 1) / 2
            //console.log(perPages,pageCount,current)
            const offset = {start:current - _offset,end:current + _offset}

            if(offset.start < 1){
                offset.end = offset.end + (1 - offset.start)
                offset.start = 1
            }

            if(offset.end > pageCount){
                offset.start = offset.start -(offset.end - pageCount)
                offset.end = pageCount
            }

            if(offset.start < 1) offset.start = 1
            this.showPrevMore = (offset.start > 1)
            this.shosNextMore = (offset.end < pageCount)

            for (let i = offset.start;i<=offset.end;i++){
                array.push(i)
            }
            //console.log(array);
            return array;
            
        }
    },
}
</script>

<style lang="scss" scoped>
    .pagination{
        padding: 0;
        margin: 0;
    }
    .page-item{
        >.page-link{
            color:#0275d8 !important;
        }
        >.page-link--current {
            background-color: #0275d8;
            color:#fff !important;
            position: relative;
            z-index: 1;
            border-color:#0275d8;
        }
        >.page-link--disabled{
            background-color: #fff;
            color:#505050 !important; 
        }
    }
    
    
</style>
