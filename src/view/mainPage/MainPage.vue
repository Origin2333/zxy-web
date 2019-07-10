<template>
    <div class="main">
        <Header></Header>
        <section class="section">
            <router-view/>
        </section>
    </div>
</template>

<script>
import Header from '../../components/Header'
export default {
    name: 'MainPage',
    components: {
        Header
    },
    data() {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
.main{
    width: 100%;
    height: 100%;
    position: relative;
    .section{
        width: 100%;
        position: absolute;;
        top: 50px;
        height: calc(100vh - 50px);
    }
}
</style>
