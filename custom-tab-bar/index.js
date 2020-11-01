Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/index/index",
      iconPath: "/image/icon_component.png",
      selectedIconPath: "/image/icon_component_HL.png",
      text: "首页"
    }, {
      pagePath: "/profile/profile",
      iconPath: "/image/icon_API.png",
      selectedIconPath: "/image/icon_API_HL.png",
      text: "我的"
    }],
    animaData: {},
    menuanimas: [],
    r: false,
    rot: 0,
    cin: {
      'width': 0,
      'height': 0
    },
    touchS: [0, 0],
    touchE: [0, 0],
    mr: 0,
  },

  properties: {
    itmenum: {
      type: Number,
      value: 7
    },
    menulist: {
      type: Array,
      value: [{
          text: '页面1',
          img: '',
          url: '/pages/dao/dao?index=0'
        },
        {
          text: '页面2',
          img: '',
          url: '/pages/yij/yij?index=1'
        },
        {
          text: '页面3',
          img: '',
          url: '/pages/li/li?index=2'
        },
        {
          text: '页面4',
          img: '',
          url: '/pages/yi/yi?index=3'
        },
        {
          text: '页面5',
          img: '',
          url: '/pages/ci/ci?index=4'
        },
        {
          text: '页面6',
          img: '',
          url: '/pages/si/si?index=5'
        },
        {
          text: '页面7',
          img: '',
          url: '/pages/jing/jing?index=6'
        }
      ]
    },
  },

  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      this.setData({
        selected: data.index
      })
    },

    getNode(cls) {
      return new Promise((res, rej) => {
        wx.createSelectorQuery().in(this).select(cls).boundingClientRect(function (rect) {
          res(rect);
        }).exec()
      })
    },

    setMenuItem(r) {
      let ao = 360 / this.properties.itmenum;
      const arr = [];
      let anima = wx.createAnimation({
        delay: 0,
        duration: 200
      });
      for (let i = 0; i < this.properties.itmenum; i++) {
        let x = (this.data.cin.width) + r * Math.cos((ao * i - 90) * Math.PI / 180);
        let y = (this.data.cin.height) + r * Math.sin((ao * i - 90) * Math.PI / 180);
        arr.push(anima.left(x).top(y).rotateZ(ao * i).step().export());
      }
      this.setData({
        menuanimas: arr
      });
    },

    setR() {
      if (!this.data.r) {
        this.setData({
          r: true
        })
        this.setMenuItem(this.data.mr);
      } else {
        this.setData({
          r: false
        })
        this.setMenuItem(0);
      }
    },

    async init() {
      let w = 0;
      let h = 0;
      await this.getNode(".menutext").then(res => {
        w = res.width / 2
        h = res.height / 2
      });
      await this.getNode(".menu").then(res => {
        this.data.cin.width = res.width / 2 - w;
        this.data.cin.height = res.height / 2 - h;
      });
      this.setMenuItem(0);
      const screenW = wx.getSystemInfoSync().screenWidth;
      if (screenW <= 500) {
        this.data.mr = 140;
      } else if (screenW > 500 && screenW <= 800) {
        this.data.mr = 300;
      } else if (screenW > 800 && screenW <= 1024) {
        this.data.mr = 360;
      } else if (screenW > 1024) {
        this.data.mr = 480;
      }
    },

    run(n) {
      let anima = wx.createAnimation({
        delay: 0,
        duration: 100,
        timingFunction: 'ease-out'
      });
      this.data.rot += 360 / this.properties.itmenum * n;
      this.setData({
        animaData: anima.rotateZ(this.data.rot).step().export()
      })
    },

    touchstart(e) {
      //const time = new Date().getTime()
      let tsX = e.touches[0].pageX;
      let tsY = e.touches[0].pageY;
      this.data.touchS = [tsX, tsY]
    },
    touchmove(e) {},

    touchend(e) {
      let tsX = e.changedTouches[0].pageX;
      let tsY = e.changedTouches[0].pageY;
      this.data.touchE = [tsX, tsY];
      let start = this.data.touchS;
      let end = this.data.touchE;
      if (start[0] < (end[0] - 30) && this.data.r) {
        this.run(1)
      } else if (start[0] > (end[0] + 30) && this.data.r) {
        this.run(-1)
      } else {
        //console.log(e)
      }
    },

    skip(url) {
      var pages = getCurrentPages();
      //console.log(url.target.dataset.url.includes(pages[0].is),pages[0].is);
      if (url.target.dataset.url) {
        if (!url.target.dataset.url.includes(pages[0].is)) {
          wx.navigateTo({
            url: url.target.dataset.url,
          })
        }
      }
    },

    route(url) {
      const pages = getCurrentPages();
      // console.log(url.target.dataset.url,pages[0].is);
      if (url.target.dataset.url) {
        if (!url.target.dataset.url.includes(pages[0].is)) {
          wx.redirectTo({
            url: url.target.dataset.url
          })       
        }
      }
    }

  },

  lifetimes: {
    ready() {
      this.init();
    }
  }
})