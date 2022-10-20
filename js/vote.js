async function login() {
	const rep = await fetch("api/login", {
		method: "POST"
	})
	const json = await rep.json()
	if (json.authenticated) {
		document.location.href = json.redirect;
	}	
}

async function vote() {
	if (localStorage.getItem("vote") != null)
		return
	const candidate = this.attributes['data-candidate'].value
	const rep = await fetch("api/votes", {
		method: "POST",
		body: JSON.stringify({name:candidate}),
		headers: {
                    'Content-Type': 'application/json'
        }
	})
	const json = await rep.json()	
	if (json.success) {
		if (json.msg !== undefined ){
			alert(json.msg)
		}
		localStorage.setItem("vote", candidate)
		updateVotes()
	} else {
		if (json.redirect !== undefined ) {
			location.href=json.redirect
		}
	}
}

async function updateVotes() {
	$(`[data-candidate]`).removeClass("voted")
	const voted_for = localStorage.getItem("vote");
	const rep = await fetch("api/votes")
	const json = await rep.json()
	if (!json.success) {
		alert(json.msg)
		document.location.href=json.redirect
		return
	}
	for (const vote of json.votes) {
		$(`[data-candidate="${vote.name}"] p`)[1].innerText = `Votes: ${vote.votes}`
	}

	$(`[data-candidate="${voted_for}"]`).addClass("voted")
	
}

$(function(){
	// On rajoute le click pour le bouton login
	$('#click-login').on("click", login);
	$('.vote-box').on("click", vote);
	if (document.location.href.endsWith("vote.html"))
		updateVotes();
});

