import NP from 'number-precision';

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
    buyMethod: 'price',
  },
  static: {
    baseBuyTriggerPrice: 0,
    percent: 0.05,
    minusGap: 0.00341297, // E大网格触发价与成交价的差值
  },
  onLoad() {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onGenerate(e: WechatMiniprogram.FormSubmit) {
    let { depth, baseBuyTriggerPrice, buyTotal, profit } = e.detail.value;
    const { percent } = this.static;

    depth = Number(depth);
    buyTotal = Number(buyTotal);
    profit = Number(profit);
    this.static.baseBuyTriggerPrice = Number(baseBuyTriggerPrice);
    const tableData = [] as any;

    for (let i = 0; i < depth; i++) {
      // 档位
      const gear = NP.minus(1, NP.times(i, percent));

      // 买入触发价
      const buyTriggerPrice = this.getBuyTriggerPrice(i);

      // 买入价
      const buyPrice = this.getBuyPriceOrSellTriggerPrice(buyTriggerPrice);

      // 获取买入股数和买入金额
      const { buyTotalPrice, buyTotalNum } = this.getBuyTotalPriceAndBuyTotalNum(buyTotal, buyPrice);

      // 卖出价格
      const sellPrice = i === 0 ? this.getFirstSellPrice(buyPrice) : tableData[tableData.length - 1].buyPrice;

      // 卖出触发价
      const sellTriggerPrice = this.getBuyPriceOrSellTriggerPrice(sellPrice);

      // 正常卖出股数
      let sellTotalNum = buyTotalNum;

      // 正常卖出总金额
      let sellTotalPrice = NP.round(NP.times(sellTotalNum, sellPrice), 0);

      // 收益
      const income = NP.minus(sellTotalPrice, buyTotalPrice);

      // 收益率
      const incomeRate = `${NP.round(NP.times(NP.divide(income, buyTotalPrice), 100), 2)}%`;

      // 留存利润
      let profitPrice = 0;
      
      // 留存股数
      let profitNum = 0;

      if(profit) {
        // 留存利润
        // 单份利润：全部卖出数量*卖出价格 - 买入总价格
        // 多份利润：profix * 单份利润
        profitPrice = NP.round(NP.times(profit, NP.minus(NP.times(buyTotalNum, sellPrice), buyTotalPrice)), 0);

        // 留存利润后的卖出总金额
        sellTotalPrice = NP.minus(sellTotalPrice, profitPrice);

        // 留存利润后的卖出股数
        sellTotalNum = NP.round(NP.divide(sellTotalPrice, sellPrice), 0);

        profitNum = NP.minus(buyTotalNum, sellTotalNum);
      }

      tableData.push({
        gear,
        buyTriggerPrice,
        buyPrice,
        buyTotalPrice,
        buyTotalNum,
        sellTriggerPrice,
        sellPrice,
        sellTotalNum,
        sellTotalPrice,
        income,
        incomeRate,
        profitPrice,
        profitNum
      });
    }

    this.setData({
      tableData,
    });

    console.log(tableData);
  },
  /**
   * 获取买入触发价
   * @param depth number
   * @returns number
   */
  getBuyTriggerPrice(depth: number) {
    const { baseBuyTriggerPrice, percent } = this.static;
    return NP.round(NP.times(baseBuyTriggerPrice, NP.minus(1, NP.times(percent, depth))), 3);
  },
  /**
   * 获取买入价或卖出触发价
   * 买入价相对于买入触发价，卖出触发价又相对于卖出价
   * @param price number
   * @returns number
   */
  getBuyPriceOrSellTriggerPrice(price: number) {
    const { minusGap } = this.static;
    return NP.round(NP.times(price, NP.minus(1, minusGap)), 3);
  },
  getFirstSellPrice(buyPrice: number) {
    const { percent } = this.static;
    return NP.round(NP.times(buyPrice, NP.plus(1, percent)), 3);
  },
  getBuyTotalPriceAndBuyTotalNum(total: number, price: number) {
    const { buyMethod } = this.data;

    if(buyMethod === 'price') {
      return {
        buyTotalPrice: total,
        buyTotalNum: NP.round(NP.divide(total, price), 0),
      }
    }

    return {
      buyTotalPrice: NP.round(NP.times(total, price), 0),
      buyTotalNum: total,
    }
  },
  onBuyMethodChange(e: WechatMiniprogram.CustomEvent){
    const { value } = e.detail;

    this.setData({
      buyMethod: value,
    });
  }
})
