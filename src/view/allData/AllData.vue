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
                <el-form-item label="施用范围" prop="level">
                    <el-select v-model="ruleForm.level" filterable placeholder="请选择" style="width: 100%;" clearable>
                        <el-option
                        v-for="item in levels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="效力等级" prop="scope">
                    <el-select v-model="ruleForm.scope" filterable placeholder="请选择" style="width: 100%;" clearable>
                        <el-option
                        v-for="item in scopes"
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
        <div class="right-charts" id="AllData">
        </div>
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
                scope: ''
            },
            departmentIds: [],
            keyWordIds: [],
            levels: [],
            scopes: []
        }
    },
    mounted() {
        Axios.all([Axios.get('/law/getDepartmentList'), Axios.get('/law/getKeyWordList'), Axios.get('/law/getLevel'), Axios.get('/law/getScope')])
        .then(Axios.spread((res1, res2, res3, res4) => {
            this.departmentIds = res1.data.data;
            this.keyWordIds = res2.data.data;
            this.levels = res3.data.data;
            this.scopes = res4.data.data;
        }))
        this.myChart = Echarts.init(document.getElementById('AllData'));
    },
    methods: {
        query() {
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
                            repulsion: 100
                        }
                    }
                ]
            };
            Axios.get('/law/getAllData?' + qs.stringify(this.ruleForm))
            .then(res => {
                option.series[0].data = res.data.data.node;
                res.data.data.links.map((e, index) => {
                    e.id = index;
                })
                option.series[0].links = res.data.data.links;
                console.log(option);
                this.myChart.setOption(option);
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
