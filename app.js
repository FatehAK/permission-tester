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
if ('mediaDevices' in navigator) {
    noCamSupport.innerHTML = 'Supported'
    navigator.mediaDevices.getUserMedia(videoConstraints).then((stream) => {
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
const noGyroSupport = document.querySelector('.no-gyro');
const gyroX = document.querySelector('.gyro-x');
const gyroY = document.querySelector('.gyro-y');
const gyroZ = document.querySelector('.gyro-z');
if ('Gyroscope' in window) {
    noGyroSupport.innerHTML = 'Supported';
    const gyro = new Gyroscope();
    gyro.start();
    gyro.onreading = () => {
        gyroX.innerHTML = `Angular Velocity X: ${gyro.x}`;
        gyroY.innerHTML = `Angular Velocity Y: ${gyro.y}`;
        gyroZ.innerHTML = `Angular Velocity Z: ${gyro.z}`;
    };
    gyro.onerror = () => {
        noGyroSupport.innerHTML = 'Not Supported';
    }
} else {
    noGyroSupport.innerHTML = 'Not Supported';
}

/* accelerometer */
const noAccSupport = document.querySelector('.no-acc');
const accX = document.querySelector('.acc-x');
const accY = document.querySelector('.acc-y');
const accZ = document.querySelector('.acc-z');
if ('Accelerometer' in window) {
    noAccSupport.innerHTML = 'Supported';
    const acc = new Accelerometer({ referenceFrame: 'device' });
    acc.start();
    acc.onreading = () => {
        accX.innerHTML = `Acceleration X: ${acc.x}`;
        accY.innerHTML = `Acceleration Y: ${acc.y}`;
        accZ.innerHTML = `Acceleration Z: ${acc.z}`;
    };
    acc.onerror = () => {
        noAccSupport.innerHTML = 'Not Supported';
    }
} else {
    noAccSupport.innerHTML = 'Not Supported';
}

/* orientation sensor */
const noOriSupport = document.querySelector('.no-ori');
const oriText = document.querySelector('.ori-text');
if ('AbsoluteOrientationSensor' in window) {
    noOriSupport.innerHTML = 'Supported';
    const ori = new AbsoluteOrientationSensor();
    ori.start();
    ori.onreading = () => {
        oriText.innerHTML = `Orientation Quats: ${ori.quaternion}`;
    };
    ori.onerror = () => {
        noOriSupport.innerHTML = 'Not Supported';
    }
} else {
    noOriSupport.innerHTML = 'Not Supported';
}

/* Device Orientation API */
const dOriAbs = document.querySelector('.device-ori-abs');
const dOriAlpha = document.querySelector('.device-ori-alpha');
const dOriBeta = document.querySelector('.device-ori-beta');
const dOriGamma = document.querySelector('.device-ori-gamma');
window.addEventListener('deviceorientation', function(evt) {
    dOriAbs.innerHTML = `Absolute: ${evt.absolute}`;
    dOriAlpha.innerHTML = `Aplha: ${evt.alpha}`;
    dOriBeta.innerHTML = `Beta: ${evt.beta}`;
    dOriGamma.innerHTML = `Gamma: ${evt.gamma}`;
});

/* Device Motion API */
const dMotionAcc = document.querySelector('.device-motion-acc');
const dMotionAccG = document.querySelector('.device-motion-acc-g');
const dMotionRotation = document.querySelector('.device-motion-rotation');
const dMotionInterval = document.querySelector('.device-motion-interval');
window.addEventListener('devicemotion', function(evt) {
    dMotionAcc.innerHTML = `Acceleration: X: ${evt.acceleration.x}, Y: ${evt.acceleration.y}, Z: ${evt.acceleration.z}`;
    dMotionAccG.innerHTML = `Acceleration with Gravity: X: ${evt.acceleration.x}, Y: ${evt.acceleration.y}, Z: ${evt.acceleration.z}`;
    dMotionRotation.innerHTML = `Rotation Rate: Alpha: ${evt.rotationRate.alpha}, Beta: ${evt.rotationRate.beta}, Gamma: ${evt.rotationRate.gamma}`;
    dMotionInterval.innerHTML = `Interval: ${evt.interval}`;
}, true);
