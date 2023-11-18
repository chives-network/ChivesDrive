// ** Types
import { Dispatch } from 'redux'
import { ReactElement, SyntheticEvent } from 'react'
import { TxRecordType } from 'src/types/apps/Chivesweave'

export type MailLabelType = 'personal' | 'company' | 'important' | 'private'

export type MailFolderType = 'inbox' | 'sent' | 'draft' | 'starred' | 'spam' | 'trash' | 'myfiles' | 'uploaded'

export type RouteParams = {
  label?: string
  folder: string
  type: string
}

export type MailLayoutType = RouteParams & {}

export type MailAttachmentType = {
  url: string
  size: string
  fileName: string
  thumbnail: string
}

export type FieldMenuItems = {
  src: string
  name: string
  value: string
}

export type FetchMailParamsType = { q: string; folder: MailFolderType; label: MailLabelType }

export type PaginateMailParamsType = { dir: 'next' | 'previous'; emailId: string }

export type UpdateMailParamsType = {
  emailIds: string[] | string | []
  dataToUpdate: { folder?: MailFolderType; isStarred?: boolean; isRead?: boolean; label?: MailLabelType }
}

export type UpdateMailLabelType = {
  label: MailLabelType
  emailIds: string[] | string | []
}

export type MailFromType = {
  name: string
  email: string
  avatar: string
}

export type MailToType = {
  name: string
  email: string
}

export type MailMetaType = {
  spam: number
  inbox: number
  draft: number
}

export type MailType = {
  id: number
  message: string
  subject: string
  isRead: boolean
  to: MailToType[]
  cc: string[] | []
  isStarred: boolean
  bcc: string[] | []
  from: MailFromType
  time: Date | string
  replies: MailType[]
  hasNextMail?: boolean
  folder: MailFolderType
  labels: MailLabelType[]
  hasPreviousMail?: boolean
  attachments: MailAttachmentType[]
}

export type MailFoldersArrType = {
  icon: ReactElement
  name: MailFolderType
}

export type MailFoldersObjType = {
  [key: string]: any[]
}

export type MailStore = {
  data: any[] | null
  mails: MailType[] | null
  selectedMails: number[]
  currentFile: null | MailType
  mailMeta: null | MailMetaType
  filter: {
    q: string
    label: string
    folder: string
  }
}

export type MailLabelColors = {
  personal: string
  company: string
  private: string
  important: string
}

export type MailSidebarType = {
  hidden: boolean
  store: MailStore
  lgAbove: boolean
  dispatch: Dispatch<any>
  leftSidebarOpen: boolean
  leftSidebarWidth: number
  driveFileOpen: boolean
  toggleUploadFilesOpen: () => void
  handleLeftSidebarToggle: () => void
  setFileDetailOpen: (val: boolean) => void
  handleSelectAllMail: (val: boolean) => void
}

export type DriveListType = {
  query: string
  hidden: boolean
  store: any
  lgAbove: boolean
  dispatch: Dispatch<any>
  direction: 'ltr' | 'rtl'
  driveFileOpen: boolean
  routeParams: RouteParams
  labelColors: MailLabelColors
  setQuery: (val: string) => void
  handleLeftSidebarToggle: () => void
  getCurrentFile: (id: number) => void
  handleSelectMail: (id: number) => void
  setFileDetailOpen: (val: boolean) => void
  handleSelectAllMail: (val: boolean) => void
  updateFile: (data: UpdateMailParamsType) => void
  updateFileLabel: (data: UpdateMailLabelType) => void
  paginationModel: any
  handlePageChange: (event: any, page: number) => void
}

export type FileDetailType = {
  currentFile: TxRecordType
  hidden: boolean
  dispatch: Dispatch<any>
  direction: 'ltr' | 'rtl'
  driveFileOpen: boolean
  routeParams: RouteParams
  labelColors: MailLabelColors
  folders: MailFoldersArrType[]
  foldersObj: MailFoldersObjType
  setFileDetailOpen: (val: boolean) => void
  updateFile: (data: UpdateMailParamsType) => void
  handleStarDrive: (e: SyntheticEvent, id: string, value: boolean) => void
  handleLabelUpdate: (id: string | string[], label: MailLabelType) => void
  handleFolderUpdate: (id: string | string[], folder: MailFolderType) => void
}

export type MailComposeType = {
  mdAbove: boolean
  uploadFilesOpen: boolean
  toggleUploadFilesOpen: () => void
  composePopupWidth: string
}
