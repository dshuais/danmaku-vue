<!--
 * @Author: dushuai
 * @Date: 2023-05-25 15:46:39
 * @LastEditors: dushuai
 * @LastEditTime: 2023-06-12 10:46:09
 * @description: app
-->
<script setup lang="ts">
import Stats from 'stats.js'
import Danmaku from '../packages'
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { getImageUrl } from './utils';

var stats = new Stats()
stats.showPanel(0) // : fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
stats.dom.style.display = 'none'

function animate() {
  stats.begin()
  stats.end()
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

const danmaku = ref<InstanceType<typeof Danmaku>>()

type dm = {
  avatar: string,
  text: string,
  isMe?: boolean
}
const Danmus = ref<string[] | dm[]>([])

// 弹幕来自b站首页
const danmus = [
  '草',
  '高技术力',
  '汤姆逊波纹疾走…啊哒哒哒哒哒哒……',
  '此曲一出，非死即伤',
  '这播放量不应该啊',
  '牛皮！',
  '全  文  背  诵',
  'ohhhhhhh',
  'NICE',
  '草这死亡姿势',
  '日常迫害团长',
  '溜了溜了',
  '火钳刘明',
  '真实',
  '汤姆逊波纹疾走',
  '不  要  停  下  来  啊',
  '泥 给 路 打 油',
  '停下来了',
  '草',
  '完全一致',
  '你怎么还没有被禁赛',
  '6P41波纹疾走!!!',
  '牛逼',
  '草',
  '草',
  'cccccccc',
  '人才不火系列',
  '双厨狂喜',
  '双厨曝炸',
  '火钳留名',
  '火钳留名',
  '牛逼啊',
  '草',
  '草',
  '要素过多',
  '火钳刘明',
  '高技术力suki',
  'bo良ki影觉得很赞',
  '你们的下一句话是名场面',
  'Niiice',
  '太草了',
  '哈哈哈哈',
  '火钳刘明',
  '6p41疾走',
  '袭击妈妈',
  '占戈哥欠走己',
  '又看jojo又玩r6的人恐怕太少了吧',
  '好活当赏',
  '要素过多',
  '动作也太流畅了吧',
  '世界名画',
  '好活，当赏',
  '全程高能',
  '新人都是怪物.jpg',
  '我的人质啊',
  '袭击妈妈锁孔看她',
  '完全不会画画（大嘘）',
  '好活',
  '爆头 2333333',
  '把队友杀了的屑',
  '动作指导:奥尔加',
  '草',
  '要素过多',
  '噗',
  '让你玩手机',
  '6啊',
  '我负责救人质',
  '三厨狂喜',
  '三厨狂喜',
  '万能日语',
  '耶———————格——————————',
  '6P41波纹疾走',
  '“哦”踩点还行',
  '火钳刘明。',
  '哎地唉洗',
  '这枪不是m249啊，等等叫什么来的',
  '火钳刘明',
  '光棍节， 。去过',
  '炸死队友哈哈哈',
  '火钳刘明',
  '火钳刘明',
  'cao',
  '火钳刘明',
  '提前Niiiiiiiice！',
  '火钳刘明',
  '神仙UP',
  '又被爆头了',
  '6p41疾走',
  '好活',
  '人质好好笑啊',
  '不要停下来啊',
  '好活啊！！',
  '6P41波纹疾走 （换成AK是不是更爽）',
  '恭喜你发现宝藏',
  '恭喜你发现宝藏',
  '恭喜你发现宝藏',
  '前方高能',
  '封禁30分钟',
  '火钳刘明',
  '该赏',
  '我靠，就冲着高帧数，投币了',
  '不 要 停 下 来 啊（指你给路）',
  '卧槽 无情',
  '草',
  'ADS草',
  '世界线收束',
  '火钳刘明',
  '人质：给我把抢我跟他拼了',
  '小车灵魂',
  '卧槽这帧数',
  'jojoの奇妙转场',
  'niiiiiiice',
  '好活',
  '要素过多',
  '6p41',
  'TK*3移除对战',
  '这场景布置有弹丸那味儿了',
  '草',
  '草',
  '不要让战斗停下来',
  '火钳留名',
  '炸死俩盾哈哈',
  '太草了，',
  '万能日语',
  '伪渲染(确信)',
  '要素过多',
  '火钳刘明',
  '卧槽',
  '炸死队友',
  '危',
  '这才是真正的高技术力',
  '高技术力suki',
  '火钳刘明',
  '欺负我不懂日语系列',
  '我打我自己',
  '帧数爆炸',
  '危',
  '危',
  '要素过多',
  '巨真实这小车',
  '牛逼',
  '帧数高的吓人',
  '5v5→3v3',
  '我都是俄式救援',
  'niiiiiiiiiiiice',
  '别啊！',
  '尼给路嗒呦',
  '目测会火',
  '双厨狂喜',
  '人质已解救（脱）',
  '哈哈哈哈哈',
  '要素过多',
  'nb',
  '杀了两个队友不就被踢出去了吗',
  '这是新人？',
  '没毛病',
  '一甲fuze',
  '要素过多',
  '大————头————',
  '人————质————',
  '这是组长吗？',
  '不是M249，是PKP',
  '卡其脱离太',
  '等等JOJO是你？',
  '我就是又看JOJO又玩r6',
  '二乔？？？？？？',
  '这也太流畅了吧',
  '这tm能出番了这帧数和技术',
  'kpm波纹疾走',
  '大制作',
  '太草了',
  '耶——格——',
  '高技术力',
  '精神小车',
  '左轮庸医',
  '袭击人质，锁孔看他',
  '奈~~斯 屑队友被杀✓',
  '惨  盾兵  惨',
  '打敌人误伤不算',
  '不要停下来啊! (指解救人质)',
  '嘴巴被贴胶还能说话的人质是鉴',
  '哈哈哈哈哈哈哈哈哈',
  '一局11杀',
  '二乔同款姿势 哈哈',
  '耶格！',
  '看',
  '鉴作无误',
  '双出狂喜',
  '为什么不是中文',
  '经典咚咚咚………三声雷，带你飞',
  '要素过多',
  'jojo',
  '三厨狂喜',
  '我也是又看又玩',
  '我都听到lisalisa了doge',
  '你给路打油',
  '确实质量很高啊',
  'NICE',
  '银魂？',
  '火钳刘明',
  '我就是又看jojo又玩R6（1631小时）的，你有什么事吗？',
  '哟西哟西',
  '要素过多',
  '我也是看JOJO，玩r6',
  'nokk',
  '800小时r6加二刷jojo在此',
  '好活',
  'jojo',
  'fuze the hostage',
  '不要停下来！！！！！',
  'pkppkp波纹疾走',
  '新人都是怪物吗？',
  '23333333',
  '我先来，首页通知书',
  '咚咚咚放这里。。。',
  '火钳刘明',
  '火钳刘明',
  '火钳刘明',
  '队友都炸',
  'nice',
  '哈哈哈哈',
  '人质:危！',
  '危',
  '火钳刘明',
  '人质  卒',
  '你币有了',
  '打投组',
  '恭喜首頁通知書！',
  '要素溢出',
  'HOSTAGE KIA',
  '233',
  '是无托版的PKP',
  '666',
  'hostage KIA',
  'tk哈哈哈',
  '要素过多',
  '这个肌肉我可以惹',
  '6的飞起',
  'jo风',
  '混入了奇怪的东西',
  '草',
  '袭击妈妈，锁孔看她',
  '哈哈哈哈哈哈',
  '，',
  '草',
  '牛逼',
  '高技术力啊',
  'opp',
  'X',
  '组长！',
  '草（中日双语）',
  '哈哈哈哈哈哈',
  '-500',
  '.',
  '看封面识内容系列',
  '草',
  '首页通知书',
  '要素过多',
  '但是不会画画',
  '草',
  '不要停下来啊！',
  '梅开三度',
  '四回啊四回',
  '高帧好评',
  '人质已解脱',
  '草',
  '强',
  '好活！',
  '好流畅',
  '草',
  '666',
  '好活儿当赏',
  '新人都是怪物系列',
  '高技术力',
  'niiiiiiiiiiiiiiice',
  '人质危',
  '哈哈哈哈',
  '带制作，三连了',
  '鉴作',
  '咚咚咚',
  '咚咚咚咚棒棒棒棒',
  '要素过多',
  '不应该是打中耳机吗',
  '高技术力',
  '完了',
  '彩虹六号牛批',
  '口罩都有荒木线，佛了',
  '哈哈哈',
  '要素爆炸',
  '高技术力',
  'cao caocaocaocao',
  '哈哈哈哈哈哈哈',
  '等等，2乔这里说的是30分钟',
  '首页通知书',
  '海     岸     线',
  'pkp波纹疾走',
  '耶————————格————————',
  '人 质 凶 手 -500',
  '队友：WDNMD',
  'jojo？？？',
  '点进来之前我以为是fuze饮料。。',
  '要素过多',
  '绝了',
  '要素过多',
  '灭 霸',
  '新人都是魔鬼',
  '帧数爆炸',
  'Cluster Charge activated！',
  '要素过多',
  'Hostage KIA，Mission failed',
  '人质已解脱。。。',
  '开 幕 雷 击',
  '哈哈哈哈',
  'ADS草死了',
  '+0',
  '牛批牛批',
  '拜见大神',
  '阿虚',
  '这帧数，感觉在看动漫',
  '卡其脱离太',
  '双厨狂喜',
  '问问',
  '不要停下来啊！！！！！',
  'h',
  '不要停下来啊',
  '要真30分钟都不用结束回合了，都开始第二局游戏了',
  '这也太强了',
  '。。。。。。。。。。。。',
  'hoho',
  '要素过多',
  '哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
  '哈哈哈哈哈哈哈哈哈哈',
  '.00',
  '哈哈',
  '万能的日语',
  '首页通知书',
  '我卡了？',
  'hhhhh',
  '大盾闪盾好惨',
  '哈哈哈哈哈哈哈哈哈',
  '草',
  '要素太多受不了哈哈哈哈哈哈哈',
  '火钳刘明',
  '首页通知书',
  'lisalisa',
  '这是什么蛇皮操作，看不懂',
  '敌 我 不 分',
  '草',
  '666',
  '哈哈哈哈啊哈哈哈',
  '完全一致',
  '要素过多',
  '你又双叒叕发现了新的宝藏',
  '火钳刘明',
  '2333',
  '高  技  术  力',
  '三梗合一',
  '四梗合一',
  '火钳刘明',
  '杀2个队友不是直接飞了吗',
  '首页通知书',
  '海岸线',
  '是延迟',
  '好活当赏',
  '这个我遇到过，fuze就是我，人质敌人队友都被我杀掉了，被老外骂并被踢了',
  '草素过多',
  '人质——  再不能起',
  '必须三联',
  '开始吟唱',
  '不要停下来啊',
  '草',
  '？？？？？？？？？？？？？？？？？',
  'tab+shift',
  '帧数高的和动画一样',
  'wwwwwwwwwwww',
  '好强',
  '23333333',
  '好活当赏',
  '此曲一出',
  '要素过载',
  '火钳刘明',
  '要素过载',
  '好活！！！！',
  '开始吟唱',
  '我听得懂咋办，在线等，很急',
  '哇哇哇好高清',
  '.',
  '医 学 奇 迹',
  'jo里jo气的',
  'jojo画风',
  '哈哈哈哈哈哈',
  '俄式反恐',
  '别拦我，老子把3个ADS都丢他脸上',
  '-500',
  '万 能 日 语',
  '666',
  '人质杀手',
  '做的真的棒。',
  '我NM笑疯',
  '双厨狂喜',
  '玛撒卡！这是袭击妈妈配音？',
  'nice',
  'jojo!',
  'JO小鬼来力',
  '真实',
  '我又玩R6又看JOJO',
  '完  全  不  会  画  画',
  '秀儿',
  '是系统自动踢人的，老外来不及踢你',
  '6p41波纹疾走',
  '火钳刘明',
  'lisalisa？？？？？',
  '盾——兵——（悲）',
  '就是没有汤姆逊，汤姆逊波纹疾走！！',
  '要素过多',
  '。。。。？？',
  '组长你怎么了组长',
  'UP:我 完 全 不 会 画 画',
  '再来亿遍',
  '泥给路带呦～',
  '哈哈哈哈哈哈哈哈哈',
  '哈哈哈哈哈哈哈哈哈',
  '火钳刘明',
  'INTJ-A',
  '没梦想的社畜',
  '死宅',
  '社恐',
  '不善争吵',
  '是个笨蛋',
  '恋爱脑',
  '不混圈子',
  '实用至上',
  '我不想卷',
  '颜文字爱好者(´･ω･`)',
  '学艺不精的前端工程师',
  '见习产品经理',
  'CRUD编写师',
  '摸鱼学资深学者',
  '数据控',
  '摸鱼的king',
  '热爱睡懒觉',
  '脑洞极大',
  '喜欢钱（谁不喜欢呢',
  '喜欢唱歌但劣质',
  '喜欢写字但没营养',
  '喜欢拍照但没技术',
  '夜喵本喵',
  '彩票中奖计划师',
  '那本《自控力》的书，买来以后就没看过',
  '甜党人士卧底辣省',
  '云养猫用户',
  '把PDD薅的黑了号',
  'Nichijou',
  '钢炼一生推',
  '冰菓',
  'CLANNAD',
  'BIG BANG!',
  '武林外传',
  '三体宇宙',
  '目标：NH558J2',
  '弱小和无知不是生存的障碍，傲慢才是',
  '4399',
  '单机云玩家',
  '喜+1（可是我没有Money',
  'CSGO社区服玩家',
  'To the Moon',
  'LOL白银分段混子',
  'MC高铁计划通✓',
  '靠BeatSaber减肥',
  '让子弹飞申遗',
  'Run! forrest run',
  '洛天依',
  '幼稚园杀手',
  '反光镜',
  '我没听出来你的flow',
  '什么音乐都听一点点',
  '被MIUI绑架的资深米黑',
  'Mac党',
  '智能家居爱好者',
  '没有耳机不能出门',
  '两个空格缩进党',
  'VS Code',
  '这个做不了',
  '我什么都没做就出BUG了',
  '我写了这么多居然没出BUG？',
  '今天工作了15分钟，好累哦',
  'HZFE底层群友',
  '被遗忘的 Lingoys!Art',
  '知乎公共领域编辑计划',
  '吃花椒的瓜酱',
  '察觉时已是鸽骑',
  '知名相声爱好'
]

// 配置
const config = reactive({
  useSlot: true,
  useSuspendSlot: true,
  isSuspend: true,
  randomChannel: true,
  loop: true,
  right: 20,
  channels: 6,
  speeds: 100
})
const inputDanmu = ref<string>('')

function handleAddDanmu() {
  console.log(inputDanmu.value)
  if (!inputDanmu.value) return
  let dm: string | dm = ''
  if (config.useSlot) {
    dm = {
      text: inputDanmu.value,
      avatar: getImageUrl(`default-avatar (${Math.ceil(Math.random() * 24)}).png`),
      isMe: true
    }
  } else {
    dm = inputDanmu.value
  }
  danmaku.value?.insert(dm)
  inputDanmu.value = ''
}

function handleDanmu(type: string) {
  switch (type) {
    case 'play':
      danmaku.value?.play()
      break;
    case 'stop':
      danmaku.value?.pause()
      break;
    case 'hide':
      danmaku.value?.hide()
      break;
    case 'show':
      danmaku.value?.show()
      break;
    case 'clear':
      danmaku.value?.clear()
      break;
    case 'reset':
      danmaku.value?.reset()
      break;
    case 'resize':
      danmaku.value?.resize()
      break;
  }
}

function handleDanmuMode(type: string) {
  if (type === 'slot') {
    config.useSlot = !config.useSlot
    config.useSlot ? Danmus.value = getDanmu() : Danmus.value = danmus
  } else if (type === 'suspendslot') {
    config.useSuspendSlot = !config.useSuspendSlot
  } else {
    config.isSuspend = !config.isSuspend
  }
}

function handleDanmuSpeeds(speeds: number) {
  if (config.speeds <= 10 && speeds === -10) return
  config.speeds += speeds
  handleDanmu('reset')
}

function handleDanmuChannels(val: number) {
  if (config.channels <= 0 && (val === -1 || val === 0)) return
  if (val === 0) {
    config.channels = 0
  } else {
    config.channels += val
  }
  handleDanmu('reset')
}

function handleStats(type: string) {
  stats.dom.style.display = type
}

function handleDanmuLoop() {
  config.loop = !config.loop
  handleDanmu('reset')
}

function handleAdd(dm: dm) {
  console.log(dm);
  const newDm: dm = { ...dm, isMe: true }
  danmaku.value?.insert(newDm)
}


function getDanmu() {
  const dms: dm[] = []
  danmus.map((text, index) => {
    dms.push({
      text,
      avatar: index % 25 != 0 ? getImageUrl(`default-avatar (${index % 25}).png`) : ''
    })
  })
  return dms
}
onMounted(() => {
  window.onresize = () => handleDanmu('resize')
  handleLoadImg()

  config.useSlot ? Danmus.value = getDanmu() : Danmus.value = danmus
})

onUnmounted(() => {
  window.onreset = null
})

function handleListEnd() {
  console.log('循环播放一轮结束');
}

function handlePlayEnd(index: number) {
  console.log('播放结束', index);
}

function handleClickDm(dm: dm, index: number) {
  console.log('当前点击的弹幕:>> ', index, dm);
}

function handleLoadImg() {
  return new Promise(resolve => {
    let imgUrlArr: string[] = [];
    for (let i = 1; i <= 24; i++) {
      imgUrlArr.push(getImageUrl(`default-avatar (${i}).png`))
    }

    let loadedCount = 0;
    const imgLoaded = () => {
      loadedCount++;
      // 加载完成
      if (loadedCount >= imgUrlArr.length) {
        resolve('图片加载完成');
      }
    };

    const Preload = () => {
      imgUrlArr.forEach(imgUrl => {
        const oImg = new Image();
        oImg.addEventListener('load', imgLoaded);
        oImg.addEventListener('error', imgLoaded);
        oImg.src = imgUrl // 无序加载，并发下载图片
      });
    };
    // 执行预加载
    Preload();
  });
}
</script>

<template>
  <Danmaku class="danmaku" ref="danmaku" :danmus="Danmus" v-bind="config" @dm-click="handleClickDm"
    @play-end="handlePlayEnd" @list-end="handleListEnd">
    <template #dm="{ danmu, index }">
      <div class="danmu-item" :class="[danmu.isMe ? 'btn-item--me' : '']">
        <img class="danmu-item--avatar" v-if="danmu.avatar" :src="danmu.avatar" alt="">
        <div>{{ danmu.text }}</div>
      </div>
    </template>
    <template #suspend="{ danmu, index }">
      <div class="danmu-suspend">
        <div class="item" @click="handleAdd(danmu)">➕</div>
        <div class="item">👍</div>
      </div>
    </template>
  </Danmaku>

  <div class="btn-list">
    <h2 class="title">danmaku-vue</h2>
    <p class="desc">基于 Vue.js 的一个弹幕交互插件，轻便、开箱即用、可扩展性强</p>
    <div>
      <div class="btn-item">
        播放：
        <button class="btn" @click="handleDanmu('play')">播放</button>
        <button class="btn" @click="handleDanmu('stop')">暂停</button>
        <button class="btn" @click="handleDanmu('clear')">清除</button>
      </div>
      <div class="btn-item">
        循环：
        <button class="btn" style="padding: 6px 50px;" @click="handleDanmuLoop">{{ config.loop ? '循环播放' : '单次播放'
        }}</button>
      </div>
      <div class="btn-item">
        模式：
        <button class="btn" @click="handleDanmuMode('slot')">{{ config.useSlot ? '关闭' : '开启' }}弹幕slot</button>
        <button class="btn" @click="handleDanmuMode('suspend')">{{ config.isSuspend ? '关闭' : '开启' }}悬浮</button>
        <button class="btn" @click="handleDanmuMode('suspendslot')">{{ config.useSuspendSlot ? '关闭' : '开启'
        }}悬浮slot</button>
      </div>
      <div class="btn-item">
        显示：
        <button class="btn" @click="handleDanmu('show')">显示</button>
        <button class="btn" @click="handleDanmu('hide')">隐藏</button>
      </div>
      <div class="btn-item">
        速度：
        <button class="btn" @click="handleDanmuSpeeds(-10)">减速</button>
        <button class="btn" @click="handleDanmuSpeeds(10)">增速</button>
        当前速度：{{ config.speeds }}像素/s
      </div>
      <div class="btn-item">
        轨道：
        <button class="btn" @click="handleDanmuChannels(-1)">-1</button>
        <button class="btn" @click="handleDanmuChannels(1)">+1</button>
        <button class="btn" @click="handleDanmuChannels(0)">填满</button>
        当前轨道数：{{ config.channels }}
      </div>
      <div class="btn-item">
        发送：
        <input class="input" type="text" placeholder="输入弹幕内容" v-model="inputDanmu">
        <button class="btn" @click="handleAddDanmu">发送</button>
      </div>
      <div class="btn-item">
        性能：
        <button class="btn" @click="handleStats('block')">开启</button>
        <button class="btn" @click="handleStats('none')">关闭</button>
      </div>
    </div>
  </div>

  <a href="https://github.com/dshuais/danmaku-vue" class="github" target="_blank" aria-label="View source on Github">
    <svg width="80" height="80" viewBox="0 0 250 250"
      style="fill: #151513; color: #fff; position: absolute; top: 0; border: 0; right: 0" aria-hidden="true">
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
      <path
        d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
        fill="currentColor" style="transform-origin: 130px 106px" class="octo-arm"></path>
      <path
        d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
        fill="currentColor" class="octo-body"></path>
    </svg>
  </a>
</template>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  background: linear-gradient(45deg, #00DFD5, #BED5E9);
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.danmaku {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 0;
}

.danmu-item {
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 30px;
  padding: 0 10px;
  box-sizing: border-box;

  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.8);
    border: none;
  }

  &--avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

.btn-item--me {
  border: 1px solid #888;
  background: rgba(255, 255, 255, 0.2);
}

.danmu-suspend {
  display: flex;
  align-items: center;
  border-radius: 0 30px 30px 0;

  .item {
    padding-left: 10px;

    &:nth-last-child(1):active {
      transform: scale(1.2);
    }
  }
}

.btn-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  position: absolute;
  z-index: 1;

  .title {
    font-size: 62px;
    font-weight: bold;
    text-shadow: 2px 4px 6px rgba(0, 0, 0, .4);
  }

  .desc {
    text-shadow: 2px 4px 6px rgba(0, 0, 0, .4);
    margin: 30px 0;
  }

  .input {
    width: 130px;
    padding: 7px 16px;
    border-radius: 5px;
    outline: none;
    border: none;
    margin-right: 8px;
  }

  .btn-item {
    margin-top: 20px;
    display: flex;
    align-items: center;

    .btn {
      background: #fff;
      color: #000;
      padding: 6px 16px;
      border: none;
      border-radius: 5px;
      margin-right: 8px;
      cursor: pointer;
      outline: none;

      &:hover {
        background: #eee;
      }
    }
  }
}

.github:hover .octo-arm {
  animation: wave 560ms ease-in-out;
}

@keyframes wave {

  0%,
  100% {
    transform: rotate(0);
  }

  20%,
  60% {
    transform: rotate(-25deg);
  }

  40%,
  80% {
    transform: rotate(10deg);
  }
}

@media (max-width: 500px) {
  .btn-list {
    .title {
      font-size: 52px;
    }

    .desc {
      font-size: 12px;
    }
  }

  .github:hover .octo-arm {
    animation: none;
  }

  .github .octo-arm {
    animation: wave 560ms ease-in-out;
  }
}
</style>
