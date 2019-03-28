const common={

    /** 
     * 设置select控件选中 
     * @param selectId select的id值 
     * @param checkValue 选中option的值 
    */  
   set_select_checked(selectId, checkValue){  
        var select = document.getElementById(selectId);  
        for (var i = 0; i < select.options.length; i++){        
            if (select.options[i].value == checkValue || select.options[i].text==checkValue){             
                select.options[i].selected = true;  
                break;  
            }  
        }  
    },
    /**
     * 获取当前日期时间
     * @param {*} format 
     * 
     */
    get_curr_date(format){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth()+1;
        var date = myDate.getDate();
        if (month < 10)
            month =  '0' + month ; 
        if (date < 10)
            date =  '0' + date ; 
        var sDate = year  + '-' + month  + '-' + date ;
        var sTime = addZero(myDate.getHours()) + ':' + addZero(myDate.getMinutes()) + ':' + addZero(myDate.getSeconds());
        if(format == 'yyyy-mm-dd')
        return sDate
        else if(format == 'hh:mm:ss')
        return sTime
        else
        return sDate + ' ' + sTime;
    },

    addZero(value){
        if(value<10)
        return '0'+value;
        else
        return value;
    },

    /**
     * 判断是否为IE浏览器
     */
    isIEBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        return isIE || isIE11;
    },

    //全屏
    fullScreen(elt){
        var full=document.fullscreenElement
            ||document.webkitFullscreenElement
            ||document.mozFullScreenElement    
            ||document.msFullscreenElement
            ||null;
        if (full) {        
            exitfullScreen();
            return;
        };
        var element=null;
        if (elt != null && document.msFullscreenEnabled) {
            element = elt;
        } else {
            element=document.documentElement;
        }
        
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } ,

    exitfullScreen(){
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        };
    },

    showDate(id) {
        var newDate = new Date();
        var date = newDate.getFullYear() + '-';
        date += addZero(newDate.getMonth() + 1)+'-';
        date += addZero(newDate.getDate())+' ';

        date += addZero(newDate.getHours())+':';
        date += addZero(newDate.getMinutes())+':';
        date += addZero(newDate.getSeconds());

        $(id).html('当前时间：'+date);
        setTimeout("showDate('"+id+"')", 1000);
    },

    convertTime2Mins(value){
        var min= parseInt(value.substr(0,2))*60;
        min += parseInt(value.substr(-2));
        return min
    }
}
export default{
    common
}