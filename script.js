class Time {
    constructor() {
        this.hour = 0
        this.minute = 0
        this.second = 0
    }

    add_second() {
        this.second++
        if (this.second >= 60) {
            this.second = 0
            this.add_minute()
        }
    }

    add_minute() {
        this.minute++
        if (this.minute >= 60) {
            this.minute = 0
            this.add_hour()
        }
    }

    add_hour() {
        this.hour++
        if (this.hour >= 24) {
            this.hour = 0
        }
    }

    get_formatted_string() {
        var hours = this.hour.toString().padStart(2, '0')
        var minutes = this.minute.toString().padStart(2, '0')
        var seconds = this.second.toString().padStart(2, '0')
        return hours + ":" + minutes + ":" + seconds
    }
}

var buttonArea = document.getElementById("button-area")
var startBtn = document.getElementById("btn-start")
var stopBtn = document.getElementById("btn-stop")
var resetBtn = document.getElementById("btn-reset")
var timerElement = document.getElementById("timer-area")
var timerData = new Time()
var counting = false

startBtn.addEventListener("click", function() {
    counting = true
    startBtn.classList.add("visually-hidden")
    stopBtn.classList.remove("visually-hidden")
    resetBtn.classList.remove("visually-hidden")
})

stopBtn.addEventListener("click", function() {
    counting = false
    stopBtn.classList.add("visually-hidden")
    startBtn.classList.remove("visually-hidden")
})

resetBtn.addEventListener("click", function() {
    timerData = new Time()
    timerElement.textContent = "00:00:00"
    counting = false
    startBtn.classList.remove("visually-hidden")
    stopBtn.classList.add("visually-hidden")
    resetBtn.classList.add("visually-hidden")
})

setInterval(function() {
    if (counting) {
        timerData.add_second()
        timerElement.textContent = timerData.get_formatted_string()
    }
}, 1000)