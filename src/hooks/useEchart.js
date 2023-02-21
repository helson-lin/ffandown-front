import * as echarts from 'echarts'
import { ref, nextTick, onUnmounted, onMounted, watch } from 'vue'
/**
 * @description echarts图表使用
 * @param {object} getOption 获取echarts options函数需要返回option
 * @params {object | {isWatch: boolean, watchData: proxy}} options  配置项
 * @returns void
 */
const useEchart = (getOption, options = { isWatch: false, watchData: null }) => {
    // echarts dom;
    const echartRef = ref(null)
    const timerList = []
    /**
     * @description 渲染图表
     * @param {boolean} 是否清除图表
     * @param {boolean} rerender 是否重新渲染
     * @param {boolean | object} ecoOption
     */
    const renderChart = (rerender = false, ecOption = false) => {
        nextTick(() => {
            if (!echartRef.value) throw new Error('[useEcharts Hook] echartRef is not found')
            let chart = echarts.getInstanceByDom(echartRef.value)
            if (chart) {
                if (rerender) { chart.clear() }
            } else if (!chart) {
                chart = echarts.init(echartRef.value)
            }
            if (!getOption) throw new Error('[useEcharts Hook] No getOption Function defined')
            const option = getOption()
            chart.setOption(option, ecOption)
        })
    }
    /**
     * @description 是否自动渲染图表
     * @param {function} getDataFunction
     * @param {boolean} isAutoRender
     */
    const autoRender = async (getDataFunction, isAutoRender = false) => {
        if (!isAutoRender) {
            getDataFunction()
        } else {
            await getDataFunction()
            renderChart()
        }
    }
    /**
     * @description: 轮询
     * @param {function} getDataFunction 请求数据
     * @param {number} interval 轮询时间（单位秒）
     * @param {boolean} isAutoRender 是否自动渲染图表
     */
    const looping = async (getDataFunction, interval, isAutoRender = false) => {
        if (typeof interval !== 'number') {
            throw new Error('[useEcharts Hook] interval must be a number')
        }
        if (!interval) {
            throw new Error('[useEcharts Hook] interval is required')
        }
        autoRender(getDataFunction, isAutoRender)
        const timer = setInterval(() => {
            autoRender(getDataFunction, isAutoRender)
        }, interval * 1000)
        timerList.push(timer)
    }

    onMounted(() => {
        if (options && options.isWatch && options.watchData) {
            watch(options.watchData, () => {
                renderChart()
            }, { deep: true })
        }
    })

    onUnmounted(() => {
        timerList.forEach(i => clearInterval(i))
    })
    return {
        echartRef,
        looping,
        renderChart,
    }
}

export default useEchart
