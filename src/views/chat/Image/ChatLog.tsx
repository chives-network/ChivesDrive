// ** React Imports
import { useRef, useEffect, Ref, ReactNode } from 'react'
import { saveAs } from 'file-saver';

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import CardMedia from '@mui/material/CardMedia'
import Link from 'next/link'
import authConfig from 'src/configs/auth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent, { ScrollBarProps } from 'react-perfect-scrollbar'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import {
  MessageType,
  MsgFeedbackType,
  ChatLogChatType,
  MessageGroupType,
  FormattedChatsType
} from 'src/types/apps/chatTypes'

const PerfectScrollbar = styled(PerfectScrollbarComponent)<ScrollBarProps & { ref: Ref<unknown> }>(({ theme }) => ({
  padding: theme.spacing(5)
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ChatLog = (props: any) => {
  // ** Props
  const { data, hidden, chatName, LLMS, rowInMsg, maxRows } = props

  // ** Ref
  const chatArea = useRef(null)

  console.log("rowInMsg IN ChatLog", rowInMsg)

  // ** Scroll to chat bottom
  const scrollToBottom = () => {
    if (chatArea.current) {
      if (hidden) {
        // @ts-ignore
        chatArea.current.scrollTop = Number.MAX_SAFE_INTEGER
      } else {
        // @ts-ignore
        chatArea.current._container.scrollTop = Number.MAX_SAFE_INTEGER
      }
    }
  }

  const handleDownload = (DownloadUrl: string, FileName: string) => {
    fetch(DownloadUrl)
      .then(response => response.blob())
      .then(blob => {
        saveAs(blob, FileName);
      })
      .catch(error => {
        console.log('Error downloading file:', error);
      });
  };

  // ** Formats chat data based on sender
  const formattedChatData = () => {
    let chatLog: MessageType[] | [] = []
    if (data.chat) {
      chatLog = data.chat.chat
    }

    const formattedChatLog: FormattedChatsType[] = []
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : 11
    let msgGroup: MessageGroupType = {
      senderId: chatMessageSenderId,
      messages: []
    }
    chatLog.forEach((msg: MessageType, index: number) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          time: msg.time,
          msg: msg.message,
          feedback: msg.feedback
        })
      } else {
        chatMessageSenderId = msg.senderId

        formattedChatLog.push(msgGroup)
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              time: msg.time,
              msg: msg.message,
              feedback: msg.feedback
            }
          ]
        }
      }

      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
    })

    return formattedChatLog
  }

  const renderMsgFeedback = (isSender: boolean, feedback: MsgFeedbackType) => {
    if (isSender) {
      if (feedback.isSent && !feedback.isDelivered) {
        return (
          <Box component='span' sx={{ display: 'inline-flex', '& svg': { mr: 2, color: 'text.secondary' } }}>
            <Icon icon='mdi:check' fontSize='1rem' />
          </Box>
        )
      } else if (feedback.isSent && feedback.isDelivered) {
        return (
          <Box
            component='span'
            sx={{
              display: 'inline-flex',
              '& svg': { mr: 2, color: feedback.isSeen ? 'success.main' : 'text.secondary' }
            }}
          >
            <Icon icon='mdi:check-all' fontSize='1rem' />
          </Box>
        )
      } else {
        return null
      }
    }
  }

  useEffect(() => {
    if (data && data.chat && data.chat.chat.length) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // ** Renders user chat
  const renderChats = () => {
    return formattedChatData().map((item: FormattedChatsType, index: number) => {
      const isSender = item.senderId === data.userContact.id

      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: !isSender ? 'row' : 'row-reverse',
            mb: index !== formattedChatData().length - 1 ? 4 : undefined
          }}
        >
          <div>
            {LLMS && LLMS[0] && LLMS[0].avatar ?
            <CustomAvatar
              skin='light'
              color={'primary'}
              sx={{
                width: '2rem',
                height: '2rem',
                fontSize: '0.875rem',
                ml: isSender ? 3.5 : undefined,
                mr: !isSender ? 3.5 : undefined
              }}
              {...(!isSender
                ? {
                    src: LLMS[0].avatar,
                    alt: chatName
                  }
                : {})}
              {...(isSender
                ? {
                    src: data.userContact.avatar,
                    alt: data.userContact.fullName
                  }
                : {})}
            >
              {chatName}
            </CustomAvatar>
            :
            null
            }
          </div>

          <Box className='chat-body' sx={{ maxWidth: ['calc(100% - 5.75rem)', '75%', '65%'] }}>
            {item.messages.map((chat: ChatLogChatType, index: number, { length }: { length: number }) => {
              let ChatMsgType = 'Chat'
              let ChatMsgContent: any
              if(chat.msg.includes('"type":"image"')) {
                ChatMsgType = 'Image'
                ChatMsgContent = JSON.parse(chat.msg)
              }
              if(chat.msg.includes('"type":"audio"')) {
                ChatMsgType = 'Audio'
                ChatMsgContent = JSON.parse(chat.msg)
              }

              return (
                <Box key={index} sx={{ '&:not(:last-of-type)': { mb: 3.5 } }}>
                    {ChatMsgType == "Chat" ?
                      <div>
                        <Typography
                        sx={{
                          boxShadow: 1,
                          borderRadius: 1,
                          width: 'fit-content',
                          fontSize: '0.875rem',
                          p: theme => theme.spacing(2, 4),
                          ml: isSender ? 'auto' : undefined,
                          borderTopLeftRadius: !isSender ? 0 : undefined,
                          borderTopRightRadius: isSender ? 0 : undefined,
                          color: isSender ? 'common.white' : 'text.primary',
                          backgroundColor: isSender ? 'primary.main' : 'background.paper'
                        }}
                        >
                          <ReactMarkdown>{chat.msg.replace('\n', '  \n')}</ReactMarkdown>
                        </Typography>
                        {index + 1 === length ? (
                          <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            {renderMsgFeedback(isSender, chat.feedback)}
                            <Typography variant='caption'>
                              {chat.time
                                ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                : null}
                            </Typography>
                          </Box>
                        ) : null}
                      </div>
                      :
                      null
                    }
                    {ChatMsgType == "Image" && ChatMsgContent && ChatMsgContent.ShortFileName ?
                      <div>
                        <LinkStyled target='_blank' href={authConfig.backEndApiChatBook + '/api/image/' + ChatMsgContent.ShortFileName}>
                          <CardMedia image={authConfig.backEndApiChatBook + '/api/image/' + ChatMsgContent.ShortFileName} sx={{ mt: 1, width: '500px', height: '500px', borderRadius: '5px' }}/>
                        </LinkStyled>
                        <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <Typography variant='caption'>
                              {chat.time
                                ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                : null}
                              {ChatMsgContent.ShortFileName ?
                              <LinkStyled onClick={()=>handleDownload(authConfig.backEndApiChatBook + '/api/image/' + ChatMsgContent.ShortFileName, ChatMsgContent.ShortFileName + '.png')} href={'#'} sx={{ml: 1}}>
                                Download
                              </LinkStyled>
                              :
                              null
                              }
                            </Typography>
                          </Box>
                      </div>
                      :
                      null
                    }
                    {ChatMsgType == "Audio" && ChatMsgContent && ChatMsgContent.ShortFileName ?
                      <div>
                        <LinkStyled target='_blank' href={authConfig.backEndApiChatBook + '/api/audio/' + ChatMsgContent.ShortFileName}>
                          <CardMedia component="audio" controls src={authConfig.backEndApiChatBook + '/api/audio/' + ChatMsgContent.ShortFileName} sx={{ mt: 1, width: '360px', borderRadius: '5px' }}/>
                        </LinkStyled>
                        <Box
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: isSender ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <Typography variant='caption'>
                              {chat.time
                                ? new Date(Number(chat.time)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                : null}
                              {ChatMsgContent.ShortFileName ?
                              <LinkStyled onClick={()=>handleDownload(authConfig.backEndApiChatBook + '/api/audio/' + ChatMsgContent.ShortFileName, ChatMsgContent.ShortFileName + '.mp3')} href={'#'} sx={{ml: 1}}>
                                Download
                              </LinkStyled>
                              :
                              null
                              }
                            </Typography>
                          </Box>
                      </div>
                      :
                      null
                    }
                </Box>
              )
            })}
          </Box>
        </Box>
      )
    })
  }

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    if (hidden) {
      return (
        <Box ref={chatArea} sx={{ p: 5, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Box>
      )
    } else {
      return (
        <PerfectScrollbar ref={chatArea} options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      )
    }
  }

  const inputMsgHeight = rowInMsg <= maxRows? rowInMsg * 1.25 : maxRows * 1.25

  return (
    <Box sx={{ height: `calc(100% - 7rem - ${inputMsgHeight}rem)` }}>
      <ScrollWrapper>{renderChats()}</ScrollWrapper>
    </Box>
  )
}

export default ChatLog
