<template>
<div class="index">
        <div class="left-filter">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="涉及部门" prop="departmentId">
                    <el-select v-model="ruleForm.departmentId" filterable placeholder="请选择" style="width: 100%;" clearable>
                        <el-option
                        v-for="item in departmentIds"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用领域" prop="keyWordId">
                    <el-select v-model="ruleForm.keyWordId" filterable placeholder="请选择" style="width: 100%;" clearable>
                        <el-option
                        v-for="item in keyWordIds"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="效力等级" prop="level">
                    <el-select v-model="ruleForm.level" filterable placeholder="请选择" style="width: 100%;" clearable>
                        <el-option
                        v-for="item in levels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="施用范围" prop="scope">
                    <el-select v-model="ruleForm.scope" filterable placeholder="请选择" style="width: 100%;" clearable>
                        <el-option
                        v-for="item in scopes"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规定范围" prop="limit">
                    <el-cascader
                    style="width: 100%;"
                    v-model="ruleForm.limit"
                    :options="limits"
                    :props="props"
                    collapse-tags
                    clearable></el-cascader>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker type="date" placeholder="选择日期" value-format='yyyy-MM-dd' v-model="ruleForm.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker type="date" placeholder="选择日期" value-format='yyyy-MM-dd' v-model="ruleForm.endTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="right-charts" id="AllData">
        </div>
    </div>
</template>

<script>
import Echarts from 'echarts'
import Axios from 'axios'
import qs from 'qs'
export default {
    name: 'LawNum',
    data() {
        return {
            ruleForm: {
                departmentId: '',
                keyWordId: '',
                startTime: '',
                endTime: '',
                level: '',
                scope: ''
            },
            departmentIds: [],
            keyWordIds: [],
            levels: [],
            scopes: [],
            limits: [],
            props: {
                multiple: true,
                value: 'id',
                label: 'name'
            }
        }
    },
    mounted() {
        Axios.all([Axios.get('/law/getDepartmentList'), Axios.get('/law/getKeyWordList'), Axios.get('/law/getLevel'), Axios.get('/law/getScope'), Axios.get('/law/getLimit')])
        .then(Axios.spread((res1, res2, res3, res4, res5) => {
            this.departmentIds = res1.data.data;
            this.keyWordIds = res2.data.data;
            this.levels = res3.data.data;
            this.scopes = res4.data.data;
            this.limits = res5.data.data;
        }))
        this.myChart = Echarts.init(document.getElementById('AllData'));
    },
    methods: {
        query() {
            var _this = this;
            var dataAxis = [];
            var data = [];
            var yMax = 200;
            var dataShadow = [];
            var option = {
                title: {
                    text: '统计图',
                    subtext: '',
                    top: '20px',
                    x: 'center'
                },
                tooltip: {},
                grid: {
                    bottom: '5%',
                    top: '10%'
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        // inside: true,
                        textStyle: {
                            color: '#999'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    max: yMax
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    { // For shadow
                        type: 'bar',
                        itemStyle: {
                            normal: {color: 'rgba(0,0,0,0.05)'}
                        },
                        barGap: '-100%',
                        barCategoryGap: '40%',
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: new Echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                )
                            },
                            emphasis: {
                                color: new Echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: data
                    }
                ]
            };
            this.ruleForm.limit1 = this.ruleForm.limit.filter(e => {
                return e[0] === "limit_department"
            }).map(e => e[1]).toString();
            this.ruleForm.limit2 = this.ruleForm.limit.filter(e => {
                return e[0] === "limit_progress"
            }).map(e => e[1]).toString();
            this.ruleForm.limit3 = this.ruleForm.limit.filter(e => {
                return e[0] === "limit_subject"
            }).map(e => e[1]).toString();
            Axios.get('/law/getLawNum?' + qs.stringify(this.ruleForm))
            .then(res => {
                yMax = 0;
                let count = 0
                res.data.data.forEach(e => {
                    count += e.cnt
                    dataAxis.push(e.time);
                    data.push(e.cnt)
                    if (e.cnt > yMax) {
                        yMax = e.cnt;
                    }
                })
                option.title.subtext = '共计' + count + '条';
                yMax = Math.ceil(yMax / 10) * 10
                for (var i = 0; i < data.length; i++) {
                    dataShadow.push(yMax);
                }
                option.yAxis.max = yMax;
                var zoomSize = 6;
                _this.myChart.clear();
                _this.myChart.setOption(option);
                _this.myChart.on('click', function (params) {
                    console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
                    _this.myChart.dispatchAction({
                        type: 'dataZoom',
                        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                    });
                });
            })
        }
    }
}
</script>

<style lang="scss">
.index{
    display: flex;
    .left-filter{
        width:442px;
        height: 100vh;
        background:rgba(234,237,241,1);
        padding: 20px;
    }
    .right-charts{
        flex-grow: 1;
        text-align: center;
    }
}
</style>
