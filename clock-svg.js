// Угол в градусах, на который смотрят стрелки в 00:00
const baseAngleDegree = -90;
// Угол в радианах, на который смотрят стрелки в 00:00
const baseAngleRadian = -Math.PI / 2;
// Угол в радианах, разделяющий между собой цифры-метки: 2π/12 = π/6
const sectorAngleRadian = Math.PI / 6;

const ns = "http://www.w3.org/2000/svg";

// SVG-контейнер
let clock = document.createElementNS(ns, "svg");
clock.setAttributeNS(null, "width", 500);
clock.setAttributeNS(null, "height", 500);
clock.setAttributeNS(null, "viewBox", "-250 -250 500 500");
document.body.append(clock);

// Основа
let board = document.createElementNS(ns, "circle");
board.setAttributeNS(null, "r", "50%");
board.setAttributeNS(null, "fill", "orange");
clock.appendChild(board);

// Центр (временный ориентир, чтобы оценить расположение стрелок)
let tempCenter = document.createElementNS(ns, "circle");
tempCenter.setAttributeNS(null, "r", "1%");
tempCenter.setAttributeNS(null, "fill", "white");
clock.appendChild(tempCenter);

// Контейнер для цифр
let numGroup = document.createElementNS(ns, "g");
clock.appendChild(numGroup);

// Цифры 1 .. 12, состоящие из метки и текста на ней
let markArray = [];
let textArray = [];
for (let i = 0; i < 12; i++) {
  markArray[i] = document.createElementNS(ns, "circle");
  let distance = 40;  // % - в процентах, расстояние часовых меток от центра циферблата
  let angle = baseAngleRadian + (i * sectorAngleRadian);
  markArray[i].setAttributeNS(null, "cx", `${distance * Math.cos(angle)}%`);
  markArray[i].setAttributeNS(null, "cy", `${distance * Math.sin(angle)}%`);
  markArray[i].setAttributeNS(null, "r", 30);
  markArray[i].setAttributeNS(null, "fill", "Wheat");
  numGroup.appendChild(markArray[i]);
  
  textArray[i] = document.createElementNS(ns, "text");
  textArray[i].textContent = i;
  textArray[i].setAttributeNS(null, "x", `${distance * Math.cos(angle)}%`);
  textArray[i].setAttributeNS(null, "y", `${distance * Math.sin(angle)}%`);
  textArray[i].setAttributeNS(null, "text-anchor", "middle");
  textArray[i].setAttributeNS(null, "alignment-baseline", "middle");
  textArray[i].setAttributeNS(null, "font-size", 25);
  numGroup.appendChild(textArray[i]);
}
textArray[0].textContent = 12;

// Часовая стрелка
let hourHand = document.createElementNS(ns, "rect");
hourHand.setAttributeNS(null, "height", 16);
hourHand.setAttributeNS(null, "width", 120);
hourHand.setAttributeNS(null, "y", `${-hourHand.getAttributeNS(null,"height") / 2}`);
clock.appendChild(hourHand);

// Минутная стрелка
let minuteHand = document.createElementNS(ns, "rect");
minuteHand.setAttributeNS(null, "height", 10);
minuteHand.setAttributeNS(null, "width", 200);
minuteHand.setAttributeNS(null, "y", `${-minuteHand.getAttributeNS(null,"height") / 2}`);
clock.appendChild(minuteHand);

// Секундная стрелка
let secondHand = document.createElementNS(ns, "rect");
secondHand.setAttributeNS(null, "height", 5);
secondHand.setAttributeNS(null, "width", 200);
secondHand.setAttributeNS(null, "y", `${-secondHand.getAttributeNS(null,"height") / 2}`);
secondHand.setAttributeNS(null, "fill", "red");
clock.appendChild(secondHand);

// Анимация
let now;
let hourAngle = 0;
let minuteAngle = 0;
let secondAngle = 0;
function update() {
  now = new Date();
  //
  // Для угла секундной стрелки достаточно метода getSeconds() - он возвращает число в диапазоне 0 .. 59:
  //
  // (getSeconds / 60) * 360°
  //
  secondAngle = baseAngleDegree + (now.getSeconds() * 6);
  secondHand.setAttributeNS(null, "transform", `rotate(${secondAngle})`);
  //
  // Для угла минутной и часовой стелок соответствующие значения из объекта Date переводятся в секунды:
  //
  // (now.getMinutes() * 60) + now.getSeconds()
  // ------------------------------------------ * 360°
  //                    60 * 60
  //
  minuteAngle = baseAngleDegree + ((now.getMinutes() * 60 + now.getSeconds()) / 10);
  minuteHand.setAttributeNS(null, "transform", `rotate(${minuteAngle})`);
  //
  // ((now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds()
  // ------------------------------------------------------------------------ * 360°
  //                            (12 * 60 * 60))
  //
  hourAngle = baseAngleDegree + (((now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds()) / 120);
  hourHand.setAttributeNS(null, "transform", `rotate(${hourAngle})`);
  window.requestAnimationFrame(update);
}
update();