<template>
  <div>
    <div class="radmenu">
      <a href="#" class="show" @click="fClick">获取麦克风权限</a>
      <ul>
        <my-menu-item @sClick="sClick" :Bname="Bname[0]" :Sname="Sname[0]" :recorder="recorder"/>
        <my-menu-item @sClick="sClick" :Bname="Bname[1]" :Sname="Sname[1]" :recorder="recorder"/>
        <my-menu-item @sClick="sClick" :Bname="Bname[2]" :Sname="Sname[2]" :recorder="recorder"/>
        <my-menu-item @sClick="sClick" :Bname="Bname[3]" :Sname="Sname[3]" :recorder="recorder"/>
        <my-menu-item @sClick="sClick" :Bname="Bname[4]" :Sname="Sname[4]" :recorder="recorder"/>
      </ul>
    </div>
    <vue-particles color="#A0B0FF" :particleOpacity="0.7"
                   :particlesNumber="80"
                   shapeType="circle"
                   :particleSize="4"
                   linesColor="#A0B0FF"
                   :linesWidth="5"
                   :lineOpacity="0.4"
                   :hoverEffect="true"
                   clickMode="push"></vue-particles>
  </div>


</template>

<script>
  import MyMenuItem from "../components/MyMenuItem"
  import Recorder from 'js-audio-recorder'
  /*const recorder = new Recorder({
    sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
    sampleRate: 48000,              // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1,                 // 声道，支持 1 或 2， 默认是1
    // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
  });*/
  export default {
    name: "my-create",
    data() {
      return {
        recorder: new Recorder({
          sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
          sampleRate: 48000,              // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
          numChannels: 1,                 // 声道，支持 1 或 2， 默认是1
          // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
        }),
        state: null,
        Bname: [{btnName: "录音栏", btnMethod: ""},
          {btnName: "播放栏", btnMethod: ""},
          {btnName: "信息栏", btnMethod: ""},
          {btnName: "销毁栏", btnMethod: ""},
          {btnName: "待开放", btnMethod: ""}],
        Sname: [
          [{btnName: "开始录音", btnMethod: "startRecorder"},
            {btnName: "继续录音", btnMethod: "resumeRecorder"},
            {btnName: "暂停录音", btnMethod: "pauseRecorder"},
            {btnName: "结束录音", btnMethod: "stopRecorder"},
            {btnName: "待开放", btnMethod: ""},],

          [{btnName: "录音播放", btnMethod: "playRecorder"},
            {btnName: "暂停播放", btnMethod: "pausePlayRecorder"},
            {btnName: "恢复播放", btnMethod: "resumePlayRecorder"},
            {btnName: "停止播放", btnMethod: "stopPlayRecorder"},
            {btnName: "待开放", btnMethod: ""}],

          [{btnName: "获取录音信息", btnMethod: "getRecorder"},
            {btnName: "下载PCM", btnMethod: "downPCM"},
            {btnName: "下载WAV", btnMethod: "downWAV"},
            {btnName: "下载MP3", btnMethod: "getMp3Data"},
            {btnName: "待开放", btnMethod: ""}],

          [{btnName: "销毁录音", btnMethod: "destroyRecorder"},
            {btnName: "待开放", btnMethod: ""},
            {btnName: "待开放", btnMethod: ""},
            {btnName: "待开放", btnMethod: ""},
            {btnName: "待开放", btnMethod: ""}],

          [{btnName: "待开放", btnMethod: ""},
            {btnName: "待开放", btnMethod: ""},
            {btnName: "待开放", btnMethod: ""},
            {btnName: "待开放", btnMethod: ""},
            {btnName: "待开放", btnMethod: ""}]]

      }
    },
    components: {
      MyMenuItem
    },
    methods: {
      fClick(event) {
        this.state = event.target.classList;
        if (this.state.contains("selected")) {
          this.state.remove("selected");
          this.state.add("show");
          const h = this.$createElement;
          this.$message({
            message: h('p', null, [
              h('span', null, '尊敬的用户，本次录音 '),
              h('i', {style: 'color: teal'}, '已经完成')
            ])
          });
        } else {
          this.state.add("selected");
          this.state.remove("show");
          /*-----------------*/
          Recorder.getPermission().then(() => {
            this.$message.success('获取权限成功')
          }, (error) => {
            this.$message({
              message: '请先允许该网页使用麦克风',
              type: 'info'
            });
            console.log(`${error.name} : ${error.message}`)
          });
          /*-----------------*/
          console.log(this.$children + "-----------------------------")
        }

      },
      sClick(info) {
        if (info === 'selected') {
          this.state.remove("selected");
        } else {
          this.state.add("selected")
        }
      }
    }
  }
</script>

<style scoped>
  @import "../assets/css/reset.css";
  @import "../assets/css/style.css";
</style>
