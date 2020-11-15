console.log("Form foreground");
window.onload = function () {
	checkHostname();
};

function checkHostname() {
	var hostname = window.location.hostname;
	console.log(hostname);
	switch (hostname) {
		case "www.facebook.com":
			domainConfig.isFacebook.setEntryInput();
			break;

		case "id.zalo.me":
			domainConfig.isZalo.setEntryInput();
			break;

		default:
			console.log("This extension is not available for this site");
			break;
	}
}

var domainConfig = {
	isFacebook: {
		username: "Hello",
		password: "123456",
		setEntryInput: function () {
			document.querySelector("#email").value = this.username;
			document.querySelector("#pass").value = this.password;
		},
	},
	isZalo: {
		phoneNumber: "944008094",
		password: "aodsfijoagn",
		setEntryInput: () => {
			document.querySelector("input[type='tel']").value = parseInt(
				this.phoneNumber,
			);
			document.querySelector(
				"input[type='password']",
			).value = this.password;
		},
	},
};
