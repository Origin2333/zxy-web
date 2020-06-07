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
        <div class="right-charts" ref="aboutLawChart">
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
import echarts from 'echarts'
import qs from 'qs'
export default {
    data() {
        return {
            name: 'AboutLaws',
            ruleForm: {
                departmentId: '',
                keyWordId: '',
                startTime: '',
                endTime: ''
            },
            departmentIds: [],
            keyWordIds: []
        }
    },
    mounted() {
        this.aboutLawChart = echarts.init(this.$refs.aboutLawChart);
        Axios.all([Axios.get('/law/getDepartmentList'), Axios.get('/law/getKeyWordList')])
        .then(Axios.spread((res1, res2) => {
            this.departmentIds = res1.data.data;
            this.keyWordIds = res2.data.data;
        }))
    },
    methods: {
        query() {
            Axios.get('/law/getLawList?' + qs.stringify(this.ruleForm))
            .then(res => {
                var option = {
                    tooltip: {
                        formatter: '{b}'
                    },
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            force: {
                                // initLayout: 'circular',
                                // gravity: 0,
                                repulsion: 600,
                                edgeLength: 200
                            },
                            symbolSize: 50,
                            roam: true,
                            label: {
                                normal: {
                                    show: true
                                }
                            },
                            edgeSymbol: ['circle'],
                            edgeSymbolSize: [4, 10],
                            edgeLabel: {
                                normal: {
                                    textStyle: {
                                        fontSize: 20
                                    }
                                }
                            },
                            data: [],
                            links: [],
                            lineStyle: {
                                normal: {
                                    opacity: 0.9,
                                    width: 2,
                                    curveness: 0
                                }
                            }
                        }
                    ]
                };
                option.series[0].data.push({
                    name: '条件',
                    id: 0
                })
                res.data.data.forEach((e, index) => {
                    option.series[0].data.push({
                        name: e.name,
                        id: e.id
                    })
                    option.series[0].links.push({
                        source: index + 1,
                        target: 0
                    });
                })
                this.aboutLawChart.setOption(option);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
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
