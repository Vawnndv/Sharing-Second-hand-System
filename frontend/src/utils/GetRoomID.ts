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

export const convert = (input: any) => {
  const parts = input.split('-');
  const userID1 = parts[0] || null;
  const userID2 = parts[1] || null;
  const postID = parts[2] || null; // Nếu không có postID, gán là null

  return { userID1, userID2, postID };
};