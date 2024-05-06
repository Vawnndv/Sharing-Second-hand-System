import React from 'react';
import { useParams } from 'react-router-dom';

function ViewPostDetail() {
    const {postid}= useParams()
    return ( 
        <div>
            {postid}
        </div>
     );
}

export default ViewPostDetail;