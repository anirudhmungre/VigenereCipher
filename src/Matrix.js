class Matrix{
    constructor(x, y, val=null){
        this.x = x
        this.y = y
        this.arr = [];
        for(i = 0; i < x; i++) {
            this.arr[i] = [];
            for(j = 0; j < y; j++) {
                this.arr[i][j] = val;
            }
        }
    }
    get size(){
        return [this.x, this.y]
    }
}