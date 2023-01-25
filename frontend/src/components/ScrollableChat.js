import React from 'react'
import { OverlayTrigger, Tooltip, Image, Button, Overflow } from 'react-bootstrap'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../context/ChatProvider'
import "./ScrollableChat.css"


const ScrollableChat = ({ messages }) => {
  const { user } = ChatState()

  let swear = [
    'arse',
    'ass',
    'asshole',
    'bastard',
    'bitch',
    'bollocks',
    'bugger',
    'bullshit',
    'crap',
    'damn',
    'frigger',
    'fuck',
    'fucker',
    'shit',
  ]

  const swearCheck = (text) => {
    const foundSwears = swear.filter(word => text.toLowerCase().includes(word.toLowerCase()));
    if (foundSwears.length) {
      return "****"
    } else {
      return text
    }
  }

  return (
    <div className="overflow-auto">
      {messages && messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {(isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip id="button-tooltip-2">{m.sender.name}</Tooltip>}
              >
                {({ ref, ...triggerHandler }) => (
                  <Button
                    variant="light"
                    {...triggerHandler}
                    className="d-inline-flex align-items-center"
                    style={{ padding: "0", backgroundColor: "#E8E8E8", border: "none" }}
                  >
                    <Image
                      ref={ref}
                      roundedCircle
                      src={m.sender.picture}
                      width={30}
                      height={30}
                      alt={m.sender.name}
                    />
                  </Button>
                )}
              </OverlayTrigger>
            )}
          <span className={m.sender._id === user._id ? "otherUser" : "user"} style={{
            borderRadius: "20px",
            padding: "5px 15px",
            maxWidth: "75%",
            marginLeft: isSameSenderMargin(messages, m, i, user._id),
            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
          }}>
            {swearCheck(m.content)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default ScrollableChat