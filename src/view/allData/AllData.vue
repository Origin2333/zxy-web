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
        <el-tabs type="border-card" style="flex-grow: 1;">
            <el-tab-pane label="表格">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="名称"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="content"
                        label="内容"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="scope"
                        label="施用范围"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="level"
                        label="效力等级"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="时间"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="departmentList"
                        label="涉及部门"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="keyWordList"
                        label="涉及领域"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="legislative_subject"
                        label="立法主体"
                        show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="图表">
                <div class="right-charts" id="AllData"></div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import Echarts from 'echarts'
import Axios from 'axios'
import qs from 'qs'
export default {
    name: 'AllData',
    data() {
        return {
            ruleForm: {
                departmentId: '',
                keyWordId: '',
                startTime: '',
                endTime: '',
                level: '',
                scope: '',
                limit: []
            },
            departmentIds: [],
            keyWordIds: [],
            levels: [],
            scopes: [],
            tableData: [],
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
            var option = {
                title: {
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                legend: [{
                    // selectedMode: 'single',
                    data: ['法规', '部门', '关键字']
                }],
                animation: false,
                series: [
                    {
                        name: '食品安全法规知识图谱',
                        type: 'graph',
                        layout: 'force',
                        data: [],
                        links: [],
                        categories: [{
                            name: '法规'
                        }, {
                            name: '部门'
                        }, {
                            name: '关键字'
                        }],
                        roam: true,
                        label: {
                            normal: {
                                position: 'right'
                            }
                        },
                        force: {
                            repulsion: 200
                        }
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
            Axios.get('/law/getAllData?' + qs.stringify(this.ruleForm))
            .then(res => {
                this.tableData = res.data.data.lawNodes;
                option.series[0].data = res.data.data.node;
                res.data.data.links.map((e, index) => {
                    e.id = index;
                })
                option.series[0].links = res.data.data.links;
                console.log(option);
                this.myChart.setOption(option);
                function clickFun (param) {
                    if (param.dataType == 'edge') return;
                    option.series[0].data = option.series[0].data.map(e => {
                        if (e.id == param.data.id) {
                            e.label.normal.show = !e.label.normal.show;
                            return e;
                        }
                        return e;
                    })
                    _this.myChart.clear();
                    _this.myChart.setOption(option);
                }
                this.myChart.off('click');
                this.myChart.on('click', clickFun);
            })
        }
    }
}
</script>

<style lang="scss">
.index{
    display: flex;
    height: 100%;
    .left-filter{
        width: 442px;
        height: 100%;
        background: #eaedf1;
        padding: 20px;
        box-sizing: border-box;
    }
    .el-tabs__content{
        height: calc(100% - 39px);
        box-sizing: border-box;
    }
    .el-tab-pane{
        height: 100%;
        text-align: center;
        overflow: auto;
    }
    .right-charts{
        display: inline-block;
        width: 1400px;
        height: 800px;
    }
}
</style>
