/**
 * Created by lxf on 2016-7-29.
 * 地图
 */

class EChartsMap {
    constructor(props) {
        this.opts = _.extend({
            el: '',
            chartsDefOpt: {
                tooltip: {
                    trigger: 'item'
                },

                dataRange: {
                    x: 'center',
                    y: 'bottom',
                    orient: 'horizontal',
                    splitList: [
                        {start: 1500},
                        {start: 200, end: 1500},
                        {start: 0, end: 200},
                        {end: 0}
                    ],
                    color: ['#5BD3C7', '#92CFFE', '#C1DFF7', '#E4E5E7']
                },

                series: [
                    {
                        name: '用户数',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                label: {
                                    show: false,
                                    textStyle: {
                                        color: "rgb(249, 249, 249)"
                                    }
                                }
                            },
                            emphasis: {
                                areaColor: '#FCDD5F',
                                label: {show: false}
                            }
                        },
                        data: [
                            {name: '北京', value: 0},
                            {name: '天津', value: 0},
                            {name: '上海', value: 0},
                            {name: '重庆', value: 0},
                            {name: '河北', value: 0},
                            {name: '河南', value: 0},
                            {name: '云南', value: 0},
                            {name: '辽宁', value: 0},
                            {name: '黑龙江', value: 0},
                            {name: '湖南', value: 0},
                            {name: '安徽', value: 0},
                            {name: '山东', value: 0},
                            {name: '新疆', value: 0},
                            {name: '江苏', value: 0},
                            {name: '浙江', value: 0},
                            {name: '江西', value: 0},
                            {name: '湖北', value: 0},
                            {name: '广西', value: 0},
                            {name: '甘肃', value: 0},
                            {name: '山西', value: 0},
                            {name: '内蒙古', value: 0},
                            {name: '陕西', value: 0},
                            {name: '吉林', value: 0},
                            {name: '福建', value: 0},
                            {name: '贵州', value: 0},
                            {name: '广东', value: 0},
                            {name: '青海', value: 0},
                            {name: '西藏', value: 0},
                            {name: '四川', value: 0},
                            {name: '宁夏', value: 0},
                            {name: '海南', value: 0},
                            {name: '台湾', value: 0},
                            {name: '香港', value: 0},
                            {name: '澳门', value: 0}

                        ]
                    }
                ]
            }
        }, props || {});

        this.init();
    }

    init() {
        this.myCharts = echarts.init(document.getElementById(this.opts.el));
        this.myCharts.showLoading();
        util.onResize(m=> {
            this.myCharts.resize();
        });
    }

    resize() {
        this.myCharts.resize();
    }

    hideLoading() {
        this.myCharts.hideLoading();
    }

    setOption(chartsData) {
        this.hideLoading();
        let opts = this.opts.chartsDefOpt;
        let splitList = [];
        if (!_.isEmpty(chartsData)) {
            chartsData.map(m=> {
                m.name = m.dimension_name;
                m.value = m.population_count;
            });

            let uniqArr = _.uniq(_.pluck(chartsData, 'population_count'));//去重后的用户数组

            if (uniqArr.length <= 3) {
                splitList = [
                    {start: 0},
                    {start: 0, end: 0}
                ];
            } else if (uniqArr.length <= 6) {
                splitList = [
                    {start: uniqArr[3]},
                    {start: 0, end: uniqArr[3]},
                    {start: 0, end: 0}
                ];
            } else {
                splitList = [
                    {start: uniqArr[3]},
                    {start: uniqArr[5], end: uniqArr[3]},
                    {start: 0, end: uniqArr[6]},
                    {start: 0, end: 0}
                ];
            }

            opts.dataRange.splitList = splitList;
        }


        // opts.series[0].data = _.extend(opts.series[0].data, chartsData);
        opts.series[0].data = chartsData;
        this.myCharts.setOption(opts);
    }
}
module.exports = EChartsMap;