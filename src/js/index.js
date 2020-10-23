; (function (player, $) {
    class MusicPlayer {
        constructor(dom) {
            this.indexObj = null; // 序号对象
            this.wrap = dom; // 播放器容器用于加载listControl模块
            this.dataList = []; // 储存请求到的数据
            this.rotateTimer = null; // 图片旋转定时器
            this.progress = player.progress.pro(); // 进度条对象
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
                    this.indexObj = new player.controlIndex(data.length);
                    this.dataList = data;
                    this.musicControl();// 添加音乐操作功能
                    this.listPlay();
                    this.loadMusic();
                    
                },
                error: () => {
                    console.log('数据请求失败')
                }
            });
        }
        // 加载音乐
        loadMusic() {
            player.render(this.dataList[this.indexObj.index]); // 渲染页面内容
            player.music.load(this.dataList[this.indexObj.index].audioSrc);
            
            this.progress.renderAllTime(this.dataList[this.indexObj.index].duration);

            // 播放音乐
            if (player.music.status == 'play') {
                player.music.play();
                // this.controlBtn[2].touchend();
                this.controlBtn[2].className = 'active';
                // 刚加载好的歌曲从0开始旋转
                this.imageRotate(0);
                this.progress.move(0);
            } else {
                this.controlBtn[2].className = '';
            }
            // 在此处运行拖拽,每次切歌后要重新建立一个拖拽对象
            this.dragProgress();
            // 进度条结束后的回调函数
            this.progress.endAfter = () => {
                this.indexObj.index = ++this.indexObj.index %  this.dataList.length;
                this.loadMusic();
            }
        }
        // 控制音乐
        musicControl() {
            // 添加手指摁下事件 上一首
            this.controlBtn[1].addEventListener('touchend', () => {
                // 获取上一个索引
                this.indexObj.prve();
                // 切换音乐后将音乐状态改为play
                player.music.status = 'play';
                this.loadMusic();
                this.list.nowMusic(this.indexObj.index);
            });
            // 下一首
            this.controlBtn[3].addEventListener('touchend', () => {
                // 获取下一个索引
                this.indexObj.next();
                // 切换音乐后将音乐状态改为play
                player.music.status = 'play';
                this.loadMusic();
                this.list.nowMusic(this.indexObj.index);
            });
            // 暂停播放
            this.controlBtn[2].addEventListener('touchend', () => {
                if (player.music.status == 'play') {
                    player.music.pause();
                    this.controlBtn[2].className = '';
                    // 停止旋转图片
                    this.imageStop();
                    this.progress.stop();
                } else {
                    player.music.play();
                    this.controlBtn[2].className = 'active';
                    // 先获取图片之前旋转的角度，再旋转图片
                    const deg = this.record.dataset.rotate || 0;
                    this.imageRotate(deg);
                    this.progress.move();
                }
            });
            
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
        imageStop() {
            clearInterval(this.rotateTimer)
        }
        // 列表切歌
        listPlay(){
            this.list = player.listControl(this.dataList, this.wrap);
            // 列表按钮添加触屏事件
            this.controlBtn[4].addEventListener('touchend',()=>{
                this.list.popIn();
            })
            // 给每个音乐添加触摸事件
            this.list.musicList.forEach((item,index) => {
                item.addEventListener('touchend',()=>{
                    if(index === this.indexObj.index) {
                        // 当点击正在播放的音乐时
                        if(player.music.status === 'play'){
                            return;
                        }
                        const event = new Event('touchend');
                        this.controlBtn[2].dispatchEvent(event);
                        this.list.popUp();
                        return
                    }
                    this.indexObj.index = index;
                    player.music.status = 'play';
                    this.loadMusic();
                    this.list.popUp();
                })
            });
        }
        // 拖拽
        dragProgress(){
            const circle = new player.progress.drag(document.querySelector('.dot'));
            circle.init();
            circle.start = ()=>{
                // 按下的时候
                // 防止在歌曲播放时拖动,清除定时器
                cancelAnimationFrame(this.progress.frameId);
            }
            circle.move = (per)=>{
                // 拖拽的时候
                this.progress.update(per)
                this.dragTime = this.dataList[this.indexObj.index].duration * per;
                this.per = per;
            }
            circle.end = ()=>{
                // 抬起的时候
                player.music.playTo(this.dragTime);
                this.controlBtn[2].className = 'active';
                const deg = this.record.dataset.rotate || 0;
                this.imageRotate(deg);
                // 按下时将定时器清除,重新让进度条移动
                this.progress.move(this.per)
            }
        }
    }
    const wrap = document.querySelector('#wrap');
    const music = new MusicPlayer(wrap);
    music.init();
})(window.player, window.Zepto)