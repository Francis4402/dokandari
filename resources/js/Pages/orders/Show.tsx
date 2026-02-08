import AppLayout from '@/Layouts/AppLayout'
import { PageProps } from '@/types'
import React from 'react'

const Show = ({auth}: PageProps) => {
  return (
    <AppLayout user={auth.user}>Show</AppLayout>
  )
}

export default Show
