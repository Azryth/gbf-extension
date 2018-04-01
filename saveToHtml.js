function saveLog() {
	var link = document.getElementById("saveLog");
	var logFile = $("<html>");
	var head = $("<head>");
	var body = $("<body>");
	$("<style type=\"text/css\">html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video { margin: 0;	padding: 0;	border: 0; font-size: 100%;	font: inherit; vertical-align: baseline; } article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block; } body { line-height: 1; } ol, ul { list-style: none; } blockquote, q { quotes: none; } blockquote:before, blockquote:after, q:before, q:after { content: ''; content: none; } table { border-collapse: collapse; border-spacing: 0; } </style>").appendTo(head);
	$("<style type=\"text/css\"> body { font-family: 'Lato', Verdana, Geneva, sans-serif; font-size: 1.25vw; line-height: 160%; } h1 { font-size: 2em; margin: 0.25em 0em 0.5em 0em; text-align: center; } h2 { font-size: 1.5em; text-align: center; } a, a:link, a:visited { text-decoration: none; decoration: none; color: white; } .main-flex { display: flex; justify-content: space-between; } .section { display: block; } .flex-container { display: flex; width: 100%; flex-direction: row; flex-wrap: nowrap; justify-content: space-between; margin: 0; } .flex-item { display: block; width: 31%; } .flex-container .sub1 { padding-left: 1em; border-style: none; } .flex-container .sub2 { padding-left: 2em; border-style: none; } .flex-container .sub3 { padding-left: 3em; border-style: none; } .flex-container .sub4 { padding-left: 4em; } .clock { display:flex; flex-direction: row; justify-content: space-around; text-align: center; margin-bottom: 1em; } .clock h2 { font-size: 2em; } #timer { padding-top: 0.25em; } #log-container { height: 35vh; background-color: #e6e6e6; padding: 0em 0.4em 0em 0.4em; margin-bottom: 1em; overflow-y:scroll; } #log .turn{ border: 0.05em; border-top-style: solid; border-color: whitesmoke; } .statSection { border: 0.2px; padding-bottom: 1em; } .character { border: 0.2px; border-bottom-style: solid; margin-top: 1em; } #characterInfo > div { line-height: 120%; } #raidID { color: #800000; } </style>").appendTo(head);
	$("<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css\"></style>").appendTo(head);
	$("<script   src=\"https://code.jquery.com/jquery-3.1.1.min.js\"   integrity=\"sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=\"   crossorigin=\"anonymous\"></script>").appendTo(head);
	$("<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>").appendTo(head);

	$("#tabs").clone(true).appendTo(body);
	$("<script type=\"text/javascript\"> $(\".toggleable\").each( function() { $(this).click(function() { $(this).next().toggle();}) }) </script>").appendTo(body);
	$("<script type=\"text/javascript\"> $(function() { $(\"#tabs\").tabs(); });</script>").appendTo(body);
	head.appendTo(logFile);
	body.appendTo(logFile);
	body.find(".clickable").remove();
	body.find(".warning").remove();
	body.find("#chartSection").remove();
	link.href = "data:text/plain;charsset=utf-8," + encodeURIComponent(logFile.prop("outerHTML"));
}
