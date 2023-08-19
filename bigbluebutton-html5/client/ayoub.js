window.crop = {};

const xEl = document.querySelector("#x")
const yEl = document.querySelector("#y")
const widthEl = document.querySelector("#width")
const heigthEl = document.querySelector("#height")

xEl.addEventListener("onchange",() => {
    window.crop.x = xEl.value;
})

yEl.addEventListener("onchange",() => {
    window.crop.y = yEl.value;
})

widthEl.addEventListener("onchange",() => {
    window.crop.width = widthEl.value;
})

heigthEl.addEventListener("onchange",() => {
    window.crop.heigth = heigthEl.value;
})