a = {
    type: "list",
        props: {
        data: ["JavaScript", "Swift"]
    },
    layout: $layout.fill,
}

$ui.render({
    props: {
        title: "TEST"
    },
    views: [{
        type: "list",
        props: {
            data: ["JavaScript", "Swift"]
        },
        layout: $layout.fill,
    }]
});