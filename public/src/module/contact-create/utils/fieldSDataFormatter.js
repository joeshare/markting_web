/**
 * Author LLJ
 * Date 2016-8-11 14:16
 */
var formatter={
    //头部信息
    headerInfo:function(data){
        var opt={
            name:data["segment_name"],
            release:data["publish_status"],
            oper:data["oper"],
            dateTime:data["updatetime"],
            id:data["id"]
        };
        return opt;
    },
    inputShowData:function(data){
        let d = $.extend(true,{},data);
        /*
         field_name:"姓名"+Math.round(Math.random()*10),
         field_code:"name"+Math.random()*10,
         field_type:Math.round(Math.random()*10),
         selected:Math.round(Math.random()*2),
         index:Math.random()*30,
         required:Math.random()>0.5?1:0,//0-不填
         ischecked:Math.random()>0.5?1:0//0-不校验  1-校验
         <option value="" disabled selected>性别</option>
         <option value="1">未知</option>
         <option value="2">男</option>
         <option value="3">女</option>
         */
        //0:输入框 1:下拉框 2:日历选择 3:地区联动 4:手机(验证码)
        d['required_show']=data.required?'*':'';
        d['html']='';
        if(d.field_type==4){
            d['html']+='<div class="btn-sendcode">发送验证码</div>';
            d['html']+='<label class="active">'+d.field_name+'</label>';
            d['html']+='<input type="text" class="validate" />';
        }else if(d.field_type==1){//下拉
            /*
             <select>
             <option value="" disabled selected>性别</option>
             <option value="1">未知</option>
             <option value="2">男</option>
             <option value="3">女</option>
             </select>
             */
            //d['html']+='<select><option value="" disabled selected>'+d.field_name+'</option></select>';
            d['html']+='<div class="icon iconfont date-ico">&#xe648;</div>';
            d['html']+='<label class="active">'+d.field_name+'</label>';
            d['html']+='<input value="" type="text" class="validate" />';
        }else if(d.field_type==2){//日历
            d['html']+='<div class="icon iconfont date-ico">&#xe626;</div>';
            d['html']+='<label class="active">'+d.field_name+'</label>';
            d['html']+='<input value="" type="text" class="validate" />';

        }else {
            d['html']='<label class="active">'+d.field_name+'</label><input value="" type="text" class="validate" />';
         }
        return d;
    },
    transformPreview:function(data){
        /*
         gender 男，女

         [{value:1,name:'男'},{value:0,name:'女'},{value:2,name:'未知'}]

         blood_type 未知，AB,A,B,O

         [{value:1,name:'AB'},{value:2,name:'A'},{value:3,name:'B'},{value:4,name:'O'},{value:0,name:'未知'}]

         marital_status 已婚，未婚

         [{value:1,name:'已婚'},{value:0,name:'未婚'}]

         education 博士，硕士，本科，专科，高中，大学，中专，初中，初中以下

         [{value:1,name:'博士'},{value:2,name:'硕士'},{value:3,name:'本科'},{value:4,name:'专科'},{value:5,name:'高中'},{value:6,name:'大学'},{value:7,name:'中专'},{value:8,name:'初中'},{value:9,name:'初中以下'}]

         employment 在职，离职，自由职业

         [{value:1,name:'在职'},{value:2,name:'离职'},{value:3,name:'自由职业'}]
         */
        data.forEach((d,i)=>{
            if(d.field_code=='gender'){
                d['select_data']=[{value:1,name:'男'},{value:0,name:'女'},{value:2,name:'未知'}];
            }else if(d.field_code=='blood_type'){
                d['select_data']=[{value:1,name:'AB'},{value:2,name:'A'},{value:3,name:'B'},{value:4,name:'O'},{value:0,name:'未知'}];
            }else if(d.field_code=='marital_status'){
                d['select_data']=[{value:1,name:'已婚'},{value:0,name:'未婚'}];
            }else if(d.field_code=='education'){
                d['select_data']=[{value:1,name:'博士'},{value:2,name:'硕士'},{value:3,name:'本科'},{value:4,name:'专科'},{value:5,name:'高中'},{value:6,name:'大学'},{value:7,name:'中专'},{value:8,name:'初中'},{value:9,name:'初中以下'}];
            }else if(d.field_code=='employment'){
                d['select_data']=[{value:1,name:'在职'},{value:2,name:'离职'},{value:3,name:'自由职业'}];
            }
        })
    }


};
module.exports= formatter;