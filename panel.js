
//////////
// Init //
//////////



$(function() {
    $("#tabs").tabs();
});

function setRaidReset() {
  if (document.getElementById('setResetRaid').checked) {
    resetRaidOnChange = true;
  } else {
    resetRaidOnChange = false;
  }
}

document.querySelector("#resetDamage").addEventListener('click', resetDamage, false);
document.querySelector("#clearLog").addEventListener('click', clearLog, false);
document.querySelector("#clearEnemyInfo").addEventListener('click', clearEnemyInfo, false);
document.querySelector("#saveLog").addEventListener('click', saveLog, false);
document.querySelector("#setResetRaid").addEventListener('click', setRaidReset, false);
document.querySelector("#resetRaidMembers").addEventListener('click', resetRaidMemberInfo, false);

//----------------------------------------------------------------------------
/////////////////
// Read Data //
/////////////////

var initMinDamage = Number.MAX_SAFE_INTEGER - 873;
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
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0, // number of turns taken
        attacks: 0, // number of autoattacks (turns + das + 2*tas)
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //second character
        name: "Ally 2",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //third character
        name: "Ally 3",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //fourth character
        name: "Ally 4",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //fifth character
        name: "Ally 5",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
    { //sixth character
        name: "Ally 6",
        attackDamage: 0,
        ougiDamage: 0,
        skillDamage: 0,
        turns: 0,
        attacks: 0,
        maxDamage: 0,
        minDamage: initMinDamage,
        das: 0,
        tas: 0,
        cas: 0
    },
];
var formation = []; // length 4 array. Each position holds the character that is in the position of the index
var skillsUsed = 0;
var summonsUsed = 0;

//For resetting raid
var resetRaidOnChange = true; //when true, all stats will reset if raid id changes
var questID = ""; //Id that identifies the quest instance

