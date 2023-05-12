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
class Entrance extends AdventureScene {
    constructor() {
        super("entrance","Entrance");
    }
    preload() {
        this.load.image('entrance','./assets/backgrounds/entrance.png');
        this.load.image('chains','./assets/images/chains.png');
        this.load.image('bluekey','./assets/images/blue key.png');
    }
    onEnter() {
        //background
        //let color = this.add.rectangle(0,0, this.w * .75, this.h, 0x584024).setOrigin(0);
        let background = this.add.image(this.w *.35,this.h *.5,'entrance').setOrigin(0.5);
        background.scale = .5;

        //locks
        let chain1 = this.add.image(this.w *.35,this.h *.3,'chains');
        let chain2 = this.add.image(this.w *.35,this.h *.3,'chains');
        chain1.scale = chain2.scale = .5;

        chain2.flipX= true;

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


        let livingroom = this.add.text(this.w * 0.3, this.w * 0.4, "living room")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('livingroom');
            });
    }
}

class LivingRoom extends AdventureScene {
    constructor() {
        super("livingroom", "Living Room");
    }
    preload() {
        this.load.image('living room','./assets/backgrounds/living room.png');
    }
    onEnter() {
        //background
        let background = this.add.image(this.w *.35,this.h *.5,'living room').setOrigin(0.5);
        background.scale = .38;

        let kitchen = this.add.text(this.w * 0.3, this.w * 0.4, "kitchen")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('kitchen');
            });

        let bedroom = this.add.text(this.w * 0.3, this.w * 0.3, "bedroom")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('bedroom');
            });
        
        console.log(this.hasItem("redkey"));
    }
}

class Kitchen extends AdventureScene {
    constructor(){
        super("kitchen", "Kitchen");
    }
    preload() {
        this.load.image('kitchen','./assets/backgrounds/kitchen.png');
        this.load.image('redkey','./assets/images/red key.png');
    }
    onEnter() {
        //background
        let background = this.add.image(this.w *.35,this.h *.5,'kitchen').setOrigin(0.5);
        background.scale = .38;

        //redkey
        console.log(this.hasItem("redkey"));
        if (!this.hasItem("Red Key")) {
            let redkey = this.add.image(this.w *.56,this.h *.65,'redkey')
                redkey.scale =.2
                redkey.setInteractive()
                .on('pointerover',()=>{
                    this.showMessage("A red key.")
                })
                .on('pointerdown',()=> {
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



        this.add.text(this.w * 0.3, this.w * 0.4, "living room")
        .setFontSize(this.s * 2)
        .setInteractive()
        .on('pointerover', () => {
            this.showMessage("You've got no other choice, really.");
        })
        .on('pointerdown', () => {
            this.gotoScene('livingroom');
        });

        this.add.text(this.w * 0.3, this.w * 0.3, "entrance")
        .setFontSize(this.s * 2)
        .setInteractive()
        .on('pointerover', () => {
            this.showMessage("You've got no other choice, really.");
        })
        .on('pointerdown', () => {
            this.gotoScene('entrance');
        });
    }
}

class Bedroom extends AdventureScene {
    constructor() {
        super("bedroom","Bedroom");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "living room")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('livingroom');
            });
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
    scene:[Kitchen,Entrance,LivingRoom,Bedroom],
    title: "Adventure Game",
});

