// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Store & Actions Imports
import { selectChat, removeSelectedChat } from 'src/store/apps/chat'

// ** Types
import { StatusObjType, StatusType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'
import { formatDateToMonthShort } from 'src/@core/utils/format'

// ** Chat App Components Imports
import SidebarLeft from 'src/views/chat/SidebarLeft'
import ChatContent from 'src/views/chat/ChatContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { ChivesChatInput, ChivesChatOutput } from 'src/functions/ChivesChat'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()

  // ** States
  const [userStatus, setUserStatus] = useState<StatusType>('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [store, setStore] = useState<any>(null)
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')
  const [sendInputText, setSendInputText] = useState<string>('')

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  useEffect(() => {
    const ChivesChatText = window.localStorage.getItem("ChivesChat")      
    const ChivesChatList = ChivesChatText ? JSON.parse(ChivesChatText) : []
    console.log("refreshChatCounter", refreshChatCounter)
    const selectedChat = {
      "chat": {
          "id": 1,
          "userId": 1,
          "unseenMsgs": 0,
          "chat": ChivesChatList
      },
      "contact": {
          "id": 1,
          "fullName": "AI 助手",
          "role": "行业知识库",
          "about": "您可以训练自己的行业知识库",
          "avatar": "/images/avatars/2.png",
          "status": "online",
          "chat": {
              "id": 1,
              "unseenMsgs": 0,
              "lastMessage": {
                  "senderId": 11,
                  "time": "2024-01-18T02:08:26.411Z",
                  "message": "4",
                  "feedback": {
                      "isSent": true,
                      "isSeen": false,
                      "isDelivered": false
                  }
              }
          }
      }
    }
    const storeInit = {
      "chats": [
          {
              "id": 1,
              "fullName": "Felecia Rower",
              "role": "Frontend Developer",
              "about": "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
              "avatar": "/images/avatars/2.png",
              "status": "offline",
              "chat": {
                  "id": 1,
                  "unseenMsgs": 1,
                  "lastMessage": {
                      "message": "I will purchase it for sure. 👍",
                      "time": "2024-01-17T01:59:40.988Z",
                      "senderId": 1,
                      "feedback": {
                          "isSent": true,
                          "isDelivered": true,
                          "isSeen": true
                      }
                  }
              }
          },
          {
              "id": 2,
              "fullName": "Adalberto Granzin",
              "role": "UI/UX Designer",
              "avatarColor": "primary",
              "about": "Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.",
              "status": "busy",
              "chat": {
                  "id": 2,
                  "unseenMsgs": 0,
                  "lastMessage": {
                      "message": "If it takes long you can mail me at my mail address.",
                      "time": "2024-01-16T01:59:40.988Z",
                      "senderId": 11,
                      "feedback": {
                          "isSent": true,
                          "isDelivered": false,
                          "isSeen": false
                      }
                  }
              }
          }
      ],
      "contacts": [
          {
              "id": 3,
              "fullName": "Joaquina Weisenborn",
              "role": "Town planner",
              "about": "Soufflé soufflé caramels sweet roll. Jelly lollipop sesame snaps bear claw jelly beans sugar plum sugar plum.",
              "avatar": "/images/avatars/8.png",
              "status": "busy"
          },
          {
              "id": 4,
              "fullName": "Verla Morgano",
              "role": "Data scientist",
              "about": "Chupa chups candy canes chocolate bar marshmallow liquorice muffin. Lemon drops oat cake tart liquorice tart cookie. Jelly-o cookie tootsie roll halvah.",
              "avatar": "/images/avatars/3.png",
              "status": "online"
          },
          {
              "id": 5,
              "fullName": "Margot Henschke",
              "role": "Dietitian",
              "avatarColor": "success",
              "about": "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
              "status": "busy"
          },
          {
              "id": 6,
              "fullName": "Sal Piggee",
              "role": "Marketing executive",
              "about": "Toffee caramels jelly-o tart gummi bears cake I love ice cream lollipop. Sweet liquorice croissant candy danish dessert icing. Cake macaroon gingerbread toffee sweet.",
              "avatar": "/images/avatars/5.png",
              "status": "online"
          },
          {
              "id": 7,
              "fullName": "Miguel Guelff",
              "role": "Special educational needs teacher",
              "about": "Biscuit powder oat cake donut brownie ice cream I love soufflé. I love tootsie roll I love powder tootsie roll.",
              "avatar": "/images/avatars/7.png",
              "status": "online"
          },
          {
              "id": 8,
              "fullName": "Mauro Elenbaas",
              "role": "Advertising copywriter",
              "about": "Bear claw ice cream lollipop gingerbread carrot cake. Brownie gummi bears chocolate muffin croissant jelly I love marzipan wafer.",
              "avatar": "/images/avatars/6.png",
              "status": "away"
          },
          {
              "id": 9,
              "avatarColor": "warning",
              "fullName": "Bridgett Omohundro",
              "role": "Designer, television/film set",
              "about": "Gummies gummi bears I love candy icing apple pie I love marzipan bear claw. I love tart biscuit I love candy canes pudding chupa chups liquorice croissant.",
              "status": "offline"
          },
          {
              "id": 10,
              "avatarColor": "error",
              "fullName": "Zenia Jacobs",
              "role": "Building surveyor",
              "about": "Cake pie jelly jelly beans. Marzipan lemon drops halvah cake. Pudding cookie lemon drops icing",
              "status": "away"
          }
      ],
      "userProfile": {
          "id": 11,
          "avatar": "/images/avatars/1.png",
          "fullName": "John Doe",
          "role": "admin",
          "about": "Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.",
          "status": "online",
          "settings": {
              "isTwoStepAuthVerificationEnabled": true,
              "isNotificationsOn": false
          }
      },
      "selectedChat": selectedChat
      }
    setStore(storeInit)
    
  }, [refreshChatCounter])

  useEffect(() => {
    setSendButtonText(t("Send") as string)
    setSendInputText(t("Type your message here...") as string)    
  }, [])

  

  const sendMsg = async (Obj: any) => {
    setSendButtonDisable(true)
    setSendButtonText(t("Sending") as string)
    setSendInputText(t("Generating the answer...") as string)
    ChivesChatInput(Obj.message, 11)
    setRefreshChatCounter(refreshChatCounter + 1)
    const ChivesChatOutputStatus = await ChivesChatOutput(Obj.message, 1)
    if(ChivesChatOutputStatus) {
      setSendButtonDisable(false)
      setRefreshChatCounter(refreshChatCounter + 2)
      setSendButtonText(t("Send") as string)
      setSendInputText(t("Type your message here...") as string)  
      //console.log("ChivesChatList", store.selectedChat.chat.chat)
    }
  }

  // ** Vars
  const { skin } = settings
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 300 : 250
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const statusObj: StatusObjType = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)

  return (
    <Box
      className='app-chat'
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        mdAbove={mdAbove}
        statusObj={statusObj}
        userStatus={userStatus}
        selectChat={selectChat}
        getInitials={getInitials}
        sidebarWidth={sidebarWidth}
        setUserStatus={setUserStatus}
        leftSidebarOpen={leftSidebarOpen}
        removeSelectedChat={removeSelectedChat}
        userProfileLeftOpen={userProfileLeftOpen}
        formatDateToMonthShort={formatDateToMonthShort}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
      <ChatContent
        store={store}
        hidden={hidden}
        sendMsg={sendMsg}
        mdAbove={mdAbove}
        statusObj={statusObj}
        getInitials={getInitials}
        sidebarWidth={sidebarWidth}
        userProfileRightOpen={userProfileRightOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
        refreshChatCounter={refreshChatCounter}
        sendButtonDisable={sendButtonDisable}
        sendButtonText={sendButtonText}
        sendInputText={sendInputText}
      />
    </Box>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
