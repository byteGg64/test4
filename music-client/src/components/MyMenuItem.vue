<template>
  <li>
    <a href="#" class="" @click="isClick($event,Bname.btnMethod,Bname.btnName)">{{Bname.btnName}}</a>
    <ul>
      <li v-for="(item) in Sname">
        <a href="#" @click="isClick2($event,item.btnMethod,item.btnName)">{{item.btnName}}</a>
      </li>
    </ul>
  </li>

  <!--<li>
    <a href="#" class="" @click="isClick">Menu 1</a>
    <ul>
      <li><a href="#" @click="isClick2">Sub Menu 1</a></li>
      <li><a href="#" @click="isClick2">Sub Menu 1</a></li>
      <li><a href="#" @click="isClick2">Sub Menu 1</a></li>
      <li><a href="#" @click="isClick2">Sub Menu 1</a></li>
      <li><a href="#" @click="isClick2">Sub Menu 1</a></li>
    </ul>
  </li>-->

</template>

<script>
  const lamejs = require("lamejs-fork-jmvsdev");
  export default {
    name: "myMeunItem",
    data() {
      return {
        state1: null,
        state2: null,
        flag1: false,
        flag2: false,
        //波浪图-录音
        drawRecordId: null,
        oCanvas: null,
        ctx: null,
        //波浪图-播放
        drawPlayId: null,
        pCanvas: null,
        pCtx: null,
      }
    },
    props: {
      Bname: "",
      Sname: [],
      recorder: null,
    },
    methods: {
      /*=============================================================*/
      /**
       * 注意$options的生命周期在$parent的前面，也就是说利用$option调用的方法此时还为绑定父组件。
       /**
       *  1111111111111111
       * */
      // 开始录音
      startRecorder(instance) {
        console.log(instance);
        instance.recorder.start().then(() => {
          //this.drawRecord();//开始绘制图片
        }, (error) => {
          // 出错了
          console.log(`${error.name} : ${error.message}`);
        });
      },
      // 继续录音
      resumeRecorder(instance) {
        instance.recorder.resume()
      },
      // 暂停录音
      pauseRecorder(instance) {
        instance.recorder.pause();
        instance.drawRecordId && cancelAnimationFrame(instance.drawRecordId);
        instance.drawRecordId = null;
      },
      // 结束录音
      stopRecorder(instance) {
        instance.recorder.stop();
        instance.drawRecordId && cancelAnimationFrame(instance.drawRecordId);
        instance.drawRecordId = null;
      },
      /**
       *  22222222222222222
       * */
      //录音播放
      playRecorder(instance) {
        instance.recorder.play();
        //this.drawPlay();//绘制波浪图
      },
      // 暂停录音播放
      pausePlayRecorder(instance) {
        instance.recorder.pausePlay()
      },
      // 恢复录音播放
      resumePlayRecorder(instance) {
        instance.recorder.resumePlay();
        instance.drawPlay();//绘制波浪图
      },
      // 停止录音播放
      stopPlayRecorder(instance) {
        instance.recorder.stopPlay();
      },
      /**
       *  333333333333333333
       * */
      //获取录音信息
      getRecorder(instance) {
        let toltime = instance.recorder.duration;//录音总时长
        let fileSize = instance.recorder.fileSize;//录音总大小
        //录音结束，获取取录音数据
        let PCMBlob = instance.recorder.getPCMBlob();//获取 PCM 数据
        let wav = instance.recorder.getWAVBlob();//获取 WAV 数据
        let channel = instance.recorder.getChannelData();//获取左声道和右声道音频数据

      },
      //下载pcm
      downPCM(instance) {
        //这里传参进去的时文件名
        instance.recorder.downloadPCM('新文件');
      },
      //下载wav
      downWAV(instance) {
        //这里传参进去的时文件名
        instance.recorder.downloadWAV('新文件');
      },
      getMp3Data(instance) {
        const mp3Blob = instance.convertToMp3(instance.recorder.getWAV());
        instance.recorder.download(mp3Blob, 'recorder', 'mp3');
      },
      convertToMp3(wavDataView) {
        console.log("=========================")
        // 获取wav头信息
        const wav = lamejs.WavHeader.readHeader(wavDataView); // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
        const {channels, sampleRate} = wav;
        const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        // 获取左右通道数据
        const result = this.recorder.getChannelData();
        console.log(result, "=========================")
        const buffer = [];
        const leftData = result.left && new Int16Array(result.left.buffer, 0, result.left.byteLength / 2);
        const rightData = result.right && new Int16Array(result.right.buffer, 0, result.right.byteLength / 2);
        const remaining = leftData.length + (rightData ? rightData.length : 0);

        const maxSamples = 1152;
        for (let i = 0; i < remaining; i += maxSamples) {
          const left = leftData.subarray(i, i + maxSamples);
          let right = null;
          let mp3buf = null;
          if (channels === 2) {
            right = rightData.subarray(i, i + maxSamples);
            mp3buf = mp3enc.encodeBuffer(left, right);
          } else {
            mp3buf = mp3enc.encodeBuffer(left);
          }
          if (mp3buf.length > 0) {
            buffer.push(mp3buf);
          }
        }
        const enc = mp3enc.flush();
        if (enc.length > 0) {
          buffer.push(enc);
        }
        return new Blob(buffer, {type: 'audio/mp3'});
      },
      /**
       *  4444444444444444
       * */
      //销毁录音
      destroyRecorder(instance) {
        instance.recorder.destroy().then(function (recorder) {
          recorder = null;
          instance.drawRecordId && cancelAnimationFrame(instance.drawRecordId);
          instance.drawRecordId = null;
        });
      },

      /*==================================*/
      isClick(event, btnMethod, btnName) {
        this.state1 = event.target.classList;
        if (this.flag2 === false) {
          this.state1.add("selected");
          this.$emit("sClick", "selected");
          this.flag2 = true;
          this.$message({
            message: "进入" + btnName,
            type: 'warning'
          });
        } else {
          this.state1.remove("selected");
          this.$emit("sClick", "cancel");
          this.flag2 = false;
          let method = this.$options.methods[btnMethod];
          if (method) {
            method(this);
          }
          /*注意；
          1.使用$options这种方法的话前提是调用的那个方法需要正在这个方法的前面声明
          2.$options的生命周期在$parent的前面，也就是说利用$option调用的方法此时还为绑定父组件。
          3.如果是使用这种办法调用方法的话，那么关于这个实例的data属性或者是props属性等待都会没掉。
          猜想this.$options.methods[btnMethod]这种方式获取的结果只是方法的定义或者是方法的对象。 */
          this.$message({
            message: "退出" + btnName + "栏",
            type: 'error'
          });
        }
      },
      isClick2(event, btnMethod, btnName) {
        console.log(btnMethod);
        this.state2 = event.target.classList;
        if (this.flag1 === false) {
          this.state2.add("selected");
          this.state1.remove("selected");
          this.flag1 = true;
          this.$message({
            message: "进入" + btnName + "按钮",
            type: 'warning'
          });
        } else {
          this.state1.add("selected");
          this.state2.remove("selected");
          this.flag1 = false;
          let method = this.$options.methods[btnMethod];
          if (method) {
            method(this);
          }
          this.$message({
            message: "您以开启" + btnName + "功能",
            type: 'success'
          });
        }
      }
    },
  }
</script>

<style scoped>
  @import "../assets/css/reset.css";
  @import "../assets/css/style.css";
</style>
