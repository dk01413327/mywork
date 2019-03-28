<template>
    <div class="vue-component" >    
        <div class="div-content row" > 
            <div class="div-left col-3"> 
                <div class="form-group row" style='line-height:40px'>
                    <div class="col-9">
                    <input id="rolename" class="form-control" type='text' placeholder="角色名称" style="font-size:12px">
                    </div>
                    <div><button class="btn btn-primary td-btn" @click="addRole">新增</button></div>
                </div>                   
                <ul class="ul-role" >
                    <template v-for="(item,idx) in roles" >
                        <li class="role-item" :class="{'role-item-active':idx==0}" :key="idx" @click="showPermission(idx)">{{item.role_name}}</li>                         
                    </template>
                </ul> 
            </div>
 
            <div class="div-table col-9">
                <table class="table table-sm table-bordered table-hover text-center" >
                    <thead class="text-center"><tr><th>系统模块</th><th>查看</th><th>新增</th><th>修改</th>
                        <th>删除</th><th>审核</th><th>导出</th><th>打印</th></tr></thead>
                    <tbody>
                        <tr v-for='(item,idx) in role.menu' :key="idx" >                               
                            <td>{{item.menu_name}}</td>
                            <td><input type="checkbox" :checked="item.permission.substr(0,1)==1" @click="toggle(item,0)"></td>
                            <td><input type="checkbox" :checked="item.permission.substr(1,1)==1" @click="toggle(item,1)"></td>
                            <td><input type="checkbox" :checked="item.permission.substr(2,1)==1" @click="toggle(item,2)"></td>
                            <td><input type="checkbox" :checked="item.permission.substr(3,1)==1" @click="toggle(item,3)"></td>
                            <td><input type="checkbox" :checked="item.permission.substr(4,1)==1" @click="toggle(item,4)"></td>
                            <td><input type="checkbox" :checked="item.permission.substr(5,1)==1" @click="toggle(item,5)"></td>
                            <td><input type="checkbox" :checked="item.permission.substr(6,1)==1" @click="toggle(item,6)"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="text-right"><button class="btn btn-danger" @click="save()">保存</button></div>  
            </div>
        </div>
    </div>

</template>
<script>
import {mapGetters, mpaActions} from 'vuex'
export default {
    name:'user',
    data(){
        return{
            pageSize:15,
            currentPage:1,
            roles:[],
            role:[],
            permission:[]
        }
    },
    computed:{
        ...mapGetters([
            'userinfo',
        ])
    },

    created:function(){        
        this.$emit('childtitle', '角色权限');
        this.getRoles();
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

            var arr = this.getUser
            this.emps = arr.filter(function(item,idx){
                return idx > start && idx < end;
            })
        },
        getRoles(){
            var _this=this;
            this.$store.dispatch('getRoles',(res)=>{
                _this.roles = res;
                _this.role = _this.roles[0];
            });
        },
        showPermission(id){            
            this.role = this.roles[id];
            $('.role-item').removeClass('role-item-active');
            $('.role-item:eq('+id+')').addClass('role-item-active');
        },
        toggle(item,idx){
            var arr = item.permission.split('');
            if(arr[idx]==0){
                arr[idx] = 1
            }else{
                arr[idx] = 0
            }
            var str = arr.join('')
            item.permission=str;
        },
        save(){
            var _this = this;
            var data = 'data='+JSON.stringify(this.role);
            this.$store.dispatch('saveRolePermission',{'data':data,'cb':(res)=>{
                this.$message(res,{type:'success'});
                 _this.getRoles();
            }})
        },
        addRole(){
            var _this = this;
            var name=$('#rolename').val();
            if(name.length == 0){
                this.$toast('请输入角色名称');
                return false;
            };
            name = 'name='+name+'&no='+this.userinfo.emp_no;
            this.$store.dispatch('addRole',{'data':name,'cb':(res)=>{
                this.$toast(res.errmsg);
                //console.log(res);
                if(res.errcode==0){
                    $('#rolename').val('');
                    _this.getRoles();
                }
            }})

        }
        
    }   
}
    
            
</script>
<style lang="scss" scoped>
    .vue-component{
        >.div-content{
            margin: 0;
            >.div-left{
                width: 300px;
                >.ul-role{
                    padding: 0;
                    text-align: center;
                    border: 1px solid blue;
                    >.role-item{
                        list-style: none;
                        margin-bottom: 2px;
                        padding: 1px;
                        cursor: pointer;
                        line-height: 40px;
                        background-color: #eee;
                    }
                    >.role-item-active{
                        background-color: #2196f3;
                    }
                }
            }
        }
    }
    .td-btn{
        font-size: 12px;
    }
</style>
