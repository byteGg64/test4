<template>
  <div class="song-lyric">
    <h1 class="lyric-title">歌词</h1>
    <transition-group name="lyric-fade">
      <!--有歌词-->
      <ul :style="{top:lrcTop}" class="has-lyric" v-if="lyr.length" key="has-lyric">
        <li v-for="(item, index) in lyr" v-bind:key="index">
          {{ item[1] }}
        </li>
      </ul>
      <!--没歌词-->
      <div v-else class="no-lyric" key="no-lyric">
        <span>暂无歌词</span>
      </div>
    </transition-group>
    <comment :playId="id" :type="0"/>
  </div>
</template>

<script>
import mixin from '../mixins'
import Comment from '../components/Comment'
import { mapGetters } from 'vuex'

export default {
  name: 'lyric',
  mixins: [mixin],
  components: {
    Comment
  },
  data () {
    return {
      lrcTop: '200px', // 歌词滑动
      showLrc: false, // 切换唱片和歌词
      lyr: [] // 当前歌曲的歌词
    }
  },
  computed: {
    ...mapGetters([
      'curTime',
      'id', // 歌曲ID
      'lyric', // 歌词
      'listOfSongs', // 存放的音乐
      'listIndex' // 当前歌曲在歌曲列表的位置
    ])
  },
  watch: {
    id: function () {//当点击某首歌曲的时候会执行toPlay方法，toPlay里面有设置id，所以当id发送改变的时候this.lyr属性就被赋值
      this.lyr = this.parseLyric(this.listOfSongs[this.listIndex].lyric)
    },
    // 播放时间的开始和结束
    curTime: function () {
      // 处理歌词位置及颜色
      if (this.lyr.length !== 0) {
        for (let i = 0; i < this.lyr.length; i++) {
          if (this.curTime >= this.lyr[i][0]) {
            for (let j = 0; j < this.lyr.length; j++) {
              document.querySelectorAll('.has-lyric li')[j].style.color = '#000'
              document.querySelectorAll('.has-lyric li')[j].style.fontSize = '15px'
            }
            if (i >= 0) {
              document.querySelectorAll('.has-lyric li')[i].style.color = '#95d2f6'
              document.querySelectorAll('.has-lyric li')[i].style.fontSize = '25px'
            }
          }
        }
      }
    }
  },
  created () {
    this.lyr = this.lyric ? this.lyric : []
  }
}
</script>

<style lang="css" scoped>
@import '../assets/css/lyric.css';
</style>
