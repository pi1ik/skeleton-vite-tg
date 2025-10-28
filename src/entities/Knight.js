export class Knight {  
    
    isMoving = false
  
    health = 100

    spawnPoint = 0
    constructor(
      posX,
      posY,
      speed,
      player,
      numOfKnights
    ) {
      this.makeKnight(posX, posY)
      this.stateInit()
      this.enableVunerability()
      this.speed = speed
      this.player = player
      this.numOfKnights = numOfKnights

    }
  
    makeKnight(x, y) {      
      this.gameObj = add([
        sprite("knight", { anim: "idle" }),
        area({ shape: new Polygon([vec2(-19,-24), vec2(-19,92), vec2(19,92), vec2(19,-24)]) }),
        scale(2),
        anchor("center"),
        pos(x, y),
        body(),
        health(this.health),
        state("move", ["fastAttack", "chargedAttack", "move", "idle", "die"]),
        "knight",
      ])
      const hitBox = this.gameObj.add([
          pos(0,0),
          polygon(
                [vec2(-57,3), vec2(-135,18), vec2(-111,64), vec2(-44,50), vec2(44,50), vec2(111,64), vec2(135,18), vec2(57,3)] 
              ),
          opacity(0),
          area(),
          "knight-hitbox",
        ])
        this.spawnPoint = this.gameObj.pos
    }

    stateInit() {
        this.gameObj.onStateEnter("move", async () => {
              await wait(1);
              this.isMoving = true
          });
        
        this.gameObj.onStateUpdate("move", () => {

            let dir
            if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
            if (!this.player.gameObj.exists()){ 
              dir = this.spawnPoint.sub(this.gameObj.pos).unit()
            } else {
              dir = this.player.gameObj.pos.sub(this.gameObj.pos).unit();
            };
            
            if (dir.x < 0) {
                this.gameObj.flipX = true
            } else if (dir.x > 0) {
                this.gameObj.flipX = false
                
            }
            this.gameObj.move(dir.scale(200));

            if (this.gameObj.checkCollision(this.player.gameObj.get("attack-area")[0])) {

              this.gameObj.enterState("fastAttack")
            } else {
              this.gameObj.enterState("move")
            }
        });

        this.gameObj.onStateEnter("fastAttack", async () => {
          this.gameObj.play("fast")
          if (this.gameObj.checkCollision(this.player.gameObj.get("attack-area")[0])) {
            if (this.gameObj.get("knight-hitbox")[0].checkCollision(this.player.gameObj)) {
              this.player.gameObj.hurt(1)
              shake(5)
            }
          }
          await wait(0.3)
          this.gameObj.enterState("chargedAttack")
        });        

        this.gameObj.onStateEnter("chargedAttack", async () => {
          this.gameObj.play("charged")
          if (this.gameObj.checkCollision(this.player.gameObj.get("attack-area")[0])) {
            if (this.gameObj.get("knight-hitbox")[0].checkCollision(this.player.gameObj)) {
              this.player.gameObj.hurt(5)
              shake(10)
            }
          }
          await wait(0.5)
          this.gameObj.enterState("move")
        });
        
        this.gameObj.onStateEnter("die", () => {

          if (this.gameObj.curAnim() !== "fall") this.gameObj.play("fall", {
            onEnd: async() => {
              
              destroy(this.gameObj)
              this.player.killCount +=1
              this.numOfKnights -=1
            }
          })
        });
        
    }

    enableVunerability() {
        this.gameObj.onCollide("fast-hitbox", (hitbox) => {
          this.gameObj.hurt(20);
          this.gameObj.applyImpulse(vec2(this.gameObj.flipX ? 1000 : -1000, 0))
          wait(.1, () => {
            this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
          });
        })
        this.gameObj.onCollide("charged-hitbox", (hitbox) => {
          this.gameObj.hurt(50);
          this.gameObj.applyImpulse(vec2(this.gameObj.flipX ? 1500 : -1500, 0))
          wait(.2, () => {
            this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
          });
        })
        
        this.gameObj.onDeath(() => {
          this.gameObj.enterState("die");
        })

    }
    
    

}