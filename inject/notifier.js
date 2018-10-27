/*! Copyright (c) 2016-2017 Rene Tanczos <gravmatt@gmail.com> - The MIT License (MIT) */
// https://github.com/gravmatt/js-notify
(function (window, document, undefined) {
  var notify = function (title, options) {
    var guid = function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    if (!window.Notification) {
      return;
    }
    if (Notification.permission === 'default') {
      Notification.requestPermission(function () {
        title && notify(title, options);
      });
    } else if (Notification.permission === 'granted') {
      if (!title) return undefined;
      opt = options || {}
      opt.tag = guid()
      var n = new Notification(title, opt);
      n.onclick = function () {
        opt.onclick && opt.onclick(this);
        this.close();
      };
      n.onclose = function () {
        opt.onclose && opt.onclose(this);
      };
      return n;
    } else if (Notification.permission === 'denied') {
      (options && options.ondenied) && options.ondenied(this);
    }
  };
  if (typeof module === "object" && module && typeof module.exports === "object") {
    module.exports = notify;
  } else {
    window.notify = notify;
    if (typeof define === "function" && define.amd) {
      define("notify", [], function () {
        return notify;
      });
    }
  }
})(window, document);

var oldtitle = ""
var noti = null
setInterval(function () {
  var dd = document.getElementsByTagName("title")
  if (dd.length > 0) {
    var title = dd[0].innerHTML
    if (oldtitle != title) {
      oldtitle = title
      if (oldtitle.match("^\\(.*\\)")) {
        if (noti) {
          try {
            noti.close()
          } catch (e) {}
        }
        noti = window.notify('Teams', {
          body: oldtitle,
          onclick: function (e) {}, // e -> Notification object
          onclose: function (e) {},
          ondenied: function (e) {}
        })
      }
    }
  }
}, 5000)

// setTimeout(function () {
//   // Note: There's no need to call webkitNotifications.checkPermission().
//   // Extensions that declare the notifications permission are always
//   // allowed create notifications.

//   // Create a simple text notification:
//   console.log(chrome)
//   console.log(notifications)
//   var notification = chrome.notifications.create('reminder', {
//     type: 'basic',
//     title: 'Don\'t forget!',
//     message: 'You have  things to do. Wake up, dude!'
//   }, function (notificationId) {});

//   // Or create an HTML notification:
//   //var notification = chrome.notifications.createHTMLNotification(
//   //  'notification.html'  // html url - can be relative
//   //);

//   // Then show the notification.
//   notification.show();
// }, 5000);
