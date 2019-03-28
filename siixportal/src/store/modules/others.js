import pub from '../../api/pub'

const state={}
const getters={}
const actions={
    getLocations(context,params){
        pub.getLocations(params.cb);
    },
    getWFRequestData(context,params){pub.getWFRequestData(params.data,params.cb)},
    saveWfRequestData(context,params){pub.saveWfRequestData(params.data,params.cb)},
    delWFRequestData(context,params){pub.delWFRequestData(params.data,params.cb)},
    closeWfRequest(context,params){pub.closeWfRequest(params.data,params.cb)},
}
const mutations={}

export default{
    state,
    getters,
    actions,
    mutations
}