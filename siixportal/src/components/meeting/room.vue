<template>
    <div class="vue-component" >
        <div class="div-content" > 
            <button class="btn btn-primary btn-add mb-1" @click="addRoom">新增</button>
        
            <div class="div-table">
                <table class="table table-bordered table-hover " id="tb-room">
                    <thead><tr><th>会议室名称</th><th>会议室描述</th><th>是否启用</th><th>容纳人数</th><th>自带投影仪</th><th>建立人</th><th>建立时间</th><th>操作</th></tr></thead>
                    <tbody>
                        <tr v-for='(room,idx) in rooms ? rooms : getRoom' :key="idx" v-if="idx < pageSize">
                            <td>{{room.room_name}}</td>
                            <td>{{room.room_desc}}</td>
                            <td>{{room.enabled}}</td>
                            <td>{{room.capacity}}</td>
                            <td>{{room.projector}}</td>
                            <td>{{room.emp_name}}</td>
                            <td>{{room.created_time}}</td>
                            <td class="text-center"><button class="btn btn-success btn-sm td-btn" @click="editRoom(idx)">修改</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <paging :page-index="currentPage" :total="roomCount" :page-size="pageSize" @change="pageChange"></paging>
        </div> 

        <div class="modal fade" id="div-room" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">人员维护</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form role="form" id="form-room" >
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">会议室名称</label>
                            <div class="col-9">
                                <input class="form-control" name="roomname" id="roomname" placeholder="会议室名称">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for='capacity' class="col-3 col-form-label">容纳人数</label>
                            <div class="col-9">
                                <input class="form-control" name="capacity" id="capacity" placeholder="容纳人数">
                            </div>
                        </div>     
                        
                        <div class="form-group row">
                            <label for='subject' class="col-3 col-form-label">描述</label>
                            <div class="col-9">
                                <textarea class="form-control" name="roomdesc" id="roomdesc" placeholder="描述">
                                </textarea>
                            </div>
                        </div>    
                        <div class="form-row">
                            <label for='rd-room-check1' class="col-3 col-form-label">是否启用</label>
                            <div class="col-9" style="line-height: 40px">
                                <div class="form-check form-check-inline ">
                                    <input class="form-check-input" type="radio" name="enabled" id="rd-room-check1" value="Y" checked>
                                    <label class="form-check-label" for="inlineRadio1">启用</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="enabled" id="rd-room-check2" value="N" >
                                    <label class="form-check-label" for="inlineRadio2">禁用</label>
                                </div>
                            </div>
                        </div>   
                            
                        <div class="form-row">
                            <label for='rd-projector-check1' class="col-3 col-form-label">自带投影仪?</label>
                            <div class="col-9" style="line-height: 40px">
                                <div class="form-check form-check-inline ">
                                    <input class="form-check-input" type="radio" name="projector" id="rd-projector-check1" value="Y" checked>
                                    <label class="form-check-label" for="inlineRadio1">是</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="projector" id="rd-projector-check2" value="N" >
                                    <label class="form-check-label" for="inlineRadio2">否</label>
                                </div>
                            </div>
                        </div>                          
                        <div id="room-feedback" class="form-row feedback"></div>                 
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="saveRoom">保存</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>                    
                </div>
                </div>
            </div>
        </div>
         
    </div>
</template>
<script>
import {mapGetters, mpaActions} from 'vuex'
export default {
    name:'room',
    data(){
        return{
            rooms:null,
            pageSize:10,
            currentPage:1
        }
    },
    computed:{
        ...mapGetters([
            'getRoom',
            'roomCount',
            'userinfo'
        ])
    },
    created:function(){
        this.$emit('childtitle', '会议室资料');
        this.$store.dispatch('getRoom');
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
            var arr = this.getRoom
            this.rooms = arr.filter(function(item,idx){
                return idx > start && idx < end;
            })
        },
        addRoom:function(){
            $('#div-room').modal('show');
        },
        editRoom :function(index){
            var arr = this.rooms ? this.rooms : this.getRoom;
            $.each(arr,function(idx,item){
                if(idx == index){
                    $('#roomname').val(item.room_name).attr("readonly",true);
                    $('#roomdesc').val(item.room_desc);
                    if(item.enabled=='禁用'){
                        $('#rd-room-check2').prop('checked',true);
                        $('#rd-room-check1').prop('checked',false);
                    }else{
                        $('#rd-room-check1').prop('checked',true);
                        $('#rd-room-check2').prop('checked',false);
                    }
                    $('#capacity').val(item.capacity);
                    if(item.projector=='否'){
                        $('#rd-projector-check2').prop('checked',true);
                        $('#rd-projector-check1').prop('checked',false);
                    }else{
                        $('#rd-projector-check1').prop('checked',true);
                        $('#rd-projector-check2').prop('checked',false);
                    }
                }
            })
            $('#div-room').modal('show');
        },

        saveRoom :function(){
            if($('#roomname').val().length == 0){
                $('#room-feedback').html('会议室名称不能为空');
                return false;
            }
            if($('#capacity').val().length == 0){
                $('#capacity').val(0);
            }        
            var url = 'index/index/save_meeting_room';
            var data = $('#form-room').serialize();
            if ($('#roomname').attr("readonly")=='readonly'){
                data +='&optype=edit&empno='+this.userinfo.emp_no;
            }else{
                data +='&optype=new&empno='+this.userinfo.emp_no;
            }
            
            this.$store.dispatch('saveRoom',{'data':data,'cb':(res)=>{
                this.$toast(res.errmsg)
                if(res.errcode==0){
                    $('#div-room').modal('hide');
                    this.$store.dispatch('getRoom');
                }
            }})
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
        >.div-data{
            padding: 10px 20px 5px 20px;
            >.div-table{
                overflow: hidden;                
            }
        }
    }
    .feedback{
        color:red;
    }
</style>
