import { GRID_KEY } from '../../config/index';

// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    tableHeader: [
      {
        prop: 'gear',
        label: '档位',
        width: 100,
      },
      {
        prop: 'buyTriggerPrice',
        label: '买入触发价',
        width: 180,
      },
      {
        prop: 'buyPrice',
        label: '买入价',
        width: 120,
      },
      {
        prop: 'buyTotalPrice',
        label: '买入总金额',
        width: 180,
      },
      {
        prop: 'buyTotalNum',
        label: '入股数',
        width: 120,
      },
      {
        prop: 'sellTriggerPrice',
        label: '卖出触发价',
        width: 180,
      },
      {
        prop: 'sellPrice',
        label: '卖出价',
        width: 120,
      },
      {
        prop: 'sellTotalNum',
        label: '出股数',
        width: 120,
      },
      {
        prop: 'sellTotalPrice',
        label: '卖出总金额',
        width: 180,
      },
      {
        prop: 'income',
        label: '收益',
        width: 100,
      },
      {
        prop: 'incomeRate',
        label: '收益率',
        width: 100,
      },
      {
        prop: 'profitPrice',
        label: '留存利润',
        width: 150,
      },
      {
        prop: 'profitNum',
        label: '留存股数',
        width: 150,
      }
    ],
    stripe: true,
    border: true,
    outBorder: true,
    tableData: [],
    collectName: '',
  },
  static: {
    
  },
  onLoad(options) {
    const { index = -1 } = options || {};

    this.getCollect(Number(index));
  },
  getCollect(index: number) {
    if(index < 0) return;
    try {
      const collectList = wx.getStorageSync(GRID_KEY);
      const { collectName, tableData } = collectList[index];
      this.setData({
        tableData,
        collectName,
      });
    } catch (e) {
      console.error(e);
    }
  }
})
