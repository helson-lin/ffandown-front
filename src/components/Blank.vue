<template>
    <div class="blank-data">
        <div class="blank">
        </div>
    </div>
</template>
<script>

export default defineComponent({
    name: 'Blank',
    setup() {
        return {
        }
    },
})
</script>
<style lang="scss" scoped>
.blank-data {
    display: flex;
    justify-content: center;
    width: 100%;

    .blank {

        // background-attachment: fixed;
        width: 480px;
        height: 480px;
        background: url("../assets/imgs/empty.png") 100% 100% no-repeat;
        transform: scale(.5);
    }
}
</style>
