<template>
    <div class="index">
        <div class="left-filter">
            <div  class="select">
                <el-select
                    v-model="lawName"
                    filterable
                    style="width:100%;"
                    @change="querylawById">
                    <el-option
                    v-for="item in lawNames"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <el-divider></el-divider>
            <div class="tree">
                <el-tree :data="lawTree" :props="defaultProps" @node-click="clickNode" default-expand-all>
                    <span class="custom-tree-node" slot-scope="{ node }">
                        <span :title="node.label">{{ node.label }}</span>
                    </span>
                </el-tree>
            </div>
        </div>
        <div class="right-charts">
            <div class="chart1" ref="lawChart"></div>
            <div class="chart2" ref="keyWordChart"><p>{{lawDesc}}</p></div>
            <div class="chart3" ref="departmentChart"></div>
            <div class="chart4" ref="keyWordChart"></div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
import echarts from 'echarts'
export default {
    name: 'index',
    data () {
        return {
            lawName: '',
            lawNames: [],
            lawDesc: '',
            loading: true,
            lawTree: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    mounted () {
        Axios.get('/law/getLawList')
        .then(res => {
            this.lawNames = res.data.data
        })
        this.myChart = echarts.init(this.$refs.lawChart);
        this.keyWordChart = echarts.init(this.$refs.keyWordChart);
        this.departmentChart = echarts.init(this.$refs.departmentChart);
        this.sonLawChart = echarts.init(this.$refs.sonLawChart);
    },
    methods: {
        querylawById (id) {
            Axios.get('/law/getLawDetail?id=' + id)
            .then(res => {
                let result = res.data.data;
                this.lawTree = [];
                this.lawTree.push({
                    name: result.name,
                    children: []
                })
                this.lawTree[0].children.push({
                    name: '主要内容',
                    children: [{
                        name: result.content
                    }]
                })
                this.lawDesc = result.content;
                this.lawTree[0].children.push({
                    name: '立法主体',
                    children: [{
                        name: result.legislative_subject
                    }]
                })
                this.lawTree[0].children.push({
                    name: '涉及部门',
                    children: result.departmentList
                })
                this.lawTree[0].children.push({
                    name: '适用范围',
                    children: [{
                        name: result.scope
                    }]
                })
                this.lawTree[0].children.push({
                    name: '适用领域',
                    children: result.keyWordList
                })
                this.lawTree[0].children.push({
                    name: '施行时间',
                    children: [{
                        name: result.time ? new Date().Format('yyyy-MM-dd') : '暂无'
                    }]
                })
                this.lawTree[0].children.push({
                    name: '制定依据',
                    children: result.aboutLawList
                })
                console.log(this.lawTree);
                this.showLawChart(this.lawTree);
            })
        },
        handleNodeClick () {

        },
        showLawChart (lawTree) {
            var _this = this;
            var option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    extraCssText: 'width: 300px; white-space: pre-wrap'
                },
                series: [
                    {
                        type: 'tree',

                        data: lawTree,

                        top: '18%',
                        bottom: '14%',

                        layout: 'radial',

                        symbol: 'emptyCircle',

                        symbolSize: 7,

                        initialTreeDepth: 3,

                        animationDurationUpdate: 750,
                        label: {
                            formatter: function (val) {
                                if (val.name.length > 6) {
                                    return val.name.substring(0, 6) + '...';
                                } else {
                                    return val.name;
                                }
                            }
                        }
                    }
                ]
            }
            this.myChart.setOption(option);
            function clickFun (param) {
                _this.clickNode(param.data)
            }
            this.myChart.off('click');
            this.myChart.on('click', clickFun);
        },
        clickNode (node) {
            var option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    extraCssText: 'width: 300px; white-space: pre-wrap'
                },
                series: [
                    {
                        type: 'tree',
                        data: [],
                        top: '20%',
                        bottom: '20%',
                        layout: 'radial',
                        symbol: 'emptyCircle',
                        symbolSize: 7,
                        initialTreeDepth: 3,
                        animationDurationUpdate: 750,
                        label: {
                            formatter: function (val) {
                                if (val.name.length > 6) {
                                    return val.name.substring(0, 6) + '...';
                                } else {
                                    return val.name;
                                }
                            }
                        }
                    }
                ]
            }
            if (node.hasOwnProperty('keyWordId')) {
                Axios.get('/law/getLawListByKeyWordId?keyWordId=' + node.keyWordId)
                .then(res => {
                    var data = [{
                        name: node.name,
                        children: res.data.data ? res.data.data : []
                    }]
                    option.series[0].data = data;
                    this.keyWordChart.clear();
                    this.keyWordChart.setOption(option);
                })
            }
            if (node.hasOwnProperty('departmentId')) {
                Axios.get('/law/getLawListByDepartmentId?departmentId=' + node.departmentId)
                .then(res => {
                    var data = [{
                        name: node.name,
                        children: res.data.data ? res.data.data : []
                    }]
                    option.series[0].data = data;
                    this.departmentChart.clear();
                    this.departmentChart.setOption(option);
                })
            }
            // if (node.hasOwnProperty('lawId')) {
            //     Axios.get('/law/getLawListByLawId?lawId=' + node.lawId)
            //     .then(res => {
            //         var data = [{
            //             name: node.name,
            //             children: res.data.data ? res.data.data : []
            //         }]
            //         option.series[0].data = data;
            //         this.sonLawChart.clear();
            //         this.sonLawChart.setOption(option);
            //     })
            // }
        }
    }
}
</script>

<style lang="scss" scoped>
.index{
    display: flex;
    box-sizing:border-box;
    height: 100%;
    .left-filter{
        width:442px;
        height: 100%;
        overflow-y: auto;
        background:rgba(234,237,241,1);
        text-align: center;
        padding: 20px 20px;
        box-sizing:border-box;
        .select{
            width: 400px;
            margin: 0 auto;
        }
        .tree{
            width: 400px;
            margin: 0 auto;
            .el-tree{
                background: transparent;
            }
            .custom-tree-node{
                width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                font-size: 14px;
                line-height: 24px;
            }
        }
    }
    .right-charts{
        // flex-grow: 1;
        width: calc(100% - 442px);
        text-align: center;
        box-sizing:border-box;
        .chart1{
            display: inline-block;
            width: 48%;
            height: 50%;
            border: 1px solid rgba(234,237,241,1);
            text-align: left;
            vertical-align: middle;
        }
        .chart2{
            display: inline-block;
            width: 48%;
            height: 50%;
            border: 1px solid rgba(234,237,241,1);
            text-align: left;
            vertical-align: middle;
            p {
                padding: 20px;
                line-height: 24px;
            }
        }
        .chart3{
            display: inline-block;
            width: 48%;
            height: 50%;
            border: 1px solid rgba(234,237,241,1);
            text-align: left;
            vertical-align: middle;
        }
        .chart4{
            display: inline-block;
            width: 48%;
            height: 50%;
            border: 1px solid rgba(234,237,241,1);
            text-align: left;
            vertical-align: middle;
        }
    }
}
</style>
