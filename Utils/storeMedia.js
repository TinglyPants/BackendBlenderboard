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

const storeVideo = (buffer, desiredFilename) => {};

module.exports = { storeImage };
