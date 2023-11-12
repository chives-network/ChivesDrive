import MyWalletModel from 'src/pages/wallet/model';

const AddressTransactionList = () => {

  const activeTab = "sent"; 

  return <MyWalletModel activeTab={activeTab} />

}

export default AddressTransactionList

