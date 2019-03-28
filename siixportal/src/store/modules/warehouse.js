import pub from '../../api/pub'
const state={}
const getters={}
const actions={
    chkPart(context,params){pub.chkPart(params.data,params.cb);},
    chkDeliveryNo(context,params){pub.chkDeliveryNo(params.data,params.cb);},
    saveDeliveryData(context,params){pub.saveDeliveryData(params.data,params.cb);},
    delDeliveryData(context,params){pub.delDeliveryData(params.data,params.cb);},    
    getDeliveryData(context,params){pub.getDeliveryData(params.data,params.cb);},
}
const mutations={}
export default{
    state,
    getters,
    actions,
    mutations
}