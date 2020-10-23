; (function (root) {
    // 进度条模块
    // 进度条类
    class Progress {
        constructor() {
            this.durTime = null; // 歌曲总时间 
            this.startTime = null; // 歌曲开始时间
            this.frameId = null; // 定时器
            this.lastPercont = 0;
            this.init();
        }
        // 初始化函数
        init() {
            this.getDom();
        }
        // 获取dom元素
        getDom() {
            this.curTime = document.querySelector('.curTime'); // 当前歌曲播放时间dom对象
            this.dot = document.querySelector('.dot'); // 小圆点dom对象
            this.frontBg = document.querySelector('.frontBg'); // 进度条dom对象
            this.backBg = document.querySelector('.backBg'); // 进度条背景dom 对象
            this.totalTime = document.querySelector('.totalTime'); // 总时间dom对象
        }
        // 渲染所有时间,传入总时间单位为s
        renderAllTime(time) {
            this.durTime = time;
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
        }
        // 得到分秒格式的字符串时间
        formatTime(time) {
            let minute = Math.floor(time / 60); // 向下取整获取分钟数
            let second = time % 60;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            return minute + ':' + second;
        }
        // 移动进度条
        move(per) {
            const This = this;
            this.startTime = new Date().getTime(); // 单位毫秒
            This.lastPercont = per === undefined ? This.lastPercont : per;
            cancelAnimationFrame(this.frameId); // 防止重复开启定时器
            frame();
            function frame() {
                const nowTime = new Date().getTime(); // 单位毫秒
                const per = This.lastPercont + ((nowTime - This.startTime) / (This.durTime * 1000));
                if (!(per <= 1)) {
                    // 当条件满足时清除定时器
                    // 进度条结束后执行的函数
                    
                    This.endAfter && This.endAfter();
                    cancelAnimationFrame(This.frameId);
                } else {
                    // 条件不满足时更新进度条
                    This.update(per);
                }
                This.frameId = requestAnimationFrame(frame);// h5新增定时器，根据屏幕刷新率进行计时递归调用
            }
        }
        // 更新进度条
        update(per) {
            let time = Math.floor(this.durTime * per);
            time = this.formatTime(time);
            this.curTime.innerHTML = time;
            const width = this.backBg.clientWidth;
            this.frontBg.style.width = per * 100 + '%';
            this.dot.style.transform = `translateX(${per * width}px)`
        }
        // 暂停进度条
        stop() {
            cancelAnimationFrame(this.frameId);
            this.lastPercont += (new Date().getTime() - this.startTime) / (this.durTime * 1000);
        }
    }
    function instanceProgress() {
        return new Progress();
    }
    // 拖拽对象
    class Drag {
        // obj表示可拖拽的dom对象
        constructor(obj) {
            this.obj = obj;
            this.startPointX = 0; // 起点
            this.startLeft = 0; // 起点距离左侧的距离
            this.percent = 0; // 拖拽的百分比
        }
        init() {
            this.obj.style.transfrom = 'transleatX(0)';
            // 手指按下事件
            this.obj.addEventListener('touchstart', (e) => {
                this.startPointX = e.changedTouches[0].pageX;
                this.startLeft = parseFloat(this.obj.style.transfrom.split('(')[1]);
                this.start && this.start(); // start为回调函数，当start存在时执行start()
            })
            // 手指拖动事件
            this.obj.addEventListener('touchmove', (e) => {
                this.disPointX = e.changedTouches[0].pageX - this.startPointX; // 手指移动的距离
                let l = this.disPointX + this.startLeft ;
                // 手指拖动越过边界处理
                if (l < 0) {
                    l = 0
                } else if (l > this.obj.offsetParent.offsetWidth) {
                    l = this.obj.offsetParent.offsetWidth;
                }
                // 移动dom元素
                this.obj.style.transfrom = `translateX(${l})`;
                this.percent = l / this.obj.offsetParent.offsetWidth;
                this.move && this.move(this.percent);
                e.preventDefault(); // 阻止浏览器的默认事件
            })
            // 手指抬起事件
            this.obj.addEventListener('touchend', (e) => {
                this.end && this.end();
            })
        }

    }
    function instanceDrag(obj) {
        return new Drag(obj);
    }
    root.progress = {
        pro: instanceProgress,
        drag: instanceDrag
    }
})(window.player || (window.player = {}))