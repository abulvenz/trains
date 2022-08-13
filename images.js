import smokeImageFilename from 'url:./images/smoke.png';

const smokeImage = new Image();
smokeImage.src = smokeImageFilename;

export default Object.freeze({
    smokeImage,
});