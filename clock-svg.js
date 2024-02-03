let ns = "http://www.w3.org/2000/svg";
let clock = document.createElementNS(ns, "svg");
clock.setAttributeNS(null, "width", 500);
clock.setAttributeNS(null, "height", 500);
document.body.append(clock);
let board = document.createElementNS(ns, "circle");
board.setAttributeNS(null, "r", "50%");
board.setAttributeNS(null, "cx", "50%");
board.setAttributeNS(null, "cy", "50%");
board.setAttributeNS(null, "fill", "olive");
clock.appendChild(board);
