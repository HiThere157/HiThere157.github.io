const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;

const ww = window.innerWidth,
  wh = window.innerHeight;

const engine = Engine.create(),
  world = engine.world;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false
  }
});

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

var settings = {
  resetGravity: () => {
    engine.gravity.x = 0;
    engine.gravity.y = 1;
  },

  addNBodies: 1,
  addedBodies: 0,
  bodyW: 50,
  bodyParam: undefined,
  addBody: () => {
    if (settings.addedBodies > 300) {
      return;
    }

    settings.bodyParam = settings.bodyW;
    for (let i = 0; i < settings.addNBodies; i++) {
      Composite.add(world, createBody(200, 200));
    }
  },

  toggleWireframe: () => {
    render.options.wireframes = !render.options.wireframes;
  },

  refresh: () => {
    window.location.reload();
  }
}

function createBody(x, y) {
  settings.addedBodies += 1;
  var sides = Math.round(Common.random(1, 8));

  var chamfer = null;
  if (sides > 2 && Common.random() > 0.7) {
    chamfer = {
      radius: 10
    };
  }

  if (Common.random() < 0.4) {
    if (Common.random() < 0.6) {
      return Bodies.rectangle(x, y, settings.bodyParam || Common.random(25, 50), settings.bodyParam || Common.random(25, 50), { chamfer: chamfer });
    } else {
      return Bodies.rectangle(x, y, settings.bodyParam || Common.random(80, 120), settings.bodyParam || Common.random(25, 30), { chamfer: chamfer });
    }

  } else {
    return Bodies.polygon(x, y, sides, settings.bodyParam || Common.random(25, 50), { chamfer: chamfer });
  }

}

const stack = Composites.stack(20, 20, 10, 7, 0, 0, createBody);
Composite.add(world, stack);

Composite.add(world, [
  Bodies.rectangle(ww / 2, 0, ww, 50, { isStatic: true }),
  Bodies.rectangle(ww / 2, wh, ww, 50, { isStatic: true }),
  Bodies.rectangle(ww, wh / 2, 50, wh, { isStatic: true }),
  Bodies.rectangle(0, wh / 2, 50, wh, { isStatic: true })
]);

const mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  });
Composite.add(world, mouseConstraint);
render.mouse = mouse;

Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: ww, y: wh }
});

const gui = new dat.GUI();
gui.domElement.parentElement.style = "z-Index: 1; user-select: none;";

const gravityFolder = gui.addFolder("Gravity");
gravityFolder.add(engine.gravity, "x", -1, 1, 0.05).listen();
gravityFolder.add(engine.gravity, "y", -1, 1, 0.05).listen();
gravityFolder.add(settings, "resetGravity").name("Reset");
gravityFolder.open();

const bodyFolder = gui.addFolder("Body");
bodyFolder.add(settings, "addNBodies", 1, 10, 1).name("n Bodies").listen();
bodyFolder.add(settings, "bodyW", 15, 150, 1).name("Wdith").listen();
bodyFolder.add(settings, "addBody").name("Add Body");
bodyFolder.open();

const worldFolder = gui.addFolder("World");
worldFolder.add(settings, "toggleWireframe").name("Toggle Wireframe");
worldFolder.add(settings, "refresh").name("Full Reset");
worldFolder.open();
