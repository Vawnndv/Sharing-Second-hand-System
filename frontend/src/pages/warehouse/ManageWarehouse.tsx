/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-template */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WarehouseTable from '../Admin/components/tables/WarehouseTable';
import { AppDispatch, useAppDispatch, RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { deleteCollaboratorAction } from '../../redux/actions/collaboratorActions';
import Axios from '../../redux/APIs/Axios';


interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
  longitude: string;
  latitude: string;
  numberofemployees: number;
  avatar: string;
  createdat: string;
  isactivated: any;
}


export default function ManageWarehouse() {
  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);


  const dispatch: AppDispatch = useAppDispatch();
  const [isAddNewWarehouse, setIsAddNewWarehouse] = useState();
  const [isUpdateWarehouse, setIsUpdateWarehouse] = useState();

  const [selectionModel, setSelectionModel] = useState([])
  const [pageState, setPageState] = useState({
      page: 0,
      pageSize: 5,
    });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);
  const [totalWarehouses, setTotalWarehouses] = useState(0);


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true);
      try {
        const res: any = await Axios.post(`/warehouse/getAllWarehousesAllInfo`,{
          page: pageState.page,
          pageSize: pageState.pageSize,
          filterModel,
          sortModel
        })
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        setWarehouses(res.wareHouses); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        setIsLoading(false);

      }

      try {
        const res: any = await Axios.get(`/warehouse/admin`)
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        setTotalWarehouses(res.wareHouses.length); // Cập nhật state với dữ liệu nhận được từ API
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        setIsLoading(false);

      }
      setIsLoading(false);

    }
  fetchWarehouses();
  },[pageState,sortModel,filterModel,isAddNewWarehouse, isUpdateWarehouse])

    // delete user handler
  const deleteWarehouseHandler = (warehouse: any) => {
    if (window.confirm(`Are you sure you want to delete ?${  warehouse.warehousename}`)) {
      // dispatch(deleteCollaboratorAction(user.userid))
    }
  }

  const handleDeleteSelectedRows = () => {
    const id = selectionModel.map((rowId: any) => rowId.toString()).join(',')
    if (window.confirm(`Are you sure you want to delete ${selectionModel.length} warehouse?` )) {
      // dispatch(deleteCollaboratorAction(id))
    }
    setSelectionModel([])
  }


  return (
    <WarehouseTable 
        deleteHandler={deleteWarehouseHandler} 
        isLoading={isLoading ?? false} 
        setIsLoading={setIsLoading}
        warehouses={wareHouses ?? []} 
        total={totalWarehouses} 
        deleteSelectedHandler={handleDeleteSelectedRows} 
        selectionModel={selectionModel} 
        setSelectionModel={setSelectionModel} 
        pageState={pageState} 
        filterModel={filterModel}
        sortModel={sortModel}
        setPageState={setPageState} 
        setFilterModel={setFilterModel}
        setSortModel={setSortModel}
        isAddNewWarehouse = {isAddNewWarehouse}
        isUpdateWarehouse = {isUpdateWarehouse}
        setIsAddNewWarehouse={setIsAddNewWarehouse}
        setIsUpdateWarehouse={setIsUpdateWarehouse}
    />
)

}
