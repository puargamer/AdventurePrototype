class Demo1 extends AdventureScene {
    constructor() {
        super("demo1", "First Room");
    }

    onEnter() {

        let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Metal, bent."))
            .on('pointerdown', () => {
                this.showMessage("No touching!");
                this.tweens.add({
                    targets: clip,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("It's a nice key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You pick up the key.");
                this.gainItem('key');
                this.tweens.add({
                    targets: key,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    onComplete: () => key.destroy()
                });
            })

        let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("key")) {
                    this.showMessage("You've got the key for this door.");
                } else {
                    this.showMessage("It's locked. Can you find a key?");
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem("key")) {
                    this.loseItem("key");
                    this.showMessage("*squeak*");
                    door.setText("🚪 unlocked door");
                    this.gotoScene('demo2');
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.add.text(50,50, "Adventure awaits!").setFontSize(50);
        this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('demo1'));
        });
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}

//my own scenes
class Beginning extends Phaser.Scene {
    constructor() {
        super('beginning')
    }
    create(){
        this.add.text(50,50, "Escape the house!").setFontSize(50);
        this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('entrance'));
        });
    }
}

//my own scenes
class Ending extends Phaser.Scene {
    constructor() {
        super('ending')
    }
    preload() {
        this.load.image('outside','./assets/backgrounds/outside.png');
    }
    create(){
        //background
        let background = this.add.image(this.w *.35,this.h *.5,'outside').setOrigin(0.5);
        background.scale = .5;

        this.add.text(50,50, "You win!").setFontSize(50);
        this.add.text(50,100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('ending'));
        });
    }
}

class Entrance extends AdventureScene {
    constructor() {
        super("entrance","Entrance");
    }
    
    preload() {
        this.load.image('arrow','./assets/images/arrow.png');
        this.load.image('entrance','./assets/backgrounds/entrance.png');
        this.load.image('chains','./assets/images/chains.png');
        this.load.image('bluekey','./assets/images/blue key.png');
        this.load.image('lock','./assets/images/lock.png');
        this.load.image('door','./assets/images/door.png');
        this.load.audio('dooraudio','./assets/audio/door.mp3');
        this.load.audio('equip','./assets/audio/equip.mp3');
        this.load.audio('chainaudio','./assets/audio/chains.mp3');
    }
    onEnter() {
        //background
        //let color = this.add.rectangle(0,0, this.w * .75, this.h, 0x584024).setOrigin(0);
        let background = this.add.image(this.w *.35,this.h *.5,'entrance').setOrigin(0.5);
        background.scale = .5;

        //equip sound
        let sound = this.sound.add('equip', { loop: false });
        let chainaudio = this.sound.add('chainaudio', { loop: false});

        //arrows
        this.arrows(true,false,false, 
            'door', null, null, 
            null, null, null, 
            'livingroom', null, null);

        //locks
        let lock1 = this.add.image(this.w *.36,this.h *.47,'lock');
        let lock2 = this.add.image(this.w *.34,this.h *.27,'lock');
        lock1.scale = lock2.scale = .1;
        let chain1 = this.add.image(this.w *.35,this.h *.3,'chains');
        let chain2 = this.add.image(this.w *.35,this.h *.1,'chains');
        chain1.scale  = chain2.scale = .5;
        chain2.flipX= true;

         //are the locks locked?
         let locked1 = true;
         let locked2 = true;


        //lock1
        lock1.setInteractive()
            .on('pointerover',()=>{
                this.showMessage("A Chicken lock.")
            })
            .on('pointerdown',()=> {
                if (this.hasItem("Chicken")) {
                    chainaudio.play();
                    this.loseItem("Chicken");
                    this.showMessage("You opened the Chicken lock.");
                    locked1 = false;

                    

                    this.tweens.add({
                        targets: [lock1, chain1],
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => lock1.destroy(),
                        onComplete: () => chain1.destroy()
                    });

                    console.log('locked 1 is');
                    console.log(locked1);
                    console.log('locked 2 is');
                    console.log(locked2);
                    if (locked1 == false && locked2 == false) {
                        this.showMessage("You opened all locks!");

                            //stuff
                            //this.input.once('pointerdown', () => {
                                //this.doorlogic('door', null, 'ending');
                            //});
                    }
                }
            })

        //lock2
        lock2.setInteractive()
            .on('pointerover',()=>{
                this.showMessage("A Duck lock.")
            })
            .on('pointerdown',()=> {
                if (this.hasItem("Duck")) {
                    chainaudio.play();
                    this.loseItem("Duck");
                    this.showMessage("You opened the Duck lock.");
                    locked2 = false;

                    this.tweens.add({
                        targets: [lock2, chain2],
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => lock2.destroy(),
                        onComplete: () => chain2.destroy()
                    });

                    console.log('locked 1 is');
                    console.log(locked1);
                    console.log('locked 2 is');
                    console.log(locked2);
                    if (locked1 == false && locked2 == false) {
                        this.showMessage("You opened all locks!");
                    }
                }
            })


        //bluekey
        if (!this.hasItem("Blue Key")) {
            let bluekey = this.add.image(this.w *.7,this.h *.4,'bluekey')
                bluekey.scale =.2
                bluekey.angle = -90
                bluekey.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage("A blue key.")
                })
                .on('pointerdown',()=> {
                    //play sound
                    sound.play();
                    
                    this.showMessage("You picked up the Blue Key.");
                    this.gainItem('Blue Key');
                    this.tweens.add({
                        targets: bluekey,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => bluekey.destroy()
                    });
                })
        }

    }

}

