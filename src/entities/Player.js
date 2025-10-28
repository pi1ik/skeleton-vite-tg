import addButton from "../utils/Button.js"
import { Joystick } from "../utils/Joystick.js"

export class Player {

  isMoving = false
  health = 99
  fastCooldown = 0.5
  chargedCooldown = 5
  isAttacking = false
  timeSinceLastAttack = 0
  timeSinceLastChargedAttack = 0
  killCount = 0
  isDying = false
  
  constructor(
    posX,
    posY,
    spriteName,
    playerAreaShape,
    menuBar, 
    isMobile
  ) {
    this.spriteName = spriteName
    this.playerAreaShape = playerAreaShape
    this.makePlayer(posX, posY)
    this.menuBar = menuBar
    this.isMobile = isMobile
    this.setPlayerControls()
    this.enableDeath()
    this.updateKillCount()
    this.updateHpBar()
  }

  makePlayer(x, y) {
    
    this.initialX = x
    this.initialY = y
    this.gameObj = add([
      sprite(this.spriteName, { anim: "idle" }),
      area({ shape: this.playerAreaShape }),
      scale(2),
      anchor("center"),
      pos(x, y),
      body(),
      health(this.health),
      "player",
    ])
    this.attackArea = this.gameObj.add([
      polygon([vec2(65,12), vec2(65,17), vec2(-65,17), vec2(-65,12)]),
      pos(0,0),
      area(),
      scale(),
      anchor("center"),
      opacity(0),
      "attack-area",
    ])

    this.timeSinceLastAttack = time()-0.5
    this.timeSinceLastChargedAttack = time()-5
    this.gameObj.setMaxHP(99)
  }

