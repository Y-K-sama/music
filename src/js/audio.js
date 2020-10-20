(function (root) {
    class AudioManage{
        constructor(){
            this.audio = new Audio();
            this.status = 'pause'; // 歌曲的状态
        }
        load(src){
            this.audio.src = src; // 加载音乐地址 
            this.audio.load()
        }
        // 播放音乐
        play(){
            this.audio.play();
            this.status = 'play';
        }
        // 暂停音乐
        pause(){
            this.audio.pause();
            this.status = 'pause';
        }
        // 音乐播放完成的事件
        musicOver(fn){
            this.audio.onended = fn;
        }
        // 跳到音乐的某个时间点
        playTo(time){
            this.audio.currentTime = time; //单位为秒
        }
    }
    root.music = new AudioManage();
})(window.player || (window.player = {}))