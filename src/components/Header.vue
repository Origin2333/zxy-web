<template>
    <div class="header">
        <span>食品安全法规知识图谱</span>
        <el-menu
            class="menu-list"
            router
            :default-active="defaultActive"
            mode="horizontal"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#00F0FF">
            <el-menu-item index="/index">法规关系图一</el-menu-item>
            <el-menu-item index="/aboutLaws">法规关系图二</el-menu-item>
            <el-menu-item index="/allData">法规关系图三</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            defaultActive: '/index'
        }
    }
}
</script>

<style lang="scss" scoped>
$headerHeight: 50px;
.header{
    background: linear-gradient(90deg,#1460b3,#0c7fce);
    height: $headerHeight;
    width: 100%;
    span{
        color: #fff;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        font-family: MicrosoftYaHeiUI-Bold;
        font-weight: 700;
        padding-left: 40px;
        float: left;
    }
    .menu-list {
      float: left;
      width: 58%;
      display: flex;
      justify-content: center;
      // display: inline-block;
      vertical-align: top;
      background: transparent;
      border: none;
      > .el-menu-item {
        height: ($headerHeight)-10px;
        line-height: $headerHeight;
        color: #fff;
        // font-weight: bold;
        font-size: 14px;
        border-color: #00F0FF;
        // margin-right: 20px;
        margin-right: 2%;
        padding: 0 2%;
        &:focus,
        &:hover {
          background-color: transparent !important; // 覆盖element-ui背景内联样式
        }
        &:hover {
          color: #00F0FF !important;
        }
      }
    }
}
</style>
