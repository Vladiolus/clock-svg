// Диаметр часов и размер SVG-контейнера
const clockSize = 500;

// Расстояние от центра циферблата и размер часовых меток
// Важно: расстояние в процентах! от общего размера часов
const markerDistance = 40;
const markerRadius = 30;

// Угол в градусах, на который смотрят стрелки в 00:00. Не для изменения
const baseAngleDegree = -90;
// Угол в радианах, на который смотрят стрелки в 00:00. Не для изменения
const baseAngleRadian = -Math.PI / 2;
// Угол в радианах, разделяющий между собой цифры-метки: 2π/12 = π/6. Не для изменения
const sectorAngleRadian = Math.PI / 6;

// Размеры стрелок
// Длина (в данном случае width) является полной, включая в себя выступающий сзади "противовес"
const hourHeight = 20;
const hourWidth = 150;
const minHeight = 10;
const minWidth = 200;
const secHeight = 5;
const secWidth = 220;

// Пространство имён для динамического создания SVG-элементов
const ns = "http://www.w3.org/2000/svg";


// SVG-контейнер
let clock = document.createElementNS(ns, "svg");
clock.setAttributeNS(null, "width", clockSize);
clock.setAttributeNS(null, "height", clockSize);
clock.setAttributeNS(null, "viewBox", `${-clockSize/2} ${-clockSize/2} ${clockSize} ${clockSize}`);
document.body.append(clock);

// Основа
let board = document.createElementNS(ns, "circle");
board.setAttributeNS(null, "r", "50%");
board.setAttributeNS(null, "fill", "orange");
clock.appendChild(board);

// Контейнер для цифр
let numGroup = document.createElementNS(ns, "g");
clock.appendChild(numGroup);

// Цифры 1 .. 12, состоящие из метки и текста на ней
let markArray = [];
let textArray = [];
for (let i = 0; i < 12; i++) {
  markArray[i] = document.createElementNS(ns, "circle");
  let angle = baseAngleRadian + (i * sectorAngleRadian);
  markArray[i].setAttributeNS(null, "cx", `${markerDistance * Math.cos(angle)}%`);
  markArray[i].setAttributeNS(null, "cy", `${markerDistance * Math.sin(angle)}%`);
  markArray[i].setAttributeNS(null, "r", markerRadius);
  markArray[i].setAttributeNS(null, "fill", "Wheat");
  numGroup.appendChild(markArray[i]);
  
  textArray[i] = document.createElementNS(ns, "text");
  textArray[i].textContent = i;
  textArray[i].setAttributeNS(null, "x", `${markerDistance * Math.cos(angle)}%`);
  textArray[i].setAttributeNS(null, "y", `${markerDistance * Math.sin(angle)}%`);
  textArray[i].setAttributeNS(null, "text-anchor", "middle");
  textArray[i].setAttributeNS(null, "alignment-baseline", "middle");
  textArray[i].setAttributeNS(null, "font-size", 25);
  numGroup.appendChild(textArray[i]);
}
textArray[0].textContent = 12;

// Часовая стрелка
let hourHand = document.createElementNS(ns, "rect");
hourHand.setAttributeNS(null, "height", hourHeight);
hourHand.setAttributeNS(null, "width", hourWidth);
hourHand.setAttributeNS(null, "x", -hourHeight);
hourHand.setAttributeNS(null, "y", -hourHeight / 2);
hourHand.setAttributeNS(null, "rx", hourHeight / 2);
clock.appendChild(hourHand);

// Минутная стрелка
let minuteHand = document.createElementNS(ns, "rect");
minuteHand.setAttributeNS(null, "height", minHeight);
minuteHand.setAttributeNS(null, "width", minWidth);
minuteHand.setAttributeNS(null, "x", -minHeight * 2);
minuteHand.setAttributeNS(null, "y", -minHeight / 2);
minuteHand.setAttributeNS(null, "rx", minHeight / 2);
clock.appendChild(minuteHand);

// Секундная стрелка
let secondHand = document.createElementNS(ns, "rect");
secondHand.setAttributeNS(null, "height", secHeight);
secondHand.setAttributeNS(null, "width", secWidth);
secondHand.setAttributeNS(null, "x", -secHeight * 4);
secondHand.setAttributeNS(null, "y", -secHeight / 2);
secondHand.setAttributeNS(null, "rx", secHeight / 2);
secondHand.setAttributeNS(null, "fill", "red");
clock.appendChild(secondHand);

// Поле для цифрового отображения времени
let elTablo = document.createElementNS(ns, "text");
elTablo.textContent = "00:00:00";
elTablo.setAttributeNS(null, "y", "-20%");
elTablo.setAttributeNS(null, "text-anchor", "middle");
elTablo.setAttributeNS(null, "alignment-baseline", "middle");
elTablo.setAttributeNS(null, "font-size", 48);
clock.appendChild(elTablo);

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
  // Для угла минутной и часовой стрелок соответствующие значения из объекта Date переводятся в секунды:
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
  //                            12 * 60 * 60
  //
  hourAngle = baseAngleDegree + (((now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds()) / 120);
  hourHand.setAttributeNS(null, "transform", `rotate(${hourAngle})`);
  
  elTablo.textContent = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  window.requestAnimationFrame(update);
}
update();