// 主界面
$ui.render({
  views: [
    {
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
          }
        ],
        actions: [
          {
            title: "Share",
            handler: (sender, indexPath) => {
              var data = sender.object(indexPath);
              $share.sheet([data.url, data.label.text]);
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: (sender, indexPath, data) => {
          episodePage(data.animeID);
        },
        pulled: getAllComics
      }
    }
  ]
});

// ====================================================================
// 主界面相关
// ====================================================================
// 页数不多，采用递归获取所有资源
function getAllComics(page = 1, allpage = -1) {
  if (page != allpage + 1) {
    $http.get({
      url: `https://prod-api.ishuhui.com/ver/82383992/comics/list/?page=2&pageSize=${page}&toView=true`,
      // body: {
      //   "pageSize": "24",
      //   "toView": "true",
      //   ".json": "",
      //   "page": `${page}`,
      // },
      handler: function (resp) {
        page += 1;
        allpage = resp.data.data.totalPages
        renderIndex(resp.data.data.data)
        return getAllComics(page = page, allpage = allpage);
      }
    })
  }
}
// 渲染主界面
function renderIndex(items) {
  $("index").data = items.map(item => {
    return {
      label: {
        text: $text.HTMLUnescape(item.animeName)
      },
      image: {
        src: item.animeThumb
      },
      animeID: item.animeID
    }
  });
  $("index").endRefreshing();
}


// 补齐位数--->又特么递归，迟早会死翘翘！！！！
// 还没谁能把漫画更新到99999话，五位数足够了
function toSameLength(indexKey) {
  newIndexKey = indexKey;
  if (indexKey.length==5) {
    return newIndexKey;
  }else {
    newIndexKey = "0" + newIndexKey;
    return toSameLength(newIndexKey);
  }
}


// ====================================================================
// 章节页
// ====================================================================
// 显示所有章节
function showAllEpisode(id) {
  $http.get({
    url: `https://prod-api.ishuhui.com/ver/82383992/anime/detail?id=${id}&type=comics&.json`,
    handler: function(resp) {
      var items = resp.data.data.comicsIndexes["1"].nums;  // 包含所有EpisodeGroup的Obeject
      
      // 对分组进行升序排列
      temp = [];  // 暂存所有的章节
      EpisodeID = 1  // 序号索引，因为自带的ID属性有问题
      rawEpisodeGroup = Object.keys(items).sort()  // EpisodeGroup的Key值
      // 重新建立键值对对应关系
      orderEpisodeGroup = {};  // 暂存修改了Key的EpisodeGroup
      indexEpisodeGroup = 0;   // EpisodeGroup的key值
      for (var i in rawEpisodeGroup) {
        ii = toSameLength(rawEpisodeGroup[i].split("-")[0])
        orderEpisodeGroup[ii] = rawEpisodeGroup[i];
      }
      orderGroupIndex = Object.keys(orderEpisodeGroup).sort()

      for (var episodeGroup in orderGroupIndex) {
        group = orderEpisodeGroup[orderGroupIndex[episodeGroup]];
        groupDetail = items[group];

        sortEpisodeIndex = Object.keys(groupDetail).sort()
        newsortEpisode = {}
        for (var i in sortEpisodeIndex) {
          ii = toSameLength(sortEpisodeIndex[i])
          newsortEpisode[ii] = sortEpisodeIndex[i];
        }

        sortEpisodeIndex = Object.keys(newsortEpisode).sort()
        for (var episodeIndex in sortEpisodeIndex) {
          episodeIndex = newsortEpisode[sortEpisodeIndex[episodeIndex]];
          items[group][episodeIndex][0]["index"] = EpisodeID;
          
          temp.push(items[group][episodeIndex]);
          EpisodeID += 1;
        }
      }

      // $console.info(Object.keys(tem).length, "as");
      // $console.info(tem);
      renderEpisode(temp);
      temp = [];
    }
  });
}

// 章节数据渲染
function renderEpisode(items) {
  var episode = $("episodeList");

  episode.data = items.map(item => {
    return { 
      A: {
        text: $text.HTMLUnescape(`第${item[0].index}话\t\t${item[0].title}`)
      },
      detailID: item[0].id,
      detailName: item[0].title
    }
  });
  episode.endRefreshing();
}

// 章节页
function episodePage(id) {
  showAllEpisode(id); 
  $ui.push({
    props: {
      title: "asd",
    },
    views: [
      {
        type: "list",
        props: {
        id: "episodeList",
        rowHeight: 25,
        template: [
          {
            type: "label",
            props: {
              id: "A",
              font: $font("bold", 17),
              lines: 0
            },
            layout: (make, view) => {
              // make.left.top.bottom.right.inset(5);
              make.width.equalTo(view.width);
            }
          }
        ]
      },
      layout: $layout.fill,
      events: {
        didSelect: (sender, indexPath, data) => {
          seeAllpic(data.detailID, data.detailName);
        }
      }
    }]
  });
}


// ==========================================================
// 漫画显示页
// ==========================================================
// 获取某个漫画下的所有图片地址
function getAllPic(detailID) {
  $console.info(detailID);
  $http.get({
    url: `https://prod-api.ishuhui.com/comics/detail?id=${detailID}`,
    handler: function(resp) {
      var allimg = resp.data.data.contentImg;
      renderPicData(allimg);
      $console.info(allimg)
    }
  });
}

// 渲染数据
function renderPicData(items) {
  // items = items[1, items.length-2]
  $("a").data= items.map(item => {
    return {
      image: {
        src: item.url
      }
    }
  })
  $console.info($("a"));
  
}


// getAllPic()

// 漫画显示页
function seeAllpic(detailID, detailName) {

  getAllPic(detailID)

  $ui.push({
    props: {
      title: detailName
    },
    views: [{
      type: "list",

      props: {
        id: "a",
        rowHeight: $device.info.screen.height,
        template: [
          {
            type: "image",
            props: {
              id: "image"
            },
            layout: (make, view) => {
              // make.left.top.bottom.inset(5);
              // view.width = 
              make.width.equalTo($device.info.screen.width);
              make.height.equalTo($device.info.screen.height)
            },
            
          },
        ],
      },
      layout: $layout.fill,
    
    }]
  });
  
}



// 首次进入刷新
getAllComics()

