import pub from '../../api/pub'
const state={
}

const getters = {
}

const actions={
    getPartEngMapping(context,params){pub.getPartEngMapping(params.data,params.cb);},
    savePartEngMapping(context,params){pub.savePartEngMapping(params.data,params.cb);},
    delPartEngMapping(context,params){pub.delPartEngMapping(params.data,params.cb);},
    getProductive(context,params){pub.getProductive(params.data,params.cb);},
    saveProductive(context,params){pub.saveProductive(params.data,params.cb);},
    getDeliveryPlan(context,params){pub.getDeliveryPlan(params.data,params.cb);},
    getManReport(context,params){pub.getManReport(params.cb);},
    getManRptDetail(context,params){pub.getManRptDetail(params.data,params.cb);},

    saveRecruitData(context,params){pub.saveRecruitData(params.data,params.cb)},
    getRecruitData(context,params){pub.getRecruitData(params.data,params.cb)},
    delRecruitData(context,params){pub.delRecruitData(params.data,params.cb)},
}

const mutations={

}

export default{
    state,
    getters,
    actions,
    mutations
}