"using strict"
String.prototype.strip = function strip(){
    return this.replace(/[^a-zA-Z]/g, "")
}