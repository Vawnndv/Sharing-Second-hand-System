/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-template */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WarehouseTable from '../Admin/components/tables/WarehouseTable';
import { AppDispatch, useAppDispatch, RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { deleteCollaboratorAction } from '../../redux/actions/collaboratorActions';


interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
  longitude: string;
  latitude: string;
  numberofemployees: number;
  avatar: string;
  createdat: string;
}


export default function ManageWarehouse() {
  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);

  const dispatch: AppDispatch = useAppDispatch();

  const [selectionModel, setSelectionModel] = useState([])
  const [pageState, setPageState] = useState({
      page: 0,
      pageSize: 5,
    });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);
  const [totalCollaborator, setTotalCollaborator] = useState(0);

  const { isLoading, isError, collaborators } = useSelector(
    (state: RootState) => state.adminGetAllCollaborators
  )

  const { isError: deleteError, isSuccess } = useSelector(
    (state: RootState) => state.adminDeleteCollaborator
  )

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/warehouse/getAllWarehousesAllInfo`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        // const count = res.data.wareHouses.length;
        // // eslint-disable-next-line prefer-const
        // let warehouseArray = [];
        // let temp = ''
        // for(let i = 0; i< count; i += 1){
        //   temp = '  ' + res.data.wareHouses[i].warehousename + ', ' + res.data.wareHouses[i].address;
        //   warehouseArray.push({
        //     value: temp,
        //     label: temp
        //   })
        // }
        console.log('AAaA',res.data.wareHouses);
        setWarehouses(res.data.wareHouses); // Cập nhật state với dữ liệu nhận được từ API

      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
  }
  fetchWarehouses();
  },[])

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
        warehouses={wareHouses ?? []} 
        total={wareHouses.length} 
        deleteSelectedHandler={handleDeleteSelectedRows} 
        selectionModel={selectionModel} 
        setSelectionModel={setSelectionModel} 
        pageState={pageState} 
        filterModel={filterModel}
        sortModel={sortModel}
        setPageState={setPageState} 
        setFilterModel={setFilterModel}
        setSortModel={setSortModel}
    />
)

}