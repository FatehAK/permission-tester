/* location */
const getLocation = document.querySelector('.get-location');
const noGeoSupport = document.querySelector('.no-geo');
getLocation.addEventListener('click', function() {
    if ('geolocation' in navigator) {
        noGeoSupport.innerHTML = 'Supported'
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const long = pos.coords.longitude;
            const locationText = document.querySelector('.location-text');
            locationText.innerHTML = `${lat}, ${long}`;
        }, (err) => {
            Swal.fire(err.name + ': ' + err.message);
        });
    } else {
        noGeoSupport.innerHTML = 'Not Supported'
    }
});

/* camera */
const videoConstraints = { audio: true, video: { width: 400, height: 300 } };
const noCamSupport = document.querySelector('.no-cam');
const getCamera = document.querySelector('.get-camera');
const resetCamera = document.querySelector('.reset-camera');
let videoStream;
getCamera.addEventListener('click', function() {
    if ('mediaDevices' in navigator) {
        getCamera.disabled = true;
        resetCamera.disabled = false;
        noCamSupport.innerHTML = 'Supported'
        navigator.mediaDevices.getUserMedia(videoConstraints).then((stream) => {
            videoStream = stream;
            const video = document.querySelector('.my-video');
            video.srcObject = stream;
            video.onloadedmetadata = function(evt) {
                video.play();
            };
        }).catch((err) => {
            Swal.fire(err.name + ': ' + err.message);
        });
    } else {
        noCamSupport.innerHTML = 'Not Supported';
    }
});

resetCamera.addEventListener('click', function () {
    getCamera.disabled = false;
    resetCamera.disabled = true;
    videoStream.getTracks().forEach(track => track.stop());
});

/* mic */
let chunks = [];
let recorder;
const startMic = document.querySelector('.start-mic');
const stopMic = document.querySelector('.stop-mic');
const noMicSupport = document.querySelector('.no-mic');
const audioConstraints = {
    audio: true,
    audio: {
        tag: 'audio',
        type: 'audio/ogg',
        ext: '.ogg',
    }
};
if ('mediaDevices' in navigator) {
    noMicSupport.innerHTML = 'Supported'
    navigator.mediaDevices.getUserMedia(audioConstraints).then((stream) => {
        if ('MediaRecorder' in window) {
            noMicSupport.innerHTML = 'Supported';
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (evt) => {
                chunks.push(evt.data);
                if (recorder.state == 'inactive') makeLink();
            };
        } else {
            noMicSupport.innerHTML = 'Not Supported';
        }
    }).catch((err) => {
        Swal.fire(err.name + ': ' + err.message);
    });
} else {
    noMicSupport.innerHTML = 'Not Supported';
}

startMic.addEventListener('click', function() {
    startMic.disabled = true;
    stopMic.disabled = false;
    chunks = [];
    recorder.start();
});

stopMic.addEventListener('click', function() {
    stopMic.disabled = true;
    startMic.disabled = false;
    recorder.stop();
});

const makeLink = () => {
    const audioCtn = document.querySelector('.audio-ctn');
    const blob = new Blob(chunks, { type: 'audio/ogg' });
    const url = URL.createObjectURL(blob);
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    audioEl.src = url;
    const anchorEl = document.createElement('a');
    anchorEl.href = url;
    anchorEl.innerHTML = 'Download';
    audioCtn.appendChild(audioEl);
    audioCtn.appendChild(anchorEl);
};

/* clipboard */
const copyBtn = document.querySelector('.copy-btn');
const copyText = document.querySelector('.copy-text');
const noClipSupport = document.querySelector('.no-clip');
if ('clipboard' in navigator) {
    noClipSupport.innerHTML = 'Supported';
    navigator.clipboard.writeText(copyText.innerHTML).then(() => {
        console.log('copied successfully');
    }).catch((err) => {
        Swal.fire(err.name + ': ' + err.message);
    });
} else {
    noClipSupport.innerHTML = 'Not Supported';
}

