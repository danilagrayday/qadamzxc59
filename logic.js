document.addEventListener('DOMContentLoaded', function() {
    const dotsElement = document.getElementById('dots');
    let dotCount = 0;

    document.getElementById('image-button').addEventListener('click', function() {
        if (navigator.vibrate) {
            navigator.vibrate(100); // Вибрация на 100 миллисекунд
        }
    });

    const changeDots = () => {
        dotCount = (dotCount + 1) % 4;
        dotsElement.textContent = '.'.repeat(dotCount);
    };

    const intervalId = setInterval(changeDots, 500);

    setTimeout(function() {
        clearInterval(intervalId);
        document.getElementById('progress_few').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    }, 3500); // Замените на нужное время в миллисекундах

    let currentProgress = 0;
    let energyTap = 500; /* Энергия */
    const energyTapMax = 500; /* Макс энергия */
    const energyTapDecrement = 10; /* Сколько энергии отнимается */
    let coinsProgress = 0; /* Количество монет */
    const coinsIncrement = 3; /* Сколько монет прибавляется */
    const coinsPerFullProgress = 100; /* Количество монет для 100% прогресса */
    const coinsInSecond = 100;

    const button = document.getElementById('image-button');

    // Обработка нажатия мыши
    button.addEventListener('mousedown', handleMouseDown);

    // Обработка отпускания мыши
    button.addEventListener('mouseup', handleMouseUp);

    // Устанавливаем интервал для восстановления энергии каждую секунду
    setInterval(restoreEnergy, 1030);

    // Устанавливаем интервал для пассивного увеличения монет каждую секунду
    setInterval(increaseFarmCoinsPassively, 36000);

    // Инициализируем начальное отображение энергии и прогресса монет
    updateEnergyDisplay();
    updateCoinsProgressDisplay();
    updateFarmCoinsDisplay();

    let isMouseDown = false;

    function handleMouseDown(event) {
        isMouseDown = true;
        handleClick(event);
    }

    function handleMouseUp() {
        isMouseDown = false;
    }

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

            // Увеличиваем прогресс
            increaseProgress();
        }

        if (isMouseDown) {
            setTimeout(() => handleClick(event), 100);
        }
    }

    function increaseProgress() {
        const progressElement = document.getElementById('progress');
        const stagePodElement1 = document.getElementById('stage_pod_id1');
        const stagePodElement2 = document.getElementById('stage_pod_id2');

        // Пересчитываем прогресс на основе количества монет
        currentProgress = Math.floor((coinsProgress / coinsPerFullProgress) * 100);
        progressElement.style.width = currentProgress + '%';

        // Если достигнут 100% прогресса, сбрасываем и увеличиваем счетчик
        if (currentProgress >= 100) {
            currentProgress = 0;
            coinsProgress = 0; // Сбрасываем прогресс монет
            stagePodElement1.textContent = `${parseInt(stagePodElement1.textContent) + 1}/10`;
            stagePodElement2.textContent = `${parseInt(stagePodElement2.textContent) + 1}/10`;
        }

        // Обновляем отображение прогресса
        stagePodElement1.textContent = `${parseInt(stagePodElement1.textContent.split('/')[0])}/10`;
        stagePodElement2.textContent = `${parseInt(stagePodElement2.textContent.split('/')[0])}/10`;
    }

    function restoreEnergy() {
        if (energyTap < energyTapMax) {
            energyTap += Math.ceil(((coinsInSecond/60)/60)); // Скорость восстановления энергии
            if (energyTap > energyTapMax) {
                energyTap = energyTapMax; // Предотвращаем превышение максимума
            }
            updateEnergyDisplay();
        }
    }

    function increaseFarmCoinsPassively() {
        const farmCoinsElement = document.getElementById('farm_coins_id');
        const currentFarmCoins = parseInt(farmCoinsElement.textContent) || 0;
        farmCoinsElement.innerHTML = `<img src="coin.png" alt="coin">${currentFarmCoins + 1}`;
    }

    function updateEnergyDisplay() {
        const energyDisplay = document.querySelector('.energy_tap');
        energyDisplay.innerHTML = `<img src="energy.png" alt="coin">${energyTap}/${energyTapMax}`;
    }

    function updateCoinsProgressDisplay() {
        const coinsProgressDisplay = document.querySelector('.farm_coins');
        coinsProgressDisplay.innerHTML = `<img src="coin.png" alt="coin">${coinsProgress}`;
    }

    function updateFarmCoinsDisplay() {
        const farmCoinsElement = document.getElementById('farm_coins_id');
        farmCoinsElement.innerHTML = `<img src="coin.png" alt="coin">${parseInt(farmCoinsElement.textContent) || 0}`;
    }

    function showCoinNotification(message, x, y) {
        const notification = document.createElement('div');
        notification.className = 'coin-notification';
        notification.innerText = message;
        notification.style.left = `${x}px`;
        notification.style.top = `${y}px`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 1000);
    }
});
