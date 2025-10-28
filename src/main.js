import kaplay from "./libs/kaplay.mjs";
import { load } from "./utils/loader.js";
import { Player } from "./entities/Player.js";
import { Knight } from "./entities/Knight.js";
import addButton from "./utils/Button.js";

const tg = window.Telegram.WebApp;
tg.ready();
tg.requestFullscreen();

kaplay({
  width: window.innerWidth,
  height: window.innerHeight,
  letterbox: true,
  font: "Diablo",
});

load.fonts();
load.assets();

const arenaWidth = width();

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent
  );

const scenes = {
  startScreen: () => {
    add([rect(width() * 3, height()), color(8, 25, 39)]);
    add([
      sprite("floor", {
        tiled: true,
        width: width(),
        height: height(),
      }),
    ]);
    const nextBtn = (() => {
      if (width() > height()) {
        return addButton(
          width() / 6,
          width() / 2,
          height() / 2,
          "play",
          7,
          0,
          width() / 9
        );
      } else {
        return addButton(
          width() / 3,
          width() / 2,
          height() / 2,
          "play",
          10,
          0,
          width() / 5
        );
      }
    })();
    nextBtn.color = rgb(0, 0, 0);
    nextBtn.onClick(() => {
      nextBtn.scale = vec2(1.2);
      wait(0.1, () => {
        nextBtn.scale = vec2(1);
        go(isMobile ? 1 : "controls");
      });
    });

    onKeyPress("enter", () => {
      nextBtn.scale = vec2(1.2);
      wait(0.1, () => {
        nextBtn.scale = vec2(1);
        go(isMobile ? 1 : "controls");
      });
    });

    add([
      text(`Kill 100 enemies`, { size: height() / 15 }),
      anchor("center"),
      pos(width() / 2, width() > height() ? height() / 4 : height() / 4),
    ]);
    add([
      text(`Start`, { size: height() / 15 }),
      anchor("center"),
      pos(
        width() / 2,
        width() > height() ? height() - height() / 4 : height() - height() / 4
      ),
    ]);
  },
  controls: () => {
    add([rect(width() * 3, height()), color(8, 25, 39)]);
    add([
      sprite("floor", {
        tiled: true,
        width: width(),
        height: height(),
      }),
    ]);

    onKeyPress("enter", () => {
      go(1);
    });

    add([
      text(`Walk: "W" "A" "S" "D"`, { size: height() / 15 }),
      anchor("center"),
      pos(width() / 2, width() > height() ? height() / 4 : height() / 4),
    ]);
    add([
      text(`Fast attack: "E" or "LMB"`, { size: height() / 15 }),
      anchor("center"),
      pos(width() / 2, width() > height() ? height() / 2.3 : height() / 2.3),
    ]);
    add([
      text(`Сharged attack: "Q" or "RMB"`, { size: height() / 15 }),
      anchor("center"),
      pos(
        width() / 2,
        width() > height()
          ? height() - height() / 2.3
          : height() - height() / 2.3
      ),
    ]);
    add([
      text(`Start: "ENTER"`, { size: height() / 15 }),
      anchor("center"),
      pos(
        width() / 2,
        width() > height() ? height() - height() / 4 : height() - height() / 4
      ),
    ]);
  },
  1: () => {
    const nav = new NavMesh();
    nav.addPolygon([
      vec2(0, 0),
      vec2(width() * 3, 0),
      vec2(width() * 3, height() * 3),
      vec2(0, height() * 3),
    ]);
    const leftFrame = add([
      rect(10, height() * 3),
      pos(0, 0),
      outline(4),
      area(),
      body({ isStatic: true }),
      color(255, 0, 0),
      "frame",
    ]);
    const rightFrame = add([
      rect(10, height() * 3),
      pos(width() * 3 - 10, 0),
      outline(4),
      area(),
      body({ isStatic: true }),
      color(255, 0, 0),
      "frame",
    ]);
    const upperFrame = add([
      rect(width() * 3, 10),
      pos(0, 0),
      outline(4),
      area(),
      body({ isStatic: true }),
      color(255, 0, 0),
      "frame",
    ]);
    const downFrame = add([
      rect(width() * 3, 10),
      pos(0, height() * 3 - 10),
      outline(4),
      area(),
      body({ isStatic: true }),
      color(255, 0, 0),
      "frame",
    ]);
    add([rect(width() * 3, height() * 3), color(8, 25, 39)]);
    add([
      sprite("floor", {
        tiled: true,
        width: width() * 3.5,
        height: height() * 3.5,
      }),
      pos(-width() / 4, -height() / 4),
    ]);

    add([
      circle(10),
      pos(
        width() > height() ? width() / 5 : width() / 3,
        width() > height() ? width() / 5 : width() / 3
      ),
      offscreen(),
      opacity(0),
      "spawn-point",
    ]);
    add([
      circle(10),
      pos(
        width() > height()
          ? width() * 3 - width() / 5
          : width() * 3 - width() / 3,
        width() > height() ? width() / 5 : width() / 3
      ),
      offscreen(),
      opacity(0),
      "spawn-point",
    ]);
    add([
      circle(10),
      pos(
        width() > height() ? width() / 5 : width() / 3,
        width() > height()
          ? height() * 3 - width() / 5
          : height() * 3 - width() / 3
      ),
      offscreen(),
      opacity(0),
      "spawn-point",
    ]);
    add([
      circle(10),
      pos(
        width() > height()
          ? width() * 3 - width() / 5
          : width() * 3 - width() / 3,
        width() > height()
          ? height() * 3 - width() / 5
          : height() * 3 - width() / 3
      ),
      offscreen(),
      opacity(0),
      "spawn-point",
    ]);

    const playerAreaShape = new Polygon([
      vec2(-19, -32),
      vec2(-19, 72),
      vec2(19, 72),
      vec2(19, -32),
    ]);

    const menuBar = (() => {
      if (width() > height()) {
        add([
          rect(width(), height() / 8),
          pos(0, 0),
          color(0, 0, 0),
          opacity(0.3),
          fixed(true),
          "menu-bar",
          z(20),
        ]);
      } else {
        add([
          rect(width(), height() / 10),
          pos(0, 0),
          color(0, 0, 0),
          opacity(0.3),
          fixed(true),
          "menu-bar",
          z(20),
        ]);
      }
    })();

    const player = new Player(
      width() * 1.5,
      height() * 1.5,
      "skeleton",
      playerAreaShape,
      get("menu-bar")[0],
      isMobile
    );

    let curSpawnPoint = 0;

    const enemy = new Knight(width() * 2, height() * 2, 1200, player);

    const spawner = loop(1, () => {
      const addEnemy = (x, y) => {
        new Knight(x, y, 1200, player);
      };

      const spawnPoints = get("spawn-point");

      if (spawnPoints[curSpawnPoint].isOffScreen()) {
        addEnemy(
          spawnPoints[curSpawnPoint].pos.x,
          spawnPoints[curSpawnPoint].pos.y
        );
      }

      if (curSpawnPoint <= 2) {
        curSpawnPoint += 1;
      } else if ((curSpawnPoint = 3)) {
        curSpawnPoint = 0;
      }
    });

    player.gameObj.onUpdate(() => {
      setCamPos(
        player.gameObj.pos.x < width() / 2
          ? width() / 2
          : player.gameObj.pos.x > width() * 2.5
          ? width() * 2.5
          : player.gameObj.pos.x,
        player.gameObj.pos.y < height() / 2
          ? height() / 2
          : player.gameObj.pos.y > height() * 2.5
          ? height() * 2.5
          : player.gameObj.pos.y
      );
    });

    onUpdate(() => {
      if (spawner.paused === true) {
        if (get("knight").length < 20) {
          spawner.paused = false;
        }
      } else {
        if (get("knight").length >= 20 || !player.gameObj.exists()) {
          spawner.paused = true;
        }
      }
    });
  },
  end: () => {
    add([rect(width() * 3, height()), color(8, 25, 39)]);
    add([
      sprite("floor", {
        tiled: true,
        width: width(),
        height: height(),
      }),
    ]);

    if (isMobile) {
      const nextBtn = (() => {
        if (width() > height()) {
          return addButton(
            width() / 6,
            width() / 2,
            height() / 2,
            "play",
            7,
            0,
            width() / 9
          );
        } else {
          return addButton(
            width() / 3,
            width() / 2,
            height() / 2,
            "play",
            10,
            0,
            width() / 5
          );
        }
      })();
      nextBtn.color = rgb(0, 0, 0);
      nextBtn.onClick(() => {
        nextBtn.scale = vec2(1.2);
        wait(0.1, () => {
          nextBtn.scale = vec2(1);
        });
        go(1);
      });
    } else {
      onKeyPress("enter", () => {
        go(1);
      });
    }

    add([
      text(`You won!`, { size: height() / 15 }),
      anchor("center"),
      pos(width() / 2, width() > height() ? height() / 4 : height() / 4),
    ]);
    add([
      text(isMobile ? `Play again` : `Press "ENTER" to play again`, {
        size: height() / 15,
      }),
      anchor("center"),
      pos(
        width() / 2,
        width() > height() ? height() - height() / 4 : height() - height() / 4
      ),
      "kill-count",
    ]);
  },
  gameover: (killCount) => {
    add([rect(width() * 3, height()), color(8, 25, 39)]);
    add([
      sprite("floor", {
        tiled: true,
        width: width(),
        height: height(),
      }),
    ]);

    if (isMobile) {
      const nextBtn = (() => {
        if (width() > height()) {
          return addButton(
            width() / 6,
            width() / 2,
            height() / 1.9,
            "play",
            7,
            0,
            width() / 9
          );
        } else {
          return addButton(
            width() / 3,
            width() / 2,
            height() / 2,
            "play",
            10,
            0,
            width() / 5
          );
        }
      })();
      nextBtn.color = rgb(0, 0, 0);
      nextBtn.onClick(() => {
        nextBtn.scale = vec2(1.2);
        wait(0.1, () => {
          nextBtn.scale = vec2(1);
        });
        go(1);
      });
    } else {
      onKeyPress("enter", () => {
        go(1);
      });
    }

    add([
      text(`You're defeated.`, {
        size: width() > height() ? height() / 15 : width() / 15,
      }),
      anchor("center"),
      pos(width() / 2, width() > height() ? height() / 5 : height() / 5),
    ]);
    add([
      text(`You've killed ${killCount} enemies.`, {
        size: width() > height() ? height() / 15 : width() / 15,
      }),
      anchor("center"),
      pos(width() / 2, width() > height() ? height() / 3.5 : height() / 4),
    ]);
    add([
      text(isMobile ? `Play again` : `Press "ENTER" to play again`, {
        size: width() > height() ? height() / 15 : width() / 15,
      }),
      anchor("center"),
      pos(
        width() / 2,
        width() > height() ? height() - height() / 4.5 : height() - height() / 4
      ),
    ]);
  },
};

for (const key in scenes) {
  scene(key, scenes[key]);
}

go("startScreen");

