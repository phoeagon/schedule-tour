window.addEventListener('load', eventWindowLoaded, false);	
function eventWindowLoaded() {
	canvasApp();	
}
const STATE = {
     GAME_STATE_TITLE : 0 , 
     GAME_STATE_NEW : 1 , 
     GAME_STATE_START : 2 , 
     GAME_STATE_OVER : 3 ,
     GAME_STATE_TIME_UP : 4 ,
     GAME_STATE_WAIT_FOR_LOAD : 5
 };
const KEY = {
    UP: 38 ,
    DOWN: 40 ,
    LEFT: 37 ,
    RIGHT : 39 ,
    SPACE : 32 ,
    F1 : 112 ,
    V_SHIFT : -1 ,
    V_ALT : -2 ,
    V_CTRL : -3
};
const SCORE = {
    KITTEN : 100 ,
    MAX : 30 ,
    MIN : -10 ,
    CHANCE : 4
};

var keyPressList=[];
//var currentStatefunction = gameStatePlayLevel;
var gameState = STATE.GAME_WAIT_FOR_LOAD;/*STATE.GAME_STATE_TITLE;*/
var refreshRobotImgCache = function(){alert("")};
function canvasApp(){
	var scoreRecord = getLocalStorage( scoreRecord ) ;
	
	const CANVAS_OFFSET = {
	    X : 50,
	    Y : 50
	};
	const POTION_TYPES = {
	    ACCELERATE : 0 ,
	    DECELERATE: 1 ,
	    REVERSE: 2 ,
	    SLIPPERY: 3 ,
	    BOMB: 4 ,
	    TRANSPORTER : 100,
	    COUNT: 5
	};

	const MODE={
	    LIMITED_TIME : 1 ,
	    MIN_TIME : 0
	};
	
	var BOX_SIZE = 20;
	var ROBOT_SIZE = 20;
	const DEFAULT_VELOCITY = 3;
	const AC_VELOCITY = 5;
	const DE_VELOCITY = 2;

    	//application states
	var robot_img  = new Image();
	
	var shuffledPositions;
        var currentGameState=0;
	var potions = [];
	var positionCandidates=[];
	var boxes=[];
	var transporters = [];
	var trans=0;
	var player={};
	var VELOCITY = DEFAULT_VELOCITY;
	var visionDist = 100;
	var WORM_HOLE_COUNT = 0;
	var kittensToFind = 1;
	var allKittens = 1;
	var finished = false;
	var gamePreset = 0;
	var boxLattice = 24;	/* a bit bigger than BOX_SIZE*/
	var boxCount = 10;
	
	resetGame();
	function changePlayerScore( delta ){
	    player.score += delta ;
	    putScoreChange ( delta );
	}
	function setClassical(){
	    boxCount = 20;
	    POTION_CHANCE = 0;
	    limitedTime = false;
	    WORM_HOLE_COUNT = 0;
	    kittensToFind = 1;
	    $('#all_kittens').html( "1" );
	}
	function cacheRobotImg(){
	    checkAndAdaptMobile();
	    robot_img.src = "./img/android1.png";
	    robot_img_buffer = document.getElementById('android_buffer');
	    robot_img_buffer.width = robot_img_buffer.height = ROBOT_SIZE+10;
	    robot_img_buffer.getContext("2d").drawImage( robot_img , 0 , 0 , ROBOT_SIZE+10 , ROBOT_SIZE+10 );
	}
	refreshRobotImgCache = cacheRobotImg;
	function setModern(){
	    boxCount = 25;
	    POTION_CHANCE = 0.8;
	    limitedTime = false;
	    WORM_HOLE_COUNT = 4;
	    kittensToFind = 3;
	    $('#all_kittens').html( "3" );
	}
	function checkAndAdaptMobile(){
	    if (checkMobile()){
		boxCount = Math.ceil( boxCount / 2 );
		BOX_SIZE = 40;
		ROBOT_SIZE = 40;
		boxLattice = 48;
		WORM_HOLE_COUNT /= 2;	/* half the number of wormholes*/
	    }else{
		BOX_SIZE = 20;
		ROBOT_SIZE = 20;
		boxLattice = 24;
	    }
	}
	function pullSettings(){
	    boxCount = $('#boxNum').attr('value');
	    POTION_CHANCE = $('#potionChance').attr('value');
	    {
		var tmp = $("#gameMode").prop('selectedIndex');
		switch(tmp){
		    case MODE.LIMITED_TIME:
			limitedTime = true;
			break;
		    case MODE.MIN_TIME:
			limitedTime = false;
			break;
		}
	    }
	    timeLimit = $('#timeLimit').attr('value');
	    WORM_HOLE_COUNT = $('#wormhole').attr('value');
	    kittensToFind = $('#kitten').attr('value');
	    $('#all_kittens').html( allKittens = kittensToFind );
	}
	function resetGame(){
	    /* init time */
	    timeOffset = getTime();
	    currentTime = timeOffset;
	    /* init game state variables */
	    currentGameState=0;	
	    positionCandidates=[];
	    potions = [];
	    trans = 0;
	    boxes = [];
	    player = {};
	    transporters = [];
	    keyPressList = [];
	    WORM_HOLE_COUNT = 0;
	    kittensToFind = 1;
	    allKittens = 1;
	    finished = false;
	    gamePreset = currentMode;
	    
	    switch(currentMode){
		case GLOBAL_PRESET.CUSTOM: pullSettings(); break;
		case GLOBAL_PRESET.CLASSICAL: setClassical(); break;
		case GLOBAL_PRESET.MODERN: setModern(); break;
	    }
	    checkAndAdaptMobile();
	}
	var isMouseDown = false;
	var limitedTime = false;
	var timeLimit = 30;
	var timeOffset = 0;
	var currentTime = 0;
	var CanvasHeight = 400;
	var CanvasWidth = 600;
	const INF = 20;
	var POTION_CHANCE = 0.5;
	
	var theCanvas = document.getElementById('canvas');
	var theBoxCanvas = document.getElementById('box_canvas');
  	if (!theCanvas || !theCanvas.getContext ||
	 !theBoxCanvas || !theBoxCanvas.getContext ) {
    		return;
  	}
  
  	var context = theCanvas.getContext('2d');
 	var boxContext = theBoxCanvas.getContext('2d');
	if ( !context || !boxContext ) {
   	 	return;
  	}
	
	function randomPoint( /*box*/ ){
	    /*if ( box.isKitten )
		return SCORE.KITTEN;
	    else*/ if( Math.random() < SCORE.CHANCE )
		return randomInteger(SCORE.MAX-SCORE.MIN)+SCORE.MIN;
	    else return 0;
	}
	function limitVelocity(){
	    var vx = player.movingX;
	    var vy = player.movingY;
	    var len = Math.sqrt(vx*vx + vy*vy);
	    var tmp_VELOCITY =   VELOCITY;
	    if ( keyPressList[KEY.V_SHIFT] && player.skills.canCreep) tmp_VELOCITY = 1.5;
	    if ( keyPressList[KEY.V_ALT] && player.skills.canBoost ) tmp_VELOCITY = VELOCITY + 1;
	    if (len > tmp_VELOCITY){
		var ratio = tmp_VELOCITY / len;
		player.movingX *= ratio ;
		player.movingY *= ratio ;
	    }
	}
	function createPlayer(){
	    newPlayer = {};
	    newPlayer.x = positionCandidates[boxCount].x;
	    newPlayer.y = positionCandidates[boxCount].y;
	    newPlayer.width = ROBOT_SIZE;
	    newPlayer.height = ROBOT_SIZE;
	    newPlayer.velocity = VELOCITY;
	    newPlayer.movingX = 0;
	    newPlayer.movingY = 0;
	    newPlayer.reversed = false;
	    newPlayer.outOfControl = false;
	    newPlayer.score = 0;
	    newPlayer.inTunnel = false;
	    newPlayer.skills = { canBoost:hasSkill('boost') ,
				canCreep:hasSkill('creep') ,
				canNinja:hasSkill('ninja')
				};

	    player = newPlayer;
	}

	function gameStateWaitForLoad(){	    }
	function gameStatePlayLevel() {
		currentTime = getTime();
		updateHeaderBar();
		
		createPotionInBoxByChance();
		createPotionByChance();
		checkKeys();
		checkTimeUp();
		limitVelocity();
		update();
		/* check potions before boxes :	 * some potions are in boxes,
		 * they can act on player in this way	 * */
		checkPotions();
		checkCollisions();
		checkTrans();
		checkShipCoord();
		render();
	}
	function gameStateTitle() {
	    createPlayer();
	    updateHeaderBar();
	    render();
	    //wait for space key click
	    if (keyPressList[KEY.SPACE]==true){
		    $('#help_info').addClass('transparent');
		    setTimeout( function(){$('#help_info').addClass('hide');},1000);
		    gameState = STATE.GAME_STATE_NEW;
	    }
	}
	function runForOnceAtGameOver(){
	    if (!finished){
	    // following code executes only once
		finished = true;
		finalScore();
		updateNewScoreRecord( player.score );
		deltaKarma( player.score );
		randomAcquireCatAndNotify();
		lotteryCat ( player.score , allKittens );
		checkAndShowNotify();
	    }
	}
	function gameStateGameOver(){
	    // set notification text
	    if ( allKittens > 1 )
		$('#kitten_found_text').html('All Kittens Found!');
	    else $('#kitten_found_text').html('Kitten Found!');
	    // show the panel
	    $('#game_over').removeClass('hide');
	    $('#game_over').removeClass('transparent');
	    // update header
	    updateHeaderBar();
	    render();
	    runForOnceAtGameOver();
	    // check key press
	    if (keyPressList[KEY.SPACE]==true){
		    $('#game_over').addClass('transparent');
		    setTimeout( function(){$('#game_over').addClass('hide');},1000);
		    gameState = STATE.GAME_STATE_NEW;
	    }
	}
	function gameStateNew(){
	   hideDialogs();
	    
	    resetGame();
	    initLayout();
	    createPlayer();
	    gameState = STATE.GAME_STATE_START;
	}
	function gameStateTimeOut(){
	     $('#time_up').removeClass('hide');
	     $('#time_up').removeClass('transparent');
	    updateHeaderBar();
	    render();
	    runForOnceAtGameOver();
	    if (keyPressList[KEY.SPACE]==true){
		    $('#time_up').addClass('transparent');
		    setTimeout( function(){$('#time_up').addClass('hide');},1000);
		    gameState = STATE.GAME_STATE_NEW;
	    }
	}
	function calculateBoxCoordinateCandidates() {
	    for (var i=0;i<CanvasWidth-boxLattice;i+=boxLattice)
		for (var j=0;j<CanvasHeight-boxLattice;j+=boxLattice){
		    var position = {};
		    position.x = i + boxLattice / 2 ;
		    position.y = j + boxLattice / 2 ;
		    positionCandidates.push(position);
		}
	}
	function checkKeys() {
		if (player.outOfControl)return;
		if (isMouseDown)return;
		player.movingX = 0;
		player.movingY = 0;
		//check keys	
		/*if (keyPressList[KEY.F1]==true){
		    gameState = STATE.GAME_STATE_TITLE;
		    return;
		}*/
		if ((keyPressList[KEY.UP]==true && !player.reversed) ||
		 (keyPressList[KEY.DOWN]==true && player.reversed) ){
		//thrust
		    player.movingY -= INF;
		}
		if ((keyPressList[KEY.DOWN]==true && !player.reversed)||
		    (keyPressList[KEY.UP]==true && player.reversed) ){
		    player.movingY += INF;
		}
		if ((keyPressList[KEY.LEFT]==true && !player.reversed) ||
		    (keyPressList[KEY.RIGHT]==true && player.reversed) ) {
		    player.movingX -= INF;
		}		
		if ((keyPressList[KEY.RIGHT]==true && !player.reversed)||
		    (keyPressList[KEY.LEFT]==true && player.reversed) ) {
		    player.movingX += INF;
		}
	}
	function update() {
		player.x=player.x+player.movingX;
		player.y=player.y+player.movingY;
		frameRateCounter.countFrames();
	}
	function refreshScoreboard(){
	    $('#classical_score').text(scoreRecord[0]);
	    $('#modern_score').text(scoreRecord[1]);
	}
	function updateNewScoreRecord( score ){
	    switch(gamePreset){
		case (GLOBAL_PRESET.CLASSICAL):
		    if ( scoreRecord[0] < score ){
			scoreRecord[0] = score;
			writeLocalStorage(scoreRecord);
			refreshScoreboard();
			return true;
		    }
		    break;
		case (GLOBAL_PRESET.MODERN):
		    if ( scoreRecord[1] < score ){
			scoreRecord[1] = score;
			writeLocalStorage(scoreRecord);
			refreshScoreboard();
			return true;
		    }
		    break;
	    }
	    return false;
	}
	function checkShipCoord(){
	    // check left
	    if ( player.x < 0 ){
		player.outOfControl = false;
		player.x = 0;
	    }
	    // check right
	    if ( player.x > CanvasWidth - player.width ){
		player.x = CanvasWidth - player.width ;
		player.outOfControl = false;
	    }
	    // check up
	    if ( player.y < 0 ){
		player.y = 0;
		player.outOfControl = false;
	    }
	    // check down
	    if ( player.y > CanvasHeight - player.height ){
		player.y = CanvasHeight - player.height;
		player.outOfControl = false;
	    }
	}
	function createPotions(){
	    potions=[];
	    const TIMES = 400;
	    for (var i=0;i<TIMES;++i)
		createPotionByChance();
	}
	function createPotionByChance(){
	    if ( Math.random() *100 < POTION_CHANCE ){
		var newPotion = createAPotion();
		//debug_output(x);
		if ( newPotion != null ){
		    potions.push(newPotion);
		    // timeout to remove an potion
		    setTimeout(function (){
			if (potions.length > 0)
			    potions.splice(0,1);
			} , (randomInteger(10)+5)*1000 );
		    return true;
		}
	    }
	    return false;
	 }
	 function createPotionInBoxByChance(){
	    if ( Math.random() *100 < POTION_CHANCE*4 ){
		var newPotion = createAPotion("true");
		//debug_output(x);
		if ( newPotion != null ){
		    potions.push(newPotion);
		    // timeout to remove an potion
		    setTimeout(function (){
			if (potions.length > 0)
			    potions.splice(0,1);
			} , (randomInteger(10)+5)*1000 );
		    return true;
		}
	    }
	    return false;
	 }
	function createAPotion( inBox ){
	    newPotion = {};
	    const MAX_ATTEMPT = 30 ;
	    const MIN_DIST = 40 ;
	    var index , x , y;
	    for (var i=0;i<MAX_ATTEMPT;++i){
		index = randomInteger(shuffledPositions.length-1 ) ;
		x = shuffledPositions[index].x;
		y = shuffledPositions[index].y;
		
		// check duplicate potion
		var flag = true;
		for(j=0;j<potions.length;++j)
		    if (potions[j].id == index){
			flag = false;
			break;
		    }
		for(j=0;j<transporters.length;++j)
		    if (transporters[j].id==index){
			flag = false;	break;
		    }
		if ( flag && measureDistance(player,x,y) >= MIN_DIST )
		     if ( (inBox=='true') ^ (index >= boxCount) )
			break;
	    }
	    
	    if (i>=MAX_ATTEMPT)
		return null;
	    newPotion.type = randomInteger(POTION_TYPES.COUNT-1);
	    newPotion.id = index;
	    newPotion.x = x;
	    newPotion.y = y;
	    newPotion.width = BOX_SIZE;
	    newPotion.height = BOX_SIZE;
	    return newPotion;
	}
	function createTrans( ){
	    //debug_output( count );

	    var ent1 = createAPotion();
	    var ent2 = createAPotion();
	    
	    if ( ent1!=null && ent2!=null ){
		transporters.push( ent1 );
		transporters.push( ent2 );
		var count = transporters.length;
		
		transporters[count-2].type = POTION_TYPES.TRANSPORTER;
		transporters[count-1].type = POTION_TYPES.TRANSPORTER;
		transporters[count-2].dest = count-1;
		transporters[count-1].dest = count-2;
		transporters[count-2].tunnelId = trans;
		transporters[count-1].tunnelId = trans;
		trans++;
		//debug_output("trans");
	    }
	    
	}
	function createBoxes(){
	    //clear the array
	    boxes = [];
	    // shuffle
	    shuffledPositions=shuffle(positionCandidates);
	    for (var i=0;i<boxCount;++i){
		var newBox = {};
		newBox.x = shuffledPositions[i].x;
		newBox.y = shuffledPositions[i].y;
		newBox.width = BOX_SIZE;
		newBox.height = BOX_SIZE;
		newBox.isKitten = false;
		newBox.msgId = randomInteger(msg.length);
		newBox.color = colors[randomInteger(colors.length-1)];
		
		boxes.push(newBox);

		/*var code = $('#debug').html();
		code += " ("+newBox.x+","+newBox.y+")<br/>";
		$('#debug').html(code);*/
	    }
	    // mark the first kittensToFind position as the kitten
	    for (var i=0;i<kittensToFind;++i)
		boxes[i].isKitten = true;
	}
	function drawPotions(){
	    context.save();
	    context.strokeStyle = '#ffffff';
	    context.font = ""+(BOX_SIZE-2)+"px serif";
	    
	    for (var i=0;i<potions.length;++i)
		drawPotion( potions[i] );
	    for (var i=0;i<transporters.length;++i)
		drawPotion( transporters[i] );
	    context.restore();
		
	    function drawPotion( potion ) {
		if ( measureDistance(potion,player.x,player.y) > visionDist &&
			potion.type != POTION_TYPES.TRANSPORTER )
		    return;
		var x = potion.x;
		var y = potion.y;


		context.setTransform(1,0,0,1,0,0); // reset to identity
		context.translate(x,y);
		context.strokeRect (0,0,BOX_SIZE,BOX_SIZE);
		switch(potion.type){
		    case POTION_TYPES.ACCELERATE:
			context.fillText("A",3,2);
			break;
		    case POTION_TYPES.DECELERATE:
			context.fillText("D",3,2);
			break;
		    case POTION_TYPES.REVERSE:
			context.fillText("R",3,2);
			break;
		    case POTION_TYPES.SLIPPERY:
			context.fillText("S",3,2);
			break;
		    case POTION_TYPES.BOMB:
			context.fillText("B",3,2);
			break;
		    case POTION_TYPES.TRANSPORTER:
			context.fillText(tunnel_tag[potion.tunnelId],3,2);
			break;
		}
		
	    }
	}
	function initLayout(){
	    //$('debug').html('DEBUG<br/>');
	    calculateBoxCoordinateCandidates();
	    createBoxes();
	    createPlayer();
	    //createPotions();
	    
	    for (var j=0;j<WORM_HOLE_COUNT;++j)
	   	createTrans();

	    boxContext.clearRect(0, 0, CanvasWidth, CanvasHeight);
	    drawBoxes();
	    drawTransIndicator();
	}
	function drawSpaceShip(){
		//transformation
		context.save(); //save current state in stack 
		context.setTransform(1,0,0,1,0,0); // reset to identity
		
		//translate the canvas origin to the center of the player
		context.translate(  Math.round(player.x+.5*player.width) ,
				    Math.round(player.y+.5*player.height) );
		
		//drawShip
		
		context.strokeStyle = '#ffffff';
		/*context.beginPath();
		
		//hard coding in locations
		//facing right
		context.moveTo(-10,-10); 
		context.lineTo(-10,10);
		context.moveTo(-10,10);
		context.lineTo(10,10);
		context.moveTo(10,10);
		context.lineTo(10,-10);
		context.moveTo(10,-10);
		context.lineTo(-10,-10);
		context.moveTo(10,-10);
		context.lineTo(-10,10);
		context.moveTo(10,10);
		context.lineTo(-10,-10);
		
		context.stroke();
		context.closePath();*/
		//context.drawImage(robot_img, -15,-15, BOX_SIZE+10 , BOX_SIZE+10);
		var half = Math.floor((BOX_SIZE+10)/2)
		context.drawImage( robot_img_buffer , -half , -half );
		//restore context
		context.restore(); //pop old state on to screen
	}
	function drawTransIndicator(){
	    boxContext.save();
	    boxContext.setTransform(1,0,0,1,0,0); // reset to identity
	    
	    for (var i = 0;i<transporters.length;i+=2){
		boxContext.fillStyle = colors[randomInteger(colors.length-1)];	
		var p0 = transporters[i];
		var p3 = transporters[i+1];
		var p2 = createAPotion();
		var p1 = createAPotion();

		var data = getBrezier( p0 , p1 , p2 , p3 );
		for (var j=0;j<data.length;++j)
		    boxContext.fillRect(data[j].x,data[j].y,2,2);
	    }
	    boxContext.restore();
	}
	function drawBoxes(){
	    for (var i=0;i<boxCount;++i)
		drawBox(boxes[i]);
		
	    function drawBox( box ){
		var x = box.x;
		var y = box.y;
		
		boxContext.save();
		boxContext.fillStyle = box.color;
		boxContext.setTransform(1,0,0,1,0,0); // reset to identity
		boxContext.translate(x,y);
		boxContext.fillRect (0,0,BOX_SIZE,BOX_SIZE);
		boxContext.restore();
	    }
	}
	function revertSlippery( player ){
	    if ( player.outOfControl ){
		player.outOfControl = false;
		VELOCITY = DEFAULT_VELOCITY;
	    }
	}
	function checkIfAllKittensFound(){
	    if ( kittensToFind == 0 )
		return true;
	    return false;
	}
	function checkCollisions() {
	    for (var i=0;i<boxCount;++i)
		if ( boundingBoxCollide ( player , boxes[i] ) ) {
		    //collide
		    //revertSlippery( player );	// collide, no longer slippery mode
		    if (boxes[i].isKitten){ 
		    // found kitten
			playMew();	/* Cat Sound Effect*/
			--kittensToFind;	// decrement kitten count				
			changePlayerScore( SCORE.KITTEN );
			fireToast("Kitten Found!");
			kittenFoundNotify();
			//potionEffectNotify("Kitten Found!");
			if (checkIfAllKittensFound()){//if all found
			    gameState = STATE.GAME_STATE_OVER;
			}
			boxes[i].isKitten = false;	// kitten taken away!
		    }else{
			fireToast(msg[boxes[i].msgId]);
		    }

		    player.x -= player.movingX;
		    if (boundingBoxCollide(player,boxes[i])){
			// try to cancel only one way, so that
			//	it still moves when two
			//	normal directions pressed but
			//	only one makes the robot hit the box
			player.x += player.movingX;
			player.y -= player.movingY;
			if (boundingBoxCollide(player,boxes[i]))
			    //if we have to cancel two directions
			    player.x -= player.movingX;
		    }
		    //break;
		}
	}
	function checkPotions(){
	    for (var i=0;i<potions.length;++i)
		if ( boundingBoxCollide ( potions[i] , player ) ){
		    playDi();	/* Potion Sound Effect*/
		    changePlayerScore( randomPoint() );
		    var thisPotion = potions[i];
		    switch(thisPotion.type){
			case POTION_TYPES.ACCELERATE:
			    VELOCITY = AC_VELOCITY;
			    potionEffectNotify("Accelerate!");
			    setTimeout( function (){
				VELOCITY = DEFAULT_VELOCITY ;
			    } , (randomInteger(5)+2)*800 );
			    break;
			case POTION_TYPES.DECELERATE:
			    VELOCITY = DE_VELOCITY;
			    potionEffectNotify("Decelerate!");
			    setTimeout( function (){
				VELOCITY = DEFAULT_VELOCITY ;
			    } , (randomInteger(5)+2)*800 );
			    break;
			case POTION_TYPES.REVERSE:
			    player.reversed = true;
			    potionEffectNotify("Reversed Direction!");
			    setTimeout( function (){
				player.reversed = false;
			    } , (randomInteger(5)+2)*800 );
			    break;
			case POTION_TYPES.BOMB:
			    potionEffectNotify("Bang!");
			    $('#canvas').addClass('animated shake wobble');
			    $('#box_canvas').addClass('animated shake wobble');
			    setTimeout( function () {
				$('#canvas').removeClass('animated shake wobble');
				$('#box_canvas').removeClass('animated shake wobble');
			    } , 3000 );
			    break;
			case POTION_TYPES.SLIPPERY:
			    potionEffectNotify("Slippy!");
			    player.outOfControl = true;
			    player.movingX *= 2;
			    player.movingY *= 2;
			    
			    VELOCITY = AC_VELOCITY + 1;
			    setTimeout( function (){
				player.outOfControl = false;
				VELOCITY = DEFAULT_VELOCITY;
			    } , (randomInteger(3)+1)*800 );
			    break;
		    }
		    // remove potion from list
		    potions . splice(i,1);
		}
	}
	function checkTrans(){
	    if ( keyPressList[KEY.V_CTRL] && player.skills.canNinja ) return;
	    var flag = false;
	    for (var i=0;i<transporters.length;++i)
		if (boundingBoxCollide( transporters[i] , player ) ) {
		    if( ! player.inTunnel ){
			playTrans();	/* Transition Sound*/
			potionEffectNotify("Wormhole Transition!");
			$('canvas').addClass('blur');
			changePlayerScore( randomPoint() );
			player.inTunnel = true;
			var id = transporters[i].dest;
			player.x = transporters[ id ].x;
			player.y = transporters[ id ].y;
			setTimeout( function () {
			    $('canvas').removeClass('blur');
			    } , 500 );
		    }
		    flag = true;
		}
	    if (!flag)
		player.inTunnel = false;
	}
	function checkTimeUp(){
	    if (limitedTime)
		if ( currentTime - timeOffset > timeLimit * 1000 )
		    gameState = STATE.GAME_STATE_TIME_UP;
	}
	function render() {
	    //requestAnimFrame( function() {
		// draw background and text 
		context.strokeStyle = '#ffffff';
		context.lineWidth = 2;
		context.clearRect(0, 0, CanvasWidth, CanvasHeight);
  		context.strokeRect(0, 0, CanvasWidth, CanvasHeight);

		//drawBoxes();
		drawPotions();
		drawSpaceShip();

		context.fillStyle    = '#ffffff';
		context.font         = '20px _sans';
		context.textBaseline = 'top';
		context.fillText  ("FPS:" + frameRateCounter.lastFrameCount + " " +VELOCITY,
		    0, CanvasHeight - 20);
	    //} );
	}
	function finalScore(){
	    var seconds = Math.round(( currentTime - timeOffset ) / 1000 );
	    if ( seconds < 1 )
		seconds = 1;
	    var delta = Math.round(500 / seconds);
	    player.score += delta;
	    potionEffectNotify("Bonus: +" + delta );
	    setTimeout( function(){updateHeaderBar();} , 2000 );
	      $('.dialog_score').html(""+player.score);
	}
	function updateHeaderBar(){
	    var seconds = Math.floor(( currentTime - timeOffset ) / 1000 );
	    var mm = Math.floor(seconds/60);
	    var ss = seconds % 60;
	    var str = "";
	    str += (mm>9) ? (""+mm) : ("0"+mm);
	    str += ":"
	    str += (ss>9) ? (""+ss) : ("0"+ss);
	    $('#timer').html(str);
	    putScore( player.score );
	    $('#kittens_to_find').html(""+kittensToFind);
	}
	function runGame() { requestAnimFrame( function(){
		switch(gameState){
		    case STATE.GAME_STATE_START:
			gameStatePlayLevel();
			break;
		    case STATE.GAME_STATE_NEW:
			gameStateNew();
			break;
		    case STATE.GAME_STATE_TITLE:
			gameStateTitle();
			break;
		    case STATE.GAME_STATE_OVER:
			gameStateGameOver();
			break;
		    case STATE.GAME_STATE_TIME_UP:
			gameStateTimeOut();
			break;
		    case STATE.GAME_STATE_WAIT_FOR_LOAD:
			gameStateWaitForLoad();
			break;
		}
	    });
	}

	// initialize the coordinate candidate array
	initLayout();
	//createPlayer();
	
	frameRateCounter=new FrameRateCounter();
	const FRAME_RATE=40;
	var intervalTime=1000/FRAME_RATE;
	setInterval(runGame, intervalTime );
	
	document.onkeydown=function(e){		
		e=e?e:window.event;
		//disable bloody scrolling!
		switch(e.keyCode){
		    case KEY.UP:
		    case KEY.DOWN:
		    case KEY.RIGHT:
		    case KEY.LEFT:
		    case KEY.SPACE:
			e.preventDefault();
		}
		keyPressList[KEY.V_SHIFT]=e.shiftKey;
		keyPressList[KEY.V_ALT] = e.altKey;
		keyPressList[KEY.V_CTRL] = e.ctrlKey;
		//ConsoleLog.log(e.keyCode + "down");
		keyPressList[e.keyCode]=true;
	}
	
	document.onkeyup=function(e){
		e=e?e:window.event;
		keyPressList[KEY.V_SHIFT]=e.shiftKey;
		keyPressList[KEY.V_ALT] = e.altKey;
		keyPressList[KEY.V_CTRL] = e.ctrlKey;
		//ConsoleLog.log(e.keyCode + "up");
		keyPressList[e.keyCode]=false;
	};
	
	$('#export_img_link').attr('href',"javascript:openScreenShot()");
	//$('#export_img_link').attr('target',"_blank");

	$(document).ready( function(){
		// set function references
		simulateKeyPress = simKeyPress;
		simulateKeyPressRelease = simKeyPressRelease;
		//$('.space_indicator').click( function(){alert("");simKeyPressRelease(KEY.SPACE);} );
		$('.space_indicator').attr( 'href' , 'javascript:simulateKeyPressRelease(KEY.SPACE);' );
		//load ready
		gameState = STATE.GAME_STATE_TITLE;

		setMode( getModeLocalStorage() );

		cacheRobotImg();
		refreshScoreboard();
		
		//if ( checkMobile () )
		//    addResizeListener();
		$('#load_prompt').addClass('hide');
		$('#main_div').removeClass('hide');
		$('#menu').removeClass('hide');
		
		loadCatGallery();
		loadSkill();
		fetchKarma();	// update karma value from localStorage
		restrictModeOptions();
	    });
	prepareSettingForm();
	prepareKey();
	function prepareSettingForm(){
	    $('.mode_option').click( function() {
		setTimeout( function(){
			if ( currentMode != gamePreset ){
			    //mode changed
			    switch(gameState){
				case STATE.GAME_STATE_START:
				case STATE.GAME_STATE_NEW:
				    break;
				default:
				    return;
				    // don't start a new game if no game is on
			    }
			    if ( gameState!=STATE.GAME_STATE_START ||
				confirm("Game Preset changed. Restart?") )
			    /* PROMPT if current game is on*/
				gameState = STATE.GAME_STATE_NEW;
			}
		    },	 500 );
		 // wait for the javascript in <a href=""> to take effect
	    } );
	    $("#gameMode").prop('selectedIndex',0);
	    $('#gameMode').change( function () {
		debug_output($('#gameMode').prop('selectedIndex')!=MODE.LIMITED_TIME);
		if ($('#gameMode').prop('selectedIndex')!=MODE.LIMITED_TIME){
		    $('#timeLimit').addClass('invisible');
		}else{ $('#timeLimit').removeClass('invisible');}
	    });
	    $('#minTimeOption').attr('value',MODE.MIN_TIME);
	    $('#limitedTimeOption').attr('value',MODE.LIMITED_TIME);
	    
	    $('#boxNum').change( function(e) {
		    $('#boxNumValue').html(""+$('#boxNum').attr('value'));
		});
	    $('#potionChance').change( function(e) {
		    $('#potionChanceValue').html(""+Math.floor($('#potionChance').attr('value')*10)/10);
		});
	    $('#timeLimit').change( function(e) {
		    $('#timeLimitValue').html(""+$('#timeLimit').attr('value'));
		});
	    $('.refreshGame').click( 	function (){
		    if (gameState == STATE.GAME_STATE_START){
			if(confirm("Refresh Game?"))
			    gameState = STATE.GAME_STATE_NEW;
		    }else alert("Game not on.");
		    $('.refreshGame').blur();// lose focus  
		} );

	    $('#wormhole').change( function(e) {
		    $('#wormholeValue').html(""+$('#wormhole').attr('value'));
		});
	    $('#kitten').change( function(e) {
		    $('#kittenValue').html(""+$('#kitten').attr('value'));
		});
	    $('#lamp').click ( function(){
		    toggleMenu();
		});
	}

	/*$('#canvas').mousedown ( function(e){
	    isMouseDown = true;
	    //$('#debug').html('mousedown');
	} );
	$('#canvas').mouseup ( function(e){
	    isMouseDown = false;
	} );
	$('#canvas').mousemove ( function (e){
	    if (isMouseDown){
		player.movingX = e.pageX - CANVAS_OFFSET.X - player.x;
		player.movingY = e.pageY - CANVAS_OFFSET.Y - player.y;
	    }
	});*/
	function simKeyPress( keyNum , value ){
	    keyPressList[ keyNum ] = value;
	}
	function simKeyPressRelease( keyNum ){
	    simulateKeyPress( keyNum , true );
	    setTimeout( function(){ simulateKeyPress( keyNum , false ); } , 100 ); 
	}
}

//*** FrameRateCounter  object prototype
function FrameRateCounter() {	
	this.lastFrameCount=0;
	var dateTemp = new Date();
	this.frameLast=dateTemp.getTime();
	delete dateTemp;
	this.frameCtr=0;
}

FrameRateCounter.prototype.countFrames=function() {
	var dateTemp =new Date();	
	this.frameCtr++;

	if (dateTemp.getTime() >=this.frameLast+1000) {
		ConsoleLog.log("frame event");
		this.lastFrameCount=this.frameCtr;
		this.frameLast=dateTemp.getTime();
		this.frameCtr=0;
	}
	
	delete dateTemp;
}


//***** object prototypes *****

//*** consoleLog util object
//creat constructor
function ConsoleLog(){
	
}

//create function that will be added to the class
console_log=function(message) {
	if(typeof(console) !== 'undefined' && console != null) {
		console.log(message);
	}
}
//add class/static function to class by assignment
ConsoleLog.log=console_log;

//*** end console log object

/* audio stuff*/
/* play sound effect functions to be overridden*/
playMew = function(){};
playDi = function(){};
playTrans = function(){};
// Check if a new cache is available on page load.


// check cache routine
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);