chrome.devtools.network.onRequestFinished.addListener(function(req) {
    var reqURL = document.createElement('a');
    reqURL.href = req.request.url;

    if(reqURL.hostname == "gbf.game.mbga.jp" || reqURL.hostname == "game.granbluefantasy.jp") {

        //i.e. normal_attack_result.json
        var path = reqURL.pathname;
        //attack
        if(path.indexOf("normal_attack_result.json") !== -1) {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var newFormation = formation.slice(0);
				//TODO: experimental: hack against parsing weirdness
				//console.log(JSON.parse(JSON.parse(JSON.stringify(body))));
				//var data = JSON.parse(body);
                const data = JSON.parse(body);
				console.log(data);
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
                var bossAttacked = false;
                for (var i = 0; i < scenario.length; i++) {
                    //normal attacks
                    if(scenario[i].cmd == "attack" && scenario[i].from == "player") {
                        var j;
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
                        if (bossAttacked) {
                            // if you're attacking after the boss has, you must be countering (?)
                            charaDetails.type = "Counter";
                        } else if( j == 1) {
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
                        if(scenario[i].list !== undefined) {
                          for (var j = 0; j < scenario[i].list.length; j++) {
                                //charaDetails.total += scenario[i].list[j].damage[0].value;
                                attackDetails.total += scenario[i].list[j].damage[0].value;
                          }
                          attackDetails.details.push(attackDetails.total);
                          charaDetails.total += attackDetails.total;
                          charaDetails.details.push(attackDetails);
                          attackDetails = { // reset
                              total: 0,
                              details: [],
                          };
                        }

                        // checking for additional damage on ougi (Yoda, Juliet, etc.)
                        // TODO: this should probably make the ougi expandable
                        for (var k = 1; scenario[i+k].cmd == "damage"; k++) {
                          if (scenario[i+k].cmd == "damage" && scenario[i+1].mode == "parallel") {
                              for (var j = 0; j < scenario[i+1].list.length; j++) {
                                  //charaDetails.total += scenario[i+1].list[j].value;
                                  attackDetails.total += scenario[i+k].list[j].value;
                                  attackDetails.details.push(scenario[i+k].list[j].value);
                              }
                          }
                          charaDetails.total += attackDetails.total;
                          charaDetails.details.push(attackDetails);
                          attackDetails = { // reset
                              total: 0,
                              details: [],
                          };
                        }
                        charaDetails.type = "CA";
                        charaDetails.pos = Number(scenario[i].pos);
                        //charaDetails.details is empty for charge attack FIXME: add details for additional damage

                        turnDetails.total += charaDetails.total;
                        turnDetails.details.push(charaDetails);
                    //chain burst
                    } else if (chainBurst == true && scenario[i].cmd == "effect" && scenario[i].kind && scenario[i].kind.indexOf("burst") !== -1) {
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
                        newFormation[scenario[i].pos] = scenario[i].npc;
                    } else if (scenario[i].cmd == "attack" && scenario[i].from == "boss") {
                        bossAttacked = true;
                    }

                    //increase individual character totals
                    if(charaDetails.pos != -1) {
                        var pos = newFormation[charaDetails.pos];
                        if (charaDetails.type != "Counter") characterInfo[pos].turns++;
                        if (charaDetails.type != "CA") {
                            characterInfo[pos].attackDamage += charaDetails.total;
                            updateMinDmg(charaDetails, pos);
                            updateMaxDmg(charaDetails, pos);
                        }

                        if (charaDetails.type == "Single") {
                            characterInfo[pos].attacks++;
                        } else if (charaDetails.type == "Double") {
                            characterInfo[pos].das++;
                            characterInfo[pos].attacks += 2;
                        } else if ( charaDetails.type == "Triple") {
                            characterInfo[pos].tas++;
                            characterInfo[pos].attacks += 3;
                        } else if ( charaDetails.type == "CA") {
                            characterInfo[pos].ougiDamage += charaDetails.total;
                            characterInfo[pos].cas++;
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

                formation = newFormation;

                turnDetails = { //reset
                    total: 0,
                    details: []
                };

                //status at the end of turn
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }

                updateBossInfo();

            });
        }

        //skill
        else if(path.indexOf("ability_result.json") !== -1) {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var newFormation = formation.slice(0);
                var data = JSON.parse(body);
                var scenario = data.scenario;
                var skillName = "";
                var character;
                var actionDetails = [];
                if(!scenario) {return;}
                for (var i = 0; i < scenario.length; i++) {
                    if(scenario[i].cmd == "ability" && scenario[i].motion == "on") {
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
                        newFormation[scenario[i].pos] = scenario[i].npc;
                    } else if (scenario[i].cmd == "loop_damage" && scenario[i].to == "boss") {
                      for (var j = 0; j < scenario[i].list[0].length; j++) {
                              actionDamage += scenario[i].list[0][j].value;
                              actionDetails.push(scenario[i].list[0][j].value);
                       }
                    }
                }

                if(skillName != "") {
                    skillsUsed++;
                    if(actionDamage != 0) {
                        characterInfo[newFormation[character]].skillDamage += actionDamage;
                        totalSkillDamage += actionDamage;
                        turnDamage += actionDamage;
                        appendOthersLog(skillName, actionDamage, actionDetails);
                    } else {
                        appendOthersLog(skillName, "");
                    }
                }

                formation = newFormation;

                //status at the end of ability
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }
            });
        }

        // summon
        else if(path.indexOf("summon_result.json") !== -1) {
            req.getContent(function(body){
                if (formation.length == 0) {
                    formation = [0, 1, 2, 3];
                }
                var newFormation = formation.slice(0);
                var data = JSON.parse(body);
                var scenario = data.scenario;
                var summonName = "";
                for (var i = 0; i < scenario.length; i++) {

                    if(scenario[i].cmd == "summon_cutin") {
                        summonName = scenario[i].name;
                    } else if(scenario[i].cmd == "summon") {
                        if(scenario[i].kind && scenario[i].kind.indexOf("attack") > -1 && scenario[i].name !== "" && summonName == "" ) {
                            summonName = scenario[i].name;
                        }

						if (scenario[i].kind && scenario[i].kind.indexOf("damage") > -1) {
							for(var j = 0; j < scenario[i].list[0].damage.length; j++) {
								actionDamage += scenario[i].list[0].damage[j].value;
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
                    } else if (scenario[i].cmd == "replace" ) {
                        newFormation[scenario[i].pos] = scenario[i].npc;
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
                formation = newFormation;

                //status at the end of summon
                var status = data.status;
                if (status != undefined && status.formation != undefined) {
                    formation = status.formation; //just in case
                }
            });
        }

        //raid start information
        else if (path.indexOf("start.json") !== -1) {
            req.getContent(function(body){
                var startinfo = JSON.parse(body);
                lockout = startinfo.turn_waiting;
                countDownLockOut(lockout - Date.now());
                if(resetRaidOnChange) {
                  if(questID !== startinfo.raid_id){
                      questID = startinfo.raid_id;
                      resetDamage();
                      clearLog();
                      clearEnemyInfo();
                      resetRaidMemberInfo();
                  }
                }

                //raid id
                if(startinfo.multi == 1) {
                    raidID = startinfo.twitter.battle_id;
                } else {
                    raidID = "";
                }
                showRaidId();

                //boss info
                setBossInfo(startinfo.boss);

                //character info
                for(var i = 0; i < startinfo.player.param.length; i++) {
                    characterInfo[i].name = startinfo.player.param[i].name;
                }

                updateCharacterInfo();

                //team formation
                if (startinfo.formation != undefined) {
                    formation = startinfo.formation;
                }

            });

        }

        //boss died
        else if (path.indexOf("reward.json") !== -1) {
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

function init() {
  //get Formation
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.formation", (res, err) => {
    if (!err) {
      formation = res.map((i) => {return parseInt(i)});
    }
  });
  // character names and display
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.player", (playerInfo, err) => {
    if (!err) {
      for (var i = 0; i < playerInfo.number; i++) {
        characterInfo[i].name = playerInfo.param[i].name;
      }
      updateCharacterInfo();
    }
  });
  // get boss info and display
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.boss", (bosses, err) => {
    if (!err) {
      var boss;
      bossInfo = [];
      for(var i = 0; i < bosses.number; i++) {
          boss = {
            name : bosses.param[i].monster,
            lv : bosses.param[i].Lv,
            maxhp : bosses.param[i].hpmax,
            hp : bosses.param[i].hp

          };
          bossInfo.push(boss);
      }
      updateBossInfo();
    }
  });
  // get raid id and display
  chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData", (info, err) => {
    if (!err) {
      if(info.multi == 1) {
          raidID = info.twitter.battle_id;
      } else {
          raidID = "";
      }
      questID = info.raid_id;
      showRaidId();
    }
  });

  // get raid member honors
  document.getElementById('setRaidHonors').checked = true;
  raidHonorsTimedUpdate();

  // default raid update on raid change is true
  document.getElementById('setResetRaid').checked = true;

}

init();
