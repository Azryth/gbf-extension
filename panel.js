
////////////////
// Formatting //
////////////////

/*
Transforms seconds into hh:mm:ss format
*/
function get_elapsed_time_string(total_seconds) {
  function pretty_time_string(num) {
    return ( num < 10 ? "0" : "" ) + num;
  }

  var hours = Math.floor(total_seconds / 3600);
  total_seconds = total_seconds % 3600;

  var minutes = Math.floor(total_seconds / 60);
  total_seconds = total_seconds % 60;

  var seconds = Math.floor(total_seconds);

  // Pad the minutes and seconds with leading zeros, if required
  hours = pretty_time_string(hours);
  minutes = pretty_time_string(minutes);
  seconds = pretty_time_string(seconds);

  // Compose the string for display
  var currentTimeString = hours + ":" + minutes + ":" + seconds;

  return currentTimeString;
}

/*
Formats a number by adding ' to separate large numbers
*/
function displayNumbers(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function updateStatistics() {
    var time = elapsed_seconds;
    $("#totalDamage").text(displayNumbers(totalDamage));
    $("#totalAttackDamage").text(displayNumbers(totalTurnDamage));
    $("#totalSkillDamage").text(displayNumbers(totalSkillDamage));
    $("#totalChainBurst").text(displayNumbers(totalChainBurstDamage));
    $("#totalSummonDamage").text(displayNumbers(totalSummonDamage));
    
    if (turnNumber != 0) {
        $("#damageTurn").text(displayNumbers(Math.round(totalDamage / turnNumber)) + " (" + turnNumber + " turns)");
        $("#skillsTurn").text((skillsUsed / turnNumber).toFixed(2) + " (" + skillsUsed + " skills)");
        $("#summonsTurn").text((summonsUsed / turnNumber).toFixed(2) + " (" + summonsUsed + " summons)");
    } else {
        $("#damageTurn").text("0");
        $("#skillsTurn").text("0");
        $("#summonsTurn").text("0");
    }
    
    updateCharacterInfo();
}

/*
Clears all boss information and adds the current one
*/
function updateBossInfo() {
    $("#enemyInfo").html("");
    for (var i = 0; i < bossInfo.length; i++) {
        if ( bossInfo[i] != undefined && bossInfo[i].name != undefined) {
            $("#enemyInfo").append("<li class=\"flex-container\"><p>" + bossInfo[i].name +"</p></li><li class=\"flex-container\"><p class=\"sub\">Max HP</p><p>" + displayNumbers(bossInfo[i].maxhp) + "</p></li><li class=\"flex-container\"><p class=\"sub\">HP</p><p>" + displayNumbers(bossInfo[i].hp) + " (" + displayNumbers((Number(bossInfo[i].hp) / Number(bossInfo[i].maxhp) * 100).toFixed(2)) + "%)</p></li>")
        }
    }
}

function updateCharacterInfo() {
    //check which infos are hidden
    var isVisible = [];
    $("#characterInfo").children(":nth-child(even)").each(function () {
        isVisible.push($(this).is(":visible"));
    });
    
    //clear the contents
    $("#characterInfo").html("");
    
    //add new content
    for (var i = 0; i < characterInfo.length; i++) {
        
        character = $("<li>");
        character.addClass("flex-container");
        character.addClass("toggleable");
        character.html("<p>\> " + characterInfo[i].name +"</p>" + "<p>" + displayNumbers(characterInfo[i].skillDamage + characterInfo[i].attackDamage) + "</p>");
        
        $("#characterInfo").append(character);
        
        var breakdown = $("<div>");
        if(!isVisible[i]) {
            breakdown.hide();
        }
        
        //attack damage
        var damageDetail = $("<li>");
        damageDetail.addClass("flex-container");
        var p = $("<p>");
        p.addClass("sub");
        p.text("attack damage");
        damageDetail.append(p);
        
        p = $("<p>");
        p.text(displayNumbers(characterInfo[i].attackDamage));
        damageDetail.append(p);
        breakdown.append(damageDetail);
        
        //skill damage
        damageDetail = $("<li>");
        damageDetail.addClass("flex-container");
        var p = $("<p>");
        p.addClass("sub");
        p.text("skill damage");
        damageDetail.append(p);
        
        p = $("<p>");
        p.text(displayNumbers(characterInfo[i].skillDamage));
        damageDetail.append(p);
        breakdown.append(damageDetail);
        breakdown.append($("</br>"));
        $("#characterInfo").append(breakdown);
        character.click(function() {
            $(this).next().toggle();
        });
        
        //$("#characterInfo").append("<li class=\"flex-container\"><p>" + characterInfo[i].name +"</p></li><li class=\"flex-container\"><p class=\"sub\">total damage</p><p>" + displayNumbers(characterInfo[i].skillDamage + characterInfo[i].attackDamage) + "</p></li>")
    }
    if(characterInfo[0].name == "Ally 1") {
        var note = $("<p>");
        note.addClass("warning");
        note.css("font-size", "1.1vw");
        note.text("*Note: The logger was started after the battle has started. Ally numbering is according to the state of the party when the logger was opened. To display the names correctly refresh the page (totals will remain in the position they are in and may be incorrect after refresh).");
        $("#characterInfo").append(note);
    }
}

function updateCharacterDATAInfo() {
    $("#characterDATAInfo").html("");
    for (var i = 0; i < characterInfo.length; i++) {
        
        if ((turnNumber - characterInfo[i].tas - characterInfo[i].cas) != 0) {
            var daRate = (characterInfo[i].das / (turnNumber - characterInfo[i].tas - characterInfo[i].cas) * 100).toFixed(2);
        } else {
            var daRate = 0;
        }
        if ((turnNumber - characterInfo[i].cas) != 0) {
            var taRate = (characterInfo[i].tas / (turnNumber - characterInfo[i].cas) * 100 ).toFixed(2);
        } else {
            taRate = 0;
        }
        $("#characterDATAInfo").append("<div class=\"character\"><li class=\"flex-container\"><p>" + characterInfo[i].name +"</p></li><li class=\"flex-container\"><p class=\"sub\">DA rate</p><p>" + daRate + "%</p></li><li class=\"flex-container\"><p class=\"sub\">TA rate</p><p>" + taRate + "%</p></li><div>")
    }
}

function showRaidId() {
    $("#raidID").html("<p>Raid ID</p><p>" + raidID + "</p>");
}

/*
Adds a line to the log containing damage done and action taken
*/
function appendTurnLog(action, damage, turnDetails) {
    
    //summary
    var item = $("<li>");
    item.addClass("flex-container");
    item.addClass("turn");
    item.addClass("toggleable");
    item.html("<p>\> " + action + "</p><p>" + displayNumbers(damage) + "</p></li>");
    
    $("#log").prepend(item); 
    
    var container = $("<div>");
    container.hide();
    var subItem;
    var subAction;
    
    for(var i = 0; i < turnDetails.details.length; i++) { //character
        //container
        subItem = $("<li>");
        subItem.addClass("flex-container");
        
        //action name
        subAction = $("<p>");
        subAction.addClass("sub");
        if (turnDetails.details[i].pos != -1) {
            if(!(turnDetails.details[i].type == "Chain Burst" || (turnDetails.details[i].type == "Single" && turnDetails.details[i].details[0].details.length < 2) || turnDetails.details[i].type == "CA")){
                subAction.html("\> "+ characterInfo[turnDetails.details[i].pos].name + "(" + turnDetails.details[i].type + ")"); 
                subItem.addClass("toggleable");
            } else {
                subAction.text(characterInfo[turnDetails.details[i].pos].name + "(" + turnDetails.details[i].type + ")"); 
            }            
        } else {
            if( turnDetails.details[i].type == "Chain Burst") {
                subAction.text(turnDetails.details[i].type);
            }
        }
        subItem.append(subAction);
        
        subAction = $("<p>");
        subAction.text(displayNumbers(turnDetails.details[i].total));
        subItem.append(subAction);
        
        container.append(subItem); 
        //action details if needed, i.e. not single attack, not charge attack, not chain burst
        if(!(turnDetails.details[i].type == "Chain Burst" || (turnDetails.details[i].type == "Single" && turnDetails.details[i].details[0].details.length < 2) || turnDetails.details[i].type == "CA")){
            var subContainer = $("<div>");
            subContainer.hide();
            var subsubItem;
            var subsubAction;
            
            for(var j = 0; j < turnDetails.details[i].details.length; j++) { //each attack
                subsubItem = $("<li>");
                subsubItem.addClass("flex-container");
                subsubAction = $("<p>");
                subsubAction.addClass("subsub");
                
                if ( turnDetails.details[i].details[j].details.length > 1) {
                    subsubAction.html("\> Attack " + (j+1));
                    subsubItem.addClass("toggleable");
                } else {
                    subsubAction.text("Attack " + (j+1));
                }
                subsubItem.append(subsubAction);
                subsubAction = $("<p>");
                subsubAction.text(displayNumbers(turnDetails.details[i].details[j].total));
                subsubItem.append(subsubAction);
                subContainer.append(subsubItem);
                
                var subsubContainer = $("<div>");
                subsubContainer.hide();
                var subsubsubItem;
                var subsubsubAction;
                
                if ( turnDetails.details[i].details[j].details.length > 1) {
                    for (var k = 0; k < turnDetails.details[i].details[j].details.length;k++){
                        subsubsubItem = $("<li>");
                        subsubsubItem.addClass("flex-container");
                        subsubsubAction = $("<p>");
                        subsubsubAction.addClass("subsubsub");
                        if( k == 0) {
                            subsubsubAction.text("Normal");
                        } else {
                            subsubsubAction.text("Extra");
                        }
                        subsubsubItem.append(subsubsubAction);
                        subsubsubAction = $("<p>");
                        subsubsubAction.text(displayNumbers(turnDetails.details[i].details[j].details[k]));
                        subsubsubItem.append(subsubsubAction);
                        subsubContainer.append(subsubsubItem);
                    }
                    subsubContainer.append($("<br/>"));
                    subContainer.append(subsubContainer);
                    subsubItem.click(function() {
                        $(this).next().toggle();
                    });
                }
            }
            subContainer.append($("<br/>"));
            
            container.append(subContainer);
            subItem.click(function() {
                $(this).next().toggle();
            });
        }
    }
    container.append($("<br/>"));
    
    item.click(function() {
        $(this).next().toggle();
    });
      
    item.after(container);
    
    totalDamage += turnDetails.total;
    if(timer != undefined) {
    	timedTotalDamage += turnDetails.total;
    }
    
    updateStatistics();
}

function appendOthersLog(action, damage) {
    $("#log").prepend("<li class=\"flex-container\"><p class=\"halfsub\">" + action + "</p><p>" + displayNumbers(damage) + "</p></li>");
        
    totalDamage += actionDamage;
    if(timer != undefined) {
    	timedTotalDamage += turnDetails.total;
    }
    actionDamage = 0;
    
    updateStatistics();
}

function updateadtChart() {
    
    adtlabels.push(turnNumber);
    //adtdata.labels = adtlabels.slice(Math.max(0,adtlabels.length - 10), adtlabels.length);
    //adtdata.labels.push(turnNumber);
    adtChart.data.labels.push(turnNumber);
    
    adtdatapoints.push(Math.round(totalDamage / turnNumber / 1000));
    dtdatapoints.push(Math.round(turnDamage / 1000));
    
    //adtChart.data.datasets[0].data = adtdatapoints.slice(Math.max(0, adtdatapoints.length - 10), adtdatapoints.length);
    //adtChart.data.datasets[1].data = dtdatapoints.slice(Math.max(0, dtdatapoints.length - 10), dtdatapoints.length);;
    adtChart.data.datasets[0].data.push(Math.round(totalDamage / turnNumber / 1000));
    adtChart.data.datasets[1].data.push(Math.round(turnDamage / 1000));
    
    adtChart.update();
    
    turnDamage = 0;
    
}

//--------------------------------------------------------------------------------------
///////////
// Timer //
///////////



var elapsed_seconds = 0;
var timer;

function startTimer() {
    if(timer === undefined) {
        timer = setInterval(function() {
            elapsed_seconds = elapsed_seconds + 1;
            $('#timer').text(get_elapsed_time_string(elapsed_seconds));
            $("#timedtotalDamage").text(displayNumbers(timedTotalDamage));
            $("#damageTime").text(displayNumbers((timedTotalDamage / elapsed_seconds).toFixed(2)) + " ("+ elapsed_seconds +"s)");
            }, 1000);
        $("#toggleTimer").text("pause timer");
    } else {
        clearInterval(timer);
        timer = undefined;
        $("#toggleTimer").text("start timer");
    }
}

function clearTimer() {
    if (timer != undefined) {
        clearInterval(timer);
    } 
    
    elapsed_seconds = 0;
    timedTotalDamage = 0;
    $('#timer').text("00:00:00");
    $("#damageTime").text("0");
    $("#timedtotalDamage").text("0");
    timer = undefined;
    
    $("#toggleTimer").text("start timer");
}

document.querySelector("#toggleTimer").addEventListener('click', startTimer, false);
document.querySelector("#clearTimer").addEventListener('click', clearTimer, false);


//------------------------------------------------------------------------------

/////////////
// Buttons //
/////////////

function resetDamage() {
    //general
    totalDamage = 0;
    totalTurnDamage = 0;
    totalSummonDamage = 0;
    totalSkillDamage = 0;
    totalChainBurstDamage = 0;
    turnNumber = 0;
    skillsUsed = 0;
    summonsUsed = 0;
    
    //chart
    adtChart.data.labels = [];
    adtChart.data.datasets[0].data = [];
    adtChart.data.datasets[1].data = [];
    adtChart.update();
    
    //character info
    for(var i = 0; i < characterInfo.length; i++) {
        characterInfo[i].attackDamage = 0;
        characterInfo[i].skillDamage = 0;
        characterInfo[i].das = 0;
        characterInfo[i].tas = 0;
    }
    
    updateStatistics();
}

function clearLog() {
    $("#log").html("");
}

function clearEnemyInfo() {
    $("#enemyInfo").html("");
    bossInfo = [];
    $("#raidID").html("");
    raidID = "";
}

$(function() {
    $("#tabs").tabs();
});


function saveLog() {
	var link = document.getElementById("saveLog");
	var logFile = $("<html>");
	var head = $("<head>");
	var body = $("<body>");
	$("<style type=\"text/css\">html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video { margin: 0;	padding: 0;	border: 0; font-size: 100%;	font: inherit; vertical-align: baseline; } article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section { display: block; } body { line-height: 1; } ol, ul { list-style: none; } blockquote, q { quotes: none; } blockquote:before, blockquote:after, q:before, q:after { content: ''; content: none; } table { border-collapse: collapse; border-spacing: 0; } </style>").appendTo(head);
	$("<style type=\"text/css\"> body {	font-family: 'Lato', Verdana, Geneva, sans-serif; letter-spacing:0.1vw;	font-size: 1.25vw; line-height: 200%; } h1 { font-size: 2em; margin: 0.25em 0em 1em 0em; text-align: center; } li { font-size: 1.5em; } .flex-container { display: flex; width: 100%; flex-direction: row; flex-wrap: nowrap; justify-content: space-between; } .flex-item { width: 48%; margin: 1em; } .flex-container .halfsub { padding-left: 1em; border-style: none; } .flex-container .sub { padding-left: 2em; border-style: none; } .flex-container .subsub { padding-left: 3em; border-style: none; } .flex-container .subsubsub { padding-left: 4em; }.statSection { border: 0.2px; padding-bottom: 1em; border-bottom-style: solid; } #log-container { height: 50vh; background-color: #e6e6e6; padding: 0em 0.4em 0em 0.4em; overflow-y:scroll; } #log .turn{ border: 0.05em; border-top-style: solid; border-color: whitesmoke; } .character { border: 0.2px; border-bottom-style: solid; margin-top: 1em; } .clock { display:flex; flex-direction: row; justify-content: space-around; text-align: center; margin-bottom: 1em; } .clock h2 { font-size: 2em; } #timer { padding-top: 0.25em; }</style>").appendTo(head);
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

document.querySelector("#resetDamage").addEventListener('click', resetDamage, false);
document.querySelector("#clearLog").addEventListener('click', clearLog, false);
document.querySelector("#clearEnemyInfo").addEventListener('click', clearEnemyInfo, false);
document.querySelector("#saveLog").addEventListener('click', saveLog, false);

//----------------------------------------------------------------------------
/////////////////
// Read Data //
/////////////////

var actionDamage = 0; //damage from action
var turnDamage = 0;
var totalDamage = 0; //all damage combined
var timedTotalDamage = 0; //total damage logged while timer is running
var totalTurnDamage = 0; //all damage from attack
var totalSummonDamage = 0; //all summon damage
var totalSkillDamage = 0; //all skill damage
var totalChainBurstDamage = 0; //damage from all chain bursts
var turnNumber = 0;
var raidID = ""; //twitter raidID
var bossInfo = []; //boss info with name, lv, maxhp, hp
var characterInfo = [ //character info with name, damage dealt
    { //first character (i.e. Gran/Djeeta)
        name: "Ally 1",
        attackDamage: 0,
        skillDamage: 0,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //second character
        name: "Ally 2",
        attackDamage: 0,
        skillDamage: 0,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //third character
        name: "Ally 3",
        attackDamage: 0,
        skillDamage: 0,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //fourth character
        name: "Ally 4",
        attackDamage: 0,
        skillDamage: 0,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //fifth character
        name: "Ally 5",
        attackDamage: 0,
        skillDamage: 0,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //sixth character
        name: "Ally 6",
        attackDamage: 0,
        skillDamage: 0,
        das: 0,
        tas: 0,
        cas: 0
    },
]; 
formation = []; // length 4 array. Each position holds the character that is in the position of the index
noFormationInfo = false; //flag in case the logger is opened when already in battle
var skillsUsed = 0;
var summonsUsed = 0;

chrome.devtools.network.onRequestFinished.addListener(function(req) {
    var reqURL = document.createElement('a');
    reqURL.href = req.request.url;
    
    if(reqURL.hostname == "gbf.game.mbga.jp" || reqURL.hostname == "game.granbluefantasy.jp") {
        
        //i.e. normal_attack_result.json
        var path = reqURL.pathname.split('/')[2];
        //attack
        if(path == "normal_attack_result.json") {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var data = JSON.parse(body);
                var scenario = data.scenario;
                //safety check
                var chainBurst = false;
                //store all turn information in here
                var turnDetails = {
                    total: 0,
                    details: []
                };
                var charaDetails = {
                    total: 0,
                    pos: -1,
                    type: "", //Single, Double, Triple, CA
                    details: [],
                };
                var attackDetails = {
                    total: 0,
                    details: [],
                };
                var perChara = [];
                for (var i = 0; i < scenario.length; i++) { 
                    //normal attacks
                    if(scenario[i].cmd == "attack" && scenario[i].from == "player") {
                        var j
                        for (j = 0; j < scenario[i].damage.length; j++) { //loop for character turn (Single, DA, TA)
                            for(var k = 0; k < scenario[i].damage[j].length; k++) { //loop for attack components (extra damage)
                                attackDetails.total += scenario[i].damage[j][k].value;
                                attackDetails.details.push(scenario[i].damage[j][k].value);
                            }
                            charaDetails.total += attackDetails.total;
                            charaDetails.details.push(attackDetails);
                            attackDetails = { // reset
                                total: 0,
                                details: [],
                            };
                        } 
                        //per character information
                        charaDetails.pos = Number(scenario[i].pos);
                        if( j == 1) {
                            charaDetails.type = "Single";
                        } else if (j == 2) {
                            charaDetails.type = "Double";
                        } else if (j == 3) {
                            charaDetails.type = "Triple";
                        }
                        
                        turnDetails.total += charaDetails.total;
                        turnDetails.details.push(charaDetails);
                    //charge attacks    
                    } else if (scenario[i].cmd == "special" || scenario[i].cmd == "special_npc") {
                        //enable checking for chainburst
                        if(scenario[i].count > 1) {
                            chainBurst = true;
                        }

                        for (var j = 0; j < scenario[i].list.length; j++) {
                            charaDetails.total += scenario[i].list[j].damage[0].value;
                        }
                        
                        charaDetails.type = "CA";
                        charaDetails.pos = Number(scenario[i].pos);
                        //charaDetails.details is empty for charge attack
                        
                        turnDetails.total += charaDetails.total;
                        turnDetails.details.push(charaDetails);
                    //chain burst    
                    } else if (chainBurst == true && scenario[i].cmd == "effect" && scenario[i].kind.indexOf("burst") !== -1) {
                        if ((i < scenario.length - 1) && scenario[i + 1].cmd == "damage") {
                            for (var j = 0; j < scenario[i + 1].list.length; j++) {
                                charaDetails.total += scenario[i + 1].list[j].value;
                            }
                            charaDetails.pos = -1;
                            charaDetails.type = "Chain Burst";
                            
                            totalChainBurstDamage += charaDetails.total;
                            turnDetails.total += charaDetails.total;
                            turnDetails.details.push(charaDetails);
                    }
                    //boss info    
                    } else if (scenario[i].cmd == "boss_gauge") {
                        if (bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = scenario[i].hp;
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : scenario[i].name.en,
                                maxhp : scenario[i].hpmax,
                                hp : scenario[i].hp
                            };
                        }
                        
                        updateBossInfo();
                        
                    } else if ((scenario[i].cmd == "die" || scenario[i].cmd == "stop") && scenario[i].to == "boss") { 
                        if ( bossInfo[Number(scenario[i].pos)] != undefined) {
                            bossInfo[Number(scenario[i].pos)].hp = "0";
                        } else {
                            bossInfo[Number(scenario[i].pos)] = {
                                name : undefined
                            };
                        }
                        
                    } else if (scenario[i].cmd == "replace" ) {
                        formation[scenario[i].pos] = scenario[i].npc;
                    }
                    
                    //increase individual character totals
                    if(charaDetails.pos != -1) {
                        characterInfo[formation[charaDetails.pos]].attackDamage += charaDetails.total;
                        if(charaDetails.type == "Double") {
                            characterInfo[formation[charaDetails.pos]].das++;
                        } else if ( charaDetails.type == "Triple") {
                            characterInfo[formation[charaDetails.pos]].tas++;
                        } else if ( charaDetails.type == "CA") {
                            characterInfo[formation[charaDetails.pos]].cas++;
                        }
                    }
                    charaDetails = { //reset
                        total: 0,
                        pos: -1,
                        type: "", //Single, Double, Triple, CA
                        details: [],
                    };
                    
                }
                
                if(turnDetails.details.length > 0) {
                    totalTurnDamage += turnDetails.total;
                    turnDamage += turnDetails.total;
                    turnNumber++;
                    
                    appendTurnLog("Turn " + (Number(JSON.parse(body).status.turn) - 1), turnDetails.total, turnDetails);
                    
                    updateadtChart();
                }
                
                turnDetails = { //reset
                    total: 0,
                    details: []
                };
                updateCharacterDATAInfo();
                
                //status at the end of turn
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }
                
                updateBossInfo();
                
            });
        }
        
        //skill
        else if(path == "ability_result.json") {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var data = JSON.parse(body);
                var scenario = data.scenario;
                var skillName = "";
                var character;
                for (var i = 0; i < scenario.length; i++) { 
                    if(scenario[i].cmd == "ability") {
                        skillName = scenario[i].name;
                        character = Number(scenario[i].pos);
                    } else if (scenario[i].cmd == "damage" && scenario[i].to == "boss") {
                        for (var j = 0; j < scenario[i].list.length; j++) {
                                actionDamage += scenario[i].list[j].value;
                         }
                    
                    //boss info    
                    } else if (scenario[i].cmd == "boss_gauge") {
                        if (bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = scenario[i].hp;
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : scenario[i].name.en,
                                maxhp : scenario[i].hpmax,
                                hp : scenario[i].hp
                            };
                        }
                        
                        updateBossInfo();
                        
                    } else if (scenario[i].cmd == "die" && scenario[i].to == "boss") { 
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }
                        
                        updateBossInfo();
                    } else if (scenario[i].cmd == "replace" ) {
                        formation[scenario[i].pos] = scenario[i].npc;
                    }
                }
                
                if(skillName != "") {
                    skillsUsed++;
                    if(actionDamage != 0) {
                        characterInfo[formation[character]].skillDamage += actionDamage;
                        totalSkillDamage += actionDamage;
                        turnDamage += actionDamage;
                        appendOthersLog(skillName, actionDamage);
                    } else {
                        appendOthersLog(skillName, "");
                    }
                }
                
                //status at the end of ability
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }
            });
        }
        
        // summon
        else if(path == "summon_result.json") {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var data = JSON.parse(body);
                var scenario = data.scenario;
                var summonName = "";
                for (var i = 0; i < scenario.length; i++) { 
                
                    if(scenario[i].cmd == "summon_cutin") {
                        summonName = scenario[i].name;
                    } else if(scenario[i].cmd == "summon") {
                        if(scenario[i].name != "" && summonName == "") {
                            summonName = scenario[i].name;
                        }
                        
                        for(var j = 0; j < scenario[i].list[0].damage.length; j++) {
                            actionDamage += scenario[i].list[0].damage[j].value;
                        }
                     
                    
                    //boss info    
                    } else if (scenario[i].cmd == "boss_gauge") {
                        if (bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = scenario[i].hp;
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : scenario[i].name.en,
                                maxhp : scenario[i].hpmax,
                                hp : scenario[i].hp
                            };
                        }
                        
                        updateBossInfo();
                        
                    } else if (scenario[i].cmd == "die" && scenario[i].to == "boss") { 
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }
                        
                        updateBossInfo();
                    } else if (scenario[i].cmd == "replace" ) {
                        formation[scenario[i].pos] = scenario[i].npc;
                    }
                }
                if(summonName != "") {
                    summonsUsed++;
                    if(actionDamage != 0) {
                        totalSummonDamage += actionDamage;
                        turnDamage += actionDamage;
                        appendOthersLog(summonName, actionDamage);
                    } else {
                        appendOthersLog(summonName, "");
                    }
                }
                
                //status at the end of summon
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }
            });
        }
        
        //raid start information
        else if (path == "start.json") {
            req.getContent(function(body){
                var startinfo = JSON.parse(body);
                //raid id
                if(startinfo.multi == 1) {
                    raidID = startinfo.twitter.battle_id;
                } else {
                    raidID = "";
                }
                showRaidId();
                
                //boss info
                var boss;
                bossInfo = [];
                for(var i = 0; i < startinfo.boss.param.length; i++) {
                    boss = {
                      name : startinfo.boss.param[i].monster,
                      lv : startinfo.boss.param[i].Lv,
                      maxhp : startinfo.boss.param[i].hpmax,
                      hp : startinfo.boss.param[i].hp
                        
                    };
                    bossInfo.push(boss);
                }
                
                updateBossInfo();
                
                //character info
                for(var i = 0; i < startinfo.player.param.length; i++) {
                    characterInfo[i].name = startinfo.player.param[i].name;
                }
                
                updateCharacterInfo();
                updateCharacterDATAInfo()
                
                //team formation
                if (startinfo.formation != undefined) {
                    formation = startinfo.formation;
                }
                
            });
        
        }
        
        //boss died
        else if (path == "reward.json") {
            req.getContent(function(body){
                var scenario = JSON.parse(body).scenario;
                for (var i = 0; i < scenario.length; i++) { 
                    if (scenario[i].cmd == "die" && scenario[i].to == "boss") {
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }
                    } else if (scenario[i].cmd == "stop" && scenario[i].to == "boss") {
                        if ( bossInfo[scenario[i].pos] != undefined) {
                            bossInfo[scenario[i].pos].hp = "0";
                        } else {
                            bossInfo[scenario[i].pos] = {
                                name : undefined
                            };
                        }
                    }
                
                }
                
                updateBossInfo();
            });
        } 
    }
});


//--------------------------------------------------------------
////////////
// Graphs //
////////////

var adtlabels = [];
var adtdatapoints = [];
var dtdatapoints = [];

var adtdata = {
    labels: [],
    datasets: [
        {
            label: "Average Damage per Turn",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
        },
        
        {
            label: "Damage in Turn",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(255,165,0,0.4)",
            borderColor: "rgba(255,165,0,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(255,165,0,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255,165,0,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [],
            spanGaps: false,
        }
    ]
};

var adtoptions = {
    scales: {
        yAxes: [{
        type: 'logarithmic',
            position: 'left'
        }]
    }
};

var graphctx = document.getElementById("graph").getContext("2d");

var adtChart = new Chart.Line(graphctx, {data: adtdata, options: adtoptions});

