'use strict'
import CanvasBase from './CanvasBase'

const TWO_PI = 2 * Math.PI

class Sunflower extends CanvasBase {
    constructor(...args) {
        super(...args)
        this.divergenceAngle = 137.5
        this.divergenceRadian = this.divergenceAngle * Math.PI / 180
        this.scale = 9 * this.ratio
        this.numberOfSeeds = 950
        this.seedDiameter = 5 * this.ratio

        this.hueOffset = 297
        this.zoomLevel = 1
        this.points = []
        this.useDots = true

        this.resizeCallbacks = [this.restartAnimation.bind(this)]
    }

    init() {
        this.attachControls()
        this.calculatePoints()
    }

    calculatePoints() {
        this.points = []
        this.divergenceRadian = this.divergenceAngle * Math.PI / 180
        this.numberOfSeeds = ((this.canvas.width / 2) * 0.8) / (this.scale * this.seedDiameter) * 360
        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2

        for (let n = 1; n <= this.numberOfSeeds; n++) {
            const phi = n * this.divergenceRadian
            const r = this.zoomLevel * this.scale * Math.sqrt(n)

            const x = r * Math.cos(phi)
            const y = r * Math.sin(phi) * -1

            const d = this.distanceFromCenter(centerX + x, centerY + y)
            // const fillStyle = this.colorEasing(d)
            const fillStyle = this.colorEasing(n)
            
            this.points.push({
                x: centerX + x,
                y: centerY + y,
                fillStyle: fillStyle
            })
        }

        this.drawPattern()
    }

    colorEasing(n) {
        const hue = ((n * this.divergenceAngle) + this.hueOffset) % 361
        return `hsl(${hue}, 85%, 60%)`
    }

    drawPattern() {
        if (this.useDots) {
            for (let i = 0, pointLen = this.points.length; i < pointLen; i++) {
                this.ctx.fillStyle = this.points[i].fillStyle
                this.ctx.beginPath()
                this.ctx.arc(this.points[i].x, this.points[i].y, this.seedDiameter * this.zoomLevel, 0, TWO_PI)
                this.ctx.fill()
            }
        } else {
            this.ctx.lineWidth = this.ratio * 4
            for (let i = 1, pointLen = this.points.length; i < pointLen; i++) {
                this.ctx.beginPath()
                this.ctx.strokeStyle = this.points[i].fillStyle
                this.ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y)
                this.ctx.lineTo(this.points[i].x, this.points[i].y)
                this.ctx.stroke()
            }
        }
    }

    distanceFromCenter(x, y) {
        const centerX = this.canvas.width / 2
        const centerY = this.canvas.height / 2

        return Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2))
    }

    restartAnimation() {
        this.clearCanvas()
        this.calculatePoints()
    }


    attachControls() {
        const rangeInputs = document.querySelectorAll('#controls input[type="range"]')
        const radioInputs = document.querySelectorAll('#controls input[type="radio"]')

        for (let i = 0, rangeInputsLen = rangeInputs.length; i < rangeInputsLen; i++) {
            rangeInputs[i].addEventListener('input', this.updateInputValueLabel.bind(this))
            rangeInputs[i].addEventListener('change', this.controlListener.bind(this))
        }

        for (let i = 0, radioInputsLen = radioInputs.length; i < radioInputsLen; i++) {
            radioInputs[i].addEventListener('click', this.updateInputValueLabel.bind(this))
        }
        
        this.updateInputs([...rangeInputs, ...radioInputs])
    }

    updateInputs(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            const name = inputs[i].getAttribute('name')
            if (inputs[i].getAttribute('type') === 'range') {
                document.querySelector(`#controls [data-for="${name}"]`).innerText = this[name]
                inputs[i].value = this[name]
            } else if (Number(this[name]) === Number(inputs[i].value)) {
                inputs[i].setAttribute('checked', true)
            }
        }
    }

    controlListener(e) {
        const name = e.target.getAttribute('name')
        this[name] = Number(e.target.value)
    }

    
    updateInputValueLabel(e) {
        const name = e.target.getAttribute('name')

        if (e.target.getAttribute('type') !== 'radio') {
            document.querySelector(`#controls [data-for="${name}"]`).innerText = e.target.value
        }
        this[name] = Number(e.target.value)

        this.restartAnimation()
    }
    
    
}

// initialize
const sunflower = new Sunflower()
sunflower.init()