/* gyroscope */
const startGyro = document.querySelector('.start-gyro');
const stopGyro = document.querySelector('.stop-gyro');
const noGyroSupport = document.querySelector('.no-gyro');
const gyroX = document.querySelector('.gyro-x');
const gyroY = document.querySelector('.gyro-y');
const gyroZ = document.querySelector('.gyro-z');
let gyro;
if ('Gyroscope' in window) {
    noGyroSupport.innerHTML = 'Supported';
    gyro = new Gyroscope();
} else {
    noGyroSupport.innerHTML = 'Not Supported';
}
gyro.onreading = () => {
    gyroX.innerHTML = `Angular Velocity X: ${gyro.x}`;
    gyroY.innerHTML = `Angular Velocity Y: ${gyro.y}`;
    gyroZ.innerHTML = `Angular Velocity Z: ${gyro.z}`;
};
gyro.onerror = () => {
    noGyroSupport.innerHTML = 'Not Supported';
};
startGyro.addEventListener('click', function() {
    if ('Gyroscope' in window) {
        noGyroSupport.innerHTML = 'Supported';
        startGyro.disabled = true;
        stopGyro.disabled = false;
        gyro.start();
    } else {
        noGyroSupport.innerHTML = 'Not Supported';
    }
});
stopGyro.addEventListener('click', function() {
    if ('Gyroscope' in window) {
        noGyroSupport.innerHTML = 'Supported';
        startGyro.disabled = false;
        stopGyro.disabled = true;
        gyro.stop();
    } else {
        noGyroSupport.innerHTML = 'Not Supported';
    }
});

/* accelerometer */
const startAcc = document.querySelector('.start-acc');
const stopAcc = document.querySelector('.stop-acc');
const noAccSupport = document.querySelector('.no-acc');
const accX = document.querySelector('.acc-x');
const accY = document.querySelector('.acc-y');
const accZ = document.querySelector('.acc-z');
let acc;
if ('Accelerometer' in window) {
    noAccSupport.innerHTML = 'Supported';
    acc = new Accelerometer({ referenceFrame: 'device' });
} else {
    noAccSupport.innerHTML = 'Not Supported';
}
acc.onreading = () => {
    accX.innerHTML = `Acceleration X: ${acc.x}`;
    accY.innerHTML = `Acceleration Y: ${acc.y}`;
    accZ.innerHTML = `Acceleration Z: ${acc.z}`;
};
acc.onerror = () => {
    noAccSupport.innerHTML = 'Not Supported';
};
startAcc.addEventListener('click', function() {
    if ('Accelerometer' in window) {
        noAccSupport.innerHTML = 'Supported';
        startAcc.disabled = true;
        stopAcc.disabled = false;
        acc.start();
    } else {
        noAccSupport.innerHTML = 'Not Supported';
    }
});
stopAcc.addEventListener('click', function () {
    if ('Accelerometer' in window) {
        noAccSupport.innerHTML = 'Supported';
        startAcc.disabled = false;
        stopAcc.disabled = true;
        acc.stop();
    } else {
        noAccSupport.innerHTML = 'Not Supported';
    }
});

/* orientation sensor */
const startOri = document.querySelector('.start-ori');
const stopOri = document.querySelector('.stop-ori');
const noOriSupport = document.querySelector('.no-ori');
const oriText = document.querySelector('.ori-text');
let ori;
if ('AbsoluteOrientationSensor' in window) {
    noOriSupport.innerHTML = 'Supported';
    ori = new AbsoluteOrientationSensor();
} else {
    noOriSupport.innerHTML = 'Not Supported';
}
ori.onreading = () => {
    oriText.innerHTML = `Orientation Quats: ${ori.quaternion}`;
};
ori.onerror = () => {
    noOriSupport.innerHTML = 'Not Supported';
};
startOri.addEventListener('click', function() {
    if ('AbsoluteOrientationSensor' in window) {
        noOriSupport.innerHTML = 'Supported';
        startOri.disabled = true;
        stopOri.disabled = false;
        ori.start();
    } else {
        noOriSupport.innerHTML = 'Not Supported';
    }
});
stopOri.addEventListener('click', function() {
    if ('AbsoluteOrientationSensor' in window) {
        noOriSupport.innerHTML = 'Supported';
        startOri.disabled = false;
        stopOri.disabled = true;
        ori.start();
    } else {
        noOriSupport.innerHTML = 'Not Supported';
    }
})

