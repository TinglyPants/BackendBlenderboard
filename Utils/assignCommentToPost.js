require("dotenv").config();

const assignCommentToPost = async (commentID, postID) => {
    const formData = new FormData();
    formData.append("serverSecret", process.env.SERVER_SECRET);
    formData.append("commentID", commentID);
    const postResponse = await fetch(
        `http://localhost:4000/posts/add-comment/${postID}`,
        { method: "POST", body: formData }
    );
    if ((await postResponse.status) === 200) {
        return true;
    } else {
        return false;
    }
};

module.exports = { assignCommentToPost };
