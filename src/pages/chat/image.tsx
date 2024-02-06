// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import GetImgLeft from 'src/views/chat/Image/GetImgLeft'
import GetImgContent from 'src/views/chat/Image/GetImgContent'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { ChatChatNameList, CheckPermission  } from 'src/functions/ChatBook'

import { sendAmount, getHash, getProcessedData, getChivesLanguage, GenereateImageFeeToBlockchain } from 'src/functions/ChivesweaveWallets'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router)
  }, [])
  
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)

  // ** States
  const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
  const [sendButtonText, setSendButtonText] = useState<string>('')

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  useEffect(() => {
    const ChatChatNameListData: string[] = ChatChatNameList()
    if(ChatChatNameListData.length == 0) {
      setRefreshChatCounter(refreshChatCounter + 1)
    }
    setSendButtonText(t("Generate images") as string)
  }, [])


  const [pendingImagesCount, setPendingImagesCount] = useState<number>(0)
  const [imageList, setImageList] = useState<any[]>([])

  useEffect(() => {
    getImagesList()
  }, [refreshChatCounter])

  const getImagesList = async function () {
    const GenereateImageFeeToBlockchainData: any = await GenereateImageFeeToBlockchain(0.00001, JSON.stringify({}))
    console.log("handleGenerateImage GenereateImageFeeToBlockchainData", GenereateImageFeeToBlockchainData)
    if(GenereateImageFeeToBlockchainData.status == 200)  {
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getUserImagesXWE/', {pageid: 0, pagesize: 30}, {
        headers: { Authorization: Buffer.from(JSON.stringify(GenereateImageFeeToBlockchainData.statusText)).toString('base64'), 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const imageListInitial: string[] = []
        RS.data.map((Item: any)=>{
          imageListInitial.push(Item)
        })
        setImageList(imageListInitial.filter((element) => element != null))
      }
    }
  }

  const handleGenerateImage = async (data: any) => {
    console.log("handleGenerateImage data", data)
    const GenereateImageFeeToBlockchainData: any = await GenereateImageFeeToBlockchain(1, JSON.stringify(data))
    console.log("handleGenerateImage GenereateImageFeeToBlockchainData", GenereateImageFeeToBlockchainData)
    if(GenereateImageFeeToBlockchainData.status == 200)  {
      setSendButtonDisable(true)
      setSendButtonText(t("Generating images...") as string)
      setPendingImagesCount(data.numberOfImages)
      const numberOfImages = data.numberOfImages
      try {
        const ImageListData = await Promise.all(
          Array.from({ length: numberOfImages }, async () => {
            const ImageName = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageStabilityAiXWE/', data, {
              headers: { Authorization: Buffer.from(JSON.stringify(GenereateImageFeeToBlockchainData.statusText)).toString('base64'), 'Content-Type': 'application/json' },
            }).then(res => res.data);
            console.log("ImageName", ImageName);

            return ImageName;
          })
        );
        console.log("ImageListData:", ImageListData);
        if(ImageListData && ImageListData.length > 0 && ImageListData[0]!=null) {
          setSendButtonDisable(false)
          setRefreshChatCounter(refreshChatCounter + 2)
          setSendButtonText(t("Generate images") as string)
          setImageList([...ImageListData, ...imageList].filter((element) => element != null))
          console.log("imageListimageListimageListimageListimageList:", imageList)
          setPendingImagesCount(0)
        }
        if(ImageListData && ImageListData.length > 0 && ImageListData[0]==null) {
          setSendButtonDisable(false)
          setSendButtonText(t("Generate images") as string)
          setPendingImagesCount(0)
          toast.error('Failed to generate the image, please modify your input parameters and try again', {
            duration: 4000
          })
        }
      } 
      catch (error) {
        setSendButtonDisable(false)
        setSendButtonText(t("Generate images") as string)
        setPendingImagesCount(0)
        console.log("handleGenerateImage Error fetching images:", error);
      }
    }
    else {
      toast.error(GenereateImageFeeToBlockchainData.statusText, {
        duration: 4000
      })
    }
  }

  const handleSubmitText = (Text: string) => {
    setSendButtonText(t(Text) as string)
  }

  const [generateSimilarData, setGenerateSimilarData] = useState<any>(null)
  const handleGenerateSimilarGetImg = (showImg: any) => {
    setGenerateSimilarData(showImg)
  }

  const currentWallet = auth.currentWallet
  const currentAddress = auth.currentAddress

  const handleUploadToBlockchainGetImg = async (showImg: any) => {
    console.log("showImg.filename", showImg)
    await uploadMultiFilesFromUrl([showImg])
  }

  const uploadMultiFilesFromUrl = async (files: any[]) => {
    toast.success(t(`Start uploading files to the blockchain...`), { duration: 4000 })

    const getChivesLanguageData: string = getChivesLanguage();

    //Make the bundle data
    const formData = (await Promise.all(files?.map(async file => {
      const data = await readFileFromURL("https://chatbookai.net/api/image/" + file.filename)
      const tags = [] as Tag[]

      const FileData: any = JSON.parse(file.data)
      console.log("FileData", FileData)

      //Not Encrypt File Content
      setBaseTags(tags, {
        'Content-Type': 'image/png',
        'File-Name': file.filename,
        'File-Hash': await getHash(data),
        'File-Public': 'Public',
        'File-Summary': '',
        'Cipher-ALG': '',
        'File-Parent': 'Root',
        'File-Language': getChivesLanguageData,
        'File-Pages': '',
        'Entity-Type': 'File',
        'App-Name': String(authConfig['App-Name']),
        'App-Version': String(authConfig['App-Version']),
        'App-Instance': String(authConfig['App-Instance']),
        'Unix-Time': String(Date.now()),
        'AI-Model': file.model,
        'AI-Prompt': file.prompt,
        'AI-Negative-Prompt': file.negative_prompt,
        'AI-Steps': String(file.steps),
        'AI-Style': String(file.style),
        'AI-Seed': String(FileData.seed),
        'AI-CFG-Scale': String(FileData.cfg_scale),
        'AI-Width': String(FileData.width),
        'AI-Height': String(FileData.height)
      })
      
      return { data, tags, path: file.name }
    })))
    
    const getProcessedDataValue = await getProcessedData(currentWallet, currentAddress, formData, true, []);

    const target = ""
    const amount = ""
    const data = getProcessedDataValue

    console.log("getChivesLanguageData", getChivesLanguageData)
    
    //Make the tags
    const tags: any = []
    tags.push({name: "Bundle-Format", value: 'binary'})
    tags.push({name: "Bundle-Version", value: '2.0.0'})
    tags.push({name: "Entity-Type", value: "Bundle"})
    tags.push({name: "Entity-Number", value: String(files.length)})

    const TxResult: any = await sendAmount(currentWallet, target, amount, tags, data, "UploadBundleFile", setUploadProgress);
    console.log("image-uploadMultiFiles-TxResult", TxResult)
    console.log("image-uploadMultiFiles-uploadProgress", uploadProgress)
    
    if(TxResult.id && TxResult.signature && TxResult.data_root) {
      toast.success(t(`Submitted successfully`), { duration: 4000 })
    }
    else {
      toast.error(t(`Submitted failed`), { duration: 4000 })
    }

  };

  function setBaseTags (tags: Tag[], set: { [key: string]: string }) {
    const baseTags: { [key: string]: string } = {
      'Content-Type': '',
      'File-Hash': '',
      'Bundle-Format': '',
      'Bundle-Version': '',
      ...set
    }
    for (const name in baseTags) { setTag(tags, name, baseTags[name]) }
  }

  function setTag (tags: Tag[], name: string, value?: string) {
    let currentTag = tags.find(tag => tag.name === name)
    if (value) {
      if (!currentTag) {
        currentTag = { name, value: '' }
        tags.push(currentTag)
      }
      currentTag.value = value
    } else {
      const index = tags.indexOf(currentTag!)
      if (index !== -1) { tags.splice(index, 1) }
    }
  }

  async function readFileFromURL(url: string): Promise<Uint8Array> {
    try {
      const response = await fetch(url);  
      if (!response.ok) {
        throw new Error(`Failed to fetch file from ${url}`);
      }  
      const arrayBuffer = await response.arrayBuffer();

      return new Uint8Array(arrayBuffer);
    } catch (error) {
      throw error;
    }
  }
  

  // ** Vars
  const { skin } = settings

  return (
    <Fragment>
      {auth.user && auth.user.email ?
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
      <GetImgLeft
        handleGenerateImage={handleGenerateImage}
        handleSubmitText={handleSubmitText}
        sendButtonDisable={sendButtonDisable}
        sendButtonText={sendButtonText}
        generateSimilarData={generateSimilarData}
      />
      <GetImgContent
        imageList={imageList}
        pendingImagesCount={pendingImagesCount}
        handleGenerateSimilarGetImg={handleGenerateSimilarGetImg}
        handleUploadToBlockchainGetImg={handleUploadToBlockchainGetImg}
      />
      </Box>
      :
      null
      }
    </Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