class LivingRoom extends AdventureScene {
    constructor() {
        super("livingroom", "Living Room");
    }
    preload() {
        this.load.image('arrow','./assets/images/arrow.png');
        this.load.image('living room','./assets/backgrounds/living room.png');
        this.load.image('bluedoor','./assets/images/blue door.png');
        this.load.image('reddoor','./assets/images/red door.png');
        this.load.image('box','./assets/images/box.png');
        this.load.image('chicken','./assets/images/chicken.png');
        this.load.audio('dooraudio','./assets/audio/door.mp3');
        this.load.audio('equip','./assets/audio/equip.mp3');
    }
    onEnter() {
        //background
        let background = this.add.image(this.w *.35,this.h *.5,'living room').setOrigin(0.5);
        background.scale = .38;

        //equip sound
        let sound = this.sound.add('equip', { loop: false });

        //arrows
        this.arrows(false,true,true, 
                    null, 'reddoor', 'bluedoor', 
                    null, 'Red Key', 'Blue Key', 
                    null, 'bedroom', 'kitchen');

        
                    
        //box
        if (!this.hasItem("Chicken")) {
            console.log('chicken');
            let box = this.add.image(this.w *.5,this.h *.45,'box');
                box.scale =.06;
                box.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage("A box with a yellow lock.")
                })
                .on('pointerdown',()=>{
                    if(this.hasItem("Gold Key")){
                        box.destroy();
                        
                        //spawn chicken
                        let chicken = this.add.image(this.w *.5,this.h *.45,'chicken');
                        chicken.scale = .15;
                        chicken.setInteractive()
                        .on('pointerover',()=>{
                            this.showMessage("A real chicken.")
                        })
                        .on('pointerdown',()=> {
                            //play audio
                            sound.play();

                            this.showMessage("You picked up the Chicken.");
                            this.gainItem('Chicken');
                            this.tweens.add({
                                targets: chicken,
                                y: `-=${2 * this.s}`,
                                alpha: { from: 1, to: 0 },
                                duration: 500,
                                onComplete: () => chicken.destroy()
                            });
                        })  
                    }
                })
        }

    }
}

