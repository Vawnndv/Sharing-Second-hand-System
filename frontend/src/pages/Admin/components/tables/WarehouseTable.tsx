/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react'
import { Avatar, Box, Grid, IconButton, Tooltip, Typography, Button } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar, gridClasses } from '@mui/x-data-grid'
import { grey } from '@mui/material/colors'
import { Add, Delete, Edit } from '@mui/icons-material'
// import { useSelector } from 'react-redux'
// import { RootState } from '../../../../redux/store'
import { DateFormat } from '../../../../components/notification/Empty'
import CustomNoRowsOverlay from './CustomNoRowsOverlay'
import { viVN } from '@mui/x-data-grid/locales';
// import ModalEditCollaborator from '../modals/ModelEditCollaborator'
// import { banUserService } from '../../../../redux/services/userServices'
// import toast from 'react-hot-toast'
// import { TbLock, TbLockOpen } from "react-icons/tb";
import ModalCreateWarehouse from '../modals/ModalCreateWarehouse'
import ModalEditWarehouse from '../modals/ModalEditWarehouse'
import { TbLock, TbLockOpen } from 'react-icons/tb'
import toast from 'react-hot-toast'
import { banUserService } from '../../../../redux/services/userServices'
import moment from 'moment'
import dayjs from 'dayjs'


interface Props {
  deleteHandler: (user: any) => void;
  isLoading: boolean;
  warehouses: any; 
  total: number;
  deleteSelectedHandler: () => void;
  selectionModel: any;
  setSelectionModel: (val: any) => void;
  pageState: any;
  filterModel: any;
  sortModel: any;
  setPageState: (val: any) => void;
  setFilterModel: (val: any) => void;
  setSortModel: (val: any) => void;
  isAddNewWarehouse: any;
  isUpdateWarehouse: any;
  setIsAddNewWarehouse: (val: any) => void;
  setIsUpdateWarehouse: (val: any) => void;
}

