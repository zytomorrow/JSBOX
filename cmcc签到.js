$ui.render({
    props: {
        title: "签到"
    },
    views: [{
        type: "list",
        props: {
            id: "list",
            rowHeght: 80,
            tempalate: [

                {
                    type: "label",
                    props: {
                        font: $font("bold", 17),
                        lines: 0

                    }
                }

            ]
        },
        layout: function (make, view) {

        },
        events: {

        }
    }]
});






var login = $http.post({
    url: "http://cmcc.bid/auth/login",
    // header: {

    // },
    body: {
        email: "z794672847@QQ.COM",
        passwd: "ZY950722",
        code: ""
    },
    handler: function (resp) {
        var data = resp.data;
        check_in()
        $console.info(resp);
        $console.info(resp.url);
    }
});


function check_in() {
    $http.post({
        url: "http://cmcc.bid/user/checkin",
        // header: {

        // },
        // body: {

        // },
        handler: function (resp) {
            var data = resp.data;
            $console.info(data);
        }
    });
}