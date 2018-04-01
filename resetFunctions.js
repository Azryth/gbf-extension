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
        characterInfo[i].ougiDamage = 0;
        characterInfo[i].skillDamage = 0;
        characterInfo[i].turns = 0;
        characterInfo[i].attacks = 0;
        characterInfo[i].maxDamage = 0;
        characterInfo[i].minDamage = initMinDamage;
        characterInfo[i].das = 0;
        characterInfo[i].tas = 0;
        characterInfo[i].cas = 0;
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

function resetRaidMemberInfo() {
  $("#raidHonorsList").html("");
}
