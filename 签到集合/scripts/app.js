function indexPage() {
  $ui.render({
    props: {
      title: '签到配置'
    },
    views: [
      {
        type: 'list',
        id: 'ssr',
        props: {
          data: [
            {
              label: {
                text: 'cmcc'
              }
            },
            {
              label: {
                text: '视界'
              }
            },
            {
              label: {
                text: 'test',
                id: 'test'
              }
            }
          ],
          template: [
            {
              type: 'label',
              props: {
                align: $align.left
              },
              layout: $layout.fill
            },
            {
              type: 'switch',
              props: {
                on: false,
                onColor: $color('green')
              },
              layout: function(make, view) {
                make.top.right.inset(5);
              },
              events: {
                changed: function(sender) {
                  $console.info(sender);
                }
              }
            }
            // {
            //   type: 'input',
            //   props: {
            //     type: $kbType.search,
            //     darkKeyboard: true
            //   },
            //   layout: function(make, view) {
            //     make.center.equalTo(view.super);
            //     make.size.equalTo($size(100, 32));
            //   }
            // }
          ]
        },
        layout: $layout.fill
      }
    ]
  });
}

module.exports = {
  indexPage: indexPage
};