  setPlayerControls() {
    if (this.isMobile) {
      const joystick = (() => {
        if (width() > height()) {
          return new Joystick(width()/12, width()/36, width()/8, height()-width()/8)
        } else {
          return new Joystick(width()/6, width()/18, width()/4.5, height()-width()/4.5)
        }
      })()
      const fastBtn = (() => {
        if (width() > height()) {
          return addButton(width()/12, width()-width()/8, height()-width()/8, "fast-btn", 0, -5, width()/6-60)
        } else {
          return addButton(width()/6, width()-width()/4.5, height()-width()/4.5, "fast-btn", 0, -5, width()/3-60)
        }
      })()
      const chargeBtn = (() => {
        if (width() > height()) {
          return addButton(width()/12, width()-width()/8, height()-width()/4, "charged-btn", 2, -10, width()/6-10)
        } else {
          return addButton(width()/6, width()-width()/4.5, height()-width()/2, "charged-btn", 2, -10, width()/3-10)
        }
      })() 
  
      let isJoystickUsing = false
      
      onTouchStart(() => {
        if (this.isDying) return
        isJoystickUsing = joystick.handleMousePress(mousePos())
        const direction = isJoystickUsing ? joystick.handleMouseDown(mousePos()) : null
        
        if (isJoystickUsing) {
          if (direction === 'forward') {
            this.gameObj.flipX = true
            if (this.isAttacking) return
            if (this.gameObj.paused) return
            if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
            
            
              if (this.isMoving === true) {
                this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
              }
              const destX = joystick.getJoystickPos().x*4
              const destY = joystick.getJoystickPos().y*4
              this.gameObj.applyImpulse(vec2(destX, destY))
            
            this.isMoving = true
          } else if (direction === 'backward') {
            this.gameObj.flipX = false
            if (this.isAttacking) return
            if (this.gameObj.paused) return
            if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
            
            
              if (this.isMoving === true) {
                this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
              }
              const destX = joystick.getJoystickPos().x*4
              const destY = joystick.getJoystickPos().y*4
              this.gameObj.applyImpulse(vec2(destX, destY))
            
            this.isMoving = true
          }
        }
        
      })
  
      onTouchMove(() => {
        if (this.isDying) return
        isJoystickUsing = joystick.handleMousePress(mousePos())
        const direction = isJoystickUsing ? joystick.handleMouseDown(mousePos()) : null
        
        if (isJoystickUsing) {
          if (direction === 'forward') {
            this.gameObj.flipX = true
            if (this.isAttacking) return
            if (this.gameObj.paused) return
            if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
            
            
              if (this.isMoving === true) {
                this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
              }
              const destX = joystick.getJoystickPos().x*4
              const destY = joystick.getJoystickPos().y*4
              this.gameObj.applyImpulse(vec2(destX, destY))
            
            this.isMoving = true
          } else if (direction === 'backward') {
            this.gameObj.flipX = false
            if (this.isAttacking) return
            if (this.gameObj.paused) return
            if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
            
            
              if (this.isMoving === true) {
                this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
              }
              const destX = joystick.getJoystickPos().x*4
              const destY = joystick.getJoystickPos().y*4
              this.gameObj.applyImpulse(vec2(destX, destY))
            
            this.isMoving = true
          }
        }
      })
  
      onTouchEnd(() => {
        if (this.isDying) return
        if (this.isAttacking) return
        
          if (this.gameObj.paused) return
          if (this.isMoving === true) {
            this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
          }
          if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
          this.isMoving = false
          joystick.handleMouseRelease()
           
      })

      fastBtn.onClick(() => {
        if (this.isDying) return
        isJoystickUsing = false
        if (
          !this.isAttacking && time() - this.timeSinceLastAttack > this.fastCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastAttack = time()
           if (this.isMoving) {
            this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
  
           }
           if (this.gameObj.curAnim() !== "fast") this.gameObj.play("fast")
           const hitbox = this.gameObj.add([
             pos(this.gameObj.flipX ? 70 : -70, 0),
             circle(75),
             opacity(0),
             area(),
             "fast-hitbox"
           ])
           wait(.3, () => {
             destroy(hitbox);
             if (this.isMoving) {
              const destX = joystick.getJoystickPos().x*4
              const destY = joystick.getJoystickPos().y*4
              this.gameObj.applyImpulse(vec2(destX, destY))
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
         } 
         fastBtn.scale = vec2(1.2);
          wait(0.1, () => {
            fastBtn.scale = vec2(1);
          })      
          fastBtn.startTimer(this.fastCooldown)
      })

      chargeBtn.onClick(() => {
        if (this.isDying) return
        if (
          !this.isAttacking && time() - this.timeSinceLastChargedAttack > this.chargedCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastChargedAttack = time()
           if (this.isMoving) {
            this.gameObj.applyImpulse(vec2(-this.gameObj.vel.x, -this.gameObj.vel.y))
  
           }
           if (this.gameObj.curAnim() !== "charged") this.gameObj.play("charged")
           const hitbox = this.gameObj.add([
             pos(0,0),
             polygon(this.gameObj.flipX ? 
              [vec2(-83,0), vec2(-63,53), vec2(90,56), vec2(187,24), vec2(213,-18), vec2(174,-79), vec2(43,-107)] :
              [vec2(83,0), vec2(63,53), vec2(-90,56), vec2(-187,24), vec2(-213,18), vec2(-174,-79), vec2(-43,-107)]),
              area(),
              opacity(0),
             "charged-hitbox"
           ])
           wait(.4, () => {
             destroy(hitbox);
             if (this.isMoving) {
              const destX = joystick.getJoystickPos().x*4
              const destY = joystick.getJoystickPos().y*4
              this.gameObj.applyImpulse(vec2(destX, destY))
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
        }  
        chargeBtn.scale = vec2(1.2);
          wait(0.1, () => {
            chargeBtn.scale = vec2(1);
          })     
          chargeBtn.startTimer(this.chargedCooldown)
      })

    } else {
      onKeyDown("e", () => {
        if (this.isDying) return
        if (
          !this.isAttacking && time() - this.timeSinceLastAttack > this.fastCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastAttack = time()
   
           this.gameObj.play("fast")
           const hitbox = this.gameObj.add([
             pos(this.gameObj.flipX ? 70 : -70, 0),
             circle(75),
             opacity(0),
             area(),
             "fast-hitbox"
           ])
           wait(.3, () => {
             destroy(hitbox);
             if (this.isDying) return
             if (this.isMoving) {
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
         } 
      })
      onKeyDown("у", () => {
        if (this.isDying) return
        if (
          !this.isAttacking && time() - this.timeSinceLastAttack > this.fastCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastAttack = time()
   
           this.gameObj.play("fast")
           const hitbox = this.gameObj.add([
             pos(this.gameObj.flipX ? 70 : -70, 0),
             circle(75),
             opacity(0),
             area(),
             "fast-hitbox"
           ])
           wait(.3, () => {
             destroy(hitbox);
             if (this.isDying) return
             if (this.isMoving) {
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
         } 
      })
  
      onMouseDown("left", () => {
        if (this.isDying) return
        if (
          !this.isAttacking && time() - this.timeSinceLastAttack > this.fastCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastAttack = time()
   
           this.gameObj.play("fast")
           const hitbox = this.gameObj.add([
             pos(this.gameObj.flipX ? 70 : -70, 0),
             circle(75),
             opacity(0),
             area(),
             "fast-hitbox"
           ])
           wait(.3, () => {
             destroy(hitbox);
             if (this.isDying) return
             if (this.isMoving) {
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
         } 
      })

      onKeyDown("q", () => {
        if (this.isDying) return
        if (
          !this.isAttacking && time() - this.timeSinceLastChargedAttack > this.chargedCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastChargedAttack = time()
           if (this.gameObj.curAnim() !== "charged") this.gameObj.play("charged")
           const hitbox = this.gameObj.add([
             pos(0,0),
             polygon(this.gameObj.flipX ? 
              [vec2(-83,0), vec2(-63,53), vec2(90,56), vec2(187,24), vec2(213,-18), vec2(174,-79), vec2(43,-107)] :
              [vec2(83,0), vec2(63,53), vec2(-90,56), vec2(-187,24), vec2(-213,18), vec2(-174,-79), vec2(-43,-107)]),
              area(),
              opacity(0),
             "charged-hitbox"
           ])
           wait(.4, () => {
             destroy(hitbox);
             if (this.isDying) return
             if (this.isMoving) {
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
          }
          chargeBtn.scale = vec2(1.2);
          wait(0.1, () => {
            chargeBtn.scale = vec2(1);
          })     
          chargeBtn.startTimer(this.chargedCooldown)
      })
      onKeyDown("й", () => {
        if (this.isDying) return
        if (
          !this.isAttacking && time() - this.timeSinceLastChargedAttack > this.chargedCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastChargedAttack = time()
           if (this.gameObj.curAnim() !== "charged") this.gameObj.play("charged")
           const hitbox = this.gameObj.add([
             pos(0,0),
             polygon(this.gameObj.flipX ? 
              [vec2(-83,0), vec2(-63,53), vec2(90,56), vec2(187,24), vec2(213,-18), vec2(174,-79), vec2(43,-107)] :
              [vec2(83,0), vec2(63,53), vec2(-90,56), vec2(-187,24), vec2(-213,18), vec2(-174,-79), vec2(-43,-107)]),
              area(),
              opacity(0),
             "charged-hitbox"
           ])
           wait(.4, () => {
             destroy(hitbox);
             if (this.isDying) return
             if (this.isMoving) {
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
          }
          chargeBtn.scale = vec2(1.2);
          wait(0.1, () => {
            chargeBtn.scale = vec2(1);
          })     
          chargeBtn.startTimer(this.chargedCooldown)
      })
  
      onMouseDown("right", () => {
        if (this.isDying) return
        if (
          !this.isAttacking && time() - this.timeSinceLastChargedAttack > this.chargedCooldown
         ) {
           this.isAttacking = true
           this.timeSinceLastChargedAttack = time()
           if (this.gameObj.curAnim() !== "charged") this.gameObj.play("charged")
           const hitbox = this.gameObj.add([
             pos(0,0),
             polygon(this.gameObj.flipX ? 
              [vec2(-83,0), vec2(-63,53), vec2(90,56), vec2(187,24), vec2(213,-18), vec2(174,-79), vec2(43,-107)] :
              [vec2(83,0), vec2(63,53), vec2(-90,56), vec2(-187,24), vec2(-213,18), vec2(-174,-79), vec2(-43,-107)]),
              area(),
              opacity(0),
             "charged-hitbox"
           ])
           wait(.4, () => {
             destroy(hitbox);
             if (this.isDying) return
             if (this.isMoving) {
              if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
             } else if (this.gameObj.curAnim() !== "idle") this.gameObj.play("idle")
              
             this.isAttacking = false
           });
          }
          chargeBtn.scale = vec2(1.2);
          wait(0.1, () => {
            chargeBtn.scale = vec2(1);
          })     
          chargeBtn.startTimer(this.chargedCooldown)
      })

      const chargeBtn = (() => {
        if (width() > height()) {
          return addButton(width()/12, width()-width()/8, height()-width()/8, "charged-btn", 0, -5, width()/6-60)
        } else {
          return addButton(width()/6, width()-width()/4.5, height()-width()/4.5, "charged-btn", 0, -5, width()/3-60)
        }
      })()


    }

    onKeyDown("w", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.move(0, -400)
      this.isMoving = true
    })
    onKeyDown("ц", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.move(0, -400)
      this.isMoving = true
    })

    onKeyDown("s", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.move(0, 400)
      this.isMoving = true
    })
    onKeyDown("ы", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.move(0, 400)
      this.isMoving = true
    })

    onKeyDown("a", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = false
      this.gameObj.move(-400, 0)
      this.isMoving = true
    })
    onKeyDown("ф", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = false
      this.gameObj.move(-400, 0)
      this.isMoving = true
    })

    onKeyDown("d", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = true
      this.gameObj.move(400, 0)
      this.isMoving = true
    })

    onKeyDown("в", () => {
      if (this.isDying) return
      if (this.isAttacking) return
      if (this.gameObj.paused) return
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run")
      this.gameObj.flipX = true
      this.gameObj.move(400, 0)
      this.isMoving = true
    })

    onKeyRelease(() => {
      if (this.isDying) return
      if (this.gameObj.paused) return
      if (isKeyReleased("w") || isKeyReleased("a") || isKeyReleased("s") || isKeyReleased("d") || 
          isKeyReleased("ц") || isKeyReleased("ф") || isKeyReleased("ы") || isKeyReleased("в")) {
        this.gameObj.play("idle")
        this.isMoving = false
      }
    })

  }

  enableDeath() {
    this.menuBar.add([
      rect(width()/2, width() > height() ? height()/32 : height()/40),
      pos(width()/4, width() > height() ? (height()/8-height()/32)/2 :( height()/10-height()/40)/2),
      "hp-bar",
      opacity(0)
    ])
    this.menuBar.get("hp-bar")[0].add([
      text(`${this.gameObj.hp() > -1 ? this.gameObj.hp()+1 : 0}/${this.gameObj.maxHP()+1}`, { size: width() > height() ? height()/32 : height()/40 }),
      anchor("center"),
      "hp-count",
    ])
    this.menuBar.add([
      text(`${this.killCount}`, { size: height()/15 }),
      pos(width()-width()/4.6, width() > height() ? (height()/8-height()/15)/2 :( height()/10-height()/15)/2),
      "kill-count",
      z(20)
    ])

    

    
    this.gameObj.onDeath(() => {
      this.isDying = true
      this.menuBar.get("hp-bar")[0].add([
        text(`${0}/${this.gameObj.maxHP()+1}`, { size: width() > height() ? height()/32 : height()/40 }),
        anchor("center"),
        pos(width()/4, width() > height() ? (height()/8-height()/32)/6 :( height()/10-height()/40)/6),
        "hp-count",
      ])
      if (this.gameObj.curAnim() !== "fall") this.gameObj.play("fall", {
        onEnd: async () => {  
          destroy(this.gameObj);
            await wait(1)
            go("gameover", this.killCount)
        }
      })
    })
  }

  updateHpBar() {
    onUpdate(() => {
      if (this.menuBar.get("hp-bar")[0]) {
        destroy(this.menuBar.get("hp-bar")[0])
        this.menuBar.add([
        rect(width()/2*this.gameObj.hp()/this.gameObj.maxHP()+1, width() > height() ? height()/32 : height()/40),
        pos(width()/4, width() > height() ? (height()/8-height()/32)/2 :( height()/10-height()/40)/2),
        color(164,0,0),
        outline(2),
        "hp-bar"
        ])
        this.menuBar.get("hp-bar")[0].add([
          text(this.isDying ? `${0}/${this.gameObj.maxHP()+1}` : `${this.gameObj.hp() > -1 ? this.gameObj.hp()+1 : 0}/${this.gameObj.maxHP()+1}`, { size: width() > height() ? height()/32 : height()/40 }),
          anchor("center"),
          pos(width()/4, width() > height() ? (height()/8-height()/32)/6 :( height()/10-height()/40)/6),
          "hp-count",
        ])
      }
    
    })
    
  }

  updateKillCount() {
    onUpdate(() => {
      this.menuBar.get("kill-count")[0].text = `${this.killCount}`
      if (this.killCount === 100) {
        go("end")
      }
    })
  }

}
