let monitorear = true;

//CONFIGURACIÓN

let amp_min = 0.01;
let amp_max = 0.1;
let imprimir = false;
let AMORTIGUACION = 0.65;

let frec_min = 48;
let frec_max = 400;

//ENTRADA DE AUDIO
let mic;

// TEACHABLE MACHINE

let classifier;

let label;

const options = { probabilityThreshold: 0.9 };
const classModel = 'https://teachablemachine.withgoogle.com/models/B8QRIgj0Y/';


//GESTOR
let gestorAmp;
let gestorPitch;


//AMPLITUD
let amp;


//ESTADOS DEL SONIDO
let haySonido = false;
let antesHabiaSonido;


//ESTADOS
let estado = "rotar";

//CONDICIONES PARA CAMBIAR DE ETAPA
let marca;
let tiempoLimiteRotar = 3000;
let tiempoLimiteEscalar = 3000;

//FRECUENCIA
let pitch;
let audioContext;
const model_url = 'http://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';


//VARIABLES PARA LA ESCALA Y LA ROTACIÓN
let tam;
let frec;
let vel;
let angle = 0.0;


//DECLARACIÓN DE LAS VARIABLES DE LOS ARREGLOS DE REDES Y RELLENOS
let rellenos = [];
let redes = [];
let cantidad = 3;

//INICIALIZACIÓN DEL OBJETO miPaleta
let miPaleta;

//VARIABLES PARA DARLE UN COLOR A CADA PNG
let esteColor;
let esteColor2;
let esteColor3;
let esteColor4;
let esteColor5;
let esteColor6;

function preload() {

  //----Color----
  miPaleta = new Paleta("./assets/obraSaturada.png");

  //----Redes----
  for (let i = 0; i < cantidad; i++) {
    let nombre = "./assets/red2-" + i + ".png";
    console.log(nombre);
    redes[i] = loadImage(nombre);
  }

  //----Rellenos----
  for (let i = 0; i < cantidad; i++) {
    let nombre = "./assets/relleno2-" + i + ".png";
    console.log(nombre);
    rellenos[i] = loadImage(nombre);
  }

  //----ml5----
  classifier = ml5.soundClassifier(classModel + 'model.json', options);

}

function setup() {

  background(0);
  createCanvas(windowHeight, windowHeight);
  angleMode(DEGREES);

  //----Gestor y Amplitud----
  gestorAmp = new GestorSenial(amp_min, amp_max);
  gestorAmp.f = AMORTIGUACION;

  //----Mic y Audio----
  mic = new p5.AudioIn();
  mic.start();
  audioContext = getAudioContext();

  //----Colores----
  esteColor = miPaleta.darColor();
  esteColor2 = miPaleta.darColor();
  esteColor3 = miPaleta.darColor();
  esteColor4 = miPaleta.darColor();
  esteColor5 = miPaleta.darColor();
  esteColor6 = miPaleta.darColor();

  imageMode(CENTER);

  classifier.classify(gotResults);

  //----Gestor y Frecuencia----
  mic.start(startPitch);
  gestorPitch = new GestorSenial(frec_min, frec_max);

  //----Forzar arranque----
  userStartAudio();

  //----Asignacion----
  antesHabiaSonido = false;

}

function draw() {

  background(0);
  vel = 3;

  gestorAmp.actualizar(mic.getLevel());
  amp = gestorAmp.filtrada;
  console.log(label);

  //----Estados y Eventos----
  haySonido = gestorAmp.filtrada > amp_min;
  let empezoElSonido = haySonido && !antesHabiaSonido;
  let finDelSonido = !haySonido && antesHabiaSonido;

  antesHabiaSonido = haySonido;

  //----Tamaño redes y rellenos----
  tam = map(amp, amp_min, amp_max, 930, 1000);

  translate(width / 2, height / 2);


 
    if (haySonido && label == 'Grave') {

      push();
      rotate(angle);
      angle = angle + vel;
      tint(esteColor, 255);
      image(rellenos[0], 0, 0, 1000, 1000); //0

      tint(esteColor4, 255);
      image(redes[0], 0, 0, 1000, 1000); //0
      pop();

    } else {
      tint(esteColor, 255);
      image(rellenos[0], 0, 0, 1000, 1000); //0

      tint(esteColor4, 255);
      image(redes[0], 0, 0, 1000, 1000); //0
    }

  


    push();
    tint(esteColor3, 255);
    image(rellenos[2], 0, 0, tam, tam); //2
    pop();



    
    if (haySonido && label == 'Agudo') {

      push();
      rotate(angle);
      angle = angle - vel;
      tint(esteColor5, 255);
      image(redes[1], 0, 0, 1000, 1000); //1

      tint(esteColor2, 255);
      image(rellenos[1], 0, 0, 1000, 1000); //1
      pop();

    } else {
      tint(esteColor5, 255);
      image(redes[1], 0, 0, 1000, 1000); //1

      tint(esteColor2, 255);
      image(rellenos[1], 0, 0, 1000, 1000); //1
    }
    
    

    push();
    tint(esteColor6, 255);
    image(redes[2], 0, 0, tam, tam); //2
    pop();



  //----Cambio color con aplauso----
  if (label == 'Aplauso') {

    esteColor = miPaleta.darColor();
    esteColor2 = miPaleta.darColor();
    esteColor3 = miPaleta.darColor();
    esteColor4 = miPaleta.darColor();
    esteColor5 = miPaleta.darColor();
    esteColor6 = miPaleta.darColor();
    label = '';

  }
  console.log(estado);

}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;

}

//----Pitch Detection----

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      gestorPitch.actualizar(frequency);

      console.log(frequency);
    }
    getPitch();
  })
}