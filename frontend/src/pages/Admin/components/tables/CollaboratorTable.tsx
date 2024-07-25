import { useEffect, useMemo, useState } from 'react'
import { Box, Grid, IconButton, Tooltip, Typography, Button } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar, getGridSingleSelectOperators, getGridStringOperators, gridClasses } from '@mui/x-data-grid'
import { grey } from '@mui/material/colors'
import { Add, Delete, Edit } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
// import { DateFormat } from '../../../../components/notification/Empty'
import CustomNoRowsOverlay from './CustomNoRowsOverlay'
import { viVN } from '@mui/x-data-grid/locales';
import ModalEditCollaborator from '../modals/ModelEditCollaborator'
import { banUserService } from '../../../../redux/services/userServices'
import toast from 'react-hot-toast'
import { TbLock, TbLockOpen } from "react-icons/tb";
import ModalCreateCollaborator from '../modals/ModelCreateCollaborator'
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AvatarComponent from '../../../../components/AvatarComponent'
// import { HandleNotification } from '../../../../utils/handleNotification'

interface Props {
  deleteHandler: (user: any) => void;
  isLoading: boolean;
  collaborators: any; 
  total: number;
  warehouseNameList: any;
  deleteSelectedHandler: () => void;
  selectionModel: any;
  setSelectionModel: (val: any) => void;
  pageState: any;
  filterModel: any;
  sortModel: any;
  setPageState: (val: any) => void;
  setFilterModel: (val: any) => void;
  setSortModel: (val: any) => void;
  setTotalCollaborator: (val: any) => void;
}

