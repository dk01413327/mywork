<template>
    <el-container>
        <el-header><myheader ></myheader></el-header>
        
        <el-container id="wrapper">
            <el-menu class="left-menu" unique-opened router background-color="#e3f2fd" active-text-color="red" :collapse="isCollapse">
                <el-menu-item index="/index" @click="add('index','index')">           
                    <i class="el-icon-location"></i>
                    <span>首页</span>
                </el-menu-item>
                <el-submenu popper-class="amenu" :index="idx+''" :key="idx" v-for="(item,idx) in getMenu" :id="item.menu_id">
                    <template slot="title">
                    <i :class="item.menu_icon"></i>
                    <span>{{item.menu_name}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item  v-for="(sub,subidx) in item.children" :key="subidx" :id="sub.menu_id" index="index"  
                        @click="add(sub)">
                            {{sub.menu_name}}  
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>

            <el-container>
                <span class="pusher" style="" @click="push">
                    <i style="margin-top:15px;" :class="isCollapse ? 'el-icon-caret-right':'el-icon-caret-left'"></i></span>
                <el-main id='page-main'>
                    <keep-alive>
                    <el-tabs v-model="activeTab" type="border-card" closable  @tab-remove="removeTab">  
                        <template  v-for="(item,idx) in tabs" >                     
                        <el-tab-pane  :label="item.label" :name="item.name" :key="idx" v-if="item.hidden == false">
                            <router-view :name="item.name" /></el-tab-pane>
                        </template>
                    </el-tabs>
                    </keep-alive>
                </el-main>
            </el-container> 
        </el-container>
    </el-container>
</template>
<script>
import myheader from '@/components/header';
import {mapGetters, mpaActions} from 'vuex'

export default {
    components:{'myheader':myheader},
    data(){
        return {
            dialogVisible:false,
            isCollapse:false,
            title:'',
            tabs:[{'label':'主页','name':'index','hidden':false}],
            activeTab: 'index',
        }        
    },
    computed:{
        ...mapGetters(['getMenu','userinfo','getSubMenu','getPermission'])
    },
    created(){
    },
    mounted(){
        $('#wrapper').css('height',window.innerHeight-60);
    },
    updated(){
        
    },
    methods:{
        getTitle(data){
            this.title = data;
        },
        push(){
            this.isCollapse = !this.isCollapse;
            setTimeout(function(){
                $(window).trigger("resize");
            },1000)
        },
        add(item){
            if(item=='index'){this.activeTab=item;return ;}
            this.$store.dispatch('setPermission',{'parentid':item.parent_id,'menuid':item.menu_id,'permission':item.permission});
            if(item.com_name=='wfoverview'){
                this.dialogVisible = true;
                const { href } = this.$router.resolve({name: 'wfoverview'})
                window.sessionStorage.setItem('permission',item.permission);
                window.open(href);
                return false;
            }
            if(item.com_name =='meeting'){
                this.dialogVisible = true;
                const { href } = this.$router.resolve({name: 'meeting'})
                window.open(href);
                return false;
            }
            
            var arr = this.tabs.filter(function(e){return e.name==item.com_name && e.hidden==false})
            if(arr.length==0){
                this.tabs.push({'label':item.menu_name,'name':item.com_name,'hidden':false});
                var data = 'userno='+this.userinfo.emp_no+'&menuid='+item.menu_id;
                this.$store.dispatch('addUseLog',{'data':data,'cb':null});  
            }            
            this.activeTab = item.com_name;
            $('.el-menu-item').removeClass('is-active');
            $('#'+item.menu_id).addClass('is-active');
        },
        removeTab(targetName){
            if(targetName=='index') {return;}
            this.handleTabs(targetName,true);
            let tabs = this.tabs;
            let activeName = this.activeTab;
            for(var i=this.tabs.length-1; i >= 0; i--){
                if(this.tabs[i].hidden == false){
                    activeName = this.tabs[i].name;
                    break;
                }
            }
            //console.log(this.tabs,targetName,activeName)
            this.activeTab = activeName;            
            //$('#tab-'+targetName).css('display','none');
            //$('#pane-'+targetName).css('display','none');
            $('#tab-'+targetName).remove();
            $('#pane-'+targetName).remove();
            
        },
        handleTabs(name,flag){
            for(var i=0; i < this.tabs.length; i++){
                if(this.tabs[i].name==name){
                    this.tabs[i].hidden = flag;
                    //break;
                }
            }
        }
    }
}
window.onresize = function(){$('#wrapper').css('height',window.innerHeight-60);}
</script>
<style scoped>
    .el-menu-item-group ul li{
        background-color:#dbeffd !important;
    }
    .el-menu-item-group ul li:hover{
        background-color:#92c0e2 !important;
    }
    .left-menu{
        overflow-y: scroll;
        overflow-x:hidden;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        margin: 5px 0;
    }
    .left-menu, .el-main{-ms-overflow-style: none;}
    .left-menu::-webkit-scrollbar, .el-main::-webkit-scrollbar {display: none;}
    .left-menu:not(.el-menu--collapse) {
        width: 200px;
    }
    #page-main{
        padding: 5px 10px 0 20px;
    }
    .pusher{
        position:absolute;
        top:50%;
        height:50px;
        font-size:20px;
        color:#007bff;
        cursor:pointer;
    }
</style>
