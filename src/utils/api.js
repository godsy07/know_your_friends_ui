import axios from "axios";

const serverAPI = "http://localhost:5002/api";

export const getRoomExists = async(roomId) => {
    const response = await axios.get(`${serverAPI}/room-exists/${roomId}`);
    return response.data;
}