function WarehouseTable(props: Props) {
  const {deleteHandler, isLoading, warehouses, total, deleteSelectedHandler, selectionModel, setSelectionModel, pageState, setPageState, setFilterModel, setSortModel, filterModel, sortModel, isAddNewWarehouse, isUpdateWarehouse, setIsAddNewWarehouse, setIsUpdateWarehouse} = props;

  // const { userInfo } = useSelector(
  //   (state: RootState) => state.userLogin
  // );

  const [data, setData] = useState<any>([]); 
  const [isOpen, setIsOpen] = useState(false);
  const [warehouseRow, setWarehouseRow] = useState(null);
  const [isEdit, setIsEdit] = useState(true);
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);



  const handleOpen = () => {
    setIsOpen(!isOpen);
    // setIsUpdateWarehouse(true);
  }

  useEffect(() => {
  if(warehouses){
    setData(warehouses);
  }
  }, [warehouses]);
  
  const handleRowSelection = (newSelectionModel: any) => {
    setSelectionModel(newSelectionModel)
  }

  const handleOpenModalCreate = () => {
    setIsOpenModalCreate(!isOpenModalCreate);
    // setIsAddNewWarehouse(true);
  }
  
  const handleBanUser = async (id: number, isBanned: any) => {
    // try {
    //   await banUserService(id, {userId: id, isBanned});
    //   const userIndex = data.findIndex((user:any) => user.userid === id);
    //   if (userIndex !== -1) {
    //     const updatedUsers = [...data];
    //     updatedUsers[userIndex] = { ...updatedUsers[userIndex], isbanned: isBanned };
    //     // Create a new array with the user replaced with updated data
    //     setData(updatedUsers);
    //     toast.success(`Ban user successfully`);
    //   }
    // } catch (error: unknown) {
    //   console.log(error)
    //   if (error instanceof Error) {
    //     toast.error(error.message)
    //   } else {
    //     toast.error("Network Error");
    //   }
    // }
  }

  const columns: GridColDef<(typeof data)[number]>[] = useMemo(
    () => [
      {
        field: 'avatar',
        headerName: 'Ảnh',
        width: 60,
        renderCell: (params) => <Avatar src={params.value} />,
        sortable: false,
        filterable: false,
      }
      ,
      { field: 'warehousename', headerName: 'Tên kho', width: 150, getTooltip: (params: any) => params.value },
      { field: 'address', headerName: 'Địa chỉ', width: 700, getTooltip: (params: any) => params.value },
      { field: 'phonenumber', headerName: 'Số điện thoại', width: 150, getTooltip: (params: any) => params.value },
      { field: 'numberofemployees', headerName: 'Nhân viên', width: 100, getTooltip: (params: any) => params.value },
      // { field: 'address', headerName: 'Address', width: 250, getTooltip: (params: any) => params.value },
      {
        field: 'createdat',
        headerName: 'Ngày tạo',
        width: 150,
        renderCell: (params: any) =>
          dayjs(params.row.createdat).format('DD/MM/YYYY')      
      },
      // {
      //   field: 'isbanned',
      //   headerName: 'Ban',
      //   width: 100,
      //   type: 'boolean'
      // },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        width: 120,
        renderCell: (params: any) => (
          <Box>
            {/* <Tooltip title="Lock this warehouse">
              <IconButton onClick={() => {handleBanUser(params.row.userid, !params.row.isbanned) }}>
                {params.row.isbanned ? <TbLock /> : <TbLockOpen />}
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Cập nhật kho">
              <IconButton onClick={() => { handleOpen(); setWarehouseRow(params.row) }}>
                <Edit />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Delete this room">
              <IconButton
                // disabled={params.row.warehouseid === userInfo?.id}
                onClick={() => deleteHandler(params.row)}
              >
                <Delete />
              </IconButton>
            </Tooltip> */}
          </Box>
        )
      }
    ],
    [data]
  );

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ mt: 1, mb: 5, p: 4 }}
    >
        <ModalEditWarehouse
          isOpen={isOpen}
          handleOpen={handleOpen}
          warehouseRow={warehouseRow}
          setWarehouseRow={setWarehouseRow}
          setIsOpen={setIsOpen}
          pageState={pageState} 
          filterModel={filterModel}
          sortModel={sortModel}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          warehouseNameList={[]}
          isUpdateWarehouse= {isUpdateWarehouse}
          setIsUpdateWarehouse={setIsUpdateWarehouse}
        />
        <ModalCreateWarehouse
        isOpen={isOpenModalCreate}
        handleOpen={handleOpenModalCreate}
        setIsOpen={setIsOpenModalCreate}
        pageState={pageState} 
        filterModel={{ items: [] }}
        sortModel={[]}        
        isAddNewWarehouse= {isAddNewWarehouse}
        setIsAddNewWarehouse={setIsAddNewWarehouse}
        />
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <Typography
            variant='h3'
            component='h3'
            sx={{ textAlign: 'center', mt: 3, mb: 3 }}
          >
                Quản lý kho
          </Typography>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            {/* <Button startIcon={<Delete/>} sx={{ ml: 2 }} variant="contained" color="primary" onClick={deleteSelectedHandler} disabled={selectionModel.length === 0}>
                Delete selected rows
            </Button> */}
            <Button startIcon={<Add/>} sx={{ ml: 2 }} variant="contained" color="primary" onClick={handleOpenModalCreate}>
                Thêm 
            </Button>
          </Box>

          <DataGrid
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText} 
            autoHeight
            rows={data}
            columns={columns}
            rowCount={total}
            loading={isLoading}
            getRowId={(row) => row.warehouseid}
            // pagination
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            paginationModel={pageState}
            filterModel={filterModel}
            sortModel={sortModel}
            onPaginationModelChange={setPageState}
            onSortModelChange={setSortModel}
            onFilterModelChange={setFilterModel}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            getRowSpacing={(params: any) => ({
              top: params.isFirstVisible ? 0 : 1,
              bottom: params.isLastVisible ? 0 : 1
            })}
            sx={{
              [`& .${gridClasses.row}`]: {
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? grey[200] : grey[900]
              },
              '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
                'mt': '1em',
                'mb': '1em'
              }
            }}
            disableRowSelectionOnClick
            slots={{
              toolbar: GridToolbar,
              noRowsOverlay: CustomNoRowsOverlay

            }}
            // columnVisibilityModel={{
            //   teacherClasses: !isOpenMenu,
            //   studentClasses: !isOpenMenu
            // }}
            onRowSelectionModelChange={handleRowSelection}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default WarehouseTable;