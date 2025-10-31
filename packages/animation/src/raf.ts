export const runRaf = (
  callback: (progress: number) => void,
  duration: number,
  resolve: (value: unknown) => void = () => { }
) => {
  const start = performance.now()
  const loop = (id: number) => {
    const now = performance.now()
    const elapsed = now - start
    const progress = elapsed / duration
    callback(progress)
    if (progress < 1) requestAnimationFrame(loop)
    else {
      cancelAnimationFrame(id)
      resolve(void 0)
    }
  }
  requestAnimationFrame(loop)
}