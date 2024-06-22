import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { deleteUserAction, getAllUsersAction } from '../../../redux/actions/userActions'
import { styled } from '@mui/system'
import { AppDispatch, RootState, useAppDispatch } from '../../../redux/store'
import UserTable from '../components/tables/UserTable'
import { getUsersTotalService } from '../../../redux/services/userServices'

const StyledClassTable = styled('div')({
  transform: 'scale(0.9)',
  transformOrigin: 'top left',
  width: 'calc(100% / 0.9)'
})

function Users() {
  const dispatch: AppDispatch = useAppDispatch();

  const [selectionModel, setSelectionModel] = useState([])
  const [pageState, setPageState] = useState({
      page: 0,
      pageSize: 5
  });

  const [totalUser, setTotalUser] = useState(0);

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);

  const { isLoading, isError, users } = useSelector(
    (state: RootState) => state.adminGetAllUsers
  )

  const { isError: deleteError, isSuccess } = useSelector(
    (state: RootState) => state.adminDeleteUser
  )

  const getTotalUser = async () => {
    try {
      const total: number = await getUsersTotalService(filterModel);
      setTotalUser(total);
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Đã xảy ra lỗi kết nối mạng. Vui lòng thử lại sau.");
      }
    }
  }

  // useEffect
  useEffect(() => {
    getTotalUser();
  }, [filterModel])

   // useEffect
   useEffect(() => {
    dispatch(getAllUsersAction(pageState.page, pageState.pageSize, filterModel, sortModel))
    
    if (isError || deleteError) {
      toast.error(isError || deleteError)
      dispatch({ type: isError ? 'GET_ALL_USERS_RESET' : 'DELETE_USER_RESET' })
    }
  }, [pageState, sortModel, filterModel, isSuccess])
  
  // delete user handler
  const deleteUserHandler = (user: any) => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${  user.lastname}?`)) {
      dispatch(deleteUserAction(user.userid))
      setTotalUser(totalUser - 1);
    }
  }

  const handleDeleteSelectedRows = () => {
    const id = selectionModel.map((rowId: any) => rowId.toString()).join(',')
    // eslint-disable-next-line no-alert
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectionModel.length} người dùng này không ?` )) {
      dispatch(deleteUserAction(id))
      setTotalUser(totalUser - selectionModel.length);

    }
    setSelectionModel([])
  }

  return (
    <StyledClassTable>
      <UserTable 
        deleteHandler={deleteUserHandler} 
        isLoading={isLoading ?? false} 
        users={users ?? []} 
        total={totalUser} 
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
    </StyledClassTable>
  )
}

export default Users

