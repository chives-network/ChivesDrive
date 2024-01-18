import axios from 'axios'

const ChivesChat = "ChivesChat"
const ChivesChatHistory = "ChivesChatHistory"
const NodeApi = "http://localhost:8000"

export function ChivesChatInput(Message: String, UserId: number) {
	const ChivesChatText = window.localStorage.getItem(ChivesChat)      
    const ChivesChatList = ChivesChatText ? JSON.parse(ChivesChatText) : []
    ChivesChatList.push({
      "message": Message,
      "time": String(Date.now()),
      "senderId": UserId,
      "feedback": {
          "isSent": true,
          "isDelivered": true,
          "isSeen": true
      }
    })
    window.localStorage.setItem(ChivesChat, JSON.stringify(ChivesChatList))
}

export async function ChivesChatOutput(Message: String, UserId: number) {
    const ChivesChatHistoryText = window.localStorage.getItem(ChivesChatHistory)      
    const ChivesChatList = ChivesChatHistoryText ? JSON.parse(ChivesChatHistoryText) : []
    const History: any = []
    if(ChivesChatList && ChivesChatList[UserId]) {
        const ChivesChatListLast10 = ChivesChatList[UserId].slice(-10)
        ChivesChatListLast10.map((Item: any)=>{
            if(Item.question && Item.answer) {
                History.push([Item.question,Item.answer])
            }
        })
    }
    const response: any = await axios.post(NodeApi + "/chat", { question: Message, history: History }).then((res) => res.data)
    if(response && response.text) {
        console.log("OpenAI Response:", response)
        ChivesChatInput(response.text, UserId)
        ChivesChatHistoryInput(Message, response.text, UserId)
        return true
    }
    else if(response && response.error) {
        console.log("OpenAI Error:", response)
        ChivesChatInput(response.error, UserId)
        return true
    }
    else {
        return false
    }
}

export function ChivesChatHistoryInput(question: String, answer: string, UserId: number) {
    console.log("ChivesChatHistoryList", question, answer, UserId)
	const ChivesChatHistoryText = window.localStorage.getItem(ChivesChatHistory)      
    const ChivesChatHistoryList = ChivesChatHistoryText ? JSON.parse(ChivesChatHistoryText) : {}
    if(ChivesChatHistoryList[UserId]) {
        ChivesChatHistoryList[UserId].push({
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        })
    }
    else {
        ChivesChatHistoryList[UserId] = [{
            "question": question,
            "time": String(Date.now()),
            "answer": answer,
        }]
    }
    console.log("ChivesChatHistoryList", ChivesChatHistoryList)
    window.localStorage.setItem(ChivesChatHistory, JSON.stringify(ChivesChatHistoryList))
}


