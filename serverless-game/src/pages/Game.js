import React, {useState, useEffect, useCallback} from 'react';
import {
    StyledGame,
    StyledCharacter,
    StyledScore,
    StyledTimer,
} from '../styled/Game';
import {Strong} from '../styled/Random';
import {useScore} from "../context/ScoreContext";

export default function Game({history}) {
    const MAX_SECONDS = 5;
    const characters = 'abc123';
    const [currentCharacter, setCurrentCharacter] = useState('');
    const [score, setScore] = useScore();
    const [ms, setMs] = useState(999);
    const [seconds, setSeconds] = useState(MAX_SECONDS);

    const setRandomCharacter = () => {
        const randomInt = Math.floor(Math.random() * 5);
        setCurrentCharacter(characters[randomInt]);
    };
    useEffect(() => {
        setRandomCharacter();
        setScore(0);
        const currentTime = new Date();
        const interval = setInterval(() => updateTime(currentTime), 1);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const updateTime = (startTime) => {
        const endTime = new Date();
        const msPassedStr = (endTime.getTime() - startTime.getTime()).toString();
        //add zeros if necessary to ensure the string has exactly 5 characters
        const formattedMSString = ('0000' + msPassedStr).slice(-5);
        //0000 - first 2 are the seconds, and the last 3 are the ms
        const updatedSeconds =
            MAX_SECONDS - parseInt(formattedMSString.substring(0, 2)) - 1;
        const updatedMs =
            1000 -
            parseInt(formattedMSString.substring(formattedMSString.length - 3));
        setSeconds(addLeadingZeros(updatedSeconds, 2));
        setMs(addLeadingZeros(updatedMs, 3));
    };

    useEffect(() => {
        if (seconds <= -1) {
            history.push('/gameOver');
        }
    }, [seconds, ms, history]);

    const addLeadingZeros = (str, length) => {
        let zeros = '';
        for (let i = 0; i < length; i++) {
            zeros += '0';
        }
        return (zeros + str).slice(-length);
    };


    const keyupHandler = useCallback((e) => {
        console.log(e.key)
        if (e.key === currentCharacter) {
            setScore((prevScore) => prevScore + 1);
        } else if (score > 0) {
            setScore((prevScore) => prevScore - 1);
        }
        setRandomCharacter();
    },[currentCharacter]);

    useEffect(() => {
        document.addEventListener('keyup', keyupHandler);
        return () => {
            document.removeEventListener('keyup', keyupHandler);
        }
    }, [keyupHandler]);

    const test = process.env.REACT_APP_AIRTABLE_TOKEN;
    console.log(test);
    return (
        <StyledGame>
            <StyledScore>
                Score: <Strong>{score}</Strong>
            </StyledScore>
            <StyledCharacter>{currentCharacter}</StyledCharacter>
            <StyledTimer>
                Time:{' '}
                <Strong>
                    {seconds}:{ms}
                </Strong>
            </StyledTimer>
        </StyledGame>
    );
}
