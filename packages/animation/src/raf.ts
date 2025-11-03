export type Easing = (progress: number) => number

export const runRaf = (
  callback: (progress: number) => void,
  duration: number,
  easing: Easing = (progress) => progress,
  resolve: (value: unknown) => void = () => { }
) => {
  const start = performance.now()
  const dur = duration * 1000
  const loop = (id: number) => {
    const now = performance.now()
    const elapsed = now - start
    const progress = elapsed / dur
    console.log(progress, easing(progress))
    callback(easing(progress))
    if (progress < 1) requestAnimationFrame(loop)
    else {
      cancelAnimationFrame(id)
      resolve(void 0)
    }
  }
  requestAnimationFrame(loop)
}