// alert
// $ui.alert({
//     title: "ZY",
//     message: "hello",
// });

// 打印到控制台
// $console.info("AAAAA");

// 获取剪贴板
// $ui.preview({
//     text: JSON.stringify($clipboard.items)
// });

// http
$http.get({
    url: "https://zytomorrow.top",
    handler: function(resp) {
        var data = resp.data;
    }
});