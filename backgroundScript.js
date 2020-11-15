let user_signed_in = false;

const url = {
	login: "http://localhost:5000/api/users/login",
	details: "http://localhost:5000/api/users/", // add userID
};

chrome.browserAction.onClicked.addListener(function () {
	if (!user_signed_in) {
		chrome.browserAction.setPopup({
			popup: "popup.html",
		});
	} else {
		chrome.browserAction.setPopup({
			popup: "info.html",
		});
	}
});

function flip_user_status(signIn, user_info) {
	if (signIn) {
		// Fetch the localhost:3000/login route
		return fetch(url.login, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((res) => {
				return new Promise((resolve) => {
					if (res.status !== 200) resolve("fail");
					chrome.storage.local.set(
						{ userStatus: signIn, user_info },
						function (response) {
							if (chrome.runtime.lastError) resolve("fail");
							user_signed_in = signIn;
							resolve("success");
						},
					);
				});
			})
			.catch((err) => console.log(err));

		// Fetch the login route
		// return fetch(url.login, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-type": "application/json",
		// 	},

		// });
	} else if (!signIn) {
		// fetch the localhost:3000/logout route
		return new Promise((resolve) => {
			chrome.storage.local.get(["userStatus", "user_info"], function (
				response,
			) {
				console.log(response);
				if (chrome.runtime.lastError) resolve("fail");

				if (response.userStatus === undefined) resolve("fail");

				fetch("http://localhost:3000/logout", {
					method: "GET",
					headers: {
						Authorization:
							"Basic " +
							btoa(
								`${response.user_info.email}:${response.user_info.pass}`,
							),
					},
				})
					.then((res) => {
						console.log(res);
						if (res.status !== 200) resolve("fail");

						chrome.storage.local.set(
							{ userStatus: signIn, user_info: {} },
							function (response) {
								if (chrome.runtime.lastError) resolve("fail");

								user_signed_in = signIn;
								resolve("success");
							},
						);
					})
					.catch((err) => console.log(err));
			});
		});
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === "login") {
		flip_user_status(true, request.payload)
			.then((res) => sendResponse(res))
			.catch((err) => console.error(err));
		return true;
	} else if (request.message === "logout") {
		flip_user_status(false, null)
			.then((res) => sendResponse(res))
			.catch((err) => console.error(err));
	} else if (request.message === "userStatus") {
		is_user_signed_in()
			.then((res) => {
				sendResponse({
					message: "success",
					userStatus: `user_info: ${res.user_info.email}`,
				});
			})
			.catch((err) => console.log(err));
		return true;
	}
});

function is_user_signed_in() {
	return new Promise((resolve) => {
		chrome.storage.local.get(["userStatus", "user_info"], function (
			response,
		) {
			if (chrome.runtime.lastError)
				resolve({ userStatus: false, user_info: {} });
			resolve(
				response.userStatus === undefined
					? { userStatus: false, user_info: {} }
					: {
							userStatus: response.userStatus,
							user_info: response.user_info,
					  },
			);
		});
	});
}
