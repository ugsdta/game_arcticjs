(function(){
var system;
var IMAGE_PATH_01 = "images/mocomoco.png"; //落下キャラクター
var IMAGE_PATH_01_2 = "images/mocomoco_02.png"; //落下キャラクター
var IMAGE_PATH_01_3 = "images/mocomoco_03.png"; //落下キャラクター
var IMAGE_PATH_02 = "images/bar_01.png"; //bar
var IMAGE_PATH_03 = "images/back.png"; //back
var IMAGE_PATH_04 = "images/box.png"; //box
var IMAGE_PATH_05 = "images/switch_01.png"; //switch
var IMAGE_PATH_06 = "images/switch_02.png"; //switch
var IMAGE_PATH_07 = "images/switch_03.png"; //switch

var destSprite ;//落下キャラクタのスプライト
var destSprite_2 ;//落下キャラクタのスプライト
var destSprite_3 ;//落下キャラクタのスプライト
var destSprite_02 ;//アイテム（棒）のスプライト
var destSprite_03 ;//背景のスプライト
var destSprite_04 ;//ゴミ箱のスプライト
var destSprite_05 ;//スイッチのスプライト
var destSprite_06 ;//スイッチのスプライト
var destSprite_07 ;//スイッチのスプライト
var mocomoco ;//落下キャラクタのオブジェクト
var timeStep = 0 ;//落下キャラクタが落下し始めてから、アイテムに接触するまでの時間ステップ。接触したらリセットされる。
var dt ;//時間刻み幅
//var g = 1.5 ;
var BAR_WIDTH = 6 ;//フィールドに存在するアイテム（棒）の幅
var BAR_LENGTH = 60 ;//フィールドに存在するアイテム（棒）の長さ
var BOX_WIDTH = 40 ;//フィールドに存在するゴミ箱の幅
var BOX_HEIGHT = 50 ;//フィールドに存在するゴミ箱の高さ
var SWITCH_WIDTH = 30 ;//フィールドに存在するゴミ箱の高さ
var PAI = 3.141592653 ;//円周率
var RADIUS = 10 ;//落下キャラクターの半径
//var bar ;//フィールドに存在するアイテム（棒）のオブジェクト
var barArray ;//フィールドに存在するアイテム（棒）のオブジェクト
var BAR_COUNT = 3 ;//フィールドに存在するアイテム（棒）の数
var box ;//フィールドに存在するゴミ箱のオブジェクト
var switch_01 ;//フィールドに存在するスイッチのオブジェクト
var switch_02 ;//フィールドに存在するスイッチのオブジェクト
var switch_03 ;//フィールドに存在するスイッチのオブジェクト
var gameClearFlag = 0 ;//gameをクリアしたかどうかを示すフラグ
var nowBallColor = 1 ;//今の使用ボールの色
var shape_01 ;//選択ボックス
var shape_02 ;//選択ボックス
var shape_03 ;//選択ボックス
var firstV ;//初速
var GREEN_GRAVITY = 200 ;//重力
var RED_GRAVITY = 400 ;//重力
var BLUE_GRAVITY = 600 ;//重力

//ゲームのメインクラス
var GameMain = arc.Class.create(arc.Game, {
	
	initialize:function(params){
		
		mocomoco = new Mocomoco();

		barArray = new Array(BAR_COUNT);
		for(var i = 0; i < BAR_COUNT; i++){
			barArray[i] = new Item_bar();
		}
		
		//barの位置を決める
		barArray[0].setX(50);
		barArray[0].setY(300);
		barArray[0].setAngle(5);
		barArray[0].setE(0.8);
	
		barArray[1].setX(120);
		barArray[1].setY(250);
		barArray[1].setAngle(0);
		barArray[1].setE(0.8);
		
		barArray[2].setX(200);
		barArray[2].setY(200);
		barArray[2].setAngle(0);
		barArray[2].setE(0.8);
		
		
		//落下キャラクタ
		var image_01 ;
		image_01 = this._system.getImage(IMAGE_PATH_01); //　画像の取得
		image_01.changeSize(RADIUS*2, RADIUS*2);
		destSprite = new arc.display.Sprite(image_01);
		var image_01_2 ;
		image_01_2 = this._system.getImage(IMAGE_PATH_01_2); //　画像の取得
		image_01_2.changeSize(RADIUS*2, RADIUS*2);
		destSprite_2 = new arc.display.Sprite(image_01_2);
		var image_01_3 ;
		image_01_3 = this._system.getImage(IMAGE_PATH_01_3); //　画像の取得
		image_01_3.changeSize(RADIUS*2, RADIUS*2);
		destSprite_3 = new arc.display.Sprite(image_01_3);
		
		//背景画像
		var root ;
		var image_03 ;
		image_03 = this._system.getImage(IMAGE_PATH_03); //　画像の取得
		root = new arc.display.Sprite(image_03);
		this.addChild(root);
		
		//画面上部表示テキスト
		this._sampleTxt = new arc.display.TextField();
		this._sampleTxt.setText("Ball in the Box");
		this._sampleTxt.setX(160);
		this._sampleTxt.setY(20);
		this._sampleTxt.setColor(0xFFFFFF);
		this._sampleTxt.setAlign(arc.display.Align.CENTER);
		this._sampleTxt.setFont("Helvetica", 20, true);
		this.addChild(this._sampleTxt);
		
		//画面下部表示テキスト
		this._sampleTxt3 = new arc.display.TextField();
		this._sampleTxt3.setText("Change Gravity");
		this._sampleTxt3.setX(27);
		this._sampleTxt3.setY(390);
		this._sampleTxt3.setColor(0xFFFFFF);
		this._sampleTxt3.setFont("Helvetica", 15, true);
		this.addChild(this._sampleTxt3);
		
		//ゴミ箱画像
		box = new Box();
		box.setX(270);
		box.setY(350);
		var image_04 ;
		image_04 = this._system.getImage(IMAGE_PATH_04); //　画像の取得
		destSprite_04 = new arc.display.Sprite(image_04);
		destSprite_04.setX(box.getX()-BOX_WIDTH/2);
		destSprite_04.setY(box.getY()-BOX_HEIGHT/2);
		this.addChild(destSprite_04);
		
		//switch画像
		switch_01 = new Switch();
		switch_01.setX(40);
		switch_01.setY(360);
		var image_05 ;
		image_05 = this._system.getImage(IMAGE_PATH_05); //　画像の取得
		destSprite_05 = new arc.display.Sprite(image_05);
		destSprite_05.setX(switch_01.getX()-SWITCH_WIDTH/2);
		destSprite_05.setY(switch_01.getY()-SWITCH_WIDTH/2);
		this.addChild(destSprite_05);
		
		switch_02 = new Switch();
		switch_02.setX(90);
		switch_02.setY(360);
		var image_06 ;
		image_06 = this._system.getImage(IMAGE_PATH_06); //　画像の取得
		destSprite_06 = new arc.display.Sprite(image_06);
		destSprite_06.setX(switch_02.getX()-SWITCH_WIDTH/2);
		destSprite_06.setY(switch_02.getY()-SWITCH_WIDTH/2);
		this.addChild(destSprite_06);
		
		switch_03 = new Switch();
		switch_03.setX(140);
		switch_03.setY(360);
		var image_07 ;
		image_07 = this._system.getImage(IMAGE_PATH_07); //　画像の取得
		destSprite_07 = new arc.display.Sprite(image_07);
		destSprite_07.setX(switch_03.getX()-SWITCH_WIDTH/2);
		destSprite_07.setY(switch_03.getY()-SWITCH_WIDTH/2);
		this.addChild(destSprite_07);
		
		//switchで今何を選んでいるかわかるようにする
		shape_01 = new arc.display.Shape();
		shape_02 = new arc.display.Shape();
		shape_03 = new arc.display.Shape();
		
		//bar
		var image_02 ;
		image_02 = this._system.getImage(IMAGE_PATH_02); //　画像の取得
		//複数barの表示
		for(var i = 0; i < BAR_COUNT; i++){
			destSprite_02 = new arc.display.Sprite(image_02);
			destSprite_02.setRotation(barArray[i].getAngle());
			destSprite_02.setX(barArray[i].getX()-Math.cos(this._convertToRadian(barArray[i].getAngle()))*BAR_LENGTH/2-Math.cos(this._convertToRadian(90+barArray[i].getAngle()))*BAR_WIDTH/2);
			destSprite_02.setY(barArray[i].getY()-Math.sin(this._convertToRadian(barArray[i].getAngle()))*BAR_LENGTH/2-Math.sin(this._convertToRadian(90+barArray[i].getAngle()))*BAR_WIDTH/2);
			this.addChild(destSprite_02);
		}
		
		//タッチイベント登録
		root.addEventListener(arc.Event.TOUCH_START, function(e) {
			//いきなりゴミ箱の上からは落下できないようにする
			if(e.x < box.getX() - BOX_WIDTH/2){
				//玉が二個同時に発射できない
				if(mocomoco.getX() == -100){
					mocomoco.setX(e.x);
					mocomoco.setY(e.y);
					//初速記録
					firstV = mocomoco.getVY();
				}
			}
		});
		
		destSprite_05.addEventListener(arc.Event.TOUCH_START, function() {
			nowBallColor = 1;
		});
		destSprite_06.addEventListener(arc.Event.TOUCH_START, function() {
			nowBallColor = 2;
		});
		destSprite_07.addEventListener(arc.Event.TOUCH_START, function() {
			nowBallColor = 3;
		});

	},
	
	//開始
	_start: function(){
	
	},
	//毎フレーム更新関数
	update:function(){
		
		//クリア時表示テキスト
		if(gameClearFlag == 1){
			this._sampleTxt2 = new arc.display.TextField();
			this._sampleTxt2.setText("Clear!Great!!");
			this._sampleTxt2.setX(160);
			this._sampleTxt2.setY(210);
			this._sampleTxt2.setColor(0xFFFFFF);
			this._sampleTxt2.setAlign(arc.display.Align.CENTER);
			this._sampleTxt2.setFont("Helvetica", 20, true);
			this.addChild(this._sampleTxt2);
		}
		
		//fpsは未使用
		var tmpFps ;
		if(this._system.getFps() == 0){
			tmpFps = 120 ;
		}else{
			tmpFps = this._system.getFps() ;
		}
		//dt = 1/tmpFps ;
		dt = 1/60;
		timeStep++ ;
		
		//落下キャラクタをスイッチによって変換
		if(nowBallColor == 1){
			//緑
			mocomoco.setG(GREEN_GRAVITY);
			//落下キャラクタの描画
			destSprite.setX(mocomoco.getX()-RADIUS);
			destSprite.setY(mocomoco.getY()-RADIUS);
			this.removeChild(destSprite_2);
			this.removeChild(destSprite_3);
			this.addChild(destSprite);
			//switchで今何を選んでいるのかわかるようにする
			this.removeChild(shape_02);
			this.removeChild(shape_03);
			shape_01.beginStroke(2.0, 0xFFFFFF, 1.0);	// 線の太さ, 色, 透明度
			shape_01.drawRect(switch_01.getX()-SWITCH_WIDTH/2, switch_01.getY()-SWITCH_WIDTH/2,SWITCH_WIDTH,SWITCH_WIDTH);
			shape_01.endStroke();
			this.addChild(shape_01);
			
		}else if(nowBallColor == 2){
			//赤
			mocomoco.setG(RED_GRAVITY);
			//落下キャラクタの描画
			destSprite_2.setX(mocomoco.getX()-RADIUS);
			destSprite_2.setY(mocomoco.getY()-RADIUS);
			this.removeChild(destSprite);
			this.removeChild(destSprite_3);
			this.addChild(destSprite_2);
			//switchで今何を選んでいるのかわかるようにする
			this.removeChild(shape_01);
			this.removeChild(shape_03);
			shape_02.beginStroke(2.0, 0xFFFFFF, 1.0);	// 線の太さ, 色, 透明度
			shape_02.drawRect(switch_02.getX()-SWITCH_WIDTH/2, switch_02.getY()-SWITCH_WIDTH/2,SWITCH_WIDTH,SWITCH_WIDTH);
			shape_02.endStroke();
			this.addChild(shape_02);
		}else{
			//青
			mocomoco.setG(BLUE_GRAVITY);
			//落下キャラクタの描画
			destSprite_3.setX(mocomoco.getX()-RADIUS);
			destSprite_3.setY(mocomoco.getY()-RADIUS);
			this.removeChild(destSprite_2);
			this.removeChild(destSprite);
			this.addChild(destSprite_3);
			//switchで今何を選んでいるのかわかるようにする
			this.removeChild(shape_02);
			this.removeChild(shape_01);
			shape_03.beginStroke(2.0, 0xFFFFFF, 1.0);	// 線の太さ, 色, 透明度
			shape_03.drawRect(switch_03.getX()-SWITCH_WIDTH/2, switch_03.getY()-SWITCH_WIDTH/2,SWITCH_WIDTH,SWITCH_WIDTH);
			shape_03.endStroke();
			this.addChild(shape_03);
		}
		
		//落下による速度修正
		mocomoco.setVY(firstV+mocomoco.getG()*timeStep*dt);
		
		//移動
		if(gameClearFlag == 0){
			mocomoco.setX(mocomoco.getX()+mocomoco.getVX()*dt);
			mocomoco.setY(mocomoco.getY()+mocomoco.getVY()*dt);
		}
		
		//落下キャラクタが下までいったら消去する
		if( mocomoco.getY() > 400 || 
			mocomoco.getY() < 0 || 
			mocomoco.getX() < 0 || 
			mocomoco.getX() > 320){
			this.removeChild(destSprite);
			this.removeChild(destSprite_2);
			this.removeChild(destSprite_3);
			mocomoco.setX(-100);
			mocomoco.setY(-100);
			mocomoco.setVX(0);
			mocomoco.setVY(0);
			mocomoco.setG(1.0);
			mocomoco.setCflag(-1);
			timeStep = 0 ;
		}
		
		//barとの当たり判定処理
		//barの両端の座標を求める
		for(var i = 0; i < BAR_COUNT; i++){
			var vec_01 = new Vector();
			var vec_02 = new Vector();
			vec_01.setX(barArray[i].getX() + Math.cos(this._convertToRadian(barArray[i].getAngle()))*BAR_LENGTH/2);
			vec_01.setY(barArray[i].getY() + Math.sin(this._convertToRadian(barArray[i].getAngle()))*BAR_LENGTH/2);
			vec_02.setX(barArray[i].getX() - Math.cos(this._convertToRadian(barArray[i].getAngle()))*BAR_LENGTH/2);
			vec_02.setY(barArray[i].getY() - Math.sin(this._convertToRadian(barArray[i].getAngle()))*BAR_LENGTH/2);
			//barベクトル
			var vec_bar = new Vector();
			vec_bar.setX(vec_01.getX()-vec_02.getX());
			vec_bar.setY(vec_01.getY()-vec_02.getY());
			//barの両端と円の中心とのベクトル
			var vec_A = new Vector();
			var vec_B = new Vector();
			vec_A.setX(mocomoco.getX()-vec_01.getX());
			vec_A.setY(mocomoco.getY()-vec_01.getY());
			vec_B.setX(mocomoco.getX()-vec_02.getX());
			vec_B.setY(mocomoco.getY()-vec_02.getY());
			//ベクトルAとBとbarの長さ
			var vec_A_length = this._vecLength(vec_A);
			var vec_B_length = this._vecLength(vec_B);
			var vec_bar_length = this._vecLength(vec_bar);
			//円の中心とbarとの距離d
			var d = Math.abs(this._vecCross(vec_bar,vec_B)) / Math.abs(vec_bar_length) ;
			//当たり判定
			//円の半径と棒の幅も考える
			//r = RADIUS + BAR_WIDTH/2;
			r = RADIUS ;
			if(d <= r && mocomoco.getCflag() == -1){
				if(this._vecDot(vec_A,vec_bar)*this._vecDot(vec_B,vec_bar) <= 0 ){
					this._bounce(i);
					timeStep = 0 ;
					mocomoco.setCflag(i);
					firstV = mocomoco.getVY();
				}else{
					if(r > Math.abs(vec_A_length) || r > Math.abs(vec_B_length)){
						this._bounce(i);
						timeStep = 0 ;
						mocomoco.setCflag(i);
						firstV = mocomoco.getVY();
					}
				}
			}
			if(mocomoco.getCflag() == i && d > r){
				//落下キャラクタが跳ね返ったら衝突フラグを戻す
				mocomoco.setCflag(-1);
			}
		}
		
		//ゴミ箱との当たり判定処理
		//落下キャラクタの中心とゴミ箱の中心との距離が、キャラクタの円の半径より短ければ当たり
		//落下キャラクタの中心とゴミ箱の中心との距離
		var vec_dif = new Vector();
		vec_dif.setX(mocomoco.getX()-box.getX());
		vec_dif.setY(mocomoco.getY()-box.getY());
		var difLength = this._vecLength(vec_dif);
		//キャラクタの円の半径
		var r = RADIUS ;
		if(r > difLength){
			//クリア
			gameClearFlag = 1 ;
		}
	},
	//衝突関数
	_bounce:function(i){
		//アイテム（棒）と衝突したら跳ね返る
		//アイテム（棒）の傾きに合わせて系全体を水平に傾ける
		var mocV = new Vector();
		mocV.setX(mocomoco.getVX());
		mocV.setY(mocomoco.getVY());
		this._vecRot(mocV,barArray[i].getAngle());
		mocV.setY(-mocV.getY()*barArray[i].getE());
		this._vecRot(mocV,-barArray[i].getAngle());
		mocomoco.setVX(mocV.getX());
		mocomoco.setVY(mocV.getY());
	},
	
	//ベクトルの長さ
	_vecLength:function(vec){
		return Math.sqrt(vec.getX()*vec.getX()+vec.getY()*vec.getY());
	},
	//ベクトルの内積
	_vecDot:function(vec_01,vec_02){
		return vec_01.getX()*vec_02.getX()+vec_01.getY()*vec_02.getY();
	},
	//ベクトルの外積
	_vecCross:function(vec_01,vec_02){
		return vec_01.getX()*vec_02.getY()-vec_02.getX()*vec_01.getY();;
	},
	//度数からラジアンへの変換
	_convertToRadian:function(angle){
		return angle*Math.PI/180;
	},
	//ベクトルの回転（度数指定、反時計回り）
	_vecRot:function(vec,angle){
		var tmpVec = new Vector();
		tmpVec.setX(vec.getX()*Math.cos(this._convertToRadian(angle))+vec.getY()*Math.sin(this._convertToRadian(angle)));
		tmpVec.setY(-vec.getX()*Math.sin(this._convertToRadian(angle))+vec.getY()*Math.cos(this._convertToRadian(angle)));
		vec.setX(tmpVec.getX());
		vec.setY(tmpVec.getY());
		return ;
	}
});

//ベクトルクラス
var Vector = arc.Class.create(arc.display.DisplayObjectContainer, {
	initialize:function(){
		this._x = 0;//x座標
		this._y = 0;//y座標
		
	},
	setX:function(x){
		this._x = x;
	},
	getX:function(){
		return this._x;
	},
	setY:function(y){
		this._y = y;
	},
	getY:function(){
		return this._y;
	}
});

//スイッチのクラス
var Switch = arc.Class.create(arc.display.DisplayObjectContainer, {
	
	initialize:function(){
		this._x = -100;//x座標
		this._y = -100;//y座標
	},
	setX:function(x){
		this._x = x;
	},
	getX:function(){
		return this._x;
	},
	setY:function(y){
		this._y = y;
	},
	getY:function(){
		return this._y;
	}
});


//ゴミ箱のクラス
var Box = arc.Class.create(arc.display.DisplayObjectContainer, {
	
	initialize:function(){
		this._x = -100;//x座標
		this._y = -100;//y座標
	},
	setX:function(x){
		this._x = x;
	},
	getX:function(){
		return this._x;
	},
	setY:function(y){
		this._y = y;
	},
	getY:function(){
		return this._y;
	}
});


//アイテム(bar)のクラス
var Item_bar = arc.Class.create(arc.display.DisplayObjectContainer, {
	
	initialize:function(){
		this._x = -100;//x座標
		this._y = -100;//y座標
		this._angle = 0;//x軸正の向きとのなす角（時計まわり）
		this._e = 1.0;//反発係数
	},
	setX:function(x){
		this._x = x;
	},
	getX:function(){
		return this._x;
	},
	setY:function(y){
		this._y = y;
	},
	getY:function(){
		return this._y;
	},
	setAngle:function(angle){
		this._angle = angle;
	},
	getAngle:function(){
		return this._angle;
	},
	setE:function(e){
		this._e = e;
	},
	getE:function(){
		return this._e;
	}
});


//落下キャラクターのクラス
var Mocomoco = arc.Class.create(arc.display.DisplayObjectContainer, {
	/*
	*緑・・・g:200
	*赤・・・g:400
	*青・・・g:600
	*/
	initialize:function(){
		this._x = -100;//x座標
		this._y = -100;//y座標
		this._vx = 0;//x座標速度
		this._vy = 5;//y座標速度
		this._g = GREEN_GRAVITY ;//重力
		this._cflag = -1;//衝突フラグ
	},
	setX:function(x){
		this._x = x;
	},
	getX:function(){
		return this._x;
	},
	setY:function(y){
		this._y = y;
	},
	getY:function(){
		return this._y;
	},
	setVX:function(vx){
		this._vx = vx;
	},
	getVX:function(){
		return this._vx;
	},
	setVY:function(vy){
		this._vy = vy;
	},
	getVY:function(){
		return this._vy;
	},
	setG:function(g){
		this._g = g;
	},
	getG:function(){
		return this._g;
	},
	setM:function(m){
		this._m = m;
	},
	getM:function(){
		return this._m;
	},
	setCflag:function(cflag){
		this._cflag = cflag;
	},
	getCflag:function(){
		return this._cflag;
	}
});

window.addEventListener('DOMContentLoaded', function(e){
	system = new arc.System(320, 420, 'canvas');
	system.setGameClass(GameMain);
	//画像を読み込む場合は、startはいらない
	system.load([IMAGE_PATH_01,IMAGE_PATH_01_2,IMAGE_PATH_01_3,IMAGE_PATH_02,IMAGE_PATH_03,IMAGE_PATH_04,IMAGE_PATH_05,IMAGE_PATH_06,IMAGE_PATH_07]);
	//system.start();
}, false);
})();
