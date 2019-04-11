$http.get({
    url: "https://prod-api.ishuhui.com/ver/82383992/comics/list/?page=4&pageSize=24&toView=true",
    // url: "https://www.baidu.com",
    timeout: 5,
    handler: function(resp) {
        var data = resp.data;
        $console.info(resp);
    }
});