/* Device Orientation API */
const startDori = document.querySelector('.start-dori');
const stopDori = document.querySelector('.stop-dori');
const dOriAbs = document.querySelector('.device-ori-abs');
const dOriAlpha = document.querySelector('.device-ori-alpha');
const dOriBeta = document.querySelector('.device-ori-beta');
const dOriGamma = document.querySelector('.device-ori-gamma');

startDori.addEventListener('click', function() {
    startDori.disabled = true;
    startDori.disabled = false;
    window.addEventListener('deviceorientation', handleOrientation);
});
stopDori.addEventListener('click', function () {
    startDori.disabled = false;
    startDmo.disabled = true;
    window.removeEventListener('deviceorientation', handleOrientation);
});
function handleOrientation(evt) {
    dOriAbs.innerHTML = `Absolute: ${evt.absolute}`;
    dOriAlpha.innerHTML = `Aplha: ${evt.alpha}`;
    dOriBeta.innerHTML = `Beta: ${evt.beta}`;
    dOriGamma.innerHTML = `Gamma: ${evt.gamma}`;
}

/* Device Motion API */
const startDmo = document.querySelector('.start-dmo');
const stopDmo = document.querySelector('.stop-dmo');
const dMotionAcc = document.querySelector('.device-motion-acc');
const dMotionAccG = document.querySelector('.device-motion-acc-g');
const dMotionRotation = document.querySelector('.device-motion-rotation');
const dMotionInterval = document.querySelector('.device-motion-interval');

startDmo.addEventListener('click', function() {
    startDmo.disabled = true;
    startDmo.disabled = false;
    window.addEventListener('devicemotion', handleMotion);
});
stopDmo.addEventListener('click', function() {
    startDmo.disabled = false;
    startDmo.disabled = true;
    window.removeEventListener('devicemotion', handleMotion);
});
function handleMotion(evt) {
    dMotionAcc.innerHTML = `Acceleration: X: ${evt.acceleration.x}, Y: ${evt.acceleration.y}, Z: ${evt.acceleration.z}`;
    dMotionAccG.innerHTML = `Acceleration with Gravity: X: ${evt.acceleration.x}, Y: ${evt.acceleration.y}, Z: ${evt.acceleration.z}`;
    dMotionRotation.innerHTML = `Rotation Rate: Alpha: ${evt.rotationRate.alpha}, Beta: ${evt.rotationRate.beta}, Gamma: ${evt.rotationRate.gamma}`;
    dMotionInterval.innerHTML = `Interval: ${evt.interval}`;
};

/* Vibration API */
const startVibrateSingle = document.querySelector('.start-vib-single');
const startVibrateMultiple = document.querySelector('.start-vib-multiple');
const startVibrateCustom = document.querySelector('.start-vib-custom');
const vibInput = document.querySelector('.input-vib');

const noVibSupport = document.querySelector('.no-vib');
startVibrateSingle.addEventListener('click', function() {
    if ('vibrate' in navigator) {
        noVibSupport.innerHTML = 'Supported';
        window.navigator.vibrate([200]);
    } else {
        noVibSupport.innerHTML = 'Not Supported';
    }
});
startVibrateMultiple.addEventListener('click', function() {
    if ('vibrate' in navigator) {
        noVibSupport.innerHTML = 'Supported';
        window.navigator.vibrate([200, 100, 200]);
    } else {
        noVibSupport.innerHTML = 'Not Supported';
    }
});
startVibrateCustom.addEventListener('click', function() {
    if ('vibrate' in navigator) {
        noVibSupport.innerHTML = 'Supported';
        const vibArray = vibInput.split(',');
        window.navigator.vibrate(vibArray);
    } else {
        noVibSupport.innerHTML = 'Not Supported';
    }
});
