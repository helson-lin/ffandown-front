<template>
    <n-modal
        class="new-plugin"
        :show="showModal"
        preset="card"
        :closable="false"
        :title="$t('plugin_settings')"
        :style="'width: 550px'"
        @on-close="closeModal"
    >
        <n-form
            ref="formRef"
            :model="settingsItems.model"
            :rules="settingsItems.rules"
            label-align="left"
            label-placement="left"
        >
            <n-form-item 
                v-for="item in settingsItems.items"
                :key="item.key"
                :path="item.key" 
                :label="item?.label ?? $t(item.key)" 
                label-width="90px"  
                class="warp"
            >
                <n-input
                    v-if="item.type === 'input'"
                    v-model:value="settingsItems.model[item.key]"
                    type="text"
                    :placeholder="item?.placeholder ?? `please input ${item.key}`"
                >
                </n-input>
                <n-select
                    v-if="item.type === 'select'"
                    v-model:value="settingsItems.model[item.key]"
                    :options="item.options"
                    :placeholder="item?.placeholder ?? `please select ${item.key}`"
                ></n-select>
                <div v-if="item.notice" class="notice">
                    {{ item.notice }}
                </div>
            </n-form-item>
        </n-form>
        <template #footer>
            <div class="flex jce footer-color">
                <n-button class="mr2" @click="closeModal">{{ $t('cancel') }}</n-button>
                <n-button type="primary" @click="confirmModal">{{ $t('confirm') }}</n-button>
            </div>
        </template>
    </n-modal>
</template>
<script>
import { defineComponent, ref } from 'vue'
import i18n from '@/lang'
import { useMessage } from 'naive-ui'
import { updatePluginOptions } from '@/api/index.js'

export default defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        uid: {
            type: String,
            required: true,
        },
        settings: {
            type: String,
            default: '',
        },
        options: {
            type: String,
            default: '',
        },
        
    },
    emits: ['update:show', 'confirm', 'refresh'],
    setup(props, ctx) {
        const formRef = ref(null)
        const message = useMessage()
        const settingsItems = ref({
            items: [],
            rules: {},
            model: {},
        })
        const getSettingsItem = () => {
            try {
                const settings = JSON.parse(props.settings || '{}')
                const options = JSON.parse(props.options || '{}')
                const allSettinsItem = Object.entries(settings).map(([key, val]) => ({ ...val, key }))
                const model = allSettinsItem.reduce((pre, item) => { 
                    pre[item.key] = options[item.key] || item?.default || ''
                    return pre 
                }, {})
                const rules = allSettinsItem.reduce((pre, item) => {
                    pre[item.key] = [{ required: item.require || item.required || false, message: item?.placeholder ?? `please input ${item.key}`, trigger: ['blur'] }]
                    return pre
                }, {})
                return {
                    items: allSettinsItem,
                    rules,
                    model,
                }
            } catch (e) {
                console.error(e)
                return {
                    items: [],
                    rules: {},
                    model: {
                        cookie: '',
                    },
                }
            }
        }
        const showModal = computed({
            get() {
                settingsItems.value = getSettingsItem()
                return props.show
            },
            set(val) {
                ctx.emit('update:show', val)
            },
        })
        const closeModal = () => {
            showModal.value = false
        }
        const updatePlugin = async (data) => {
            const res = await updatePluginOptions(data)
            if (res.code === 0) {
                message.success(i18n.global.t('plugin_option_updated'))
                closeModal()
                ctx.emit('refresh')
            }
        }
        const confirmModal = () => {
            formRef.value?.validate(async (errors) => {
                if (!errors) {
                    await updatePlugin({
                        uid: props.uid,
                        options: JSON.stringify(settingsItems.value.model),
                    })
                }
            })
        }
        return {
            showModal,
            closeModal,
            confirmModal,
            message,
            settingsItems,
            formRef,
        }
    },
})
</script>
<style lang="scss" scoped>
.new-plugin {
    :deep(.n-modal) {
        animation: modal-fade-in .3s ease-out;
    }

    :deep(.n-card) {
        overflow: hidden;
        border-radius: 12px;
        transition: all .3s ease;

        .n-card-header {
            padding: 20px 24px;
            background: rgb(0 0 0 / 2%);
            border-bottom: 1px solid rgb(0 0 0 / 6%);

            .n-card-header__main {
                font-size: 18px;
                font-weight: 600;
                color: rgb(0 0 0 / 85%);
            }
        }

        .n-card__content {
            padding: 24px;
        }

        .n-card__footer {
            padding: 16px 24px;
            background: rgb(0 0 0 / 2%);
            border-top: 1px solid rgb(0 0 0 / 6%);
        }
    }

    .warp {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }

        :deep(.n-form-item-label) {
            font-size: 14px;
            font-weight: 500;
            color: rgb(0 0 0 / 85%);
        }

        :deep(.n-form-item-blank) {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
        }

        :deep(.n-input) {
            .n-input__input-el {
                padding: 8px 12px;
                font-size: 14px;
                border-radius: 6px;
                transition: all .2s ease;

                &:hover {
                    border-color: rgb(0 0 0 / 20%);
                }

                &:focus {
                    border-color: $primary-color;
                    box-shadow: 0 0 0 2px rgba($primary-color, .1);
                }
            }
        }

        :deep(.n-select) {
            .n-select__input {
                padding: 8px 12px;
                font-size: 14px;
                border-radius: 6px;
                transition: all .2s ease;

                &:hover {
                    border-color: rgb(0 0 0 / 20%);
                }

                &:focus {
                    border-color: $primary-color;
                    box-shadow: 0 0 0 2px rgba($primary-color, .1);
                }
            }
        }

        .notice {
            margin-top: 4px;
            font-size: 13px;
            line-height: 1.5;
            color: rgb(0 0 0 / 45%);
        }
    }

    .footer-color {
        :deep(.n-button) {
            min-width: 80px;
            height: 36px;
            font-size: 14px;
            border-radius: 6px;
            transition: all .2s ease;
        }

        :deep(.n-button--primary) {
            background: $primary-color;
            border-color: $primary-color;

            &:hover {
                background: darken($primary-color, 5%);
                border-color: darken($primary-color, 5%);
            }
        }

        :deep(.n-button--default) {
            &:hover {
                color: $primary-color;
                border-color: $primary-color;
            }
        }
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    .new-plugin {
        :deep(.n-card) {
            .n-card-header {
                padding: 16px 20px;

                .n-card-header__main {
                    font-size: 16px;
                }
            }

            .n-card__content {
                padding: 20px;
            }

            .n-card__footer {
                padding: 12px 20px;
            }
        }

        .warp {
            margin-bottom: 16px;

            :deep(.n-form-item-label) {
                font-size: 13px;
            }

            :deep(.n-input),
            :deep(.n-select) {
                width: 100%;
            }
        }

        .footer-color {
            :deep(.n-button) {
                min-width: 70px;
                height: 32px;
                font-size: 13px;
            }
        }
    }
}

