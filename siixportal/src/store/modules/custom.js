import pub from '../../api/pub'
const state={
    
}

const getters = {
}

const actions={
    getBando(context,params){pub.getBando(params.data,params.cb);},
    saveBandoBom(context,params){pub.saveBandoBom(params.data,params.cb);},
    delBandoBom(context,params){pub.delBandoBom(params.data,params.cb);},
}

const mutations={
    
}

export default{
    state,
    getters,
    actions,
    mutations
}