class Kitchen extends AdventureScene {
    constructor(){
        super("kitchen", "Kitchen");
    }
    preload() {
        this.load.image('arrow', './assets/images/arrow.png');
        this.load.image('kitchen','./assets/backgrounds/kitchen.png');
        this.load.image('redkey','./assets/images/red key.png');
        this.load.image('box','./assets/images/box.png');
        this.load.image('duck','./assets/images/duck.png');
        this.load.image('bluedoor','./assets/images/blue door.png');
        this.load.audio('dooraudio','./assets/audio/door.mp3');
        this.load.audio('equip','./assets/audio/equip.mp3');
    }
    onEnter() {
        //background
        let background = this.add.image(this.w *.35,this.h *.5,'kitchen').setOrigin(0.5);
        background.scale = .38;

        //equip sound
        let sound = this.sound.add('equip', { loop: false });

        //arrows
        this.arrows(true,true,false, 
                    'bluedoor', 'door', null, 
                    'Blue Key', null, null, 
                    'livingroom', 'entrance', null);

        //redkey
        if (!this.hasItem("Red Key")) {
            let redkey = this.add.image(this.w *.2,this.h *.66,'redkey')
                redkey.scale =.2
                redkey.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage("A red key.")
                })
                .on('pointerdown',()=> {
                    //play sound
                    sound.play();

                    this.showMessage("You picked up the Red Key.");
                    this.gainItem('Red Key');
                    this.tweens.add({
                        targets: redkey,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => redkey.destroy()
                    });
                })
        }

        //box
        if (!this.hasItem("duck")) {
            console.log(this.hasItem("Duck"));
            let box = this.add.image(this.w *.57,this.h *.61,'box')
                box.scale =.06
                box.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage("A box with a yellow lock.")
                })
                .on('pointerdown',()=>{
                    if(this.hasItem("Gold Key")){
                        box.destroy();
                        
                        //spawn duck
                        let duck = this.add.image(this.w *.57,this.h *.61,'duck');
                        duck.scale = .05;
                        duck.setInteractive()
                        .on('pointerover',()=>{
                            this.showMessage("A rubber duck.")
                        })
                        .on('pointerdown',()=> {
                            //play audio
                            sound.play();

                            this.showMessage("You picked up the Duck.");
                            this.gainItem('Duck');
                            this.tweens.add({
                                targets: duck,
                                y: `-=${2 * this.s}`,
                                alpha: { from: 1, to: 0 },
                                duration: 500,
                                onComplete: () => duck.destroy()
                            });
                        })  
                    }
                })
        }

    }
}

class Bedroom extends AdventureScene {
    constructor() {
        super("bedroom","Bedroom");
    }
    preload(){
        this.load.image('arrow', './assets/images/arrow.png');
        this.load.image('bedroom','./assets/backgrounds/bedroom.png');
        this.load.image('goldkey','./assets/images/gold key.png');
        this.load.image('reddoor', './assets/images/red door.png');
        this.load.audio('dooraudio','./assets/audio/door.mp3');
        this.load.audio('equip','./assets/audio/equip.mp3');

    }
    onEnter() {
        //background
        let background = this.add.image(this.w *.35,this.h *.5,'bedroom').setOrigin(0.5);
        background.scale = .38;

        //equip sound
        let sound = this.sound.add('equip', { loop: false });

        //arrows
        this.arrows(true,false,false, 
            'reddoor', null, null, 
            'Red Key', null, null, 
            'livingroom', null, null);

        //gold key
        if (!this.hasItem("Gold Key")) {
            let goldkey = this.add.image(this.w *.56,this.h *.65,'goldkey')
                goldkey.scale =.2
                goldkey.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage("A gold key.")
                })
                .on('pointerdown',()=> {
                    //play sound
                    sound.play();

                    this.showMessage("You picked up the Gold Key.");
                    this.gainItem('Gold Key');
                    this.tweens.add({
                        targets: goldkey,
                        y: `-=${2 * this.s}`,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => goldkey.destroy()
                    });
                })
        }
    }
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    //scene: [Intro, Demo1, Demo2, Outro],
    scene:[Entrance, LivingRoom, Kitchen, Beginning,Bedroom, Ending],
    title: "Adventure Game",
});

