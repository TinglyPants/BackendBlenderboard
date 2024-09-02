const storeImage = async (buffer, desiredFilename) => {
    const formData = new FormData();
    formData.append("image", new Blob([buffer]));
    const mediaResponse = await fetch(
        "http://localhost:4000/media/image/create/" + desiredFilename,
        { method: "POST", body: formData }
    );
    if ((await mediaResponse.status) === 200) {
        return true;
    } else {
        return false;
    }
};

const storeVideo = async (buffer, desiredFilename) => {
    const formData = new FormData();
    formData.append("video", new Blob([buffer]));
    const mediaResponse = await fetch(
        "http://localhost:4000/media/video/create/" + desiredFilename,
        { method: "POST", body: formData }
    );
    if ((await mediaResponse.status) === 200) {
        return true;
    } else {
        return false;
    }
};

const storeModel = async (buffer, desiredFilename) => {
    const formData = new FormData();
    formData.append("model", new Blob([buffer]));
    const mediaResponse = await fetch(
        "http://localhost:4000/media/model/create/" + desiredFilename,
        { method: "POST", body: formData }
    );
    if ((await mediaResponse.status) === 200) {
        return true;
    } else {
        return false;
    }
};

module.exports = { storeImage, storeVideo, storeModel };
