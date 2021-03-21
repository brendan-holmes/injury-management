import { useRef, useEffect } from 'react'

export const useCanvas = (draw, options={}) => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext(options.context || '2d')
    // let frameCount = 0
    // let animationFrameId
    const render = () => {
    //   frameCount++;
      resizeCanvas(canvas);
      draw(context)
    //   animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    // return () => {
    //   window.cancelAnimationFrame(animationFrameId)
    // }
  }, [draw])
  return canvasRef
}

const resizeCanvas = (canvas) => {
    
    // const { width, height } = canvas.getBoundingClientRect()
    const width = 450;
    const height = 550;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      return true // here you can return some usefull information like delta width and delta height instead of just true
      // this information can be used in the next redraw...
    }

    return false
  }