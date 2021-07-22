import '../styles/style.scss';

import Sky from '../assets/sky.jpg';
import Invader from '../assets/invader.png';
import Defender from '../assets/defender.png';
import { dir } from 'async';


document.addEventListener('DOMContentLoaded', () => {
    const grids = document.querySelectorAll('.game-grid div');
    const resultSpan = document.getElementById('result');
    let width = 15;
    let currentDefenderIndex = 202;
    let currentInvaderIndex = 0;
    let shootedInvaders = [];
    let direction = 1;
    let result = 0;
    let invaderId;

    const invadersArray = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ]

    invadersArray.forEach(invader => {
        grids[currentInvaderIndex + invader].classList.add('invader');
    })

    grids[currentDefenderIndex].classList.add('defender');


    function defenderMoves(e) {
        grids[currentDefenderIndex].classList.remove('defender');

        switch(e.keyCode) {
            case 37:
                if(currentDefenderIndex % width !== 0 ) { currentDefenderIndex -= 1};
                break;
            case 39:
                if(currentDefenderIndex % width < width -1) { currentDefenderIndex +=1};
                break;
        }

        grids[currentDefenderIndex].classList.add('defender');
    }

    document.addEventListener('keydown', defenderMoves);


    function invadersMoves() {
        const leftBorder = invadersArray[0] % width === 0;
        const rightBorder = invadersArray[invadersArray.length - 1] % width === width - 1;

        if((leftBorder && direction === -1) || (rightBorder && direction === 1)) {
            direction = width;
        } else if(direction === width) {
            if(leftBorder) {
                direction = 1;
            } else {
                direction = -1;
            }
        }

        for(let i = 0; i <= invadersArray.length-1; i++) {
            grids[invadersArray[i]].classList.remove('invader');
        }

        for(let i = 0; i <= invadersArray.length-1; i++) {
            invadersArray[i] += direction;
        }

        for(let i = 0; i <= invadersArray.length-1; i++) {
            if(!shootedInvaders.includes(i)) {
                grids[invadersArray[i]].classList.add('invader');
            }
        }


        if(grids[currentDefenderIndex].classList.contains('invader', 'defender')) {
            grids[currentDefenderIndex].classList.remove('defender');
            resultSpan.textContent = `You got ${result} scores, but Earth is now conquered by alien Invaders :(`;
            clearInterval(invaderId);
        }

        for(let i = 0; i < invadersArray.length - 1; i++) {
            if(invadersArray[i] > (grids.length - (width-1))) {
                resultSpan.textContent = `You got ${result} scores, but Earth is now conquered by alien Invaders :(`;
                clearInterval(invaderId);
            }
        }

        if(shootedInvaders.length === invadersArray.length) {
            resultSpan.textContent = `You got ${result} scores, and Earth is now saved! :)`;
            clearInterval(invaderId);
        }
    }

    invaderId = setInterval(invadersMoves, 500);

    function shooting(e) {
        let laserId;
        let currentLaserIndex = currentDefenderIndex;

        function laserMoves() {
            grids[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            grids[currentLaserIndex].classList.add('laser');

            if(grids[currentLaserIndex].classList.contains('invader')) {
                grids[currentLaserIndex].classList.remove('invader');
                grids[currentLaserIndex].classList.remove('laser');

                clearInterval(laserId);

                const shooted = invadersArray.indexOf(currentLaserIndex);
                shootedInvaders.push(shooted);
                result++;
                resultSpan.textContent = result;
            }

            if(currentLaserIndex < width) {
                grids[currentLaserIndex].classList.remove('laser');
                clearInterval(laserId);
            }
        }

        switch(e.keyCode) {
            case 38:
                laserId = setInterval(laserMoves, 100);
                break;
        }
    }

    document.addEventListener('keyup', shooting)
})