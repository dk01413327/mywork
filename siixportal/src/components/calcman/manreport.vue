<template>
    <div class="vue-component">
        <div class="m-0" v-for="(data,idx) in mData" :key="idx" >
            <div class="chart-data p-2 bg-white" >
                <div class="chart" :id="('mychart'+idx)" style='height:300px;width:100%'></div>
            </div>
            <div class="p-2 bg-white mb-2">
                <table class="table table-bordered m-0">
                    <thead class="bg-white"><tr><th></th><th></th><th v-for="(month,mm) in xAxis" :key="mm">{{month}}</th></tr></thead>
                    <tbody :id="('tbody'+idx)">
                        <tr v-for="(item,dd) in data.data" :key="dd">
                            <td v-if="dd==0" rowspan="5">{{data.dept}}</td>
                            <td v-if="dd==0">计划数量(K)</td><td v-else-if="dd==1">实际人力</td>
                            <td v-else-if="dd==2">间接人力</td><td v-else-if="dd==3">需求人力</td><td v-else>差异</td>
                                <td :class="{'text-primary':dd==3}" v-for="(td,ii) in item" :key="ii" 
                                @click="dd==3 && showDetail(data.dept,(ii+1))">{{td}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal fade" id="div-detail" >
            <div class="modal-dialog" role="document" style="max-width:80%">
                <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title">人力需求明细</h5>
                    
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" >
                    <Tablebox url='getManRptDetail' :path-params='pathParams'>
                        <tr slot='fixths' class="text-center"><th>年月</th><th>六位码</th>
                        <!-- <th>品名</th> -->
                        <th>型号</th><th>工程</th>
                        <th>计划数量</th><th>月工时数</th><th>生产性</th><th>需求人数</th></tr>

                        <tr slot='ths' class="text-center"><th>年月</th><th>六位码</th>
                        <!-- <th>品名</th> -->
                        <th>型号</th><th>工程</th>
                        <th>计划数量</th><th>月工时数</th><th>生产性</th><th>需求人数</th></tr>
                        
                        <template slot="item" slot-scope="props">
                        <tr slot='item' >
                            <td>{{props.item.yearmonth}}</td>
                            <td>{{props.item.part_no}}</td>
                            <!-- <td>{{props.item.part_name}}</td> -->
                            <td>{{props.item.model_name}}</td>
                            <td>{{props.item.eng_name}}</td>
                            <td>{{props.item.qty}}</td>
                            <td>{{props.item.month_hours}}</td>
                            <td>{{props.item.productive}}</td>
                            <td>{{props.item.reqmen}}</td>
                        </tr>
                        </template>
                        
                    </Tablebox>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>                    
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import {mapGetters,mapActions} from 'vuex';
import Tablebox from '../common/table'
export default {
    name:'part',
    components:{Tablebox},
    data(){
        return{
            requstVisible:false,
            pageSize:12,
            currentPage:1,
            menRpt:[],
            engs:[],
            myChart:[],
            mData:[],
            detail:[],
            pathParams:null,
        }
    },
    computed:{
        ...mapGetters(['userinfo']),
        xAxis(){
            return ["Jan","Feb","Mar","Apr","May","Jue","Jul","Aug","Sep","Oct","Nov","Dec"]
        },
        
        engCount(){
            return this.engs.length;
        }
    },
    watch:{},
    created(){
        var _this = this;
        this.$emit('childtitle', '人力报表');
        var toast = this.$toast({'message':'正在拼命加载,请稍候...','mtype':3});
        this.$store.dispatch('getManReport',{'cb':(res)=>{
            if(res.errcode == 1){
                toast.close();
                this.$toast('没有数据');
                return false;
            }
            this.migrationData(res.data);
            _this.menRpt = res.data;
            toast.close();}});
        
        this.$store.dispatch('getEngs',{'cb':(res)=>{
            _this.engs = res.data;
            }});
    },
    mounted(){
        
    },
    updated(){
        this.$store.dispatch('clickMenu');
        this.draws(); 
    },
    methods:{ 
        draws(){
            var _this = this;
            _this.myChart = Array();
            $('.chart').each(function(idx){
                if(idx==0){
                    var title = '全厂';
                }else{
                    var title = _this.engs[idx-1].eng_name; 
                }
                let myChart = echarts.init(document.getElementById('mychart'+(idx)));
                _this.myChart.push(myChart);
                _this.drawChart(myChart,title);
            });
            
            window.onresize = function(){
                _this.myChart.forEach(el=>{
                    el.resize();
                })
            }
        },
        drawChart(chart,dept){
            var _this = this;
            var data  = this.mData.filter(function(e){return e.dept==dept});
            data = data[0].data;
            var colorList = [
            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
            ];

            chart.setOption({
                title: { text: dept+'每月人力需求' },
                legend: {
                    x: 'right',
                    data:['实际人力','间接人力','需求人力']
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        // for text color
                        var color = colorList[params[0].dataIndex];
                        var res = '<div style="color:#C1232B">';
                        res += '<strong>' + params[0].name + ':' + dept + '人力状况</strong>'
                        for (var i = 0, l = params.length; i < l; i++) {
                            res += '<br/>' + params[i].seriesName + ' : ' + params[i].value 
                        }
                        res += '</div>';
                        return res;
                    }
                },
                xAxis: {
                    data: _this.xAxis,
                },
                yAxis: {},
                series: [
                {
                    itemStyle:{normal:{label : {show: true},color:params=>{return '#FCCE10'}}},
                    name: '实际人力',
                    type: 'bar',
                    data: data[1]
                },
                {
                    itemStyle:{normal:{label : {show: true},color:params=>{return '#27727B'}}},
                    name: '间接人力',
                    type: 'bar',
                    stack:'需求',
                    data: data[2]
                },
                {
                    itemStyle:{normal:{label : {show: true},color:params=>{return '#E87C25'}}},
                    name: '需求人力',
                    type: 'bar',
                    stack:'需求',
                    data: data[3]
                }]
            });
        },
        migrationData(mendata){
            var res = Array();
            function getData(dept){
                var data = mendata.filter(function(e){return e.eng_name==dept});
                var diff = Array(0,0,0,0,0,0,0,0,0,0,0,0);
                var actualmen = Array(0,0,0,0,0,0,0,0,0,0,0,0);
                var idlmen = Array(0,0,0,0,0,0,0,0,0,0,0,0);
                var needmen = Array(0,0,0,0,0,0,0,0,0,0,0,0);
                var shipqty = Array(0,0,0,0,0,0,0,0,0,0,0,0);
                data.forEach(element => {
                    var idx = parseInt(element.yearmonth.substr(-2));
                    actualmen[idx-1] = element.actual_man;
                    idlmen[idx-1] = element.idl_man;
                    needmen[idx-1] = element.need_man;
                    diff[idx-1] = parseInt(element.need_man)+parseInt(element.idl_man)-parseInt(element.actual_man);
                    shipqty[idx-1] = element.ship_qty;
                });
                var data = Array();
                data.push(shipqty);
                data.push(actualmen);
                data.push(idlmen);
                data.push(needmen);
                data.push(diff);
                
                res.push({'dept':dept,'data':data})  
            }
            getData('全厂');
            this.engs.forEach(el=>{
                getData(el.eng_name)
            })
            this.mData = res;
        },
        showDetail(dept,idx){
            var ym;
            var date = new Date();
            var ym  = date.getFullYear();
            if(idx<10){
                ym += '0'+idx;
            }else{
                ym += ''+ idx;
            }
            var _this = this;
            var data = 'dept='+dept+'&ym='+ym;
            this.pathParams = {'data':data}

            $('#div-detail').modal('show');
        }
    }
    
}
</script>
<style lang="scss" scoped>
    .text-primary{
        cursor: pointer;
    }
    .text-primary:hover{
        text-decoration: underline;
    }
</style>
