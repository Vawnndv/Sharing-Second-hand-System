export const getRoomId = (userID1: string, userID2: string) => {
  const sortedIDs = [userID1, userID2].sort();
  const roomID = sortedIDs.join('-');
  return roomID;
}

export const getRoomIdWithPost = (userID1: string, userID2: string, postID: string) => {
  const sortedIDs = [userID1, userID2].sort();
  // Combine sortedIDs with postID
  const roomID = `${sortedIDs.join('-')}-${postID}`;
  return roomID;
}
