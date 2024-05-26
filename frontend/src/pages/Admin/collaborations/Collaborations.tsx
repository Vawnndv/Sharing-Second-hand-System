import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { deleteCollaboratorAction, getAllCollaboratorsAction } from '../../../redux/actions/collaboratorActions'
import { AppDispatch, RootState, useAppDispatch } from '../../../redux/store'
import CollaboratorTable from '../components/tables/CollaboratorTable'
import { getCollaboratorsTotalService } from '../../../redux/services/collaboratorServices'
import { styled } from '@mui/material/styles'
import { getWarehouseNameList } from '../../../redux/services/warehouseService'


const StyledClassTable = styled('div')({
    transform: 'scale(0.9)',
    transformOrigin: 'top left',
    width: 'calc(100% / 0.9)'
  })
  
function Collaborators() {
    const dispatch: AppDispatch = useAppDispatch();

    const [selectionModel, setSelectionModel] = useState([])
    const [pageState, setPageState] = useState({
        page: 0,
        pageSize: 5,
      });
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [sortModel, setSortModel] = useState([]);
    const [totalCollaborator, setTotalCollaborator] = useState(0);
    const [warehouseNameList, setWarehouseNameList] = useState([]);


  const { isLoading, isError, collaborators } = useSelector(
    (state: RootState) => state.adminGetAllCollaborators
  )

  const { isError: deleteError, isSuccess} = useSelector(
    (state: RootState) => state.adminDeleteCollaborator
  )

  const getTotalCollaborator = async () => {
    try {
      const total: number = await getCollaboratorsTotalService(filterModel);
      setTotalCollaborator(total);
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Network Error");
      }
    }
  }

  const adminGetWarehouseNameList = async () => {
    try {
      const res: any = await getWarehouseNameList();
      setWarehouseNameList(res.warehouseList);
    //   setWarehouseNameList(res.warehouseList);

    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log("Network Error");
      }
    }
  }

  // useEffect
  useEffect(() => {
    getTotalCollaborator();
    adminGetWarehouseNameList();
  }, [filterModel])

   // useEffect
   useEffect(() => {
    dispatch(getAllCollaboratorsAction(pageState.page, pageState.pageSize, filterModel, sortModel))

    if (isError || deleteError) {
      toast.error(isError || deleteError)
      dispatch({ type: isError ? 'GET_ALL_COLLABORATORS_RESET' : 'DELETE_COLLABORATORS_RESET' })
    }
    console.log(pageState)
  }, [dispatch, pageState, sortModel, filterModel, isSuccess])
  
   // delete user handler
   const deleteUserHandler = (user: any) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cộng tác viên ${user.lastname}?`)) {
      dispatch(deleteCollaboratorAction(user.userid))
      setTotalCollaborator(totalCollaborator - 1);
    }
  }

  const handleDeleteSelectedRows = () => {
    const id = selectionModel.map((rowId: any) => rowId.toString()).join(',')
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectionModel.length} cộng tac viên này không?` )) {
        dispatch(deleteCollaboratorAction(id))
        setTotalCollaborator(totalCollaborator - selectionModel.length)
    }
    setSelectionModel([])
  }

  return (
    <StyledClassTable>
        <CollaboratorTable 
            deleteHandler={deleteUserHandler} 
            isLoading={isLoading ?? false} 
            collaborators={collaborators ?? []} 
            total={totalCollaborator} 
            deleteSelectedHandler={handleDeleteSelectedRows} 
            selectionModel={selectionModel} 
            setSelectionModel={setSelectionModel} 
            pageState={pageState} 
            filterModel={filterModel}
            sortModel={sortModel}
            setPageState={setPageState} 
            setFilterModel={setFilterModel}
            setSortModel={setSortModel}
            warehouseNameList={warehouseNameList}
            setTotalCollaborator={setTotalCollaborator}
        />
    </StyledClassTable>
  )
}

export default Collaborators

