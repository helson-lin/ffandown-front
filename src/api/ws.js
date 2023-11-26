class Websocket {
    constructor(url) {
        this.url = url
        this.websocket = null
        this.callback = null
        this.init()
    }

    init() {
        if (this.websocket) return
        this.websocket = new WebSocket(this.url)
        // 连接发生错误的回调方法
        this.websocket.onerror = (error) => {
            console.warn(`websocket error: ${error}`)
        }

        // 连接成功建立的回调方法
        this.websocket.onopen = () => {
            console.info('websocket onopen')
        }

        // 接收到消息的回调方法
        this.websocket.onmessage = (event) => {
            const dataString = event.data
            if (typeof dataString !== 'string') return
            const data = JSON.parse(dataString)
            this.callback(data)
        }

        // 连接关闭的回调方法
        this.websocket.onclose = () => {
            window.console.warn('websocket onclose')
        }
    }

    on(fun) {
        if (typeof fun !== 'function') return
        this.callback = fun
    }

    send(key, msg) {
        this.websocket.send(JSON.stringify({ key, msg }))
    }
}

export default Websocket
