/*
возвращает случайное целое число в заданном интервале
*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

// картинки с номерами 0,1,2
function getNextImageNumber(imageNumber, maxNumber = 2) {
    imageNumber++;
    if (imageNumber > maxNumber) {
        imageNumber = 0
    }
    return imageNumber;
}    

function playSound(element, loop = false) {
    element.currentTime = 0;
    element.loop = loop;
    element.play();
}

function stopSound(element) {
     element.pause();
}     