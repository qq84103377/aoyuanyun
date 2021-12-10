let lastTime = 0

let requestAnimationFrame
let cancelAnimationFrame

requestAnimationFrame = function (callback) {
  const currTime = new Date().getTime()
  // 为了使setTimteout的尽可能的接近每秒60帧的效果
  const timeToCall = Math.max(0, 16 - (currTime - lastTime))
  const id = setTimeout(() => {
    callback(currTime + timeToCall)
  }, timeToCall)
  lastTime = currTime + timeToCall
  return id
}

cancelAnimationFrame = function (id) {
  clearTimeout(id)
}

export {
  requestAnimationFrame,
  cancelAnimationFrame
}