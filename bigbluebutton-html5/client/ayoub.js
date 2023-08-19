window.crop = {};

const xEl = document.querySelector("#x")
const yEl = document.querySelector("#y")
const widthEl = document.querySelector("#width")
const heigthEl = document.querySelector("#heigth")

xEl.addEventListener("onchange",() => {
    console.log("changed");
    window.crop.x = xEl.value;
})

yEl.addEventListener("onchange",() => {
    console.log("changed");
    window.crop.y = yEl.value;
})

widthEl.addEventListener("onchange",() => {
    console.log("changed");
    window.crop.width = widthEl.value;
})

heigthEl.addEventListener("onchange",() => {
    console.log("changed");
    window.crop.heigth = heigthEl.value;
})