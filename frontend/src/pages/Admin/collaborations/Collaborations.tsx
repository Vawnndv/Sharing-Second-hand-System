import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { deleteCollaboratorAction, getAllCollaboratorsAction } from '../../../redux/actions/collaboratorActions'
import { AppDispatch, RootState, useAppDispatch } from '../../../redux/store'
import CollaboratorTable from '../components/tables/CollaboratorTable'
import { getCollaboratorsTotalService } from '../../../redux/services/collaboratorServices'

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

  const { isLoading, isError, collaborators } = useSelector(
    (state: RootState) => state.adminGetAllCollaborators
  )

  const { isError: deleteError, isSuccess } = useSelector(
    (state: RootState) => state.adminDeleteCollaborator
  )

  const getTotalCollaborator = async () => {
    try {
      const total: number = await getCollaboratorsTotalService(filterModel);
      setTotalCollaborator(total);
        console.log(total)
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Network Error");
      }
    }
  }

  // useEffect
  useEffect(() => {
    getTotalCollaborator();
  }, [filterModel, isSuccess])

   // useEffect
   useEffect(() => {
    dispatch(getAllCollaboratorsAction(pageState.page, pageState.pageSize, filterModel, sortModel))

    if (isError || deleteError) {
      toast.error(isError || deleteError)
      dispatch({ type: isError ? 'GET_ALL_COLLABORATORS_RESET' : 'DELETE_COLLABORATORS_RESET' })
    }
    console.log(pageState)
  }, [pageState, sortModel, filterModel, isSuccess])
  
   // delete user handler
   const deleteUserHandler = (user: any) => {
    if (window.confirm(`Are you sure you want to delete ?${  user.firstname}`)) {
      dispatch(deleteCollaboratorAction(user.userid))
    }
  }

  const handleDeleteSelectedRows = () => {
    const id = selectionModel.map((rowId: any) => rowId.toString()).join(',')
    if (window.confirm(`Are you sure you want to delete ${selectionModel.length} users?` )) {
      dispatch(deleteCollaboratorAction(id))
    }
    setSelectionModel([])
  }

  return (
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
        />
  )
}

export default Collaborators

