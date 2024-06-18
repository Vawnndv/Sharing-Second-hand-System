import { useEffect, useMemo, useState } from 'react'
import { Avatar, Box, Grid, IconButton, Tooltip, Typography, Button } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar, gridClasses } from '@mui/x-data-grid'
import { grey } from '@mui/material/colors'
import { Delete } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
// import { DateFormat } from '../../../../components/notification/Empty'
import { TbLock, TbLockOpen } from "react-icons/tb";
import CustomNoRowsOverlay from './CustomNoRowsOverlay'
import { viVN } from '@mui/x-data-grid/locales';
import { banUserService } from '../../../../redux/services/userServices'
import toast from 'react-hot-toast'
import dayjs from 'dayjs';
import { HandleNotification } from '../../../../utils/handleNotification'

interface Props {
  deleteHandler: (user: any) => void;
  isLoading: boolean;
  users: any; 
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
}

function UserTable(props: Props) {
  const {deleteHandler, isLoading, users, total, deleteSelectedHandler, selectionModel, setSelectionModel, pageState, setPageState, setFilterModel, setSortModel, filterModel, sortModel} = props;

  const { userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  console.log(userInfo)
  const [data, setData] = useState<any>([]); 

  useEffect(() => {
    setData(users);
  }, [users]);

  const handleRowSelection = (newSelectionModel: any) => {
    setSelectionModel(newSelectionModel)
  }

  const handleBanUser = async (id: number, isBanned: any) => {
    try {
      await banUserService(id, {userId: id, isBanned});
      const userIndex = data.findIndex((user:any) => user.userid === id);
      if (userIndex !== -1) {
        const updatedUsers = [...data];
        updatedUsers[userIndex] = { ...updatedUsers[userIndex], isbanned: isBanned };
        // Create a new array with the user replaced with updated data
        console.log(updatedUsers[userIndex], '12313');
        setData(updatedUsers);
        await HandleNotification.sendNotification({
          userReceiverId: updatedUsers[userIndex].userid,
          userSendId: userInfo?.id,
          postid: '',
          avatar: userInfo?.avatar,
          link: '',
          title: 'ban acc',
          name: `${userInfo?.firstName} ${userInfo?.lastName}`,
          body: 'Tài khoảng của bạn đã bị ban. Xin vui lòng liên hệ admin để xử lý',
        })
        toast.success(`Khóa tài khoản của người dùng thành công`);
      }
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Lỗi mạng");
      }
    }
  }

  const columns: GridColDef<(typeof data)[number]>[] = useMemo(
    () => [
      {
        field: 'avatar',
        headerName: 'Hình đại diện',
        width: 60,
        renderCell: (params) => <Avatar src={params.row.avatar} />,
        sortable: false,
        filterable: false,
      }
      ,
      { field: 'lastname', headerName: 'Họ', width: 150, getTooltip: (params: any) => params.value },
      { field: 'firstname', headerName: 'Tên', width: 150, getTooltip: (params: any) => params.value },
      { field: 'email', headerName: 'Email', width: 150, getTooltip: (params: any) => params.value },
      { field: 'dob', headerName: 'Ngày sinh', width: 100, getTooltip: (params: any) => params.value,  renderCell: (params: any) =>
        params.row.dob ? dayjs(params.row.dob).format('DD/MM/YYYY') : ''
      },
      { field: 'phonenumber', headerName: 'Số điện thoại', width: 150, getTooltip: (params: any) => params.value },
      { field: 'address', headerName: 'Địa chỉ', width: 250, getTooltip: (params: any) => params.value },
      {
        field: 'createdat',
        headerName: 'Ngày tạo',
        width: 150,
        renderCell: (params: any) =>
          dayjs(params.row.createdat).format('DD/MM/YYYY')
      },
      {
        field: 'isbanned',
        headerName: 'Bị khóa',
        width: 100,
        type: 'boolean'
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        width: 120,
        renderCell: (params: any) => (
          <Box>
            <Tooltip title="Khóa người dùng">
              <IconButton onClick={() => {handleBanUser(params.row.userid, !params.row.isbanned) }}>
                {params.row.isbanned ? <TbLock /> : <TbLockOpen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Xóa người dùng">
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
      <Grid item xs={12}>
        <Box
          sx={{
            width: '99.99%',
            minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <Typography
            variant='h3'
            component='h3'
            sx={{ textAlign: 'center', mt: 3, mb: 3 }}
          >
            Quản lý người dùng
          </Typography>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Button startIcon={<Delete/>} sx={{ ml: 2 }} variant="contained" color="primary" onClick={deleteSelectedHandler} disabled={selectionModel.length === 0}>
              Xóa các dòng đã chọn
            </Button>
          </Box>

          <DataGrid
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText} 
            autoHeight
            rows={data}
            columns={columns}
            rowCount={total}
            loading={isLoading}
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

export default UserTable