function CollaboratorTable(props: Props) {
  const {deleteHandler, isLoading, collaborators, total, warehouseNameList, deleteSelectedHandler, selectionModel, setSelectionModel, pageState, setPageState, setFilterModel, setSortModel, filterModel, sortModel, setTotalCollaborator} = props;

  const { userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const [data, setData] = useState<any>([]); 
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isBanLoading, setIsBanLoading] = useState(false);
  const [userRow, setUserRow] = useState(null);
  const [isEdit, setIsEdit] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setIsEdit(!isEdit);
  }

  
  const handleOpenModalCreate = () => {
    setIsOpenModalCreate(!isOpenModalCreate);
  }

  useEffect(() => {
    setData(collaborators);
  }, [collaborators]);
  
  const handleRowSelection = (newSelectionModel: any) => {
    setSelectionModel(newSelectionModel)
  }

  const handleOpenDialog = (user: any, isBanned: any) => {
    setSelectedUser({ ...user, isBanned });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };
  
  const handleConfirmBanUser = async () => {
    if (selectedUser) {
      handleClose();
      setIsBanLoading(true);
      try {
        const text = selectedUser.isBanned ? 'khóa' : 'mở khóa';
        await banUserService(selectedUser.userid, { userId: selectedUser.userid, isBanned: selectedUser.isBanned });
        const userIndex = data.findIndex((user: any) => user.userid === selectedUser.userid);
        if (userIndex !== -1) {
          const updatedUsers = [...data];
          updatedUsers[userIndex] = { ...updatedUsers[userIndex], isbanned: selectedUser.isBanned };
          setData(updatedUsers);
          toast.success(`${text} tài khoản của cộng tác viên ${selectedUser.lastname} ${selectedUser.firstname} thành công`);
          setIsBanLoading(false);
          //   await HandleNotification.sendNotification({
          //     userReceiverId: updatedUsers[userIndex].userid,
          //     userSendId: userInfo?.id,
          //     avatar: userInfo?.avatar,
          //     link: '',
          //     title: 'Khóa tài khoản',
          //     name: `${userInfo?.firstName} ${userInfo?.lastName}`,
          //     body: 'Tài khoản của bạn đã bị ban. Xin vui lòng liên hệ admin để xử lý',
          //   })
        }
      } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Lỗi mạng');
        }
        setIsBanLoading(false);
      }
    }
  };


  const columns: GridColDef<(typeof data)[number]>[] = useMemo(
    () => [
      {
        field: 'avatar',
        headerName: 'Ảnh',
        width: 60,
        renderCell: (params) => <AvatarComponent avatar={params.row.avatar} username={params.row.firstname ? params.row.firstname : params.row.email}/>,
        sortable: false,
        filterable: false,
      }
      ,
      { 
        field: 'lastname',
        headerName: 'Họ',
        width: 110,
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      { 
        field: 'firstname',
        headerName: 'Tên',
        width: 100,
        getTooltip: (params: any) => params.value,
        // filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      { 
        field: 'email',
        headerName: 'Email',
        width: 240,
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      { 
        field: 'dob',
        headerName: 'Ngày sinh',
        width: 95,
        getTooltip: (params: any) => params.value,
        renderCell: (params: any) => params.row.dob ? dayjs(params.row.dob).format('DD/MM/YYYY') : ''
      },   
      { 
        field: 'phonenumber',
        headerName: 'Số điện thoại',
        width: 110,
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      { 
        field: 'address',
        headerName: 'Địa chỉ',
        width: 250,
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      
      {
        field: 'createdat',  
        headerName: 'Ngày tạo',
        width: 95,
        renderCell: (params: any) => dayjs(params.row.createdat).format('DD/MM/YYYY')
      },
      { 
        field: 'warehousename',
        headerName: 'Kho làm việc',
        width: 100,
        getTooltip: (params: any) => params.value,
        filterOperators: getGridStringOperators().filter((operator) => operator.value === 'contains'),
      },
      {
        field: 'isbanned',
        headerName: 'Bị khóa',
        width: 70,
        type: "singleSelect",
        valueOptions: [
          { value: '', label: "Bất kì giá trị nào", defaultValue: true},
          { value: true, label: "Có" },
          { value: false, label: "Không" }
        ],
        filterOperators: getGridSingleSelectOperators().filter(operator => operator.value === 'is'),
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        width: 120,
        renderCell: (params: any) => (
          <Box>
            <Tooltip title="Khóa cộng tác viên">
              <IconButton onClick={() => handleOpenDialog(params.row, !params.row.isbanned)}>
                {params.row.isbanned ? <TbLock /> : <TbLockOpen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Cập nhật cộng tác viên">
              <IconButton disabled={params.row.id === userInfo?.id} onClick={() => { handleOpen(); setUserRow(params.row) }}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa cộng tác viên">
              <IconButton
                disabled={params.row.id === userInfo?.id}
                onClick={() => deleteHandler(params.row)}
              >
                <Delete />
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
        <ModalEditCollaborator
            isOpen={isOpen}
            handleOpen={handleOpen}
            userRow={userRow}
            setUserRow={setUserRow}
            setIsOpen={setIsOpen}
            pageState={pageState} 
            filterModel={filterModel}
            sortModel={sortModel}
            warehouseNameList={warehouseNameList}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
        />
        <ModalCreateCollaborator
            isOpen={isOpenModalCreate}
            handleOpen={handleOpenModalCreate}
            setIsOpen={setIsOpenModalCreate}
            pageState={pageState} 
            warehouseNameList={warehouseNameList}
            filterModel={{ items: [] }}
            sortModel={[]}
            totalCollaborator={total}
            setTotalCollaborator={setTotalCollaborator}
        />
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            // minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <Typography
            variant='h3'
            component='h3'
            sx={{ textAlign: 'center', mt: 3, mb: 3 }}
          >
            Quản lý cộng tác viên
          </Typography>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Button startIcon={<Delete/>} sx={{ ml: 2 }} variant="contained" color="primary" onClick={deleteSelectedHandler} disabled={selectionModel.length === 0}>
                Xóa các dòng đã chọn
            </Button>
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
            loading={isLoading || isBanLoading}
            getRowId={(row) => row.userid}
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
            // columnVisibilityModel={{
            //   teacherClasses: !isOpenMenu,
            //   studentClasses: !isOpenMenu
            // }}
            onRowSelectionModelChange={handleRowSelection}
          />
        </Box>
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {!selectedUser?.isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {!selectedUser?.isBanned
              ? `Bạn có chắc chắn muốn mở khóa tài khoản của Cộng tác viên ${selectedUser?.lastname} ${selectedUser?.firstname}?`
              : `Bạn có chắc chắn muốn khóa tài khoản của Cộng tác viên ${selectedUser?.lastname} ${selectedUser?.firstname}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color='error'>
            Không
          </Button>
          <Button onClick={handleConfirmBanUser} autoFocus>
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CollaboratorTable