document.addEventListener("DOMContentLoaded", function () {
	document
		.querySelector("#login-form")
		.addEventListener("submit", async function (event) {
			const form = event.target;
			event.preventDefault();
			const email = document.querySelector("#email").value;
			const password = document.querySelector("psw").value;
			await fetch("http://localhost:5000/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: new FormData(form),
			})
				.then((response) => console.log(response))
				.catch((error) => console.log(error));
		});
});
