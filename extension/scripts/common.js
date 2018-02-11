// const server = 'http://104.223.24.11:3000'
const server = 'http://localhost:3000'
const errors = {
    401: '当前没有访问权限',
    500: '服务器异常'
}
const contactText = '如有疑问，请联系插件开发者trajoe.wu@gmail.com'

const headers = {
    'Content-Type': 'application/json'
}

//当前所有打开的页面信息，从扩展安装时捕获
class PageInfo {
    constructor() {
        this.allOpenedPageInfo = []
    }
    /**
     * 根据key来判断是否有对应的pageInfo
     * @param {*} pageInfo 
     * @param {*} key pageInfo的属性，默认通过url查找
     */
    has(pageInfo, key = 'url') {
        return this.allOpenedPageInfo.some(item => item[key] === pageInfo[key])
    }
    /**
     * 根据key来查找url匹配的pageInfo
     * @param {*} pageInfo 
     * @param {*} key pageInfo的属性，默认通过url查找
     */
    find(pageInfo, key = 'url') {
        return this.allOpenedPageInfo.filter(item => item[key] === pageInfo[key])
    }
    /**
     * 根据key查找url匹配的pageInfo的index
     * @param {*} pageInfo 
     * @param {*} key pageInfo的属性，默认通过url查找
     */
    findIndex(pageInfo, key = 'url') {
        const index = -1
        this.allOpenedPageInfo.forEach((item, i) => {
            if (item[key] === PageInfo[key]) {
                index = i
            }
        })
        return index
    }
    /**
     * 添加pageInfo
     * @param {*} pageInfo 
     */
    append(pageInfo) {
        //如果还没有包含这个url的pageInfo
        if (!this.has(pageInfo, 'url')) {
            //如果这个tab已存在则替换
            if (this.has(pageInfo, 'tabId')) {
                const index = this.findIndex(pageInfo, 'tabId')

                this.allOpenedPageInfo.splice(index, 1, pageInfo)
            } else {
                this.allOpenedPageInfo.push(pageInfo)
            }
        }
    }
    /**
     * 删除pageInfo
     * @param {*} pageInfo 
     */
    remove(pageInfo) {
        const index = this.findIndex(pageInfo)
        this.allOpenedPageInfo.splice(index, 1)
    }
    /**
     * 清空pageInfo
     */
    clear() {
        this.allOpenedPageInfo = []
    }
}

/**
 * navigator.platform映射值
 */
const osMap = {
    win: 'Windows',
    mac: 'Mac',
    x11: 'Linux',
    lin: 'Linux'
}


/**
 * 用户平台信息
 */
const platform = {
    chromeVersion: /Chrome\/([\d.]+)/.exec(navigator.userAgent)[1],
    os: osMap[navigator.platform.toLowerCase().substr(0, 3)]
}


const common = {
    pageInfo: new PageInfo(),
    request(url, data = {}) {
        url = server + url
        return fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        }).then(res => {
            if (res.status !== 200) {
                alert(`${errors[res.status]}，${contactText}`)
                return
            }
            return res.json()
        }).then(res => {
            if (res && res.code !== 200) {
                alert(`${errors[res.code]}，${contactText}`)
                return
            }

            if (res && res.token) {
                headers.Authorization = `Bearer ${res.token}`
            }
            return res
        })
    },
    /**
     * 监听页面访问
     * @param {*} callback 监听后回调
     */
    listenVisit(callback) {
        let visitInfo = {},
            visited = false //该页是否已访问标识

        /**
         * 当url被访问时调用，但并不能保证调用时页面已加载，故第一次访问页面可能拿不到title
         */
        chrome.history.onVisited.addListener((result) => {
            visitInfo = {
                ...result,
                platform
            }
            visited = false
        })

        /**
         * tabs更新变化时调用，一个页面因状态不同可能会调用多次
         */
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            console.log('onUpdated')
            //当前页面状态为完成或已有title信息，并且url不为新建标签页且该页面
            //当已有title信息，并且url不为新建标签页且该页面
            //因会调用多次这里使用了访问标识visited
            if ((visitInfo.title || changeInfo.title) && tab.url !== 'chrome://newtab/' && !visited) {
                visited = true
                visitInfo.title = tab.title
                typeof callback === 'function' && callback(visitInfo)

                visitInfo.tabId = tabId
                this.pageInfo.append(visitInfo)
                visitInfo = {}
            }
        })

        chrome.tabs.onActiveChanged.addListener((tabId, selectInfo) => {
            console.log('onActiveChanged', tabId, selectInfo)
        })

        chrome.tabs.onActivated.addListener((activeInfo) => {
            const { tabId, windowId } = activeInfo
            chrome.tabs.get(tabId, tab => {
                console.log(tab)
            })
        })

        chrome.tabs.onHighlightChanged.addListener((selectInfo) => {
            console.log('onHighlightChanged', selectInfo)
        })

        chrome.tabs.onHighlighted.addListener(highlightInfo => {
            console.log('onHighlighted', highlightInfo)
        })

        chrome.tabs.onDetached.addListener(detachInfo => {
            console.log('onDetached', detachInfo)
        })

        chrome.tabs.onAttached.addListener(attachInfo => {
            console.log('onAttached', attachInfo)
        })

        chrome.tabs.onRemoved.addListener(removeInfo => {
            console.log('onRemoved', removeInfo)
        })

        chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
            console.log('onReplaced', addedTabId, removedTabId)
        })

    }

}