// 暗色模式支持
@media (prefers-color-scheme: dark) {
    .new-plugin {
        :deep(.n-card) {
            background: rgb(30 30 30 / 95%);
            border: 1px solid rgb(255 255 255 / 8%);

            .n-card-header {
                background: rgb(255 255 255 / 3%);
                border-bottom-color: rgb(255 255 255 / 8%);

                .n-card-header__main {
                    color: rgb(255 255 255 / 90%);
                }
            }

            .n-card__footer {
                background: rgb(255 255 255 / 3%);
                border-top-color: rgb(255 255 255 / 8%);
            }
        }

        .warp {
            :deep(.n-form-item-label) {
                color: rgb(255 255 255 / 85%);
            }

            :deep(.n-input) {
                .n-input__input-el {
                    color: rgb(255 255 255 / 85%);
                    background: rgb(255 255 255 / 4%);
                    border-color: rgb(255 255 255 / 12%);

                    &:hover {
                        border-color: rgb(255 255 255 / 20%);
                    }

                    &:focus {
                        border-color: $primary-color;
                        box-shadow: 0 0 0 2px rgba($primary-color, .2);
                    }

                    &::placeholder {
                        color: rgb(255 255 255 / 30%);
                    }
                }
            }

            :deep(.n-select) {
                .n-select__input {
                    color: rgb(255 255 255 / 85%);
                    background: rgb(255 255 255 / 4%);
                    border-color: rgb(255 255 255 / 12%);

                    &:hover {
                        border-color: rgb(255 255 255 / 20%);
                    }

                    &:focus {
                        border-color: $primary-color;
                        box-shadow: 0 0 0 2px rgba($primary-color, .2);
                    }
                }
            }

            .notice {
                color: rgb(255 255 255 / 45%);
            }
        }

        .footer-color {
            :deep(.n-button--default) {
                color: rgb(255 255 255 / 85%);
                background: rgb(255 255 255 / 4%);
                border-color: rgb(255 255 255 / 12%);

                &:hover {
                    color: $primary-color;
                    background: rgb(255 255 255 / 8%);
                    border-color: $primary-color;
                }
            }
        }
    }
}

// 动画效果
@keyframes modal-fade-in {
    from {
        opacity: 0;
        transform: scale(.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

</style>