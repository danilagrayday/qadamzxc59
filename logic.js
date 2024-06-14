document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.getElementById('loading-screen').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    }, 4000);
});

let energyTap = 100;
let coinsProgress = 0;
const maxCoins = 5000; // Количество монет для достижения уровня
const energyTapDecrement = 6; // Сколько энергии отнимается при каждом нажатии
const coinsIncrement = 6; // Сколько монет добавляется при каждом нажатии
const energyRestoreRate = 4; // Сколько энергии восстанавливается в секунду

// Функция для обновления отображения энергии
function updateEnergyDisplay() {
    const energySpan = document.querySelector('.energy_tap');
    energySpan.innerHTML = `<img src="energy.png"> ${energyTap}/4000`;
}

// Функция для обновления отображения прогресса монет
function updateCoinsProgressDisplay() {
    const coinsProgressDiv = document.querySelector('.coins_progress');
    coinsProgressDiv.innerHTML = `<img src="coin.png"> ${coinsProgress.toLocaleString()}`;
    updateProgressBar(); // Обновляем прогресс бар
}

// Функция для обновления ширины прогресс бара
function updateProgressBar() {
    const progressBar = document.querySelector('.progress .color');
    const progressPercentage = Math.min((coinsProgress / maxCoins) * 100, 100); // Процент прогресса
    progressBar.style.width = `${progressPercentage}%`;
}

// Функция для создания и анимации уведомления о монетах
function showCoinNotification(message, posX, posY) {
    const coinButton = document.querySelector('.coin');
    const notification = document.createElement('div');
    notification.classList.add('coin-notification');
    notification.textContent = message;
    notification.style.left = `${posX}px`; // Устанавливаем позицию по горизонтали
    notification.style.top = `${posY}px`; // Устанавливаем позицию по вертикали
    coinButton.appendChild(notification);

    // Плавно исчезаем уведомление через 2 секунды
    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => {
            notification.remove();
        }, 200); // Даем время для анимации исчезновения
    }, 1000);
}

// Функция для восстановления энергии каждую секунду
function restoreEnergy() {
    if (energyTap < 1000) {
        energyTap += energyRestoreRate;
        if (energyTap > 1000) {
            energyTap = 1000; // Ограничение восстановленной энергии до максимального значения
        }
        updateEnergyDisplay();
    }
}

// Функция для обработки нажатия на кнопку
function handleClick(event) {
    if (energyTap >= energyTapDecrement) {
        energyTap -= energyTapDecrement;
        coinsProgress += coinsIncrement;
        updateEnergyDisplay();
        updateCoinsProgressDisplay();

        // Получаем координаты клика относительно .coin
        const rect = event.currentTarget.getBoundingClientRect();
        const posX = event.clientX - rect.left;
        const posY = event.clientY - rect.top;

        showCoinNotification(`+${coinsIncrement} монет`, posX, posY);
    } else {
        alert('Недостаточно энергии!');
    }
}

// Добавляем обработчик события для кнопки
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('image-button');
    button.addEventListener('click', handleClick);

    // Устанавливаем интервал для восстановления энергии каждую секунду
    setInterval(restoreEnergy, 1000);

    // Инициализируем начальное отображение энергии и прогресса монет
    updateEnergyDisplay();
    updateCoinsProgressDisplay();
});
