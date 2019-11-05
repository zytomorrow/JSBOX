function login(basicUrl, user, passwd, code) {
  $http.post({
    url: `${basicUrl}/auth/login`,
    header: {},
    body: {
      email: user,
      passwd: passwd,
      code: code
    },
    handler: function(resp) {
      //   $console.info(resp.data);
      checkIn(basicUrl);
    }
  });
}

function checkIn(basicUrl) {
  $http.post({
    url: `${basicUrl}/user/checkin`,
    handler: function(resp) {
      $console.info(resp.data);
      $ui.alert(resp.data);
    }
  });
}

login(`http://cmcc.bid`, 'z794672847@qq.com', 'Zy950722', '');
login(`https://sight.kim`, 'z794672847@QQ.com', 'Zy950722', '');
