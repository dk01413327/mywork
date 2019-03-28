<template>
    <div class="vue-meeting">
        <button id="btn-booking" class="btn btn-success btn-blok btn-lg animated shake" 
                data-toggle="modal" @click="showBooking" v-if="JSON.stringify(userinfo)!='{}'">我要预约</button>
        <div id="color-nav" class="text-center" > 
            <ul class="nav nav2">
                <li class="nav-item bg-warning" style="border-radius: 20px 0 0 20px">VIP</li>
                <li class="nav-item bg-primary">客户</li>
                <li class="nav-item bg-info">供应商</li>
                <li class="nav-item bg-secondary" style="border-radius: 0 20px 20px 0">内部</li>
            </ul>
        </div>
        <div id="tabdiv" > 
            <div id="div-tabhead" style="position: absolute;top:0;width:100%">
                <table id="tabhead" class="table table-bordered table-hover text-center" >
                    <thead class="thead-dark">
                        <tr><th>日期</th><th>会议室</th><th colspan="4">7:00</th><th colspan="4">8:00</th><th colspan="4">9:00</th><th colspan="4">10:00</th><th colspan="4">11:00</th><th colspan="4">12:00</th><th colspan="4">13:00</th><th colspan="4">14:00</th><th colspan="4">15:00</th><th colspan="4">16:00</th><th colspan="4">17:00</th><th colspan="4">18:00</th></tr>
                    </thead>
                </table>
            </div>
            <div id="div-tabdata">
                <table id="tabdata" class="table table-bordered table-hover text-center" style="table-layout: fixed" >
                    <thead class="thead-dark" > 
                        <tr><th width="60">日期</th><th width="90">会议室</th><th colspan="4">7:00</th><th colspan="4">8:00</th><th colspan="4">9:00</th><th colspan="4">10:00</th><th colspan="4">11:00</th><th colspan="4">12:00</th><th colspan="4">13:00</th><th colspan="4">14:00</th><th colspan="4">15:00</th><th colspan="4">16:00</th><th colspan="4">17:00</th><th colspan="4">18:00</th></tr>
                    </thead>
                    <tbody id='tbdata'>                 
                    </tbody>
                </table>
            </div>
        </div>

        <div id="bookingroom" data-backdrop='static' class="modal fade " tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 60%;">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                        <h5 class="modal-title" id="title">会议预约</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul class="nav form-row text-center" style="padding:0 20px;margin-bottom: 20px" >
                            <li id="step1Li" class="col step-blue" @click="showStep(1)">1、会议信息</li>
                            <li id="step2Li" class="col step-gray" @click="showStep(2)"><img id="step2Img" :src="img1">2、出席人员(可选项)</li>
                            <li id="step3Li" class="col step-gray" @click="showStep(3)"><img id="step3Img" :src="img2">3、选择频率(可选项)</li>
                            <li id="step4Li" class="col step-gray"><img id="step4Img" :src="img3"><a >4、完成</a></li>
                        </ul>
                        <form id="form-booking" >
                            <input value="0" name="bkno" id="bkno" hidden>
                            <div id="dostep1" >
                                <div class="form-group form-row">
                                    <label for='subject' class="col-2 col-form-label text-center">会议主旨</label>
                                    <div class="col-9">
                                        <input class="form-control" name="subject" id="subject" placeholder="会议主旨">
                                    </div>
                                </div>

                                <div class="form-group form-row">
                                    <label for='roomno' class="col-2 col-form-label text-center">会议室</label>
                                    <div class="col-9">
                                        <select name='roomno' id="roomno" class="form-control">
                                            <option v-for = "(rm,idx) in getRoom" :value="rm.room_id" :key="idx" 
                                             v-if="rm.enabled=='启用'">{{ rm.room_name }}</option>
                                        </select>
                                    </div>
                                    
                                </div>

                                <div class="form-group form-row">
                                    <label for='meetingdate' class="col-2 col-form-label text-center">会议日期</label>
                                    <div class="col-9">
                                        <input class="form-control" name="meetingdate" id="meetingdate" readonly>
                                    </div>
                                </div>

                                <div class="form-group form-row">
                                    <label for='starttime' class="col-2 col-form-label text-center">开始时间</label>
                                    <div class="col-9">
                                        <select name='starttime' id="starttime" class="form-control">             
                                        </select>
                                    </div>                                    
                                </div>
                                <div class="form-group form-row">
                                    <label for='endtime' class="col-2 col-form-label text-center">结束时间</label>
                                    <div class="col-9">
                                        <select name='endtime' id="endtime" class="form-control">               
                                        </select>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <label for='mtype-chk-group' class="col-2 col-form-label text-center">会议类别</label>
                                    <div class="col-9" style="line-height: 40px" id="mtype-chk-group">
                                        <div class="form-check form-check-inline ">
                                            <input class="form-check-input" type="radio" name="mtype" id="mtype1" value="0" checked @click="checkMeetingType(0)">
                                            <label class="form-check-label" for="inlineRadio1">内部会议</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="mtype" id="mtype2" value="1" @click="checkMeetingType(1)">
                                            <label class="form-check-label" for="inlineRadio2">供应商</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="mtype" id="mtype3" value="2" @click="checkMeetingType(2)">
                                            <label class="form-check-label" for="inlineRadio2">客户</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="mtype" id="mtype4" value="3" @click="checkMeetingType(3)" >
                                            <label class="form-check-label" for="inlineRadio3">VIP</label>
                                        </div>
                                    </div>
                                </div>
                                <div id="div-custname" class="form-group form-row" style="display: none">
                                    <label for='custname' class="col-2 col-form-label text-center">名称</label>
                                    <div class="col-9">
                                        <input name='custname' id="custname" class="form-control">
                                    </div>
                                </div>

                                <div class="form-group form-row" >
                                    <label for='remark' class="col-2 col-form-label text-center">预约备注</label>
                                    <div class="col-9">
                                        <textarea name='remark' id="booking-remark" class="form-control"></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="dostep2" style="display: none; padding:0 20px">
                                <input id="search" class="form-control col-2" style="margin-bottom: 5px" placeholder="输入工号回车...">
                                <div class="div-scroll">
                                    <table class="table table-bordered table-striped">
                                        <thead class="thead-light"><tr><th></th><th>工号</th><th>姓名</th><th>部门</th></tr></thead>
                                        <tbody id="tby-attendance">
                                            <tr v-for="(emp,idx) in emps" v-if="emp.enabled=='启用' && emp.emp_no!='admin'" :key="idx">
                                                <td><input type="checkbox" name="attend[]" :value="emp.emp_no"></td>
                                                <td>{{emp.emp_no}}</td>
                                                <td>{{emp.emp_name}}</td>
                                                <td>{{emp.dept}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                                
                            </div>
                            
                            <div id="dostep3" style="display: none">
                                <div class="form-group form-row">
                                    <label for='endtime' class="col-2 col-form-label text-center">预约类型</label>
                                    <div class="col-10" style="line-height: 40px" id="mlevel-chk-group">
                                        <div class="form-check form-check-inline ">
                                            <input class="form-check-input" type="radio" name="meetinglevel" value="0" checked @click="showFix(false)">
                                            <label class="form-check-label" for="inlineRadio1">正常</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="meetinglevel" value="1" @click="showFix(true)" >
                                            <label class="form-check-label" for="inlineRadio2">固定</label>
                                        </div>                                    
                                    </div>
                                </div>

                                <div id="fix" style="display:none">
                                    <div class="form-group form-row">
                                        <label for='enddate' class="col-2 col-form-label text-center">到期日期</label>
                                        <div class="col-9">
                                            <input class="form-control" name="fixenddate" id="fixenddate" readonly>
                                        </div>
                                    </div>
                                    <div class="form-group form-row">
                                        <label class="col-2 col-form-label text-center">固定类型</label>
                                        <div class="col-4" style="line-height: 40px" id="mfix-chk-group">
                                            <input type="radio" name="fixtype" value="-1" checked hidden>
                                            <div class="form-check form-check-inline ">
                                                <input class="form-check-input" type="radio" name="fixtype" value="0" @click="showRateSelect(0)">
                                                <label class="form-check-label" for="inlineRadio1">日</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="fixtype" value="1" @click="showRateSelect(1)">
                                                <label class="form-check-label" for="inlineRadio2">周</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="fixtype" value="2" @click="showRateSelect(2)">
                                                <label class="form-check-label" for="inlineRadio3">月</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="rate-select" class="form-group form-row" style="display:none">
                                        <label class="col-2 col-form-label text-center">选择频率</label>
                                        <div class="dropdown col-9">
                                            <input id="rate-text" class="form-control dropdown-toggle"  data-toggle="dropdown" readonly>
                                            <div class="dropdown-menu" aria-labelledby="rate-text">
                                                <div id="rate-select-menu1">
                                                    <label v-for="(item,idx) in weekdays" style="margin:0 2px" :key="idx">
                                                        <input type="checkbox" :value="idx" :data-caption='item' name='atweeks[]' @click="showSelectValue()">{{item}}</label>
                                                </div>
                                                <div id="rate-select-menu2">
                                                    <span v-for="(item,idx) in days" :key="idx">
                                                        <label style="margin:0 2px"  v-if="idx<31">
                                                            <input type="checkbox" :value="idx+1" :data-caption='item' name='atdays[]' @click="showSelectValue()">{{item}}
                                                        </label>
                                                        <label style="margin:0 2px" v-else>
                                                            <input type="checkbox" :value="idx+1" :data-caption='item' name='atdays[]' @click="showSelectValue()" >最后一天
                                                        </label> 
                                                    </span>
                                                </div>                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                           

                            <div id="booking-feedback" class="form-row feedback" style="color:red"></div>
                        </form> 
                    </div>
                    <div class="modal-footer">        
                        <button id="btn-save" class="btn btn-primary" @click="saveBookingData()">保存</button>
                    </div>
                </div>
            </div>       
        </div>

        <div id="tips" class="card bg-dark" style="max-width: 25rem;position:fixed;display: none;color:#fff">
            <div class="card-body" style="padding-bottom:0" >
                <table class="table table-sm table-bordered " style="border: 0px;table-layout: fixed">
                    <tr><th class="tip-title">会议主旨</th><th >{{ bkinfo.subject }}</th></tr>
                    <tr><th class="tip-title">日期时间</th><th  >{{ bkinfo.mdate }} {{ bkinfo.stime }} ~ {{ bkinfo.etime }}</th></tr>
                    <tr><th class="tip-title">会议地点</th><th  >{{ bkinfo.roomname }}</th></tr>
                    <tr ><th class="tip-title" v-if="bkinfo.mtype==0">会议类型</th>
                        <th class="tip-title" v-else-if='bkinfo.mtype==1'>厂商名称</th>
                        <th class="tip-title" v-else>客户名称</th>
                        <th  v-if="bkinfo.mtype==0">{{bkinfo.mtypename}}</th>
                        <th  v-else>{{bkinfo.cname}}</th></tr>
                    
                    <tr  v-if="bkinfo.fixtype>-1"><th class="tip-title">固定频率</th>
                        <th v-if="bkinfo.fixtype==0">每天固定</th>
                        <th v-else-if="bkinfo.fixtype==1">每周 
                            <span v-for="(item,idx) in bkinfo.fixat.split(',').sort()" :key="idx" >{{weekdays[item].substr(-1)}}</span>固定，<span> {{bkinfo.fixedate}}</span>结束</th>
                        <th v-else-if="bkinfo.fixtype==2">每月
                            <span v-for="(item,idx) in bkinfo.fixat.split(',')" :key="idx"><span v-if="item<32">{{item}}</span><span v-else>最后一天</span>
                        </span>固定</th>
                    </tr>
                    <tr v-if="bkinfo.attendance!=''"><th class="tip-title">出席人员</th><th>{{ bkinfo.attendance }}</th></tr>                  

                    <tr><th class="tip-title">预定人</th><th  >{{ bkinfo.dept }}：{{ bkinfo.applyer }}  </th>
                    <tr><th class="tip-title">联络方式</th>
                        <th v-if="bkinfo.emaill !='' && bkinfo.tel !='' " class="addwidth">
                            <span class="fa fa-envelope"></span>{{ bkinfo.email }} <span class="fa fa-phone"></span>{{ bkinfo.tel }} </th> 
                        <th v-else-if="bkinfo.email != ''"><span class="fa fa-envelope"></span>{{ bkinfo.email }}</th>
                        <th v-else-if="bkinfo.tel != ''"><span class="fa fa-phone"></span>{{ bkinfo.tel }}</th>
                        <th v-else></th>
                    </tr>                    
                    <tr><th class="tip-title">申请时间</th><th>{{ bkinfo.applytime }}</th></tr>
                    <tr v-if="convertRemark !=''"><th class="tip-title">预约备注</th><th>{{ convertRemark }}</th></tr>
                </table>
            </div>
            <div class="card-footer">  
                <button  class="btn btn-sm btn-info" @click="editBooking()">修改</button>
                <button  class="btn btn-sm btn-warning" @click="cancelBooking()">取消</button>              
            </div>
        </div>
    </div>
</template>
<script>
import {get_curr_date,set_select_checked,convertTime2Mins} from '../../../static/js/public.js'
import { mapGetters,mapActions} from 'vuex'
export default {
    data:function(){
        return {
            tddata:[],
            tipdata:{},
            weekdays:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
            bkinfo:[],
            rooms:[],
            emps:[],
            days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],
            times:['07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00'
                ,'10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00'
                ,'13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00'
                ,'16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00'],
            img:['/static/images/blue_gray.png','/static/images/gray_gray.png','/static/images/blue_blue.png'],
            img1:'',
            img2:'',
            img3:''
        }        
    },
    name:'meeting',
    computed:{
        ...mapGetters([
            'bookingdata',
            'userinfo',
            'getRoom'
        ]),
        convertRemark:function(){
            var str = String(this.bkinfo.remark)
            return str.replace('<br>','')
        }
    },
    created(){
        this.$emit('childtitle', '');
        this.$store.dispatch('getRoom')
    },
    mounted:function(){
        this.getBookingData(data => {
            this.addData2Table(data)
            changeWidth();
        });
        this.initDate();
    },
    updated:function(){        
        this.$store.dispatch('clickMenu');
    },
    methods:{
        getBookingData:function(cb){
            this.$store.dispatch('get_booking_data',cb);
        },
        addData2Table:function(data){
            var _this=this;
            var cnt = 0;
            var tdata ='';
            var rowspan = 0;
            var roomid = 0;
            var rspan = 0;
            var tips = '';
            var cdate = get_curr_date('yyyy-mm-dd').substr(-5).replace('-','/');
            $.each(data,function(idx,item){
                cnt++;
                var tr='';
                var trcss = '';
                if(rowspan == 0){
                    rowspan = data.filter(function(e){return e.day==cdate;}).length;
                    rspan = rowspan;
                }                        
                
                if(item.week_day == 5 || item.week_day == 6){
                    trcss = 'weekend-bg-color'
                }
                if(roomid == item.room_id){ trcss += ' border-top-x2' }
                if(cnt == data.length){trcss += ' border-bottom-x2'}
                tr = '<tr class="'+trcss+'">';
                var skip = true;
                var cspan = 1;
                var room = item.room_name;
                var roomdesc=item.room_desc;
                if(roomid == 0 ){roomid=item.room_id;}
                
                $.each(item,function(key,value){  
                    var temp  = '', bgcss = '';
                    if(value !== null){temp = value;}
                    if(cspan == 1){
                        if(key.indexOf('time')!=-1 && temp != ''){                                    
                            temp = temp.replace('\r\n','<br>')
                            temp = temp.replace(/\s+/g, ""); 
                            var jsonObj = $.parseJSON(temp);
                            var mtype = jsonObj.mtype;
                            cspan = jsonObj.cspan;
                            var bkinfo = temp.substr(0,temp.length-1)+',"roomname":"'+room+'"}'
                            tips = "data-info='"+bkinfo+"'";
                            if(mtype == 0){ bgcss = 'bg-secondary'; } 
                            else if(mtype == 1){ bgcss = 'bg-info';}
                            else if(mtype == 2){ bgcss = 'bg-primary';}
                            else { bgcss = 'bg-warning';}
                            
                            if(key.substr(-2)=='45'){bgcss+=' border-right-x2'}                                    
                            if((parseInt(jsonObj.stime.substr(-2))+15*cspan) % 60==0){
                                bgcss += ' border-right-x2'
                            }
                            bgcss+=' text-nowrap';
                            tr+='<td class="'+ bgcss +'"' + tips +' colspan="'+cspan+'">'+jsonObj.subject+'</td>'
                        }
                        else{
                            if(key=='room_name')
                                tr+='<td class="border-right-x2" data-desc="'+roomdesc+'" data-id="'+item.room_id+'" onclick="showRoomBooking(this)" style="cursor: pointer;color:blue">'+temp+'</td>'
                            else if(key == 'day'){
                                if(rspan == rowspan){
                                    temp += '<br/>'+_this.weekdays[item.week_day].substr(-1);
                                    tr+='<th class="border-left-x2 border-right-x2" rowspan='+rowspan+' >'+temp+'</th>';
                                    rspan--;
                                }else{
                                    rspan--;
                                    if(rspan == 0) {rspan = rowspan}
                                }
                            }else if(key !='room_desc' && key != 'room_id' && key != 'week_day'){
                                if(key.substr(-2)=='45'){bgcss+=' border-right-x2'}
                                tr+='<td class="'+bgcss+'">'+temp+'</td>'
                            }                                        
                        }
                    }else{
                        cspan--;
                    }                                                         
                })                        
                tdata+=tr+'</tr>';
            })

            $('#tbdata').html(tdata);
            $('#tbdata tr:last').removeClass('border-bottom-x2')
            this.tdClickEvent();
            this.tdHoverEvent();
        },
        tdHoverEvent:function(){
            var _this = this;
            $('td').hover(
                function(){
                    $('#tips').css('display','none');
                    var ccidx = $(this).index();
                    var colidx = ccidx;
                    var rowidx = $(this).parent().index();
                    var span = 0;
                    $('#tabdata tr').each(function(){
                        if ($(this).index()== rowidx){
                            $(this).children('td').each(function(){
                                if($(this).index()>=colidx){return false;}
                                if(parseInt($(this).attr('colspan'))>0){
                                    span+=parseInt($(this).attr('colspan'))-1;
                                }
                            })
                        }
                    })
                    //日期行减1
                    if($(this).parent().children('th').html()!=undefined){ccidx--;}
                    ccidx +=span;
                    if(ccidx % 4 == 1){
                        ccidx+=1;
                    }
                    if(ccidx % 4 == 2 || ccidx % 4 == 3){
                        ccidx += 4 - ccidx % 4;
                    }
                    var add = parseInt(ccidx/4);
                    ccidx = add + 1;                             
                    $('#tabhead tr th').each(function(){
                        var cidx = $(this).index();
                        if(cidx==ccidx ){
                            $(this).css('background-color','red');
                        }
                    })
                },function(){$('#tabhead tr th').css('background-color','blue');}
            ) 
        },
        tdClickEvent:function(){
            var _this = this;
            $('td').click(
                function(){
                    var subject = $(this).data('info');
                    if(typeof(subject) != 'undefined'){
                        _this.bkinfo=$(this).data('info');
                        var left = event.clientX - 20
                        var top = event.clientY - 20
                        if(left>$(window).width()-$("#tips").width()){
                            left = $(window).width()-$("#tips").width()-10;
                        }
                        if(top>$(window).height()-$("#tips").height()){
                            top = $(window).height()-$("#tips").height()-70;
                        }
                        $("#tips").css({
                            top: top,
                            left: left,
                            display:'block'
                        });
                    } else{
                        $('#tips').css('display','none');
                    }
            });
        },

        checkMeetingType(value){
            if(value == 0 || value=='内部'){
                $('#div-custname').css('display','none')
            }else if(value == 1 || value=='供应商'){
                $('#div-custname').css('display','flex')
                $('#div-custname label').html('厂商名称')
            }else {
                $('#div-custname').css('display','flex')
                $('#div-custname label').html('客户名称')
            }
        },
        showRateSelect(value){
            if(value == 0){
                $('#rate-select').hide();
                $('#rate-text').hide().val('');
                $('#fixenddate').val(''); 
            }else if(value == 1){
                $('#rate-select').show();
                $('#rate-text').val('').show();
                $('#rate-select-menu1 input:checkbox').each(function(){
                    $(this).prop('checked',false);
                })
                $('#rate-select-menu1').show();
                $('#rate-select-menu2').hide();
            }else{
                $('#rate-select').show();
                $('#rate-text').val('').show();
                $('#rate-select-menu2 input:checkbox').each(function(){
                    $(this).prop('checked',false);
                })
                $('#rate-select-menu1').hide();
                $('#rate-select-menu2').show();
            }
        },
        showFix(value){
            var _this=this;
            if(value){
                $('#fix').css('display','block');
                $('#mfix-chk-group input:eq(1)').prop('checked',true);
            }else{
                $('#fix').css('display','none')
                $('#mfix-chk-group input:eq(0)').prop('checked',true);
            }
            _this.showRateSelect(0);
        },
        
        showSelectValue(){
            var seltext = '';  
            if($('#rate-select-menu1').css('display')=='none'){
                $('#rate-select-menu2 input:checked').each(function(){
                    seltext +=';'+$(this).data('caption');
                })
            }else{
                $('#rate-select-menu1 input:checked').each(function(){
                    seltext +=';'+$(this).data('caption');
                })  
            }            
            $('#rate-text').val(seltext.substr(1));
        },
        

        showBooking(){
            this.$store.dispatch('getUser',{'data':'','cb':res=>{
                this.emps = res.data;
            }})
            document.getElementById('form-booking').reset();
            this.checkMeetingType(0);
            //this.showRateSelect(0)
            this.showFix(0);
            this.showStep(1);
            $('#bkno').attr('value','0');
            $('#booking-feedback').html('');            
            $('#bookingroom').modal('show');   
        },
        showStep (index){
            for(var i=2;i<=index;i++){
                $("#step"+i+"Li").addClass("step-blue").removeClass("step-gray");
                
            }
            for(var i=index+1;i<=4;i++){
                $("#step"+i+"Li").addClass("step-gray").removeClass("step-blue");
            }
             if(index==1){
                this.img1 = this.img[0];
                this.img2 = this.img[1];
                this.img3 = this.img[1];
            }else if(index==2){
                this.img1 = this.img[2];
                this.img2 = this.img[0];
                this.img3 = this.img[1];
            }else if(index==3){
                this.img1 = this.img[2];
                this.img2 = this.img[2];
                this.img3 = this.img[0];
            }
            for(var i = 1;i<4;i++ ){
                $('#dostep'+i).css('display','none');
            }
            $('#dostep'+index).css('display','block');

        },

        saveBookingData (){
            if(this.checkMeetingData()==false){
                return false;
            }
            var data = $("#form-booking").serialize();
            data += '&userno='+this.userinfo.emp_no;
            this.$store.dispatch('save_booking_data',{'data':data,'cb':(res)=>{
                if(res.errcode=='0'){
                    this.$toast('预约成功');
                    $('#bookingroom').modal('hide');
                    this.getBookingData(data => {this.addData2Table(data)});
                }else{
                    this.$toast(res.errmsg);
                }
            }});
        },

        checkMeetingData(){
            if($('#subject').val().length==0){ 
                $('#booking-feedback').html('会议主题不能为空');              
                return false;
            }
            if($('#meetingdate').val().length==0){
                $('#booking-feedback').html('会议日期不能为空');
                return false;
            }
            if($('#starttime option:selected').text()==$('#endtime option:selected').text()){
                $('#booking-feedback').html('会议开始时间不能等于会议结束时间');
                return false;
            }
            if($('#starttime option:selected').text()>$('#endtime option:selected').text()){
                $('#booking-feedback').html('会议开始时间不能大于会议结束时间');
                return false;
            }
            if(convertTime2Mins($('#endtime option:selected').text())-convertTime2Mins($('#starttime option:selected').text())<30){
                $('#booking-feedback').html('不能预约小于半小时的会议');
                return false;
            }
            var sDate = get_curr_date('yyyy-mm-dd');
            if($('#meetingdate').val()<sDate){
                $('#booking-feedback').html('会议开始日期不能小于当前日期');
                return false;
            }
            if($('#div-custname').css('display')!='none'){
                if($('#custname').val().length==0){
                    $('#booking-feedback').html($('#div-custname label').html()+'不能为空');
                    return false;
                }                
            }
            if($('#fix').css('display')!='none' && $('#rate-select').css('display')!='none' && $('#rate-text').val().length ==0){
                $('#booking-feedback').html('请选择会议固定频率');
                return false;
            }
            if($('#fix').css('display')!='none' && $('#fixenddate').val().length==0){
                $('#booking-feedback').html('请选择固定会议结束日期');
                return false;
            }

            $('#booking-feedback').html('');
        },
        
        editBooking () {
            if(this.userinfo == null){
                this.$toast('请先登录',{time:1000,icon:2});
                return false;
            }

            if(this.bkinfo.empno!=this.userinfo.emp_no && this.userinfo.is_admin == 0){
                this.$toast('只有申请者和管理员才能修改');
                return false;
            }
            this.showBooking();
            this.addTime(); 
            $('#bkno').attr('value',this.bkinfo.bookingno);
            set_select_checked('roomno',this.bkinfo.roomname);            
            $('#subject').val(this.bkinfo.subject);
            $('#meetingdate').val(this.bkinfo.odate);
            set_select_checked('starttime',this.bkinfo.stime); 
            set_select_checked('endtime',this.bkinfo.etime);
            $("#mtype-chk-group input:radio[value='"+this.bkinfo.mtype+"']").prop('checked','true');
            this.checkMeetingType(this.bkinfo.mtype);
            $('#custname').val(this.bkinfo.cname);
            $("#mlevel-chk-group input:radio[value='"+this.bkinfo.level+"']").prop('checked','true');
            this.showFix(this.bkinfo.level);
            $("#mfix-chk-group input:radio[value='"+this.bkinfo.fixtype+"']").prop('checked','true');
            this.showRateSelect(this.bkinfo.fixtype);
            $('#fixenddate').val(this.bkinfo.fixedate);
            $('#booking-remark').val(this.bkinfo.remark.replace('<br>','\r\n'));
            
            if(this.bkinfo.fixtype > 0){
                var fixat=this.bkinfo.fixat.split(',');
                
                $.each(fixat,function(idx,item){
                    if(this.bkinfo.fixtype == 1){
                        $('#rate-select-menu1 input:eq('+(item)+')').prop('checked',true);
                    }
                    if(this.bkinfo.fixtype == 2){
                        $('#rate-select-menu2 input:eq('+(item-1)+')').prop('checked',true);
                    }
                })
                this.showSelectValue();                
            }            
            $('#tips').hide();
        }, 

        cancelBooking(){
            var _this = this;
            if(this.userinfo == null){
                this.$alert('请先登录','出错啦',{type:'error'});
                return false;
            }
            if(this.bkinfo.empno!=this.userinfo.emp_no && this.userinfo.is_admin == 0){
                this.$alert('只有申请者和管理员才能取消','出错啦',{type:'error'});
                return false;
            }
            this.$confirm('确定要取消会议吗?','提示',{confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'}).then(()=>{
                $('#tips').hide();
                this.$store.dispatch('cancelBooking',{data:'no='+this.bkinfo.bookingno+'&empno='+this.userinfo.emp_no,cb:res=>{
                    if(res.errcode == 0){
                        this.$message({message:res.errmsg,type:'success'});
                        _this.getBookingData(data => {
                            _this.addData2Table(data)
                            changeWidth();
                        });
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })            
        },        
        initDate(){
            var _this=this;
            $("#meetingdate").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                todayHighlight: 1,//今天高亮
                minView: "month",//设置只显示到月份
                todayBtn: true,
                autoclose: 1//选择后自动关闭
            }).on('changeDate',function(){ 
                _this.addTime();            
            });
            $("#fixenddate").datetimepicker({
                format: 'yyyy-mm-dd',//显示格式
                todayHighlight: 1,//今天高亮
                minView: "month",//设置只显示到月份
                todayBtn: true,
                autoclose: 1//选择后自动关闭
            })
        },
        addTime(){
            var seldate = $('#meetingdate').val();
            var curdatetime = get_curr_date();
            var curdate = curdatetime.substr(0,10);
            var curtime = curdatetime.substr(11,5);
            var bcurr = seldate == curdate;
            var options = '';
            
            $.each(this.times,function(idx,time){
                if(bcurr){
                    if(time > curtime)
                      options+='<option>'+time+'</option>';
                }else{
                    options+='<option>'+time+'</option>';
                }
            });
            $('#starttime').empty().append(options);
            $('#endtime').empty().append(options);
        }
    }
}
function changeWidth(){
    //$('#div-tabdata').css('height',document.body.clientHeight-140);
    $('#div-tabdata').css('height',window.innerHeight-40);
    $('#tabhead th').each(function(idx){
        $(this).css('width',$('#tabdata tr th:eq('+idx+')').outerWidth());
    })
}
window.onresize=function(){changeWidth()}
</script>

<style scoped>
    .vue-meeting{
        font-size: 1rem !important;
        padding: 0;
        border-radius: 0;
        margin-top: 5px;
        padding: 0 10px;
    }
    .vue-meeting .nav2{
        justify-content:center; 
        margin-bottom: 1px;
    }
    .vue-meeting .nav2 li{
        width: 120px;
        height: 30px;
        margin-left:2px;
        line-height: 30px;
        color:#fff;
    }
    .vue-meeting table{margin: 0}
    #step1Li,#step2Li,#step3Li,#step4Li,
    #step1Li img,#step2Li img,#step3Li img,#step4Li img{
        padding: 0px;
        margin: 0px;
        height: 40px;
        line-height: 40px;
        float:left;
        color:#fff;
        cursor: pointer;
    }
    .step-blue{background-color: #0f9af2;}
    .step-gray{ background-color: #dfdfdf;}
    .vue-meeting .btn{font-size:1rem !important;}
    .vue-meeting #btn-booking{font-size:1.2rem !important;position: fixed;width:120px;margin:0 auto;left: 0;right: 0;bottom: 8px;z-index: 1;}
    .vue-meeting #btn-booking:hover{transform: scale(1.2);background-color: blue;}
    .vue-meeting .div-scroll{
        overflow: hidden;
        overflow-y: auto;
        height: 300px;
    }
    
</style>
