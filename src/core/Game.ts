import * as PIXI from 'pixi.js';
import Loader from './Loader';
import PlayButton from './PlayButton';
import Background from './Background';
import ReelsContainer from './ReelsContainer';
import Scoreboard from './Scoreboard';
import VictoryScreen from './VictoryScreen';
import LossScreen from './LossScreen';
import { sound } from '@pixi/sound';

export default class Game {
    public app: PIXI.Application;
    private playBtn: PlayButton;
    private reelsContainer: ReelsContainer;
    private scoreboard: Scoreboard;
    private victoryScreen: VictoryScreen;
    private lossScreen: LossScreen;
    

    constructor() {
        this.app = new PIXI.Application({ width: 960, height: 536 });
        // arcade-game-fruit-machine-jackpot-002-short.mp3
        sound.add('pull', 'assets/arcade-game-fruit-machine-jackpot-002-short.mp3');
        sound.add('win','assets/mixkit-payout-award-ding-1935.mp3')
        sound.add('lose','assets/negative_beeps-6008.mp3')
        sound.add('resetpurse','assets/565699__ralphwhitehead__coin-bag-pickup-drop.mp3')
        const w = window.document.getElementById('pixi-cell')
        if (w) {
            w.appendChild(this.app.view);
        }
        new Loader(this.app, this.init.bind(this));

    }

    private init() {
        this.createScene();
        this.createPlayButton();
        this.createReels();
        this.createScoreboard();
        this.createVictoryScreen();
        this.createLossScreen();
    }

    private createScene() {
        const bg = new Background(this.app.loader);
        this.app.stage.addChild(bg.sprite);
    }

    private createPlayButton() {
        this.playBtn = new PlayButton(this.app, this.handleStart.bind(this));
        this.app.stage.addChild(this.playBtn.sprite);
    }

    private createReels() {
        this.reelsContainer = new ReelsContainer(this.app);
        this.app.stage.addChild(this.reelsContainer.container);
    }

    private createScoreboard() {
        this.scoreboard = new Scoreboard(this.app);
        this.app.stage.addChild(this.scoreboard.container);
    }

    private createVictoryScreen() {
        this.victoryScreen = new VictoryScreen(this.app);
        this.app.stage.addChild(this.victoryScreen.container);
    }

    private createLossScreen() {
        this.lossScreen = new LossScreen(this.app);
        this.app.stage.addChild(this.lossScreen.container);
    }

    handleStart() {
        sound.play('pull')
        this.scoreboard.decrement();
        this.playBtn.setDisabled();
        this.reelsContainer.spin()
            .then(this.processSpinResult.bind(this));
    }

    private async processSpinResult(isWin: boolean) {
        if (isWin) {
            sound.play('win')
            this.scoreboard.increment();
            this.victoryScreen.show();
        }
    
        if (!this.scoreboard.outOfMoney) this.playBtn.setEnabled();
        
        if (this.scoreboard.outOfMoney) {
            sound.play('lose')
            await this.lossScreen.show();
            this.playBtn.setEnabled();
            this.scoreboard.reset();
            sound.play('resetpurse')
        }
    }
    
}
