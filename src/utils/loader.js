export const load = {
  fonts: () => {
    loadFont("Diablo", "./assets/fonts/Diablo.ttf")
  },
  assets: () => {
    
    loadSprite("skeleton", "./assets/skeleton_sprite.png", {
      sliceX: 4,
      sliceY: 5,
      anims: {
        idle: {
          frames: [0,1,2,3,0,0,0,0,0,0,0,0],
          loop: true,
          speed: 7
        },
        run: {
          from: 4,
          to: 7,
          loop: true,
        },
        fast: {
          frames: [8,9,10,10],
          from: 8,
          to: 10,
        },
        charged: {
          from: 12,
          to: 14,
        }, 
        fall: {
          from: 16,
          to:18
        }
      },
    }),
    loadSprite("knight", "./assets/knight_sprite.png", {
      sliceX: 4,
      sliceY: 4,
      anims: {
        idle: {
          from: 12,
          to: 12,
          loop: true,
        },
        run: {
          from: 3,
          to: 0,
          loop: true,
        },
        fast: {
          from: 8,
          to: 10,
        },
        charged: {
          from: 4,
          to: 6,
        },
        fall: {
          from: 13,
          to: 14,
        }
      },
    }),
    loadSprite("floor", "./assets/floor.png"),
    loadSprite("play", "./assets/play.png"),
    loadSprite("fast-btn", "./assets/fast_sprite.png"),
    loadSprite("charged-btn", "./assets/charged_sprite.png")
  },
}
