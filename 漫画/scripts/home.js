var episode = require("./episode");



// $ui.render({
//     props: {
//         title: "漫画大厅"
//     },

//     views: [
//         {
//             footer: {
//                 type: "label",
//                 props: {
//                     height: 20,
//                     text: "Write the Code. Change the world.",
//                     textColor: $color("#AAAAAA"),
//                     align: $align.center,
//                     font: $font(12)
//                 }
//             }
//         }
//     ]




// });


// 大厅导航页
$ui.render({
    views: [{
        type: "list",
        props: {
            rowHeight: 80,
            id: "index",
            template: [

                {
                    type: "image",
                    props: {
                        id: "image"
                    },
                    layout: (make, view) => {
                        make.left.top.bottom.inset(5);
                        make.width.equalTo(view.height);
                    }
                },

                {
                    type: "label",
                    props: {
                        id: "label",
                        font: $font("bold", 17),
                        lines: 0
                    },
                    layout: make => {
                        make.left.equalTo($("image").right).offset(10);
                        make.top.bottom.equalTo(0);
                        make.right.inset(10);
                    }
                },

            ],

            actions: [{
                title: "Share",
                handler: (sender, indexPath) => {
                    var data = sender.object(indexPath);
                    $share.sheet([data.url, data.label.text]);
                }
            }]
        },
        layout: $layout.fill,

        events: {
            didSelect: (sender, indexPath, data) => {
                episode.episodePage(data.animeID, data.animeName);
            },
            pulled: function () {
                getAllComics();
            }
        }


    }]
});


// ====================================================================
// 主界面相关
// ====================================================================
// 获取漫画清单
function getAllComics(nowpage = 1, allpage = -1, alldata = []) {
    if (nowpage == allpage + 1) {
        // $console.info(alldata);
        return;
    } else {
        $http.get({
            url: `https://prod-api.ishuhui.com/ver/d1472853/comics/list?pageSize=24&toView=true&.json&page=${nowpage}`,
            handler: function (resp) {
                // $console.info(page);
                // $console.info(resp.data.data.data);
                nowpage += 1;

                // 尝试获取数据，error则退出获取
                // allpage = resp.data.data.totalPages;
                // for (var i = 0; i < resp.data.data.data.length; i++) {
                //     alldata.push(resp.data.data.data[i]);
                // }
                // renderIndex(alldata);
                // return getAllComics(page = page, allpage = allpage, alldata = alldata);





                try {
                    allpage = resp.data.data.totalPages;
                    for (var i = 0; i < resp.data.data.data.length; i++) {
                        alldata.push(resp.data.data.data[i]);
                    }
                    renderIndex(alldata);

                } catch (error) {
                    $console.info(typeof (nowpage), nowpage, typeof (allpage), allpage);
                    $console.info("已获取完毕", nowpage, allpage);
                    return;
                }
                return getAllComics(nowpage = parseInt(nowpage), allpage = allpage, alldata = alldata);

            }
        });
    }
}

// 渲染主界面
function renderIndex(items) {
    $("index").data = items.map(item => {
        return {
            animeName: item.title, // 漫画名

            label: {
                // text: $text.HTMLUnescape(item.animeName)
                text: $text.HTMLUnescape(item.title) // 漫画名
            },
            image: {
                src: item.thumb // 封面图
            },

            // t: {
            //     text: new Date(parseInt(item.time)).toLocaleString().replace(/:\d{1,2}$/, ' ')
            // },

            animeID: item.animeID, // 漫画的ID号
            minorTitle: item.minorTitle, // 副标题--最新话
            lastUpdate: new Date(parseInt(item.time)).toLocaleString().replace(/:\d{1,2}$/, ' '), // 最新更新时间
        };
    });

    // $console.info(lastUpdate);
    $("index").endRefreshing();
}


// 初始执行
getAllComics(nowpage = 1);