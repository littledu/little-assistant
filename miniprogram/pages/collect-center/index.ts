import { GRID_KEY } from '../../config/index';

// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    right: [
      {
        text: '删除',
        icon: {
          name: 'delete',
          size: 16,
        },
        className: 'btn delete-btn',
      },
    ],
    rightIcon: [
      {
        icon: 'delete',
        className: 'btn delete-btn',
      },
    ],
    collectList: [],
  },
  static: {
    
  },
  onLoad() {
    this.getCollectList();
  },
  getCollectList() {
    try{
      const collectList = wx.getStorageSync(GRID_KEY);
      this.setData({
        collectList,
      });
    } catch(e) {
      console.error(e);
    }
  },
  goToDetail(e: WechatMiniprogram.Event) {
    const { index } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/collect-detail/index?index=${index}`,
    });
  }
})
