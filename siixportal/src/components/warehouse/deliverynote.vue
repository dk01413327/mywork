<template>
    <el-container>
        <el-header style="border-bottom:1px solid #eee">
            <el-button @click="showDialog" type="primary">新增送货单</el-button>
        </el-header>
        <br/>
        <el-table :data='deliveryData' header-row-class-name='main-header' >
            <el-table-column type="expand" >
                <template slot-scope="props">
                    <el-table border :data="props.row.detail" style="font-size:12px" header-row-class-name="detail-header">
                        <el-table-column type="index" fixed></el-table-column>
                        <el-table-column label="六位码" fixed >
                            <template slot-scope="part">                                
                                <el-dropdown style="font-size:12px" v-if="part.row.post_level==0">                                    
                                    <span class="el-dropdown-link">{{part.row.part_no}}</span>
                                    <el-dropdown-menu slot="dropdown" >
                                        <el-dropdown-item  @click.native="edit(part.$index, part.row)" 
                                            :disabled="getPermission.permission.substr(2,1)==0">
                                            修改
                                        </el-dropdown-item>
                                        <el-dropdown-item  divided @click.native="del(part.$index, part.row)" 
                                            :disabled="getPermission.permission.substr(3,1)==0">
                                            删除
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <span v-else>{{part.row.part_no}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="品名规格" prop="part_name"></el-table-column>
                        <el-table-column label="物料名称" prop="material_name"></el-table-column>
                        <el-table-column label="物料品名" prop="material_spec"></el-table-column>
                        <el-table-column label="使用车型" prop="car_type"></el-table-column>
                        <el-table-column label="客户名称" prop="cust_name"></el-table-column>
                        <el-table-column label="机种" prop="model_name"></el-table-column>
                        <el-table-column label="PO NO" prop="po_no"></el-table-column>
                        <el-table-column label="LOT NO" prop="lot_no"></el-table-column>
                        <el-table-column label="数量" prop="ship_qty"></el-table-column>
                        <el-table-column label="箱数" prop="carton_qty"></el-table-column>
                        <el-table-column label="装箱明细" prop="carton_detail"></el-table-column>
                        <el-table-column label="箱号" prop="carton_nos"></el-table-column>
                        <el-table-column label="库位" prop="ship_stock"></el-table-column>
                        <el-table-column label="备注" prop="remark"></el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="参考号" prop="apply_no"></el-table-column>
            <el-table-column label="客户名称" prop="cust_cname"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.post_level>0">已提交</span>
                </template>
            </el-table-column>
            <el-table-column label="制作人" prop="updated_user"></el-table-column>
            <el-table-column label="制作时间" prop="updated_time"></el-table-column>
            <el-table-column label="操作" min-width='150px' >
                <template slot-scope="delivery">
                    <el-button size="mini" type="primary" @click="add(delivery.$index, delivery.row)" 
                        :disabled="getPermission.permission.substr(2,1)==0" v-if="delivery.row.post_level==0">追加明细</el-button>
                    <el-button size="mini" type="danger" @click="submit(delivery.$index, delivery.row)" 
                        :disabled="getPermission.permission.substr(2,1)==0" v-if="delivery.row.post_level==0">提交审核</el-button>
                </template>
            </el-table-column>
            
        </el-table>
        <el-dialog :visible.sync="dialogVisible" title="新增送货单" top='2vh' :close-on-click-modal="dialogVisible==false">
            <el-form id="deliveryForm" :model="formData" :rules="rules" ref="deliveryForm" :inline-message='true' label-width="80px">
                <el-row v-if="opType == 'new'">
                    <el-col :span="12">
                        <el-form-item label="参考编号" prop="applyno" >
                            <el-input placeholder="请输入参考编号" class="input-with-select" v-model="formData.applyno" name="applyno">
                                <el-select v-model="applycode" slot="prepend" placeholder="请选择" style="width:90px" name="applycode">
                                    <el-option label="SED" value="SED"></el-option>
                                    <el-option label="SEDB" value="SEDB"></el-option>
                                    <el-option label="SEDN" value="SEDN"></el-option>
                                    <el-option label="SDC" value="SDC"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="custid">
                            <el-select v-model="formData.custid" placeholder="请选择客户" style="width:100%">
                                <el-option v-for="item in customers" :label="item.cust_cname" :value="item.id" :key="item.id">
                                    <span style="float:left">{{item.cust_cname}} {{item.cust_ename}}</span>
                                    <span style="float:right;color: #8492a6;">{{item.cust_code}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-else>
                    <el-col :span="12">
                        <el-form-item label="参考号" >
                            <el-input v-model="formData.applyno" name="applyno" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户名称" >
                            <el-input v-model="formData.custname" name="custid" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                    
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="六位码" prop="partno">
                            <el-input v-model="formData.partno" name="partno"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="品名规格" prop="partname">
                            <el-input v-model="formData.partname" name="partname"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="物料名称" prop="material">
                            <el-input v-model="formData.material" name="material"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="物料品名" prop="spec">
                            <el-input v-model="formData.spec" name="spec"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="使用车型" prop="carType">
                            <el-input v-model="formData.carType" name="cartype"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="机种" prop="modelName">
                            <el-input v-model="formData.modelName" name="modelname"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="PO NO" prop="pono" >
                            <el-input v-model="formData.pono" name="pono"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="LOT NO" prop="lotno">
                            <el-input v-model="formData.lotno" name="lotno"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="数量" prop="shipQty">
                            <el-input v-model.number="formData.shipQty" name="shipqty"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="箱数" prop="cartonQty" >
                            <el-input v-model.number="formData.cartonQty" name="cartonqty"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="装箱明细" prop="cartonDetail" >
                            <el-input v-model="formData.cartonDetail" name="cartondetail"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="箱号" prop="cartonNos">
                            <el-input v-model="formData.cartonNos" name="cartonnos"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="库位" prop="shipStock">
                            <el-input v-model="formData.shipStock" name="shipstock"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注" >
                            <el-input v-model="formData.remark" name="remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm" v-if="opType=='new'">重置</el-button>
                <el-button @click="resetForm" v-else>取消</el-button>
                <el-button type="primary" @click="saveData">保存</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        var numValidator=(rule,value,callback)=>{
            if(value <= 0){
                callback(new Error('请输入大于0的数字'))
            }
        };
        var partValidator=(rule,value,callback)=>{
            var _this = this;
            this.$store.dispatch('chkPart',{data:'con='+value,cb:res=>{
                if(res.errcode==0){
                    _this.formData.partid=res.data[0].part_id;
                    _this.formData.partno=res.data[0].part_no;
                    _this.formData.partname=res.data[0].part_name;
                }else{
                    callback(new Error(res.errmsg));
                }
            }})
        };
        var applynoValidator=(rule,value,callback)=>{
            if(this.opType != 'new') return;
            var _this = this;
            this.$store.dispatch('chkDeliveryNo',{data:'applyno='+_this.applycode+value,cb:res=>{
                if(res.errcode == 1){
                    callback(new Error(res.errmsg));
                }
            }})
        }
        return {
            menuRight:'',
            dialogVisible:false,
            opType:'new',
            deliveryData:[],
            customers:[],
            applycode:'SED',
            formData:{
                did:'',
                applyno:'',
                custid:'',
                custname:'',
                partid:'',
                partno:'',
                partname:'',
                material:'',
                spec:'',
                carType:'',
                modelName:'',
                pono:'',
                lotno:'',
                shipQty:0,
                cartonQty:0,
                cartonDetail:'',
                cartonNos:'',
                shipStock:'',
                remark:'',
            },
            rules:{
                applyno:[{required:true,message:'请输入参编号',trigger:'blur'},
                        ,{validator:applynoValidator,trigger:'blur'}],                
                custid:[{required:true,message:'请选择客户',trigger:'change'}],

                partno:[{required:true,message:'请输入料号',trigger:'blur'},
                        {validator:partValidator,trigger:'blur'}],
                partname:[{required:true,message:'请输入规格品名',trigger:'blur'},
                          {validator:partValidator,trigger:'blur'}],
                material:[{required:true,message:'请输入物料名称',trigger:'blur'}],
                spec:[{required:true,message:'请输入物料品名',trigger:'blur'}],
                carType:[{required:true,message:'请输入使用车型',trigger:'blur'}],
                modelName:[{required:true,message:'请输入机种',trigger:'blur'}],
                pono:[{required:true,message:'请输入PO NO',trigger:'blur'}],
                lotno:[{required:true,message:'请输入LOT NO',trigger:'blur'}],
                shipQty:[{required:true,message:'请输入出货数量',trigger:'blur'},
                         { type: 'number', message: '出货数量必须为数字值'},
                         { validator: numValidator, trigger: 'blur' }],
                cartonQty:[{required:true,message:'请输入箱数',trigger:'blur'},
                         { type: 'number', message: '箱数必须为数字值'},
                         { validator: numValidator, trigger: 'blur' }],
                cartonDetail:[{required:true,message:'请输入装箱明细',trigger:'blur'}],
                cartonNos:[{required:true,message:'请输入箱号',trigger:'blur'}],
                shipStock:[{required:true,message:'请输入库位',trigger:'blur'}],
            }
        }
    },
    computed:{
        ...mapGetters(['userinfo','getPermission'])
    },
    created(){
        this.menuRight = this.getPermission;
        this.getDeliveryData();
        this.getCustomer();
    },
    methods:{
        showDialog(){
            //$('#table').printArea();
            //window.print();
            this.opType = 'new';
            this.dialogVisible = true;      
        },
        resetForm(){
            if(this.opType == 'new'){
                this.$refs['deliveryForm'].resetFields();
            }else{
                this.dialogVisible = false;
            }            
        },
        getCustomer(){
            this.$store.dispatch('getCustomer',{data:'',cb:res=>{
                this.customers = res.data;
            }})
        },
        getDeliveryData(){
            var _this = this;
            this.$store.dispatch('getDeliveryData',{data:'',cb:res=>{
                _this.deliveryData = res.data;
            }})
        },
        add(index,item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            this.formData.applyno=item.apply_no;
            this.formData.custname=item.cust_cname;
            this.formData.custid = item.cust_id;

            this.formData.partid='';
            this.formData.partno='';
            this.formData.partname='';
            this.formData.material='';
            this.formData.spec='';
            this.formData.carType='';
            this.formData.modelName='';
            this.formData.pono='';
            this.formData.lotno='';
            this.formData.shipQty=0;
            this.formData.cartonQty=0;
            this.formData.cartonDetail='';
            this.formData.cartonNos='';
            this.formData.shipStock='';
            this.formData.remark='';
            this.formData.did = 0;
            this.dialogVisible = true;
            this.opType = 'add';
        },
        edit(index,item){
            //this.$refs['deliveryForm'].resetFields();
            this.formData.applyno=item.apply_no;
            this.formData.custid=item.cust_id;
            this.formData.custname=item.cust_cname;
            this.formData.partid=item.part_id;
            this.formData.partno=item.part_no;
            this.formData.partname=item.part_name;
            this.formData.material=item.material_name;
            this.formData.spec=item.material_spec;
            this.formData.carType=item.car_type;
            this.formData.modelName=item.model_name;
            this.formData.pono=item.po_no;
            this.formData.lotno=item.lot_no;
            this.formData.shipQty=item.ship_qty;
            this.formData.cartonQty=item.carton_qty;
            this.formData.cartonDetail=item.carton_detail;
            this.formData.cartonNos=item.carton_nos;
            this.formData.shipStock=item.ship_stock;
            this.formData.remark=item.remark;
            this.formData.did = item.id;
            this.dialogVisible = true;
            this.opType = 'edit';
        },
        del(index,item){
            this.$confirm('确认删除此单?','提示',{confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'}).then(()=>{
                this.$store.dispatch('delDeliveryData',{data:'applyno='+item.apply_no+'&did='+item.id,cb:res=>{
                    if(res.errcode == 0){
                        this.$message({message:'删除成功',type:'success'});
                        this.getDeliveryData()
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'});
                    }
                }})
            })
            
        },
        submit(index,item){
            if(item.post_level > 0){
                this.$alert('此单已提交','出错啦',{type:'error'});
                return false;
            }
            var _this = this;
            this.$confirm('提交后不能修改,确认提交码?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                var data = 'applyno='+item.apply_no+'&chkuser='+this.userinfo.emp_no+'&menuid='+this.menuRight.menuid+'&chktype=0&chklevel=0'
                this.$store.dispatch('approveRequest',{data:data,cb:res=>{
                    if(res.errcode==0){
                        this.$message({message:'提交成功',type:'success'});
                        this.getDeliveryData();
                    }else{
                        this.$alert(res.errmsg,'出错啦',{type:'error'})
                    }                    
                }});
            })
        },
        saveData(){
            var chkok = true;
            this.$refs['deliveryForm'].validate((valid)=>{   
                chkok = valid;
            })
            if(!chkok){return false;}
            var data =  $('#deliveryForm').serialize();
            var _this=this;
            data +='&partid='+this.formData.partid+'&opuser='+this.userinfo.emp_no
                  +'&applycode='+this.applycode+'&optype='+this.opType
                  +'&did='+this.formData.did+'&custid='+this.formData.custid;
            this.$store.dispatch('saveDeliveryData',{data:data,cb:res=>{
                if(res.errcode==0){
                    _this.$message({message:'保存成功',type:'success'});
                    this.dialogVisible = false;
                    this.getDeliveryData();
                }else{
                    this.$alert(res.errmsg,'出错啦',{type:'error'});
                }
            }})
        }
    }
    
}
</script>
<style>
  .el-form-item{
      margin-bottom: 5px;
  }
  .main-header th{
      background-color: #94caff !important;      
  }
  .detail-header th{
      background-color: #d7ebff !important;
      text-align: center;
  }
  .el-dropdown-link{
      color:#409EFF;
      cursor: pointer;
  }
</style>

