import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import SideSearchBar from '../components/SideSearchBar'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

function Chat() {

  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideSearchBar />}
      <MDBContainer style={{ marginTop: "3%", maxWidth:"100%"}}>
          <MDBRow>
          <MDBCol size='md-4' style={{ marginBottom:"3%"}}>
            {user && <MyChats fetchAgain={fetchAgain} />}
            </MDBCol>
            <MDBCol size='md-8'>
              {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
    </div>
  )
}

export default Chat