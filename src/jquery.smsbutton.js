
/*
	SMS button UI
	option
		type {String} "mobile" or "email"
		success {Function} success response callback
		error {Function} error response callback
		time {Number} time-count after SMS has been sent sucessfully, default to 60s
		afterReset {Function} after button has been reset after time-count
*/
(function ($) {

	$.fn.extend({
		SMSButton: function (opt) {
			var type = opt.type || "mobile",
				// state = opt.state, 
				success = opt.success || function () { },
				error = opt.error || function () { },
				time = opt.time || 60,
				afterReset = opt.afterReset || function () { }

			return this.each(function () {
				var $this = $(this),
					timer,
					T = time,
					readyText = (type == "email") ? "获取邮箱验证码" : "免费获取验证码"

				// state className
				var sClass = {
					sending: "disabled",
					sended: "disabled",
					ready: ""
				}

				// click handler
				$this.on("click", function (e) {
					// not in ready state
					if ($this.attr("disabled") == true) return
					// reset state className
					resetState()
					// change state to sending
					changeState("sending")
					getSMS().done(function (res) {
						console.log(res)
						changeState("sended")
					}).fail(function (err) {
						console.log(err)
						changeState("ready")
					}).always(function () {
						console.log("always")
						console.log(arguments)
					})

				})

				// 清除上一次class状态方法
				function resetState() {
					clearInterval(timer)
					$this.removeClass(sClass.sending + " " + sClass.sended + " " + sClass.ready)
					$this.removeAttr("disabled")
				}

				// 更改状态
				function changeState(state) {
					switch (state) {
						case "sending":
							$this.addClass(sClass.sending)
							$this.attr("disabled", true)
							changeText("正在发送...")
							break
						case "sended":
							cb = success
							$this.addClass(sClass.sended)
							$this.attr("disabled", true)
							changeText(T + "秒后可重新获取")
							timer = setInterval(function () {
								if (T == 1) {
									clearInterval(timer)
									$this.sCodeBtnChange(type, "ready")
									cb && cb()
									return
								}
								changeText(--T + "秒后可重新获取")
							}, 1000)
							break
						default://"ready" state
							$this.addClass(sClass.ready)
							changeText(readyText)
					}
				}

				function changeText(text) {
					if ($this.is("input")) {
						$this.val(text)
					} else {
						$this.text(text)
					}
				}

			})
		}
	})

})(window.jQuery)


