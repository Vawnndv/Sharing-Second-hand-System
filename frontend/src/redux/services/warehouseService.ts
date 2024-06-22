import Axios from "../APIs/Axios";

// admin get warehouse list API call
const getWarehouseNameList = async () => {
    const { data } = await Axios.get(`/warehouse/warehouse-name-list`);
    return data
};

export {
    getWarehouseNameList,
}