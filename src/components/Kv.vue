<!-- 键值对组件 --> 
<template>
    <div class="kv">
        <div v-for="(item, index) in list" :key="index" class="kv-item">
            <div class="kv-item-box">
                <n-select
                    v-model:value="item.key"
                    filterable
                    tag
                    :placeholder="$t('headers_key')"
                    :options="options"
                    class="kv-item-box-k"
                />
                <!-- <n-input v-model:value="item.key" :placeholder="$t('headers_key')" class="kv-item-box-k" /> -->
                <n-input v-model:value="item.value" :placeholder="$t('headers_value')" class="kv-item-box-v" />
            </div>
            <n-button type="danger" @click="remove(index)">{{ $t('delete') }}</n-button>
        </div>
        <n-button class="add-kv" type="primary" @click="add">{{ $t('add_headers') }}</n-button>
    </div>
</template>
<script>
import { computed } from 'vue'

export default {
    props: {
        value: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:value'],
    setup(props, ctx) {
        const list = computed({
            get() {
                return props.value
            },
            set(value) {
                ctx.emit('update:value', value)
            }, 
        })
        const add = () => {
            list.value.push({ key: null, value: '' })
        }
        const remove = (index) => {
            list.value.splice(index, 1)
        }
        const arrToOptions = (arr) => arr.map(i => ({ value: i, label: i }))
        const headersOptions = ['Authorization', 'Accept', 'Accept-Encoding', 'Accept-Language', 'Cookie', 'User-Agent', 'Referer']
        return {
            list,
            add,
            remove,
            options: arrToOptions(headersOptions),
        }
    },
}
</script>
<style lang="scss" scoped>
.kv {
    display: flex;
    flex-direction: column;

    &-item {
        display: flex;
        flex: 1;
        align-items: center;
        margin-bottom: 20px;

        &-box {
            display: flex;
            flex: 1;
            align-items: center;
            padding-right: 10px;

            &-v {
                margin-left: 10px;
            }
        }
    }

    .add-kv {
        width: fit-content;
    }
}
</style>
