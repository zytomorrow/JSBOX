// unsplash v1.2
// unsplash.js使用unsplash官方api
// api限制每小时50次请求
// author:extrastu
// site:blog.extrastu.xin
// 为了更好的图片体验加载的是full规格的图片,可能加载的有点慢,请见谅

let appID = '17805ef4205f7051084afdf56296a3811b0d98deb7cf68688554bc54562cf222'
let page = 1, perPage = 12, photos = [], currIndex = 0, res = '', searchTxt = '';
const sizes = [$size(550, 850), $size(1000, 665), $size(1024, 689), $size(640, 427),]
const CN_MENU = ['最新', '精选', '搜索']
const dw = $device.info.screen.width
const dh = $device.info.screen.height
let h = 250
$ui.render({
    props: {
        title: "unsplash",
        navButtons: [{
            title: "支持",
            icon: "103",
            handler: () => {
                $ui.menu({
                    items: ["越花越有礼❤", "请我喝杯咖啡❤"],
                    handler: (title, idx) => {
                        switch (idx) {
                            case 0:
                                $clipboard.text = '小伙伴们，给大家发红包喽！领完上App Store绑定支付宝就能用。6zKICt25e8 用完还能赢4999元购物津贴！#吱口令#长按复制此消息，打开支付宝就能领取！';
                                $ui.alert({
                                    title: "支持",
                                    message: "apple store红包已复制到剪切板\n打开支付宝即可使用\n\n感谢您的支持❤"
                                })
                                break;
                            case 1:
                                $app.openURL("https://www.buymeacoffee.com/extra")
                                break;
                        }
                    }
                })
            }
        }]
    },
    views: [
        //loading入场动画
        {
            type: "image",
            props: {
                src: "http://oz53lzns9.bkt.clouddn.com/18-8-23/41250009.jpg"
            },
            layout: (make, view) => {
                make.height.equalTo(view.super);
                make.width.equalTo(view.super);
            }
        },
        {
            type: "label",
            props: {
                id: "header",
                alpha: 0,
            },
            layout: function (make, view) {
                make.height.equalTo(50)
                make.width.equalTo(view.super);
            },
            views: [
                {
                    type: "image",
                    props: {
                        src: "http://oz53lzns9.bkt.clouddn.com/18-8-4/86764088.jpg"
                    },
                    layout: (make, view) => {
                        make.height.equalTo(view.super);
                        make.width.equalTo(view.super);
                    }
                },
                {
                    type: "label",
                    props: {
                        text: "Photos for everyone",
                        font: $font("ChalkboardSE-Light", 35),
                        color: $color("#FFF")
                    },
                    layout: function (make, view) {
                        make.center.equalTo(view.super)
                    }
                }
            ]
        },
        {
            type: "matrix",
            props: {
                id: "listView",
                columns: 2,
                spacing: 10,
                selectable: true,
                waterfall: true,
                square: false,
                alpha: 0,
                template: [
                    {
                        type: "image",
                        props: {
                            id: "image",
                            smoothRadius: 10,
                            info: "unsplash"
                        },
                        layout: $layout.fill
                    },
                ]
            },
            layout: function (make) {
                make.left.bottom.right.equalTo(0)
                make.top.equalTo(0)
            },
            events: {
                itemSize: (sender, indexPath) => {
                    return sizes[indexPath.item % 4]
                },
                didSelect: function (sender, indexPath, object) {
                    h = 10
                    $ui.push({
                        props: {
                            title: "image"
                        },
                        views: [{
                            type: "image",
                            props: {
                                src: object.image.src,
                                scale: 0.8
                            },
                            layout: (make, view) => {
                                make.width.equalTo
                            },
                            events: {
                                tapped: function (sender) {
                                    $http.download({
                                        url: object.image.src,
                                        handler: function (resp) {
                                            $share.universal(resp.data)
                                            $app.tips("下载完成")
                                        }
                                    })
                                }
                            }
                        }]
                    })
                },
                didReachBottom: function (sender) {
                    $ui.toast("请求数据中...")
                    $device.taptic(1)
                    page++;
                    if (currIndex == 0) {
                        fetchData(page, perPage, "https://api.unsplash.com/photos")
                    } else if (currIndex == 1) {
                        fetchData(page, perPage, "https://api.unsplash.com/collections/featured")
                    }
                    $delay(1.5, function () {
                        sender.endFetchingMore()
                    })
                }
            }
        }
        ,
        {
            type: "menu",
            props: {
                id: "menuView",
                items: CN_MENU,
                alpha: 0,
            },
            layout: (make, view) => {
                make.bottom.inset(0)
                make.height.equalTo(44);
                make.width.equalTo(view.super);
            },
            events: {
                changed: function (sender) {
                    let items = sender.items
                    let index = sender.index
                    currIndex = index
                    photos.splice(0, photos.length)
                    if (index == 0) {
                        fetchData(page, perPage, "https://api.unsplash.com/photos")
                    } else if (index == 1) {
                        fetchData(page, perPage, "https://api.unsplash.com/collections/featured")
                    } else if (index == 2) {
                        searchPhotoView()
                    }
                }
            }
        },
    ]
})


