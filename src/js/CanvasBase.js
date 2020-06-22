import debounce from 'lodash.debounce'

export default class CanvasBase {
    constructor(width = 600, height = 600) {
        this.ratio = window.devicePixelRatio || 1
        this.width = width * this.ratio
        this.height = height * this.ratio
        this.animationRequest = null
        this.canvas = document.querySelector('#canvas')
        this.canvas.width = width * this.ratio
        this.canvas.height = height * this.ratio
        this.canvas.style.width = `${width}px`
        this.canvas.style.height = `${height}px`
        this.ctx = this.canvas.getContext('2d')
        this.ctx.scale(this.ratio, this.ratio)

        this.resizeCallbacks = []
        this.attachListeners()
        this.watchPageResize()
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    updateFrame(callback) {
        this.animationRequest = requestAnimationFrame(() => (this.updateFrame(callback)))
        callback()
    }

    stopFrameUpdate() {
        if (this.animationRequest) {
            cancelAnimationFrame(this.animationRequest)
        }
    }

    toPolarCoordinates({ x, y }) {
        return {
            x: x + (this.canvas.width / 2),
            y: y + (this.canvas.height / 2)
        }
    }

    watchPageResize() {
        let width, height
        let padding = 30
        const w = this.width / this.ratio
        const h = this.height / this.ratio
        const ratio = this.height / this.width

        if (window.screen.width > 576) {
            padding = 60
        }
        if (window.screen.width > 991) {
            padding = 0
        }

        if (window.screen.width <= window.screen.height) {
            width = Math.min(window.screen.width, w) - padding
            height = width * ratio
        } else {
            height = Math.min(window.screen.height, h) - padding
            width = height / ratio
        }

        this.canvas.width = width * this.ratio
        this.canvas.height = height * this.ratio
        this.canvas.style.width = `${width}px`
        this.canvas.style.height = `${height}px`

        if (this.resizeCallbacks.length > 0) {
            this.resizeCallbacks.forEach(callback => callback())
        }
    }

    attachListeners() {
        window.addEventListener('resize', debounce(this.watchPageResize.bind(this), 160))
    }

    preRenderCanvas(width, height, callback = (ctx) => {}) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height

        callback(ctx)
        return canvas
    }
}