/**
 * props类型
 */
export type Props = {
  /**
   * 弹幕列表
   */
  danmus: Danmu[],
  /**
   * 轨道数量 0为最大轨道数量（撑满容器）
   */
  channels?: number,
  /**
   * 自动播放 默认true
   */
  autoplay?: boolean,
  /**
   * 循环播放 默认false
   */
  loop?: boolean,
  /**
   * 是否开启插槽 默认false
   */
  useSlot?: boolean,
  useSuspendSlot?: boolean,
  /**
  * 弹幕刷新频率(ms) 默认100
  */
  debounce?: number,
  /**
   * 弹幕速度（像素/秒） 默认200
   */
  speeds?: number,
  /**
     * 是否开启随机轨道注入弹幕 默认false
     */
  randomChannel?: boolean,
  /**
    * 弹幕字号（仅文本模式） 默认18
    */
  fontSize?: number,
  /**
   * 弹幕垂直间距 默认4
   */
  top?: number,
  /**
   * 弹幕水平间距 默认0
   */
  right?: number,
  /**
   * 是否开启悬浮暂停 默认false
   */
  isSuspend?: boolean,
  /**
   * 弹幕额外样式
   */
  extraStyle?: string,
}

/**
 * 自定义弹幕
 */
type CustomDanmu = {
  [key: string]: any
}

/**
 * 弹幕类型
 */
export type Danmu = string | CustomDanmu

/**
 * 弹幕轨道
 */
export interface DanChannel {
  [index: number]: [HTMLDivElement]
}