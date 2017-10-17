/**
 * Created by lxf on 2016-7-14.
 * 日历组件
 */
var layer = require('plugins/layer.js');//弹窗插件
class LcalendarTipList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    render() {
        return (
            <div className="conwrap">
                <ul>
                    {this.props.data.map(m=> {
                        return (
                            <li><span className="ico"></span><span className="txt">{m.activity}</span></li>
                        )
                    })}
                </ul>
                <div className="ft-wrap">
                    <a href="/html/activity/supervise.html" className="seemore-btn">查看更多</a>
                </div>
                <div className="bottomarr"></div>
            </div>
        )
    }
}
class Lcalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],//接口返回的数据
            weekArr: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            startDay: 1,//1号是星期几
            monthCount: 30,//当月一共多少天
            year: '0000',//年
            month: '01',//月
            day: 1,//日
            allDays: []//根据条件生成的天的2维数组，目的是方便渲染
        };

        // this.setTotal = this.setTotal.bind(this)
    }

    //是否为闰年
    isLeapYear(year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    //某月的天数
    getDaysOfMonth(year, month) {
        return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }

    //获取一个月份1号是星期几(1-7：星期一 - 星期日)
    getBeginDayOfMouth(year, month) {
        var d = new Date(year, month - 1, 1);
        return d.getDay();
    }

    setEvent() {
        $(document).on('click', '#container', function (e) {
            layer.closeAll();
        });
    }

    // 实例化后执行一次,相当于init方法
    componentDidMount() {
        this.load();
        this.setEvent();
    }

    //每次渲染之后都要调用
    componentDidUpdate() {

    }

    //约定好参数格式为字符串'2016-07-15'
    setDate(nowDateStr, currentMonth, data) {
        let nowDateArr = nowDateStr.split('-');
        let currentMonthArr = currentMonth.split('-');
        let y = currentMonthArr[0];//当前年
        let m = currentMonthArr[1];
        let thisYear = nowDateArr[0];//今年
        let thisMonth = nowDateArr[1];//今月
        let day = nowDateArr[2];
        let startDay = this.getBeginDayOfMouth(y, m);
        let monthCount = this.getDaysOfMonth(y, m);
        let lastMonthCount;
        if (m == '01') {
            lastMonthCount = this.getDaysOfMonth(y - 1, 12);
        } else {
            lastMonthCount = this.getDaysOfMonth(y, m - 1);
        }


        let lastDays = _.range(lastMonthCount - startDay + 2, lastMonthCount + 1);//1号之前的天们
        let midDays = _.range(1, monthCount + 1);
        let nextDays = _.range(1, 42 - monthCount);
        let allDays = [...lastDays, ...midDays, ...nextDays];


        var dimensionalArr = [];//2维数组
        var t = [];
        //1转2的小技巧
        allDays.map((m, i)=> {
            t.push(m);
            if (t.length == 7) {
                dimensionalArr.push(t);
                t = [];
            }
        });

        this.setState({
            thisYear: thisYear,
            year: y,
            thisMonth: thisMonth,
            month: m,
            startDay: startDay,
            monthCount: monthCount,
            day: day,
            allDays: dimensionalArr,
            data: data
        })
    }


    //加载接口数据
    load(date = "0") {

        let that = this;
        util.api({
            data: {
                method: 'mkt.homepage.calendar.list',
                date: date
            },
            success: function (response) {
                // console.info(response)
                if (response.code == 0) {
                    let nowDate = response.data[0].today;
                    let currentMonth = response.data[0].current_month;
                    that.setDate(nowDate, currentMonth, response.data[0].calendar_data);
                }
            }
        });
    }

    //显示活动列表
    showList(day, e) {
        let that = this;
        let meEl = $(e.currentTarget);
        if (!meEl.is('.on')) return;
        util.api({
            data: {
                method: 'mkt.homepage.calendar.pop',
                date: this.state.year + '-' + this.state.month + '-' + day
            },
            success: function (response) {
                if (response.code == 0) {
                    layer.open({
                        //area: '500px',//宽高area: ['500px', '300px']
                        shade: 0,//不要遮罩
                        closeBtn: 0,//不要关闭按钮
                        type: 4,//tip类型
                        shift: 5,//动画类型0-6 默认0
                        tips: [1, '#fff'],//方向1-4，背景色
                        content: ['<div class="lcalendar-tiplist-wrap"></div>', meEl],
                        success: function (layero, index) {
                            let tipList = ReactDOM.render(
                                <LcalendarTipList data={response.data[0].content}/>,
                                document.querySelector('.lcalendar-tiplist-wrap')
                            );
                        }
                    });
                }
            }
        });
    }

    //处理TD状态的一些逻辑
    setTd(m, day, ii, i) {
        let tdIndex = i * 7 + ii + 1;//td的索引
        let isweekend = '';//周末
        let otherMonthDay = '';//其他月的天
        let today = '';//今天
        let type = '';
        if ((this.state.monthCount + this.state.startDay) <= tdIndex || tdIndex < this.state.startDay) {
            otherMonthDay = 'othermonthday';
        }
        if (ii >= 5) {
            isweekend = 'weekend';
        }

        if ((day == this.state.day) && (m == this.state.thisMonth)) {
            today = 'today';//今天
        } else {
            today = '';
        }
        this.state.data.map(m=> {
            if (m.active_day.split('-')[2] == day) {
                switch (m.status) {
                    case 1:
                        type = 'bg-purple on';
                        break;
                    case 2:
                        type = 'bg-blue on';
                        break;
                }
            }
        });
        return (
            <td className={today+' '+otherMonthDay+' '+isweekend}>
                <span className={type} onClick={this.showList.bind(this,day)}>{day}</span>
            </td>
        )
    }

    changeMonth(type) {

        let y = Number(this.state.year);
        let m = Number(this.state.month);
        switch (type) {
            //上
            case 1:
                if (m == 1) {
                    m = 12;
                    y = y - 1;
                } else {
                    m = m - 1;
                }
                break;
            //下
            case 2:
                if (m == 12) {
                    m = 1;
                    y = y + 1;
                } else {
                    m = m + 1;
                }
                break;
        }

        this.setState({
            year: y,
            month: util.pad(m)
        });
        this.load(y + util.pad(m))
    }

    render() {
        return (
            <div className="lcalendar-wrap">
                <table className="lcalendar-table col s9">
                    <thead>
                    <tr>
                        {this.state.weekArr.map(m=> {
                            return (
                                <th>{m}</th>
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.allDays.map((trData, i)=> {
                        return (
                            <tr>
                                {trData.map((day, ii)=> {
                                    return this.setTd(this.state.month, day, ii, i);
                                })}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className="header col s3">
                    <div className="arr-btn-wrap">
                        <div className="btn-prev icon iconfont" onClick={this.changeMonth.bind(this,1)}>&#xe647;</div>
                        <div className="btn-next icon iconfont" onClick={this.changeMonth.bind(this,2)}>&#xe648;</div>
                    </div>
                    <div className="tit"> {this.state.year}年{this.state.month}月</div>
                    <div className="cloudwrap"><img src="/img/index/calendar_ico.png" alt=""/></div>
                    <ul className="list">
                        <li><span className="ico"></span>今天</li>
                        <li><span className="ico bg-purple"></span>即将开始的活动</li>
                        <li><span className="ico bg-blue"></span>进行中的活动</li>
                    </ul>
                </div>
            </div>
        )
    }
}

module.exports = Lcalendar;
