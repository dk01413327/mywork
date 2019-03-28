<template>
    <div>
        <el-row :gutter="5" >
            <el-col :span="6">
                <el-card class="text-white" style="background:#ff5722">
                    <el-row><el-col :span="12"><h5>新报修</h5></el-col><el-col :span="12"><h1 style="text-align:right">{{newReq}}</h1></el-col></el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="text-white" style="background:#ffc107">
                    <el-row><el-col :span="12"><h5>待维修</h5></el-col><el-col :span="12"><h1 style="text-align:right">{{accReq}}</h1></el-col></el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="text-white" style="background:#03a9f4">
                    <el-row><el-col :span="12"><h5>维修中</h5></el-col><el-col :span="12"><h1 style="text-align:right">{{onReq}}</h1></el-col></el-row>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="text-white" style="background:#cddc39">
                    <el-row><el-col :span="12"><h5>已修好</h5></el-col><el-col :span="12"><h1 style="text-align:right">{{finReq}}</h1></el-col></el-row>
                </el-card>
            </el-col>
        </el-row>
        <br/>
        <el-row :gutter="5">
            <el-col :span="8">
                <el-card><div class="chart" id="deptchart" style='height:300px;width:100%'></div></el-card>
            </el-col>
            <el-col :span="8">
                <el-card><div class="chart" id="typechart" style='height:300px;width:100%'></div></el-card>
            </el-col>
            <el-col :span="8">
                <el-card><div class="chart" id="areachart" style='height:300px;width:100%'></div></el-card>
            </el-col>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="24">
                <el-card><div class="chart" id="datechart" style='height:300px;width:100%'></div></el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import echarts from 'echarts'
import {mapGetters,mapActions,mapMutation} from 'vuex'
export default {
    data(){
        return{
            statsData:[],
            newReq:0,
            accReq:0,
            onReq:0,
            finReq:0
        }
    },
    created(){
        
    },
    mounted(){
        this.getData();
        
    },
    methods:{
        getData(){
            this.$store.dispatch('getTarStat',{data:'',cb:res=>{
                if(res.errcode==1){
                    this.$alert(res.errmsg,'出错啦',{type:'error'})
                }else{
                    this.statsData = res.data;
                    var data = this.statsData.filter(item=>{return item.type==0})
                    for(var i=0;i<data.length;i++){
                        if(data[i].name==0){
                            this.newReq = data[i].value;
                        }else if(data[i].name==1){
                            this.accReq = data[i].value;
                        }if(data[i].name==2){
                            this.onReq = data[i].value;
                        }else{
                            this.finReq = data[i].value;
                        }
                    }
                    this.drawDeptChart();
                    this.drawTypeChart();
                    this.drawAreaChart();
                    this.drawDateChart();
                }
            }})
        },
        drawDeptChart(){
            var colorList = [
            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
            ];
            var data = this.statsData.filter(item=>{return item.type==1});
            let myChart = echarts.init(document.getElementById('deptchart'));
            myChart.setOption({
                tooltip : {
                    show: true,
                    formatter: "{b} : {c} ({d}%)"
                },
                title:{text:'报修部门统计'},
                calculable : true,
                series:{
                    type:'pie',
                    radius : '55%',
                    itemStyle : {
                        normal : {
                            label : {
                                position : 'outer',
                                formatter : function (params) {                       
                                    return params.name+':'+params.value+'\n'+(params.percent - 0).toFixed(0) + '%'
                                }
                            },
                            color:params=>{
                                return colorList[params.dataIndex%colorList.length]
                            }
                        }                        
                    },
                    data:data
                }
            })
        },
        drawTypeChart(){
            var colorList = [
                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',            
                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
            ];
            var data = this.statsData.filter(item=>{return item.type==2});
            let myChart = echarts.init(document.getElementById('typechart'));
            myChart.setOption({
                tooltip : {
                    show: true,
                    formatter: "{b} : {c} ({d}%)"
                },
                title:{text:'设备类型统计'},
                calculable : true,
                series:{
                    type:'pie',
                    radius : '55%',
                    itemStyle : {
                        normal : {
                            label : {
                                position : 'outer',
                                formatter : function (params) {                       
                                    return params.name+':'+params.value+'\n'+(params.percent - 0).toFixed(0) + '%'
                                }
                            },
                            color:params=>{
                                return colorList[params.dataIndex%colorList.length]
                            }
                        }                        
                    },
                    data:data
                }
            })
        },
        drawAreaChart(){
            var colorList = [
            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',           
            ];
            var data = this.statsData.filter(item=>{return item.type==3});
            let myChart = echarts.init(document.getElementById('areachart'));
            myChart.setOption({
                tooltip : {
                    show: true,
                    formatter: "{b} : {c} ({d}%)"
                },
                title:{text:'位置统计'},
                calculable : true,
                series:{
                    type:'pie',
                    radius : '55%',
                    itemStyle : {
                        normal : {
                            label : {
                                position : 'outer',
                                formatter : function (params) {                       
                                    return params.name+':'+params.value+'\n'+(params.percent - 0).toFixed(0) + '%'
                                }
                            },
                            color:params=>{
                                return colorList[params.dataIndex%colorList.length]
                            }
                        }                        
                    },
                    data:data
                }
            })
        },
        drawDateChart(){
            var colorList = [
            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0',
            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',           
            ];
            let myChart = echarts.init(document.getElementById('datechart'));
            var data = this.statsData.filter(item=>{return item.type==4});
            var xdata = []
            for(var i=0;i<data.length;i++){
                xdata.push(data[i].name)
            }
            myChart.setOption({
                title:{text:'维修员接单数统计'},
                xAxis: {
                    data:xdata,
                },
                yAxis:{

                },
                series:{
                    name:'维修员',
                    type:'bar',
                    itemStyle:{normal:{label : {show: true},color:params=>{
                                return colorList[params.dataIndex%colorList.length]
                            }}},
                    data:data,
                }
            })
        }
    }
}
</script>
<style>
    .el-card:hover{
        transform: scale(1.02)
    }
</style>
