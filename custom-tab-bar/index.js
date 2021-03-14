
Component({
  data: {
    itemindex:-1,
    selected: -1,
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
    r: false,
    rot: 0,
    touchS: [0, 0],
    touchE: [0, 0],
    mr: 0,
    ao:0,
    translateR:0
  },

  properties: {
    menulist: {
      type: Array,
      value: [{
          text: '页面1',
          img: '',
          url: '/pages/dao/dao'
        },
        {
          text: '页面2',
          img: '',
          url: '/pages/yij/yij'
        },
        {
          text: '页面3',
          img: '',
          url: '/pages/li/li'
        },
        {
          text: '页面4',
          img: '',
          url: '/pages/yi/yi'
        },
        {
          text: '页面5',
          img: '',
          url: '/pages/ci/ci'
        },
        {
          text: '页面6',
          img: '',
          url: '/pages/si/si'
        },
        {
          text: '页面7',
          img: '',
          url: '/pages/jing/jing'
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

    setR() {
      if (!this.data.r) {
        this.setData({
          r: true,
          translateR:this.data.mr
        })
      } else {
        this.setData({
          r: false,
          translateR:0
        })
      }
    },

    async init() {
      this.setData({
        ao:360 / this.properties.menulist.length
      })
      await this.getNode(".menutext").then(res => {
        this.data.mr = res.width / 62.5 * 140
      });
    },

    run(n) {
      this.data.rot += this.data.ao * n;
      this.setData({
        rot:this.data.rot
      })
    },

    touchstart(e) {
      //const time = new Date().getTime()
      let tsX = e.touches[0].pageX;
      let tsY = e.touches[0].pageY;
      this.data.touchS = [tsX, tsY]
    },

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
      // console.log(url);
      // console.log(url.target.dataset.url,pages[0].is);
      if (url.target.dataset.url) {
        if (!url.target.dataset.url.includes(pages[0].is)) {
          wx.redirectTo({
            url: url.target.dataset.url+'?index='+url.target.dataset.index
          })       
        }
      }
    }

  },

  lifetimes: {
    ready() {
      this.init();
    }
  },
  pageLifetimes:{
    show(){
      //控制菜单切换后文字显示效果
      const index = getCurrentPages()[0].options.index;
      if(index){
        this.setData({
          itemindex:parseInt(index)
        })
      }
    }
  }
})