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

//------- timed value update ---------

var bossUpdate;

function bossInfoTimedUpdate() {
  if(document.getElementById('setUpdateBoss').checked) {
    if(bossUpdate === undefined) {
        bossUpdate = setInterval(function() {
          // get boss info and display
          chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData.boss", (bosses, err) => {
            if (!err) {
              for(var i = 0; i < bossInfo.length; i++) {
                if(bosses.param[i].hp < bossInfo[i].hp) {
                  bossInfo[i].hp = bosses.param[i].hp;
                }
              }
              updateBossInfo();
            }
          });
        }, 300);
    }
  } else {
    clearInterval(bossUpdate);
    bossUpdate = undefined;
  }
}

document.querySelector("#setUpdateBoss").addEventListener('click', bossInfoTimedUpdate, false);


//-   -   -   -   -   -   -   -   -   -   -   -   -  -   -   -   -   -   -   -   -   -   -   -   -   -
var raidHonorUpdate;

function raidHonorsTimedUpdate() {
  if(document.getElementById('setRaidHonors').checked) {
    $("#raidHonors").show();
    if(raidHonorUpdate === undefined) {
      raidHonorUpdate = setInterval(function() {
        //get info and update
        chrome.devtools.inspectedWindow.eval("Game.view.setupView.pJsnData", (info, err) => {
          if (!err) {
            if(info && info.multi == 1) {
              var data = info.multi_raid_member_info;
              if(data) {
                updateRaidMemberInfo(data);
              }
            }
          }
        });
      }, 500);
    }
  } else {
    $("#raidHonors").hide();
    clearInterval(raidHonorUpdate);
    raidHonorUpdate = undefined;
  }
}

function updateRaidMemberInfo(rmi) {
  $("#raidHonorsList").html("");
  for(var i = 0; i < rmi.length; i++) {
    $("#raidHonorsList").append(formatLiData(rmi[i].nickname + " (" + rmi[i].level + ")", displayNumbers(rmi[i].point), 0, ["flex-container"]));
  }
}

document.querySelector("#setRaidHonors").addEventListener('click', raidHonorsTimedUpdate, false);
