/**
 * @description 加载配置文件，加上时间戳防止缓存
 */
export const loadConfig = () => {
    const path = './config.js?timesmap=' + new Date().getTime()
    const scriptHtml = document.createElement('script')
    scriptHtml.type = 'text/javascript'
    scriptHtml.async = true
    scriptHtml.src = path
    document.head.append(scriptHtml)
}

export const getOption = () => {
    const localOption = localStorage.getItem('cp_info')
    if (!localOption) return { url: '', secret: '' }
    try {
        return JSON.parse(localOption)
    } catch (e) {
        return { url: '', secret: '' }
    }
}

export const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)

export const UIDGenerator = {
    nums: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        97,
        98,
        99,
        100,
        101,
        102,
        103,
        104,
        105,
        106,
        107,
        108,
        109,
        110,
        111,
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
    ],
    getRandomIndex() { return Math.floor(Math.random() * this.nums.length) },
    getRandomString() { const randomIndex = this.getRandomIndex(); return randomIndex > 9 ? this.asciiToChart(this.nums[randomIndex]) : randomIndex },
    asciiToChart: (ascii) => String.fromCharCode(ascii),
    generate(length = 7) { return new Array(length).fill('').map(() => this.getRandomString()).join('') },
}

export const copyToClipboard = (text) => {
    const input = document.createElement('textarea')
    document.body.appendChild(input)
    input.value = text
    input.focus()
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
}
