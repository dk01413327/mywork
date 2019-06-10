<template>
    <el-row>
        <el-input placeholder="请输入钢网编号" style="width:200px" v-model="formCondition.stencilno">
            <el-button slot="append" icon="el-icon-search" @click="getData()"></el-button>
        </el-input>
        <el-button type="primary" style="margin-left:10px" @click="qryDialogVisible = true">更多条件</el-button>
        <el-button type="success" @click="exportData">导出</el-button> 
        <el-button-group style="float: right">
            <el-button type="primary" @click="addStencil" v-if="menuRight.substr(4,1)==1">登记</el-button>
            <el-button type="primary" @click="dropdownClick(1,'领用')" v-if="menuRight.substr(1,1)==1">领用</el-button>
            <el-button type="primary" @click="dropdownClick(2,'归还')" v-if="menuRight.substr(1,1)==1">归还</el-button>
        </el-button-group>
        <div class="spliter"></div>
        <el-table :data="stencilData">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-form class="expand-form"><el-row v-if="scope.row.a_value>0">
                        <el-col :span="4"><el-form-item label="左上张力"><span>{{scope.row.a_value}}</span></el-form-item></el-col>
                        <el-col :span="4"><el-form-item label="右上张力"><span>{{scope.row.b_value}}</span></el-form-item></el-col>
                        <el-col :span="4"><el-form-item label="中间张力"><span>{{scope.row.c_value}}</span></el-form-item></el-col>
                        <el-col :span="4"><el-form-item label="右下张力"><span>{{scope.row.d_value}}</span></el-form-item></el-col>
                        <el-col :span="4"><el-form-item label="左下张力"><span>{{scope.row.e_value}}</span></el-form-item></el-col>
                        <el-col :span="4"><el-form-item label="张力极差"><span>{{scope.row.range_diff}}</span></el-form-item></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8"><el-form-item label="基板编号"><span>{{scope.row.pcb_code}}</span></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="制作编号"><span>{{scope.row.maker_no}}</span></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="制作日期"><span>{{scope.row.create_date}}</span></el-form-item></el-col>           
                    </el-row>
                    <el-row>
                        <el-col :span="8"><el-form-item label="修改日期"><span>{{scope.row.updated_time}}</span></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="更新人"><span>{{scope.row.emp_name}}</span></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="备注"><span>{{scope.row.remark}}</span></el-form-item></el-col>
                    </el-row>
                    
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="钢网编号" >
                <template slot-scope="scope">
                    <el-dropdown trigger="click" >
                        <span class="dropdown-link">{{scope.row.stencil_no}}</span>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <el-dropdown-item @click.native="dropdownClick(1,'领用',scope.row)" v-if="scope.row.status == 0">领用</el-dropdown-item>
                            <el-dropdown-item @click.native="dropdownClick(2,'归还',scope.row)" v-if="scope.row.status == 2">归还</el-dropdown-item> -->
                            <el-dropdown-item @click.native="dropdownClick(3,'报废',scope.row)" v-if="scope.row.status == 0 && menuRight.substr(4,1)==1">报废</el-dropdown-item>
                            <el-dropdown-item @click.native="dropdownClick(4,'升级',scope.row)" v-if="scope.row.status == 3 && menuRight.substr(4,1)==1">升级</el-dropdown-item>
                            <el-dropdown-item @click.native="dropdownClick(5,'修改',scope.row)" v-if="(scope.row.status == 0 || scope.row.status == 1) && menuRight.substr(4,1)==1">修改</el-dropdown-item>
                            <el-dropdown-item @click.native="dropdownClick(6,'报废处理',scope.row)" v-if="scope.row.status == 3 && menuRight.substr(4,1)==1">报废处理</el-dropdown-item>
                            <el-dropdown-item @click.native="getStencilTravel(scope.row)" divided>履历</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
            <el-table-column label="版本" prop="ver_no"></el-table-column>
            <el-table-column label="位置" prop="location"></el-table-column>
            <el-table-column label="状态" min-width="90">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==0" type="success">可用</el-tag>
                    <el-tag v-if="scope.row.status==1" type="warning">不可用</el-tag>
                    <el-tag v-if="scope.row.status==2">已领用</el-tag>
                    <el-tag v-if="scope.row.status==3">已报废</el-tag>
                    <el-tag v-if="scope.row.status==4" type="danger">已处理</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="型号" min-width="150">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="right">
                        <span>{{ scope.row.models}}</span>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" v-if="scope.row.models">{{ scope.row.models.substr(0,15) }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="钢网厚度" prop="thickness"></el-table-column>
            <el-table-column label="客户别" prop="customer"></el-table-column>
            <el-table-column label="连板数" prop="pcb_qty"></el-table-column>
            <el-table-column label="最大次数" prop="max_count" ></el-table-column>
            <el-table-column label="使用次数" prop="use_count"></el-table-column>
            <el-table-column label="剩余次数" prop="remain_cnt" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.remain_cnt<10000" type="danger">{{scope.row.remain_cnt}}</el-tag>
                    <el-tag v-else>{{scope.row.remain_cnt}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <paging class="paging" 
            :page-index="formCondition.currentPage" :total="dataCount" :page-size="formCondition.pageSize" @change="pageChange"></paging>
        <el-dialog :visible.sync="dialogVisible" :title="curOp.name" top="5vh" :close-on-click-modal="false" width="70%">
            <el-form  :model="formData" :rules="rules" ref="stencilForm" :inline-message='true' label-width="110px">
                <el-row v-if="curOp.id == 1 || curOp.id == 2">
                    <el-col :span="8">
                    <el-form-item label="钢网编号">
                        <el-input class="req-no" v-model="reqno" placeholder="请扫描钢网编号" :disabled="curOp.id>2" maxlength="6"
                                @keyup.enter.native="queryStencilByno"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                    <el-form-item label="版本">
                        <el-input class="req-ver" v-model="reqver" placeholder="请扫描钢网版本" :disabled="curOp.id>2" maxlength="6"
                                @keyup.enter.native="queryStencilByno"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="位置" prop="location">
                            <el-input v-model="formData.location" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5" maxlength="6"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-else>
                    <el-col :span="8">
                        <el-form-item label="钢网编号" prop="stencil_no">
                            <el-input v-model="formData.stencil_no" :placeholder="maxNo" :disabled="curOp.id!=0" maxlength="6"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="版本" prop="ver_no">
                            <el-input v-model="formData.ver_no" :disabled="curOp.id!=0 && curOp.id!=4 "></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="位置" prop="location">
                            <el-input v-model="formData.location" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5" maxlength="6"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >                    
                    <el-col :span="8">
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="formData.status" style="width:100%" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5">
                                <el-option v-for="item in statuses" :label="item.name" :value="item.id" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="钢网厚度" prop="thickness">
                            <el-input v-model="formData.thickness" @blur="handleInputThick" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="基板编号" prop="pcb_no">
                            <el-input  v-model="formData.pcb_no" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row >
                    <el-col :span="8">
                        <el-form-item label="厂商制作编号" prop="maker_no">
                            <el-input v-model="formData.maker_no" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="制作日期" prop="create_date">
                            <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="formData.create_date" style="width:100%" 
                                :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-date-picker>
                        </el-form-item>
                    </el-col>
                     <el-col :span="8">
                        <el-form-item label="客户别" prop="customer">
                            <el-input  v-model="formData.customer" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="8">
                        <el-form-item label="连板数" prop="pcb_qty">
                            <el-input type="number" v-model="formData.pcb_qty" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="最大次数" prop="max_count">
                            <el-input type="number" v-model="formData.max_count" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用次数" >
                            <el-input type="number" v-model="formData.use_count" :disabled="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                   
                    <el-col :span="12" v-if="stencilPics.length>0">
                        <el-form-item label="钢网图片" >                            
                            <span class="dropdown-link" @click="showImage(true)">点击查看</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row v-if="formData.models.length>0 || curOp.id==0"><el-col>
                    <el-form-item label="使用型号" >
                        <el-tag v-for="model in formData.models" :key="model" closable @close="handleClose(model)">{{model}}</el-tag>
                        <el-input v-if="curOp.id == 0 || curOp.id == 5" class="input-model" placeholder="请输入型号" 
                            v-model="inputModel" @keyup.enter.native="handleInputConfirm" 
                            @blur="handleInputConfirm" :readonly="curOp.id!=0 && curOp.id!=4 && curOp.id!=5"></el-input>
                    </el-form-item>                    
                </el-col></el-row>
                <el-row><el-col :span="24" v-if="curOp.id == 0 || curOp.id == 5">
                    <el-form-item label="钢网图片" >
                        <el-upload :file-list="fileList" :auto-upload="false" action="" :limit="3" :on-exceed="picExceed" :on-change="checkFile" >
                            <el-row><el-col :span="4"><el-button type="success">选择文件</el-button></el-col>
                            <el-col :span="9"></el-col></el-row>
                        </el-upload>
                    </el-form-item>
                </el-col></el-row>
                
                <el-row>
                    <el-col v-if="curOp.id == 3">
                        <el-form-item label="报废原因">
                            <el-input v-model="formData.reason" placeholder="报废原因"></el-input>
                        </el-form-item>
                    </el-col>                    
                </el-row>
                <el-row v-if="curOp.id == 3 || curOp.id==6">
                    <el-col :span="12">
                        <el-form-item label="申请人">
                            <el-input v-model="formData.applyer" placeholder="申请人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="确认人">
                            <el-input v-model="formData.confirmer" placeholder="确认人"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="curOp.id==1 || curOp.id == 2">
                    <el-col v-if="curOp.id == 1" :span="8">
                        <el-form-item label="使用拉别">
                            <el-input v-model="formData.line" placeholder="使用拉别"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="curOp.id == 2" :span="8">
                        <el-form-item label="生产数量">
                            <el-input v-model="formData.pro_qty" placeholder="生产数量" @change="calcUseCount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请人" >
                            <el-input v-model="formData.applyer" placeholder="申请人"></el-input>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="确认人">
                            <el-input v-model="formData.confirmer" placeholder="确认人"></el-input>
                        </el-form-item>
                    </el-col>                    
                </el-row>
                <el-row v-if="curOp.id == 1 || curOp.id == 2 || curOp.id == 3"><el-col>
                    <el-form-item label="钢网张力">
                        <el-row :gutter="5">
                            <el-col :span="4"><el-input class="tension" v-model="formData.avalue" type="number" width="20%" placeholder="左上角" @change="handleInputValue(0)"></el-input></el-col>
                            <el-col :span="4"><el-input class="tension" v-model="formData.bvalue" type="number" width="20%" placeholder="右上角" @change="handleInputValue(1)"></el-input></el-col>
                            <el-col :span="4"><el-input class="tension" v-model="formData.cvalue" type="number" width="20%" placeholder="中间" @change="handleInputValue(2)"></el-input></el-col>
                            <el-col :span="4"><el-input class="tension" v-model="formData.dvalue" type="number" width="20%" placeholder="右下角" @change="handleInputValue(3)"></el-input></el-col>
                            <el-col :span="4"><el-input class="tension" v-model="formData.evalue" type="number" width="20%" placeholder="左下角" @change="handleInputValue(4)"></el-input></el-col>
                            <el-col :span='3'><el-input class="tension" v-model="formData.range" readonly placeholder="极差"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col></el-row>
                <el-row><el-col>
                    <el-form-item label="备注" prop="remark">
                        <el-input  v-model="formData.remark"></el-input>
                    </el-form-item>
                </el-col></el-row>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="saveData">保存</el-button>
                <el-button type="success" @click="resetForm('stencilForm')" v-if="curOp.id==1 || curOp.id==2">重置</el-button>
                <el-button type="danger" @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="travelDialogVisible" title="钢网履历" top="5vh" width="90%">
            <el-table :data="stencilTravel">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form class="expand-form"><el-row v-if="scope.row.a_value>0">
                            <el-col :span="4"><el-form-item label="左上张力"><span>{{scope.row.a_value}}</span></el-form-item></el-col>
                            <el-col :span="4"><el-form-item label="右上张力"><span>{{scope.row.b_value}}</span></el-form-item></el-col>
                            <el-col :span="4"><el-form-item label="中间张力"><span>{{scope.row.c_value}}</span></el-form-item></el-col>
                            <el-col :span="4"><el-form-item label="右下张力"><span>{{scope.row.d_value}}</span></el-form-item></el-col>
                            <el-col :span="4"><el-form-item label="左下张力"><span>{{scope.row.e_value}}</span></el-form-item></el-col>
                            <el-col :span="4"><el-form-item label="张力极差"><span>{{scope.row.range_diff}}</span></el-form-item></el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4"><el-form-item label="拉别"><span>{{scope.row.line_name}}</span></el-form-item></el-col>
                            <el-col :span="4"><el-form-item label="申请人"><span>{{scope.row.apply_emp}}</span></el-form-item></el-col>
                            <el-col :span="4"><el-form-item label="确认人"><span>{{scope.row.confirm_emp}}</span></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="报废原因"><span>{{scope.row.scrap_reason}}</span></el-form-item></el-col>
                            <el-col :span="6"><el-form-item label="备注"><span>{{scope.row.remark}}</span></el-form-item></el-col>                            
                        </el-row>
                        
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="钢网编号" prop="stencil_no"></el-table-column>
                <el-table-column label="版本" prop="ver_no"></el-table-column>
                <el-table-column label="位置" prop="location"></el-table-column>
                <el-table-column label="状态" min-width="90">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==0">可用</el-tag>
                        <el-tag v-if="scope.row.status==1">不可用</el-tag>
                        <el-tag v-if="scope.row.status==2">已领用</el-tag>
                        <el-tag v-if="scope.row.status==3">已报废</el-tag>
                        <el-tag v-if="scope.row.status==4">已处理</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作类别" min-width="110">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.op_type}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="钢网厚度" prop="thickness"></el-table-column>
                <el-table-column label="客户别" prop="customer"></el-table-column>
                <el-table-column label="连板数" prop="pcb_qty"></el-table-column>
                <el-table-column label="使用次数" prop="use_count"></el-table-column>
                <el-table-column label="操作人" prop="emp_name"></el-table-column>
                <el-table-column label="操作日期" prop="updated_time" min-width="150"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="请输入查询条件" :visible.sync="qryDialogVisible">
            <el-form :data="formCondition" inline-message label-width="75px">    
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="钢网编号">
                            <el-input v-model="formCondition.stencilno"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用型号">
                            <el-input v-model="formCondition.model"></el-input>
                        </el-form-item>
                    </el-col> 
                    <el-col :span="8">
                        <el-form-item label="存放位置">
                            <el-input v-model="formCondition.location"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="状态">                        
                            <el-select v-model="formCondition.status">
                                <el-option label="All" :value="-1"></el-option>
                                <el-option v-for="item in statuses" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户别">
                            <el-input v-model="formCondition.customer"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="基板编号">
                            <el-input v-model="formCondition.pcbno"></el-input>
                        </el-form-item>
                    </el-col>
                    
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="制作编号">
                            <el-input v-model="formCondition.makerno"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form> 
            <span slot="footer">
                <el-button type="primary" style="margin-left:10px" @click="getData(1)">查询</el-button>
            </span>
        </el-dialog>
        <imageshower title="钢网写真" :file-list="stencilPics" :dialog-visible="picDialogVisible" @visibleChange="showImage"></imageshower>
    </el-row>
</template>
<script>
import {Getters, mapGetters} from 'vuex'
export default {
    data(){
        var checkStencil = (rule,value,callback)=>{
            if(value.length != 6){
                return callback(new Error('请输入六位字符'));
            }
        }
        var checkNumber = (rule,value,callback)=>{
            if(parseInt(value)<=0){
                return callback(new Error('请输入大于0的整数'));
            }
        }
        return{
            menuRight: '',
            dataCount:0,
            stencilData: null,
            stencilTravel:null,
            dialogVisible: false,
            picDialogVisible: false,
            travelDialogVisible:false,
            qryDialogVisible : false,
            stencilPics:[],
            fileList: [],
            statuses: [{id:'0',name:'可用'},{id:'1',name:'不可用'},{id:'2',name:'已领用'},{id:'3',name:'已报废'},{id:'4',name:'已处理'}],
            curOp:{id: 0, name: '钢网登记'},
            maxNo:'',
            reqno:'',
            reqver:'',
            formData:{
                optype: '',
                stencil_no: '',
                ver_no: '',
                location: '',
                status: '0',
                thickness: '',
                pcb_no: '',
                maker_no: '',
                create_date: '',
                pcb_qty: '',
                org_use_count: 0,
                max_count: '',
                use_count: '',
                customer: '',
                remark: '',
                models: [],
                pics: [],
                opuser: '',
                files: '',

                line: '',
                reason: '',
                applyer: '',
                confirmer: '',
                reason: '',
                avalue: '',
                bvalue: '',
                cvalue: '',
                dvalue:  '',
                evalue:'',
                range: 0,
                pro_qty:'',
            },
            formCondition:{
                stencilno:'',
                model:'',
                location:'',
                status:-1,
                customer:'',
                pcbno:'',
                makerno:'',
                pageSize:10,
                currentPage:1,
            },
            inputModel: '',
            rules: {
                stencil_no:[{required:true,message:'请输入钢网编号',trigger:'blur'}, { validator: checkStencil, trigger: 'blur' }],
                ver_no:{required:true,message:'请输入钢网版本',trigger:'blur'},
                location:{required:true,message:'请输入钢网存放位置',trigger:'blur'},
                status:{ required: true, message: '请选择钢网状态', trigger: 'blur' },
                thickness:{ required: true, message: '请输入钢网厚度', trigger: 'blur' },
                pcb_no:{ required: true, message: '请输入基板编号', trigger: 'blur' },
                maker_no:{ required: true, message: '请输入厂商制作编号', trigger: 'blur' },
                create_date:{ required: true, message: '请输入钢网制作日期', trigger: 'blur' },
                pcb_qty:[{ required: true, message: '请输入连接板数', trigger: 'blur' },{validator:checkNumber,trigger:'blur'}],
                use_count:{ required: true, message: '请输入使用次数', trigger: 'blur' },
                customer:{ required: true, message: '请选输入客户别', trigger: 'blur' },
                max_count:[{required:true,message:'请输入最大使用次数',trigger:'blur'},{validator:checkNumber,trigger:'blur'}]
            }
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPermission','imageUrl','downloadUrl'])
    },
    created(){
        this.formData.opuser = this.userinfo.emp_no;
        this.menuRight = this.getPermission.permission;
        this.getData();
    },
    
    methods:{
        pageChange(page){
            this.formCondition.currentPage = page
            this.getData()
        },
        addStencil(){
            this.curOp = {id: 0, name: '钢网登记'};
            this.formData.optype = '登记';
            this.$store.dispatch('getStencilMaxno',{data:'',cb:res=>{
                if(res.errcode == 0){
                    this.maxNo = res.errmsg;
                    this.setFormData();
                }
            }})          
                        
        },
        showImage(flag){
            if(this.stencilPics.length == 0){
                this.$alert('此钢网还未上传图片',this.errTitle,{type:'error'});
                return false;
            }
            this.picDialogVisible = flag;
        },
        handleClose(model){
            if(this.curOp.id != 0 && this.curOp.id != 5){
                return;
            }
            this.formData.models.splice(this.formData.models.indexOf(model), 1);
        },
        handleInputConfirm(){
            let inputModel = this.inputModel;
            if (this.formData.models.indexOf(inputModel) > -1) {
                this.$alert('型号重复','出错啦',{type:'error'});
                this.inputModel = '';
                return;
            }
            if (inputModel) {
                this.formData.models.push(inputModel);
            }
            this.inputModel = '';
        },
        handleInputValue(idx){
            let value = 0
            switch(idx){
                case 0 : value = parseInt(this.formData.avalue);  break;
                case 1 : value = parseInt(this.formData.bvalue);  break;
                case 2 : value = parseInt(this.formData.cvalue);  break;
                case 3 : value = parseInt(this.formData.dvalue);  break;
                case 4 : value = parseInt(this.formData.evalue);  break;
            }            
            if(value < 35){
                $(".tension:eq("+idx+") input").css('background','red')
            }else{
                $(".tension:eq("+idx+") input").css('background','white')
            }
            let maxValue = parseInt(this.formData.avalue);
            let minValue = maxValue;
            if(minValue > parseInt(this.formData.bvalue) ){
                minValue = parseInt(this.formData.bvalue);
            }
            if(maxValue < parseInt(this.formData.bvalue)){
                maxValue = parseInt(this.formData.bvalue);
            }
            if(minValue > parseInt(this.formData.cvalue) ){
                minValue = parseInt(this.formData.cvalue);
            }
            if(maxValue < parseInt(this.formData.cvalue)){
                maxValue = parseInt(this.formData.cvalue);
            }
            if(minValue > parseInt(this.formData.dvalue) ){
                minValue = parseInt(this.formData.dvalue);
            }
            if(maxValue < parseInt(this.formData.dvalue) ){
                maxValue = parseInt(this.formData.dvalue);
            }
            if(minValue > parseInt(this.formData.evalue)){
                minValue = parseInt(this.formData.evalue);
            }
            if(maxValue < parseInt(this.formData.evalue)){
                maxValue = parseInt(this.formData.evalue);
            }
            this.formData.range = maxValue - minValue;
            if(this.formData.range > 5){
                $(".tension:eq(5) input").css('background','red')
            }else{
                $(".tension:eq(5) input").css('background','white')
            }
        },
        handleInputThick(){
            var val = this.formData.thickness.substr(0,4);
            var count = this.formData.max_count;
            if(val == '0.08'){
                count = 100000;
            }else if(val == '0.10'){
                count = 120000;
            }else if(val == '0.12'){
                count = 140000;
            }else if(val == '0.13'){
                count = 160000;
            }else if(val == '0.15'){
                count = 200000;
            }else if(val == '0.18'){
                count = 240000;
            }else if(val == '0.20'){
                count = 280000;
            }else if(val == '0.25'){
                count = 300000;
            }else if(val == '0.30'){
                count = 350000;
            }
            this.formData.max_count = count;
        },
        calcUseCount(){
            if(this.formData.pro_qty && this.formData.pcb_qty>0){
                this.formData.use_count =  this.formData.org_use_count + Math.round(this.formData.pro_qty/this.formData.pcb_qty);
            }
        },
        setFormData(item){
            if(this.$refs['stencilForm'])
                this.$refs['stencilForm'].clearValidate();
            this.formData.rid = item ? item.id : 0;
            this.formData.stencil_no = item ? item.stencil_no : '';
            this.formData.ver_no = item ? item.ver_no : '';
            this.formData.location = item ? item.location : '';
            if(this.curOp.id==4){
                this.formData.status = '0';
            }else{
                this.formData.status = item ? item.status : '0';
            }
            
            this.formData.thickness = item ?  item.thickness : '';
            this.formData.pcb_no = item ?  item.pcb_code : '';
            this.formData.maker_no = item ?  item.maker_no : '';
            this.formData.create_date = item ?  item.create_date : '';
            this.formData.pcb_qty = item ?  item.pcb_qty : '';
            this.formData.max_count = item ?  item.max_count : '';
            this.formData.use_count = item ?  item.use_count : 0;
            this.formData.customer = item ?  item.customer : '';
            this.formData.org_use_count = item ?  item.use_count : 0;
            if(this.curOp.id == 5){
                this.formData.remark = item ?  item.remark : '';
            }else{
                this.formData.remark = '';
            }
            
            this.formData.files = [];
            this.fileList = [];
            this.stencilPics = [];

            this.formData.line='';
            this.formData.applyer='';
            this.formData.confirmer='';
            this.formData.reason='';
            this.formData.avalue='';
            this.formData.bvalue='';
            this.formData.cvalue='';
            this.formData.dvalue='';
            this.formData.evalue='';
            this.formData.range='';
            this.formData.pro_qty = '';
            if(item){
                if(item.models){
                    this.formData.models = item.models.split(';');
                }
                if(item.pics){
                    this.stencilPics = item.pics.split(';');
                    for(var i=0;i<this.stencilPics.length;i++){
                        this.stencilPics[i] = this.imageUrl + this.stencilPics[i];
                    }
                }
            }else{
                this.formData.models = [];
            }
            $(".tension input").css('background','white')
            this.dialogVisible = true;
        },
        dropdownClick(cmd,name,item){
            this.maxNo = '';
            this.curOp = {id:cmd,name:name};
            this.formData.optype = name;
            this.setFormData(item);
        },
        checkFile(file,list){
            var cnt = 0;
            for(var i=0; i < list.length; i++){
                var fileinfo = list[i].raw;
                if(!(fileinfo.type === 'image/png' || fileinfo.type === 'image/gif' 
                    || fileinfo.type === 'image/jpg' || fileinfo.type === 'image/jpeg')){
                        list.splice(i,1);
                        this.$alert('请上传图片文件',this.errTitle,{type:'error'});
                        return false;
                }else{
                    if(file.name == list[i].name){
                        cnt++;
                        if (cnt>1){
                            list.splice(i,1);
                            this.$alert('文件重复',this.errTitle,{type:'error'});
                            return false;
                        }
                        if (file.size /1024 /1024 > 2){
                            list.splice(i,1);
                            this.$alert('文件太大，请上传小于2M图片文件','出错啦',{type:'error'});
                            return false;
                        }           
                    }
                }                
            }
            this.fileList = list;
        },
        picExceed(){
            this.$alert('图片超过三张',this.errTitle,{type:'error'});
        },
        getData(){
            var data = this.formCondition;
            this.$store.dispatch('getStencilData',{data:data,cb:res=>{
                if(res.errcode == 0){
                    this.stencilData = res.data;
                    this.dataCount = res.count;
                    this.qryDialogVisible = false;
                }else{
                    this.$alert(res.errmsg,this.errTitle,{type:'error'});
                }
            }})
        },
        getStencilTravel(item){
            this.$store.dispatch('getStencilTravel',{data:'no='+item.stencil_no+'&ver='+item.ver_no,cb:res=>{
                if(res.errcode == 0){
                    this.stencilTravel = res.data;
                    this.travelDialogVisible = true;
                }
            }})
        },
        saveDataEx(file){
            if(file){
                this.formData.files = file.files;
            }
            if(!this.formData.use_count){
                this.formData.use_count = 0;
            }
            if(!this.formData.avalue){
                this.formData.avalue = 0;
                this.formData.bvalue = 0;
                this.formData.cvalue = 0;
                this.formData.dvalue = 0;
                this.formData.evalue = 0;
                this.formData.range = 0;
            }
            this.$store.dispatch('saveStencilData',{data:this.formData,cb:res=>{
                if(res.errcode==0){
                    this.$message({message:res.errmsg,type:'success'});
                    this.dialogVisible = false;
                    this.getData();
                }else{
                    this.$alert(res.errmsg,this.errTitle,{type:'error'});
                }
            }})
        },
        saveData(){
            var chkok = true;
            this.$refs['stencilForm'].validate((valid)=>{   
                chkok = valid;
            })
            if(chkok){
                chkok = this.checkSaveData();
            }
            if(!chkok){return false;}

            if(this.fileList.length==0) {
                this.saveDataEx();
                return false;
            }
            var fd = new FormData();
            for(var i=0; i < this.fileList.length;i++){
                fd.append('myfile'+i,this.fileList[i].raw)
            }
            fd.append('uptype','99');
            fd.append('fun','stencil');
            fd.append('reqno',this.formData.stencil_no);
            fd.append('empno',this.userinfo.emp_no);
            this.$store.dispatch('uploadfile',{data:fd,cb:res=>{
                var jsonObj = JSON.parse(res);
                if(jsonObj.errcode == 1){
                    this.$alert(jsonObj.errmsg,this.errTitle,{type:'error'});
                }else{
                    this.saveDataEx(jsonObj);
                }
            }})
        },
        checkSaveData(){
            if(this.curOp.id==1){
                if(this.formData.line.length == 0){
                    this.$alert('请输入领用拉别',this.errTitle,{type:'error'});
                    return false;
                }
            }else if(this.curOp.id == 3){
                if(this.formData.reason.length == 0){
                    this.$alert('请输入报废原因',this.errTitle,{type:'error'});
                    return false;
                }
            }
            if(this.curOp.id == 1 || this.curOp.id == 2 || this.curOp.id == 3){
                if(this.formData.avalue==0 || this.formData.bvalue==0 || this.formData.cvalue==0 || this.formData.dvalue==0 || this.formData.evalue==0){
                    this.$alert('请输入各位置张力',this.errTitle,{type:'error'});
                    return false;
                } else if(this.formData.applyer.length == 0 || this.formData.confirmer.length == 0){
                    this.$alert('请输入申请人或确认人',this.errTitle,{type:'error'});
                    return false;
                }
            }
            if(this.curOp.id == 2){
                if(this.formData.pro_qty == 0){
                    this.$alert('请输入生产数量',this.errTitle,{type:'error'});
                    return false;
                }
            }
            if(this.formData.models.length == 0){
                this.$alert('请输入钢网型号',this.errTitle,{type:'error'});
                    return false;
            }
            return true;
        },
        exportData(){
            var url = this.downloadUrl+'/index/smt/download_stencil_data';
            var method='get';
            //window.location.href = this.downloadUrl+'/index/smt/download_stencil_data';
            //var a = document.createElement("a");
            //a.href = window.URL.createObjectURL(this.downloadUrl+'/index/smt/download_stencil_data');
            //a.click();
            jQuery('<form action="'+url+'" method="'+(method||'post')+'">' +  // action请求路径及推送方法
                '<input type="text" name="stencilno" value="'+this.formCondition.stencilno+'"/>' + 
                '<input type="text" name="model" value="'+this.formCondition.model+'"/>' +
                '<input type="text" name="location" value="'+this.formCondition.location+'"/>' +
                '<input type="text" name="status" value="'+this.formCondition.status+'"/>' +
                '<input type="text" name="customer" value="'+this.formCondition.customer+'"/>' +
                '<input type="text" name="pcbno" value="'+this.formCondition.pcbno+'"/>' +
                '<input type="text" name="makerno" value="'+this.formCondition.makerno+'"/>' +
                '<input type="text" name="pageSize" value="'+this.formCondition.pageSize+'"/>' +
                '<input type="text" name="currentPage" value="'+this.formCondition.currentPage+'"/>' +
            '</form>')
            .appendTo('body').submit().remove();
        },
        queryStencilByno(){
            if(this.reqno.length == 0 || this.reqver.length == 0){                
                if(this.reqver.length==0){
                    $('.req-ver input').focus();
                    return false;
                } 
                this.$alert('请输入钢网编号或版本',this.errTitle,{type:'error'});
                return false;
            }
            this.setFormData();
            if(this.reqno.length > 0 && this.reqver.length > 0){
                this.$store.dispatch('getStencilByno',{data:'no='+this.reqno+'&ver='+this.reqver,cb:res=>{
                    if(res.errcode == 1){
                        this.$alert(res.errmsg,this.errTitle,{type:'error'});
                        return false;
                    }else                       
                        if(res.data.length == 0){
                            this.$alert('查无此钢网',this.errTitle,{type:'error'});
                            return false;
                        }
                        var data = res.data[0];
                        if(this.curOp.id == 1){
                            if(data.status != 0){
                                this.$alert('此钢网不可领用',this.errTitle,{type:'error'});
                                return false;
                            } 
                        }
                        if(this.curOp.id == 2){
                            if(data.status != 2){
                                this.$alert('此钢网不可归还',this.errTitle,{type:'error'});
                                return false;
                            } 
                        }
                        this.setFormData(res.data[0]);
                        $('.req-no input').attr('disabled','true');
                        $('.req-ver input').attr('disabled','true');
                    }
                })
            }
        },
        resetForm(name){
            this.$refs[name].resetFields();
            this.reqno = '';
            this.reqver = '';
            this.formData.models = '';
            $('.req-no input').removeAttr('disabled');
            $('.req-ver input').removeAttr('disabled');

        }
    }
}
</script>

<style>
    .input-model{
        width: 150px;
        margin-bottom: 5px;
    }
    .el-tag{
        margin-right: 10px;
        font-size: 14px;
    }
    .dropdown-link{
        cursor: pointer;
        color: #409EFF;
    }
    .expand-form{
        background:#e4e7ed;
    }
   .expand-form label{
        width: 90px;
        color: #99a9bf !important;
    }
</style>
