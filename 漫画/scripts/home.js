// 大厅导航页

var width = $device.info.screen.width;
var height = $device.info.screen.height;


module.exports.home = function home() {
    screen_width = $device.info.screen.width;
    screen_height = $device.info.screen.height;
    $ui.render({
        views: [{
            type: "matrix",
            props: {
                columns: 3,
                itemHeight: (screen_height - 200) / 3,
                spacing: 10,



                template: {
                    props: {},
                    views: [{
                        //     type: "label",
                        //     props: {
                        //         id: "label",
                        //         bgcolor: $color("#474b51"),
                        //         textColor: $color("#abb2bf"),
                        //         align: $align.center,
                        //         font: $font(32)
                        //     },
                        //     layout: $layout.fill
                        // },{
                        type: "image",
                        props: {},
                        layout: $layout.fill
                    }]
                }
            },
            data: [{
                type: "label",
                props: {
                    id: "label",
                    bgcolor: $color("#474b51"),
                    textColor: $color("#abb2bf"),
                    align: $align.center,
                    font: $font(32)
                },
                data: {
                    text: "das"
                },

                layout: $layout.fill
            }],
            layout: $layout.fill
        }]
    });
    list = $("matrix").data = [{
            title: "System (Text)",
            rows: [{
                type: "button",
                props: {
                    title: "Button"
                },
                layout: function (make, view) {
                    make.center.equalTo(view.super);
                    make.width.equalTo(64);
                },
                events: {
                    tapped: function (sender) {
                        $ui.toast("Tapped")
                    }
                }
            }]
        },
        {
            image: {
                src: "https://i.loli.net/2019/04/01/5ca16a94257eb.png"
            }
        },
        {
            image: {
                src: "https://i.loli.net/2019/04/01/5ca16a94257eb.png"
            }
        },
        {
            image: {
                src: "https://i.loli.net/2019/04/01/5ca16a94257eb.png"
            }
        },
        {
            image: {
                src: "https://i.loli.net/2019/04/01/5ca16a94257eb.png"
            }
        },
        {
            image: {
                src: "https://i.loli.net/2019/04/01/5ca16a94257eb.png"
            }
        },
        {
            image: {
                src: "https://i.loli.net/2019/03/15/5c8b0426ebfb0.png"
            }
        }, {
            image: {
                src: "https://i.loli.net/2019/04/01/5ca16873ea06a.gif"
            }
        },
        {
            image: {
                src: "https://i.loli.net/2019/04/01/5ca16a94257eb.png"
            }
        }

    ]

    $console.info($("matrix"));
};