function searchPhotoView() {
    $ui.push({
        type: "view",
        props: {
            title: "搜索",
            bgcolor: $color("#008080"),
        },
        views: [
            {
                type: "input",
                props: {
                    id: "searchInput",
                    bgcolor: $color("#fff"),
                    placeholder: "输入图片/作者/类名进行搜索",
                    clearsOnBeginEditing: true,
                    font: $font(18),
                    radius: 0
                },
                layout: (make, view) => {
                    make.top.left.right.inset(0)
                    make.height.equalTo(35)
                },
                events: {
                    returned(sender) {
                        sender.blur()
                        if (sender.text) {
                            searchTxt = sender.text
                            $device.taptic(0);
                            $ui.toast("正在为你查找中...")
                            fetchData(page, perPage, 'https://api.unsplash.com/search/collections?query=' + sender.text)
                        } else {
                            sender.text = "输入图片/作者/类名进行搜索"
                        }
                    }
                }
            },
            {
                type: "label",
                props: {
                    id: "photosCount",
                    bgcolor: $color("#fff"),
                    font: $font("bold", 30),
                    textColor: $color("#008080"),
                    autoFontSize: true
                },
                layout: function (make, view) {
                    make.top.equalTo($("searchInput").bottom).offset(1)
                    make.height.equalTo(35)
                    make.width.equalTo(view.super);
                }
            },
            {
                type: "matrix",
                props: {
                    id: "searchListView",
                    columns: 1,
                    spacing: 10,
                    selectable: true,
                    waterfall: true,
                    square: false,
                    bgcolor: $color("#eeeeee"),
                    footer: {
                        type: "label",
                        props: {
                            id: "searchListFooter",
                            height: 50,
                            text: "加载中...",
                            textColor: $color("#008080"),
                            align: $align.center,
                            font: $font(12)
                        }
                    },
                    template: [
                        {
                            type: "image",
                            props: {
                                id: "searchRes",
                                smoothRadius: 10,
                            },
                            layout: $layout.fill
                        }
                    ]
                },
                layout: (make, view) => {
                    make.top.equalTo($("photosCount").bottom)
                    make.bottom.inset(0)
                    make.left.right.inset(0)
                },
                events: {
                    itemSize: (sender, indexPath) => {
                        return sizes[indexPath.item % 4]
                    },
                    didSelect: function (sender, indexPath, object) {
                        console.log(object)
                        $ui.push({
                            props: {
                                title: "image"
                            },
                            views: [{
                                type: "image",
                                props: {
                                    src: object.searchRes.src
                                },
                                layout: $layout.fill,
                                events: {
                                    tapped: (sender) => {
                                        $http.download({
                                            url: object.searchRes.src,
                                            handler: function (resp) {
                                                $share.universal(resp.data)
                                                $app.tips("下载完成")
                                            }
                                        })
                                    }
                                }
                            }]
                        })
                    },
                    didReachBottom: (sender) => {
                        $ui.toast("请求数据中...")
                        $device.taptic(1)
                        page++;
                        fetchData(page, perPage, 'https://api.unsplash.com/search/collections?query=' + searchTxt)
                        $delay(1.5, function () {
                            sender.endFetchingMore()
                        })
                    }
                }
            }
        ]
    })
    fetchData(page, perPage, 'https://api.unsplash.com/search/collections?query=city')
    $("photosCount").text = "本周热搜";
}

function fetchData(page, perPage, reqUrl) {
    if (currIndex == 2) {
        var url = reqUrl + "&client_id=" + appID + "&page=" + page
    } else {
        var url = reqUrl + "?client_id=" + appID + "&page=" + page + "&per_page=" + perPage
    }
    $ui.loading(true)
    $http.get({
        url: url,
        handler: (resp) => {
            $ui.loading(false)
            photos = photos.concat(resp.data)
            console.log(photos.length)
            render(photos)
        }
    })

}

function render(data) {
    if (data == "") {
        console.log("暂未匹配到结果")
        $ui.alert("暂未匹配到结果")
        return false
    } else {
        if (currIndex == 2) {
            data.map((item) => {
                $("searchListView").data = item.results.map((i) => {
                    return { searchRes: { src: i.cover_photo.urls.regular } }
                })
            })
        } else {
            $("listView").data = data.map(function (item) {
                $ui.animate({
                    duration: .4,
                    animation: () => {
                        $("listView").alpha = 1
                        $("menuView").alpha = 1
                    }
                });

                if (currIndex == 0) {
                    return { image: { src: item.urls.regular } }
                } else if (currIndex == 1) {
                    return { image: { src: item.cover_photo.urls.regular } }
                }

            })
        }

    }

}

function fetchNetworkType() {
    let networkType = $device.networkType
    if (networkType == 0) {
        $ui.alert("您当前无网络,请检查后再试")
    } else if (networkType == 1) {
        $ui.toast("您正在使用wifi网络")
    } else {
        $ui.toast("您正在使用蜂窝数据网络")
    }
}

fetchNetworkType()
fetchData(page, perPage, "https://api.unsplash.com/photos")


