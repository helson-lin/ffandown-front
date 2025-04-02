// src/hooks/useSSE.js
import { ref, onUnmounted } from 'vue'

export function useSSE(url, handlers) {
    const data = ref(null)
    const error = ref(null)
    let eventSource = null

    const initSSE = (params) => {
        const BASEURL = window.CONFIG?.BASEURL
        const listUrl = new URL(window.origin + BASEURL + url)
        Object.entries(params).forEach(([key, value]) => {
            listUrl.searchParams.append(key, value)
        })
        eventSource = new EventSource(listUrl.href)

        // 绑定默认消息处理
        eventSource.onmessage = (e) => {
            try {
                data.value = JSON.parse(e.data)
                if (handlers?.onMessage) handlers.onMessage(data.value)
            } catch (err) {
                error.value = err
            }
        }

        // 绑定自定义事件处理
        if (handlers?.events) {
            Object.entries(handlers.events).forEach(([eventName, callback]) => {
                eventSource.addEventListener(eventName, (e) => callback(JSON.parse(e.data)))
            })
        }

        // 错误处理
        eventSource.onerror = (err) => {
            error.value = err
            if (handlers?.onError) handlers.onError(err)
        }
    }

    const closeSSE = () => {
        if (eventSource) eventSource.close()
    }

    onUnmounted(closeSSE)

    return { data, error, closeSSE, initSSE }
}
