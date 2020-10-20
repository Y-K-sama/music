; (function (player, $) {
    class MusicPlayer {
        constructor(dom) {
            this.num = 0; // 歌曲的序号
            this.wrap = dom; // 播放器容器用于加载listControl模块
            this.dataList = [];
            this.rotateTimer = null;
        }
        // 初始化
        init() {
            this.getDom();
            this.getData('../mock/data.json');
        }
        // 获取dom元素
        getDom() {
            this.record = document.querySelector('.songImg img');
            this.controlBtn = document.querySelectorAll('.control li');
        }
        getData(url) {
            // 获取歌曲信息
            $.ajax({
                url: url,
                type: 'get',
                success: data => {
                    this.dataList = data;
                    this.loadMusic();
                    this.musicControl();// 添加音乐操作功能
                },
                error: () => {
                    console.log('数据请求失败')
                }
            });
        }
        // 加载音乐
        loadMusic() {
            player.render(this.dataList[this.num]); // 渲染页面内容
            player.music.load(this.dataList[this.num].audioSrc);
            // 播放音乐
            if (player.music.status == 'play') {
                player.music.play();
                // this.controlBtn[2].touchend();
                this.controlBtn[2].className = 'active';
                // 刚加载好的歌曲从0开始旋转
                this.imageRotate(0)

            } else {
                this.controlBtn[2].className = '';
            }
        }
        // 控制音乐
        musicControl() {
            // 添加手指摁下事件 上一首
            this.controlBtn[1].addEventListener('touchend', () => {
                if (this.num == 0) {
                    this.num = this.dataList.length
                }
                this.num--;
                // 切换音乐后将音乐状态改为play
                player.music.status = 'play';
                this.loadMusic()
            });
            // 下一首
            this.controlBtn[3].addEventListener('touchend', () => {
                // 判断上一首歌是哪一首第一首的上一首是最后一首
                this.num = (this.num + 1) % this.dataList.length;
                // 切换音乐后将音乐状态改为play
                player.music.status = 'play';
                this.loadMusic()
            });
            // 暂停播放
            this.controlBtn[2].addEventListener('touchend', () => {
                if (player.music.status == 'play') {
                    player.music.pause();
                    this.controlBtn[2].className = '';
                    // 停止旋转图片
                    this.imageStop();
                } else {
                    player.music.play();
                    this.controlBtn[2].className = 'active';
                    // 先获取图片之前旋转的角度，再旋转图片
                    const deg = this.record.dataset.rotate || 0;
                    this.imageRotate(deg);
                }
            })
        }
        // 旋转唱片图片
        imageRotate(deg) {
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(() => {
                deg = + deg + 0.2;
                this.record.style.transform = 'rotate(' + deg + 'deg)';
                this.record.dataset.rotate = deg; // 将旋转角度信息以自定义标签的形式储存在img上
            }, 1000 / 60) //事件适配屏幕刷新率60hz
        }
        // 暂停旋转
        imageStop(){
            clearInterval(this.rotateTimer)
        }
    }
    const wrap = document.querySelector('.wrap');
    const music = new MusicPlayer(wrap);
    music.init();
})(window.player, window.Zepto)