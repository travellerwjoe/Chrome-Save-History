/**
 * 获取用户登录信息
 */
chrome.identity.getProfileUserInfo((userInfo) => {
    common.request('/token', userInfo)
})


/**
 * 监听页面访问
 */
common.listenVisit((result) => {
    console.log(result)
    common
        .request('/history/insert', result)
        .then(res => {
            console.log(res)
        })

    // common
    //     .request('/history')
    //     .then(res => {
    //         console.log(res)
    //     })
})

/* chrome.identity.getAccounts((accounts) => {
    console.log(accounts)
}) */




