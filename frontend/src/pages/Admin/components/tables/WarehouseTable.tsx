/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react'
import { Avatar, Box, Grid, IconButton, Tooltip, Typography, Button, Dialog, useMediaQuery, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar, getGridSingleSelectOperators, getGridStringOperators, gridClasses } from '@mui/x-data-grid'
import { grey } from '@mui/material/colors'
import { Add, Delete, Edit } from '@mui/icons-material'
import { DateFormat } from '../../../../components/notification/Empty'
import CustomNoRowsOverlay from './CustomNoRowsOverlay'
import { viVN } from '@mui/x-data-grid/locales';
import ModalCreateWarehouse from '../modals/ModalCreateWarehouse'
import ModalEditWarehouse from '../modals/ModalEditWarehouse'
import { TbLock, TbLockOpen } from 'react-icons/tb'
import toast from 'react-hot-toast'
import { banUserService } from '../../../../redux/services/userServices'
import moment from 'moment'
import dayjs from 'dayjs'
import Axios from '../../../../redux/APIs/Axios'
import theme from '../../../../theme'


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
  setIsLoading: (val: any) => void;
}

function WarehouseTable(props: Props) {
  const {deleteHandler, isLoading, warehouses, total, deleteSelectedHandler, selectionModel, setSelectionModel, pageState, setPageState, setFilterModel, setSortModel, filterModel, sortModel, isAddNewWarehouse, isUpdateWarehouse, setIsAddNewWarehouse, setIsUpdateWarehouse, setIsLoading} = props;



  const [data, setData] = useState<any>([]); 
  const [isOpen, setIsOpen] = useState(false);
  const [warehouseRow, setWarehouseRow] = useState<any>(null);
  const [isEdit, setIsEdit] = useState(true);
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);



  const handleOpen = () => {
    setIsOpen(!isOpen);
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
  }

  const handleOpenDialog = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  
  const handleLockWarehouse = async () => {
    if(selectedWarehouse){
      setIsLoading(true);
      const warehouseid = selectedWarehouse.warehouseid;
      const status = !selectedWarehouse.isactivated;
      try{
        const res = await Axios.post(`/warehouse/updateWarehouseStatus`, {
          warehouseid,
          status
        });
        const warehouseIndex = data.findIndex((warehouse:any) => warehouse.warehouseid === warehouseid);
        if (warehouseIndex !== -1) {
          const updatedWarehouse = [...data];
          updatedWarehouse[warehouseIndex] = { ...updatedWarehouse[warehouseIndex], isactivated: status };
          setData(updatedWarehouse);
          toast.success(`Cập nhật trạng thái kho thành công`);
        }
      } catch(error: any){
        toast.error(`Lỗi khi cập nhật trạng thái kho `, error);
        setOpenDialog(false);
        setIsLoading(false);
      }
      setOpenDialog(false);
      setIsLoading(false);
    }

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
      { field: 'warehousename', 
        headerName: 'Tên kho', 
        width: 200, 
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      { field: 'address',
         headerName: 'Địa chỉ', 
         width: 450, 
         getTooltip: (params: any) => params.value,
         filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
        },
      { field: 'phonenumber', 
        headerName: 'Số điện thoại', 
        width: 150, 
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      { field: 'numberofemployees', 
        headerName: 'Nhân viên', 
        width: 100, 
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter(operator => operator.value === 'contains'),
      },
      {
        field: 'createdat',
        headerName: 'Ngày tạo',
        width: 150,
        renderCell: (params: any) =>
          dayjs(params.row.createdat).format('DD/MM/YYYY')      
      },
      {
        field: 'isactivated',
        headerName: 'Tình trạng',
        width: 150,
        type: "singleSelect",
        valueOptions: [
          { value: '', label: "Bất kì giá trị nào", defaultValue: true},
          { value: true, label: "Hoạt động" },
          { value: false, label: "Ngưng hoạt động" }
        ],
        filterOperators: getGridSingleSelectOperators().filter(operator => operator.value === 'is'),
        renderCell: (params: any) =>(
          <Box sx={{
            width: '100%',
            height: '100%',
            alignContent: 'center',
          }}>
            {params.row.isactivated ? (
              <Tooltip title="Trạng thái kho" style={{color: 'green', fontSize: '15px'}} >
                <Typography>
                    Hoạt động
                </Typography>
                </Tooltip>
            ) : (
              <Tooltip title="Trạng thái kho" style={{color: 'grey', fontSize: '15px'}}> 
                <Typography>
                    Ngưng hoạt động
                </Typography>
              </Tooltip>

            )}
          </Box>  
        )
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        width: 120,
        renderCell: (params: any) => (
          <Box>
            <Tooltip title="Cập nhật trạng thái kho">
              <IconButton onClick={() => {handleOpenDialog(params.row)}}>
                {!params.row.isactivated ? <TbLock /> : <TbLockOpen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Cập nhật kho">
              <IconButton onClick={() => { handleOpen(); setWarehouseRow(params.row) }}>
                <Edit />
              </IconButton>
            </Tooltip>
            
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
            getRowSpacing={(params: any) => ({
              top: params.isFirstVisible ? 0 : 1,
              bottom: params.isLastVisible ? 0 : 1
            })}
            sx={{
              [`& .${gridClasses.row}`]: {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? grey[200] : grey[900]
              },
              '.MuiDataGrid-cell': {
                alignContent: 'center',
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
            onRowSelectionModelChange={handleRowSelection}
          />
        </Box>
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        open={isOpenDialog}
        onClose={handleCloseDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {!selectedWarehouse?.isactivated ? 'Mở khóa tài khoản' : 'Khóa tài khoản '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {!selectedWarehouse?.isactivated
              ? `Bạn có chắc chắn muốn kho ${selectedWarehouse?.warehousename} hoạt động lại ?`
              : `Bạn có chắc chắn muốn kho  ${selectedWarehouse?.warehousename} ngưng hoạt động ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog} color='error'>
            Không
          </Button>
          <Button onClick={handleLockWarehouse} autoFocus>
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default WarehouseTable;