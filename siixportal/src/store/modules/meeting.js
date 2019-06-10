import pub from '../../api/pub'
const state={
    bookingdata:null,
    meetingInfo:null,
    tipsData:null
}

const setters = {

}

const getters = {
    bookingdata: state => {
        return state.bookingdata;
    }
}

const actions = {
    get_booking_data(context,cb){
        var data= 'userno='+context.getters.userinfo.emp_no;
        pub.booking_data_overview(data,(res) => {
            cb(res.data);
            context.commit('booking_data_overview',res);
        })
    },
    save_booking_data(context,data){
        pub.saveBookingData(data.data, data.cb)
    },
    get_my_booking(context,data){
        pub.getMyBooking(data.data, data.cb)
    },
    cancelBooking(context,data){
        pub.cancelBooking(data.data,data.cb)
    },
    get_attend_person(context,data){
        pub.get_attend_person(data.data,data.cb);
    }
}

const mutations = {
    booking_data_overview(state,res){
        state.bookingdata = res.data;
    }
}

export default {
    state,
    setters,
    getters,
    actions,
    mutations,
}