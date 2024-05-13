import Axios from "../APIs/Axios";

// admin get warehouse list API call
const getWarehouseNameList = async () => {
    const { data } = await Axios.get(`/warehouse/warehouse-name-list`);
    console.log(data, '123');
    return data
};

export {
    getWarehouseNameList,
}