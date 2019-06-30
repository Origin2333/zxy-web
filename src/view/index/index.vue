<template>
    <div class="index">
        <div class="left-filter">
            <el-select
                v-model="lawName"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="loading"
                class="select"
                @change="querylawById">
                <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <el-tree :data="lawTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="right-charts" ref="lawChart"></div>
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
            options: [],
            loading: true,
            lawTree: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    mounted () {

    },
    methods: {
        remoteMethod (query) {
            var _this = this
            if (query !== '') {
                this.loading = true
                Axios.get('/law/getLawList?name=' + query)
                .then(res => {
                    this.loading = false
                    _this.options = res.data.data
                })
            }
        },
        querylawById (id) {
            debugger
            Axios.get('/law/getLawDetail?id=' + id)
            .then(res => {
                debugger
                let result = res.data.data;
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
                        name: result.time
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
            var myChart = echarts.init(this.$refs.lawChart);
            var option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
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

                        animationDurationUpdate: 750

                    }
                ]
            }
            debugger
            myChart.setOption(option);
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
        text-align: center;
        padding: 20px;
        .select{
            width: 400px;
        }
    }
    .right-charts{
        flex-grow: 1;
    }
}
</style>
