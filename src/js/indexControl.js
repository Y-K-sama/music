// 实现索引切割索引对象
; (function (root) {
    class Index {
        constructor(len, index = 0) {
            this.index = index; // 当前索引值，默认为0
            this.len = len; // 数据长度
        }
        // 取上一个索引
        prev() {
            return this.get(-1);
        }
        // 取下一个索引
        next() {
            return this.get(1);
        }
        /**
         * 得到索引值
         * @param {*} val 为-1或1
         */
        get(val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }
    root.controlIndex = Index;
})(window.player || (window.player = {}))