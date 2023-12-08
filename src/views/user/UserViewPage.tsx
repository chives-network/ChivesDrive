// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import UserViewLeft from 'src/views/user/UserViewLeft'
import UserViewRight from 'src/views/user/UserViewRight'

type Props = {
  tab: string
}

const UserView = ({ tab }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} />
      </Grid>
    </Grid>
  )
}

export default UserView
