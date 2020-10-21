// 列表切割
; (function (root) {
    /**
     * 
     * @param {array} data 数据 
     * @param {*} wrap 父级dom元素
     */
    function listControl(data, wrap) {
        const list = document.createElement('div'),
            dl = document.createElement('dl'),
            dt = document.createElement('dt'),
            close = document.createElement('div'),
            closeImg = document.createElement('div'),
            musicList = [];// 用来存放dd元素
        list.className = 'list';
        dt.innerHTML = '播放列表';
        close.innerHTML = '关闭';
        close.className = 'close';
        closeImg.className = 'closeImg';
        dl.appendChild(dt);

        data.forEach((item, index) => {
            const dd = document.createElement('dd');
            dd.innerHTML = item.name;
            musicList.push(dd);
            dl.appendChild(dd);
            // 添加触屏事件
            dd.addEventListener('touchend',()=>{
                nowMusic(index);
            });
        });
        dl.appendChild(close);
        list.appendChild(dl);
        list.appendChild(closeImg);
        wrap.appendChild(list);
        // 关闭按钮添加事件
        close.addEventListener('touchend', () => {
            popUp();
        });
        closeImg.addEventListener('touchend', () => {
            popUp();
        });
        nowMusic(0);
        // 弹入列表
        function popIn() {
            list.style.transition = '.2s';
            list.style.transform = 'translateY(0)';
        }
        // 弹出列表
        function popUp() {
            const height = getComputedStyle(list).height;
            list.style.transition = '.2s';
            list.style.transform = 'translateY(' + height + ')'
        }
        // 正在播放的音乐名称样式
        function nowMusic(index){
            musicList.forEach((item)=>{
                item.className = '';
            });
            musicList[index].className = 'active';
        }
        return {
            popUp: popUp,
            popIn: popIn,
            nowMusic: nowMusic,
            musicList: musicList
        }
    }
    root.listControl = listControl;
})(window.player || (window.player = {}))