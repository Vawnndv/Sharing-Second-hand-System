import { useEffect, useMemo, useState } from 'react'
import { Avatar, Box, Grid, IconButton, Tooltip, Typography, Button } from '@mui/material'
import { DataGrid, GridColDef, GridToolbar, gridClasses } from '@mui/x-data-grid'
import { grey } from '@mui/material/colors'
import { Delete, Edit } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/store'
import { DateFormat } from '../../../../components/notification/Empty'
import CustomNoRowsOverlay from './CustomNoRowsOverlay'
import { viVN } from '@mui/x-data-grid/locales';
import ModalEditCollaborator from '../modals/ModelEditCollaborator'
import { banUserService } from '../../../../redux/services/userServices'
import toast from 'react-hot-toast'
import { TbLock, TbLockOpen } from "react-icons/tb";

interface Props {
  deleteHandler: (user: any) => void;
  isLoading: boolean;
  collaborators: any; 
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

function CollaboratorTable(props: Props) {
  const {deleteHandler, isLoading, collaborators, total, deleteSelectedHandler, selectionModel, setSelectionModel, pageState, setPageState, setFilterModel, setSortModel, filterModel, sortModel} = props;

  const { userInfo } = useSelector(
    (state: RootState) => state.userLogin
  );

  const [data, setData] = useState<any>([]); 
  const [isOpen, setIsOpen] = useState(false);
  const [userRow, setUserRow] = useState(null);

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
  console.log(collaborators);
    setData(collaborators);
  console.log(data);
  }, [collaborators]);
  
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
        setData(updatedUsers);
        toast.success(`Ban user successfully`);
      }
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Network Error");
      }
    }
  }

  const columns: GridColDef<(typeof data)[number]>[] = useMemo(
    () => [
      {
        field: 'photoURL',
        headerName: 'Avatar',
        width: 60,
        renderCell: (params) => <Avatar src={params.row.image} />,
        sortable: false,
        filterable: false,
      }
      ,
      { field: 'firstname', headerName: 'First Name', width: 150, getTooltip: (params: any) => params.value },
      { field: 'lastname', headerName: 'Last Name', width: 150, getTooltip: (params: any) => params.value },
      { field: 'email', headerName: 'Email', width: 150, getTooltip: (params: any) => params.value },
      { field: 'phonenumber', headerName: 'Phone Number', width: 150, getTooltip: (params: any) => params.value },
      { field: 'address', headerName: 'Address', width: 250, getTooltip: (params: any) => params.value },
      {
        field: 'createdat',
        headerName: 'Created At',
        width: 150,
        renderCell: (params: any) =>
          DateFormat(params.row.createdat)
      },
      {
        field: 'isbanned',
        headerName: 'Ban',
        width: 100,
        type: 'boolean'
      },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        width: 120,
        renderCell: (params: any) => (
          <Box>
            <Tooltip title="Ban this user">
              <IconButton onClick={() => {handleBanUser(params.row.userid, !params.row.isbanned) }}>
                {params.row.isbanned ? <TbLock /> : <TbLockOpen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit this room">
              <IconButton disabled={params.row.id === userInfo?.id} onClick={() => { handleOpen(); setUserRow(params.row) }}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete this room">
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
                Manage Users
          </Typography>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Button startIcon={<Delete/>} sx={{ ml: 2 }} variant="contained" color="primary" onClick={deleteSelectedHandler} disabled={selectionModel.length === 0}>
                Delete selected rows
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

export default CollaboratorTable