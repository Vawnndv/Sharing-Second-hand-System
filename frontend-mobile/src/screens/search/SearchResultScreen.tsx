import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ContainerComponent } from '../../components'
import CardSearchResult from './CardSearchResult'
import FilterSearch from './FilterSearch'

const data = [
  {
    "id": "1",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 1",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "John Doe",
    "distance": "2.5km",
    "addedRecently": true
  },
  {
    "id": "2",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 2",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Jane Smith",
    "distance": "1.8km",
    "addedRecently": false
  },
  {
    "id": "3",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 3",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Alice Johnson",
    "distance": "3.2km",
    "addedRecently": true
  },
  {
    "id": "4",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 4",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Bob Brown",
    "distance": "2.1km",
    "addedRecently": false
  },
  {
    "id": "5",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 5",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Emma Wilson",
    "distance": "4.5km",
    "addedRecently": true
  },
  {
    "id": "6",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 6",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "David Taylor",
    "distance": "2.9km",
    "addedRecently": false
  },
  {
    "id": "7",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 7",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Olivia Brown",
    "distance": "3.8km",
    "addedRecently": true
  },
  {
    "id": "8",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 8",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Michael Johnson",
    "distance": "1.3km",
    "addedRecently": false
  },
  {
    "id": "9",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 9",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Sophia Lee",
    "distance": "5.0km",
    "addedRecently": true
  },
  {
    "id": "10",
    "imageUri": "https://source.unsplash.com/random",
    "title": "Product 10",
    "authorAvatarUri": "https://source.unsplash.com/random",
    "authorName": "Matthew Wilson",
    "distance": "2.7km",
    "addedRecently": false
  }
]


const SearchResultScreen = ({ route } : any) => {
  const { searchQuery } = route.params;

  return (
    <ContainerComponent back>
      <FilterSearch/>
      <CardSearchResult data={data}/>
    </ContainerComponent>
  )
}

export default SearchResultScreen

const styles = StyleSheet.create({})