// 渲染功能：渲染图片，音乐信息是否喜欢
; (function (root) {
    // 渲染图片
    function renderImg(src) {
        root.blurImg(src);
        const img = document.querySelector('.songImg img');
        img.src = src;
    }
    // 渲染音乐信息
    function renderInfo(data) {
        const infoLi = document.querySelector('.songInfo').children;
        infoLi[0].innerHTML = data.name;
        infoLi[1].innerHTML = data.singer;
        infoLi[2].innerHTML = data.album;
    }
    // 渲染是否喜欢
    function renderIsLike(isLike) {
        const love = document.querySelector('.control').children[0];
        if (isLike) {
            love.className = 'active'
        } else {
            love.className = '';
        }
    }
    root.render = function (data) {
        renderImg(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
    };
})(window.player || (window.player = {})); // 传入window提高代码运行效率，在函数内使用全局变量最好当做参数传入以提高效率