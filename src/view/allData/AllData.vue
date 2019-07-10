<template>
    <div class="AllData" id="AllData">
    </div>
</template>

<script>
import Echarts from 'echarts'
import Axios from 'axios'
export default {
    name: 'AllData',
    data() {
        return {
        }
    },
    mounted() {
        var myChart = Echarts.init(document.getElementById('AllData'));
        var option = {
            title: {
                text: 'Les Miserables',
                subtext: 'Default layout',
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
                    name: 'Les Miserables',
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
        Axios.get('/law/getAllData')
        .then(res => {
            option.series[0].data = res.data.data.node;
            res.data.data.links.map((e, index) => {
                e.id = index;
            })
            option.series[0].links = res.data.data.links;
            console.log(option);
            myChart.setOption(option);
        })
    }
}
</script>

<style lang="scss">
.AllData{
    width: 100%;
    height: 100%;
}
</style>
