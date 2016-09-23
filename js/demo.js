// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Body = Matter.Body,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      // pixelRatio: 'auto',
      width: 800,
      height: 370,
      background: '#ffffff',
      wireframeBackground: '#ffffff',
      wireframes: false
    }
});

// create a ground
var ground = Bodies.rectangle(400, 350, 700, 5, { isStatic: true });
var wall_left = Bodies.rectangle(50, 210, 5, 300, { isStatic: true });
var wall_right = Bodies.rectangle(750, 210, 5, 300, { isStatic: true });
World.add(engine.world, [ground, wall_left, wall_right]);

// bind to mouse
var mouseconstraint = MouseConstraint.create(engine, {
  element: render.canvas
});
World.add(engine.world, [mouseconstraint]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

var colors = ["ff9b25", "ffcf00", "16cc90", "3cd1e6", "a74fe4"];

function roundRand(min, max) {
  var range = max - min;
  return min + Math.round(Math.random()*range);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function darken(color) {
  var components_in = [],
      components_out = [];
  while (color) {
    components_in.push(color.slice(-2, color.length));
    color = color.slice(0, -2);
  }
  components_in.forEach(function(item) {
    var comp_10 = parseInt(item, 16) - 32;
    if (comp_10 < 0) { comp_10 = 0; }
    var comp_16 = comp_10.toString(16);
    if (comp_16.length < 2) {
      comp_16 = "0" + comp_16;
    }
    components_out.push(comp_16);
  });
  return components_out.reverse().join("")
}

function addFigure(angles) {
  var color = pickRandom(colors);
  World.add(engine.world,
    Bodies.polygon(
      roundRand(100,700),
      roundRand(100,200),
      angles,
      50,
      { render: {
        lineWidth: 2,
        strokeStyle: "#"+darken(color),
        fillStyle: "#"+color }}
      ));
}
var k =0;
var figures={};
var test;


$(document).ready(function(){
  addFigure(4); // добавим квадрат
  addFigure(4);
  // var namespace = '/game';
  // var socket = io.connect('http://rain.cancode.ru' + namespace);
  // socket.on('start_game', function(data) {
  //   var figures = data.data.figures;
  //   figures.forEach(function(figure){
  //     // console.log(figure);
  //     addFigure(figure.vertex);
  //   });
  // });
});

function draw_figure(figure_id,angles) {
  var figure_attr='';
  if (figures[figure_id]) {
    $.each(angles, function(index, value) { 
      if (index == 0) {
        figure_attr += "M "+ angles[index].x+' '+angles[index].y+' L';
      }
      else if (index == angles.length-1) {
        figure_attr += ' '+angles[index].x+' '+angles[index].y+' Z';
      }
      else {
        figure_attr += ' '+angles[index].x+' '+angles[index].y;
      }
    });
    if (figures[figure_id].attr('d')==figure_attr) return false;
    figures[figure_id].attr('d',figure_attr);
  }
  else {
    var linePath = acgraph.path();
    linePath.parent(stage);
    $.each(angles, function(index, value) {
      if (index == 0) {
        linePath.moveTo(angles[index].x, angles[index].y);
      }else {
        linePath.lineTo(angles[index].x, angles[index].y);
      }
    });
    linePath.close();
    figures[figure_id] = linePath;
  }
}

anychart.onDocumentReady(function(){

  stage = anychart.graphics.create('container');

  (function render() {
    var bodies = Composite.allBodies(engine.world);

    window.requestAnimationFrame(render); // я бы перенёс это в конец, а может и нет

    for (var bid in bodies) { // перебор всех объектов в сцене
      var body = bodies[bid];
      var object_id = body.id; // id объекта
      var vertices = body.vertices; // вертексы объкта вида [{x: 243, y: 123}, {x: 141, y: 232}, {x: 412, y: 41}, {x: 232, y: 41}]
      draw_figure(object_id,vertices);
    }

  })();

});
