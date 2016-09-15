
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
    $("#totalDamage").text(displayNumbers(totalDamage));
    $("#totalAttackDamage").text(displayNumbers(totalTurnDamage));
    $("#totalSkillDamage").text(displayNumbers(totalSkillDamage));
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
    
    if(timer != undefined) {
        if (elapsed_seconds != 0){
            $("#damageTime").text(displayNumbers(Math.round(totalDamage / elapsed_seconds)));
        } else {
            $("#damageTime").text("0");
        }
    }
    
    updateCharacterInfo();
}

/*
Clears all boss information and adds the current one
*/
function updateBossInfo() {
    $("#enemyInfo").html("");
    for (var i = 0; i < bossInfo.length; i++) {
        if ( bossInfo[i].name != undefined) {
            $("#enemyInfo").append("<li class=\"flex-container\"><p>" + bossInfo[i].name +"</p></li><li class=\"flex-container\"><p class=\"sub\">Max HP</p><p>" + displayNumbers(bossInfo[i].maxhp) + "</p></li><li class=\"flex-container\"><p class=\"sub\">HP</p><p>" + displayNumbers(bossInfo[i].hp) + "</p></li>")
        }
    }
}

function updateCharacterInfo() {
    $("#characterInfo").html("");
    for (var i = 0; i < characterInfo.length; i++) {
        $("#characterInfo").append("<li class=\"flex-container\"><p>" + characterInfo[i].name +"</p></li><li class=\"flex-container\"><p class=\"sub\">total damage</p><p>" + displayNumbers(characterInfo[i].totalDamage) + "</p></li>")
    }
}

function updateCharacterDATAInfo() {
    $("#characterDATAInfo").html("");
    for (var i = 0; i < characterInfo.length; i++) {
        
        var daRate = (characterInfo[i].das / (turnNumber - characterInfo[i].tas) * 100).toFixed(2);var taRate = (characterInfo[i].tas / turnNumber * 100).toFixed(2);
        
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
    item.html("<p>" + action + "</p><p>" + displayNumbers(damage) + "</p></li>");
    
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
            subAction.text(characterInfo[turnDetails.details[i].pos].name + "(" + turnDetails.details[i].type + ")");            
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
                subsubAction.text("Attack " + (j+1));
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
                        if( k == 1) {
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
    
    updateStatistics();
}

function appendOthersLog(action, damage) {
    $("#log").append("<li class=\"flex-container\"><p class=\"halfsub\">" + action + "</p><p>" + displayNumbers(damage) + "</p></li>");
            
    totalDamage += actionDamage;
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
    $('#timer').text("00:00:00");
    timer = undefined;
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
        characterInfo[i].totalDamage = 0;
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
    $("#raidID").html("");
}

$(function() {
    $("#tabs").tabs();
});


document.querySelector("#resetDamage").addEventListener('click', resetDamage, false);
document.querySelector("#clearLog").addEventListener('click', clearLog, false);
document.querySelector("#clearEnemyInfo").addEventListener('click', clearEnemyInfo, false);

//----------------------------------------------------------------------------
/////////////////
// Read Data //
/////////////////

var actionDamage = 0; //damage from action
var turnDamage = 0;
var totalDamage = 0; //all damage combined
var totalTurnDamage = 0; //all damage from attack
var totalSummonDamage = 0; //all summon damage
var totalSkillDamage = 0; //all skill damage
var turnNumber = 0;
var raidID = ""; //twitter raidID
var bossInfo = []; //boss info with name, lv, maxhp, hp
var characterInfo = [ //character info with name, damage dealt
    { //first character (i.e. Gran/Djeeta)
        name: "Ally 1",
        totalDamage: 0,
        das: 0,
        tas: 0
    },
    { //second character
        name: "Ally 2",
        totalDamage: 0,
        das: 0,
        tas: 0
    },
    { //third character
        name: "Ally 3",
        totalDamage: 0,
        das: 0,
        tas: 0
    },
    { //fourth character
        name: "Ally 4",
        totalDamage: 0,
        das: 0,
        tas: 0
    },
    { //fifth character
        name: "Ally 5",
        totalDamage: 0,
        das: 0,
        tas: 0
    },
    { //sixth character
        name: "Ally 6",
        totalDamage: 0,
        das: 0,
        tas: 0
    },
]; 
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
                var scenario = JSON.parse(body).scenario;
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
                    } else if (chainBurst == true) {
                        if (scenario[i].cmd == "effect" && scenario[i].kind.indexOf("burst") !== -1) {
                            if ((i < scenario.length - 1) && scenario[i + 1].cmd == "damage") {
                                for (var j = 0; j < scenario[i + 1].list.length; j++) {
                                    charaDetails.total += scenario[i + 1].list[j].value;
                                }
                                charaDetails.pos = -1;
                                charaDetails.type = "Chain Burst";
                                
                                turnDetails.total += charaDetails.total;
                                turnDetails.details.push(charaDetails);
                            }
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
                    }
                    if(charaDetails.pos != -1) {
                        characterInfo[charaDetails.pos].totalDamage += charaDetails.total;
                        if(charaDetails.type == "Double") {
                            characterInfo[charaDetails.pos].das++;
                        } else if ( charaDetails.type == "Triple") {
                            characterInfo[charaDetails.pos].tas++;
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
            });
        }
        
        //skill
        else if(path == "ability_result.json") {
            req.getContent(function(body){
                var scenario = JSON.parse(body).scenario;
                var skillName = "";
                for (var i = 0; i < scenario.length; i++) { 
                    if(scenario[i].cmd == "ability") {
                        skillName = scenario[i].name;
                    } else if (scenario[i].cmd == "damage") {
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
                    }
                }
                
                if(skillName != "") {
                    skillsUsed++;
                    if(actionDamage != 0) {
                        totalSkillDamage += actionDamage;
                        turnDamage += actionDamage;
                        appendOthersLog(skillName, actionDamage);
                    } else {
                        appendOthersLog(skillName, "");
                    }
                }
            });
        }
        
        // summon
        else if(path == "summon_result.json") {
            req.getContent(function(body){
                var scenario = JSON.parse(body).scenario;
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
                            console.log(scenario[i].list[0].damage[j].value);
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
            });
        }
        
        //raid start information
        else if (path == "start.json") {
            req.getContent(function(body){
                var startinfo = JSON.parse(body);
                //raid id
                if(startinfo.multi == 1) {
                    raidID = startinfo.twitter.battle_id;
                    showRaidId();
                } else {
                    raidID = "";
                }
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
                    }
                
                }
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

