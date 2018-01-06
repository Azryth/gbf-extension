document.addEventListener("keyup", doKeyFunction);

doNotLoad = false;

function doKeyFunction(e) {
	if(locations[e.key] && !doNotLoad) {
		window.location = locations[e.key].href;
	}	
}

var locations = {
	r: {
		href: "http://game.granbluefantasy.jp/#quest/assist",
		desc: "raid assist"
	},
	p: {
		href: "http://game.granbluefantasy.jp/#party/index/0/npc/0",
		desc: "party"
	},
	s: { 
		href: "http://game.granbluefantasy.jp/#item",
		desc: "supplies"
	},
	l: {
		href: "http://game.granbluefantasy.jp/#quest/supporter/510031/5",
		desc: "angel halo"
	},
	k: {
		href: "http://game.granbluefantasy.jp/#casino/game/poker/200040",
		desc: "poker"
	},
	h: {
		href: "http://game.granbluefantasy.jp/#mypage",
		desc: "home"
	}
};