let monitorear = true;

//CONFIGURACIÓN

let amp_min = 0.001;
let amp_max = 0.1;
let imprimir = false;
let AMORTIGUACION = 0.95;

let frec_min = 0.01;
let frec_max = 0.9;

//ENTRADA DE AUDIO
let mic;

// TEACHABLE MACHINE

let classifier;

let label;

const options = { probabilityThreshold: 0.9 };
const classModel = 'https://teachablemachine.withgoogle.com/models/JlfubUN9N/';


//GESTOR
let gestorAmp;
let gestorPitch;


//AMPLITUD
let amp;


//ESTADOS DEL SONIDO
let haySonido = false;
let antesHabiaSonido;


//ESTADOS
let estado = "primero";

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
  cambioDeColor();

  imageMode(CENTER);

  classifier.classify(gotResults);

  //----Gestor y Frecuencia----
  mic.start(startPitch);
  gestorPitch = new GestorSenial(frec_min, frec_max);
  gestorPitch.f = AMORTIGUACION;

  //----Forzar arranque----
  userStartAudio();

  //----Asignacion----
  antesHabiaSonido = false;

}
let aTest = 0;

function draw() {



  background(0);
  vel = 3;

  gestorAmp.actualizar(mic.getLevel());
  amp = gestorAmp.filtrada;
  //console.log(label);

  frec = gestorPitch.filtrada;

  //----Estados y Eventos----
  haySonido = gestorAmp.filtrada > amp_min;


  antesHabiaSonido = haySonido;

  //----Tamaño redes y rellenos----
  tam = map(amp, amp_min, amp_max, 930, 1050);
  //angle = map(frec, frec_min, frec_max, 0, 360);

  translate(width / 2, height / 2);


  //----DIAGRAMA DE ESTADOS----
  if (estado == "primero") {

    if (haySonido) {
      if (frec >= frec_min) {
        angle++;
      } else if (frec <= frec_max) {
        angle--;
      }
    }


    push();
    rotate(angle);
    tint(esteColor, 255);
    image(rellenos[0], 0, 0, 1000, 1000); //0
    pop();

    push();
    tint(esteColor2, 255);
    image(rellenos[1], 0, 0, tam, tam); //1
    pop();

    push();
    tint(esteColor3, 255);
    image(rellenos[2], 0, 0, 1000, 1000); //2
    pop();

    push();
    rotate(angle);
    tint(esteColor4, 255);
    image(redes[0], 0, 0, 1000, 1000); //0
    pop();

    push();
    tint(esteColor5, 255);
    image(redes[1], 0, 0, tam, tam); //1
    pop();

    push();
    tint(esteColor6, 255);
    image(redes[2], 0, 0, 1000, 1000); //2
    pop();

    if (label == 'Aplauso ruido'||label == 'Aplauso silencio') {

      estado = "segundo";
      cambioDeColor();
      label = '';
    }


  } else if (estado == "segundo") {

    if (haySonido) {
      if (frec >= frec_min) {
        angle--;
      } else if (frec <= frec_max) {
        angle++;
      }
    }

    push();
    rotate(angle);
    tint(esteColor3, 255);
    image(rellenos[2], 0, 0, 1000, 1000); //2
    pop();

    push();
    tint(esteColor, 255);
    image(rellenos[0], 0, 0, tam, tam); //0
    pop();

    push();
    tint(esteColor2, 255);
    image(rellenos[1], 0, 0, 1000, 1000); //1
    pop();

    push();
    tint(esteColor4, 255);
    image(redes[0], 0, 0, tam, tam); //0
    pop();

    push();
    rotate(angle);
    tint(esteColor6, 255);
    image(redes[2], 0, 0, 1000, 1000); //2
    pop();

    push();
    tint(esteColor5, 255);
    image(redes[1], 0, 0, 1000, 1000); //1
    pop();



    if (label == 'Aplauso ruido'||label == 'Aplauso silencio') {

      estado = "tercero";
      cambioDeColor();
      label = '';

    }


  } else if (estado == "tercero") {

    if (haySonido) {
      if (frec >= frec_min) {
        angle++;
      } else if (frec <= frec_max) {
        angle--;
      }
    }

    push();
    rotate(angle);
    tint(esteColor2, 255);
    image(rellenos[1], 0, 0, 1000, 1000); //1
    pop();

    push();
    tint(esteColor3, 255);
    image(rellenos[2], 0, 0, tam, tam); //2
    pop();

    push();
    tint(esteColor, 255);
    image(rellenos[0], 0, 0, tam, tam); //0
    pop();

    push();
    rotate(angle);
    tint(esteColor5, 255);
    image(redes[1], 0, 0, 1000, 1000); //1
    pop();

    push();
    tint(esteColor6, 255);
    image(redes[2], 0, 0, tam, tam); //2
    pop();

    push();
    tint(esteColor4, 255);
    image(redes[0], 0, 0, tam, tam); //0
    pop();

    if (label == 'Aplauso ruido'||label == 'Aplauso silencio') {

      estado = "reinicio";
      cambioDeColor();
      label = '';

    }

  } else if (estado == "reinicio") {

    estado = "primero";


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

      console.log(frec);
    }
    getPitch();
  })
}

function cambioDeColor() {
  esteColor = miPaleta.darColor();
  esteColor2 = miPaleta.darColor();
  esteColor3 = miPaleta.darColor();
  esteColor4 = miPaleta.darColor();
  esteColor5 = miPaleta.darColor();
  esteColor6 = miPaleta.darColor();
}