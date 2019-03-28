<template>
    <div id="div-import-msg" >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-warning">
                    <h5 class="modal-title">导入结果</h5>
                </div>
            
                <div class="modal-body">
                    <table class="table">
                        <tr v-for='(msg,idx) in importMsg' :key="idx">
                            <td>{{msg}}</td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="close">关闭</button> 
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        importMsg:{
            type:Array,
            default(){
                return []
            }
        }
    },
    methods:{
        close(){
            $('#div-import-msg').css('display','none')
        }
    }
}
</script>
<style lang="scss" scoped>
    #div-import-msg{
        position: fixed;
        top: 120px;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 9;
    }
    .modal-body{
        height: 300px;
        overflow: hidden;
        overflow-y: scroll;
    }
</style>

